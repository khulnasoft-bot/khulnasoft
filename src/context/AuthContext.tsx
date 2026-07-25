import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, signInWithGoogle, signOut as supabaseSignOut } from '../lib/supabase';

export type RoleType = 'Platform Admin' | 'Security Officer' | 'Senior DevOps' | 'Developer' | 'Auditor';
export type SsoProviderType = 'Google Auth (Supabase)' | 'Okta OIDC' | 'Azure AD OAuth2' | 'Keycloak OIDC' | 'PingIdentity OIDC';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: RoleType;
  org: string;
  ssoProvider: SsoProviderType;
  scopes: string[];
  mfaVerified: boolean;
  idToken: string;
  accessToken: string;
  refreshTokenString: string;
  tokenExpiresAt: number;
  authTime: string;
}

interface AuthContextType {
  user: UserProfile | null;
  supabaseUser: SupabaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (provider?: 'okta' | 'azure' | 'keycloak' | 'ping') => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  verifyMfa: (code: string) => boolean;
  switchRole: (newRole: RoleType) => void;
  inspectTokensOpen: boolean;
  setInspectTokensOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'khulnasoft_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          return parsed;
        }
      } catch (e) {
        // Fallback
      }
    }
    return null;
  });

  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [inspectTokensOpen, setInspectTokensOpen] = useState<boolean>(false);

  // Sync Supabase Auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const sbUser = session?.user ?? null;
      setSupabaseUser(sbUser);
      if (sbUser) {
        const profile: UserProfile = {
          id: sbUser.id,
          name: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'Supabase User',
          email: sbUser.email || 'user@supabase.app',
          avatarUrl: sbUser.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
          role: 'Platform Admin',
          org: 'khulnasoft',
          ssoProvider: 'Google Auth (Supabase)',
          scopes: ['openid', 'profile', 'email'],
          mfaVerified: sbUser.email_confirmed_at ? true : false,
          idToken: session?.access_token || '',
          accessToken: session?.access_token || '',
          refreshTokenString: session?.refresh_token || '',
          tokenExpiresAt: session?.expires_at ? session.expires_at * 1000 : Date.now() + 3600 * 1000 * 8,
          authTime: new Date().toISOString(),
        };

        setUser(profile);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [user]);

  // Google Login via Supabase
  const loginWithGoogle = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Supabase Auth error:', err);
      setAuthError(err?.message || 'Google sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Note: Real OIDC/OAuth2 flows should be implemented via Supabase Auth
  // For now, users login with Google via signInWithGoogle
  const login = async (provider: 'okta' | 'azure' | 'keycloak' | 'ping' = 'okta') => {
    setIsLoading(true);
    setAuthError(null);
    try {
      // Direct to Supabase Google sign-in as a fallback
      // Real OIDC integrations (Okta, Azure, Keycloak) require Supabase config
      await signInWithGoogle();
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout session
  const logout = async () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    try {
      await supabaseSignOut();
    } catch (e) {
      // Ignore
    }
  };

  // Refresh OIDC Token via Supabase
  const refreshToken = async () => {
    if (!supabaseUser || !user) return;
    setIsLoading(true);
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      if (session) {
        const updatedUser: UserProfile = {
          ...user,
          tokenExpiresAt: session.expires_at ? session.expires_at * 1000 : Date.now() + 3600 * 1000 * 8,
          accessToken: session.access_token,
          refreshTokenString: session.refresh_token || user.refreshTokenString,
        };
        setUser(updatedUser);
      }
    } catch (err: any) {
      console.error('Token refresh failed:', err);
      setAuthError(err?.message || 'Token refresh failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify MFA Step-up
  const verifyMfa = (code: string) => {
    if (!user) return false;
    // In production, verify with Supabase MFA API
    if (code.length === 6) {
      setUser({ ...user, mfaVerified: true });
      return true;
    }
    return false;
  };

  // Switch Role - would require backend support to verify user has permission
  const switchRole = (newRole: RoleType) => {
    if (!user) return;
    // In production, verify role change with backend/database
    setUser({ ...user, role: newRole });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        isAuthenticated: !!user,
        isLoading,
        authError,
        login,
        loginWithGoogle,
        logout,
        refreshToken,
        verifyMfa,
        switchRole,
        inspectTokensOpen,
        setInspectTokensOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

