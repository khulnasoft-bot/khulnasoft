import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, signInWithPopup, signOut, db, handleFirestoreError, OperationType } from '../lib/firebase';

export type RoleType = 'Platform Admin' | 'Security Officer' | 'Senior DevOps' | 'Developer' | 'Auditor';
export type SsoProviderType = 'Google Auth (Firebase)' | 'Okta OIDC' | 'Azure AD OAuth2' | 'Keycloak OIDC' | 'PingIdentity OIDC';

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
  tokenExpiresAt: number; // Unix timestamp in ms
  authTime: string;
}

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
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

// Helper to generate realistic JWT Token string
const createMockJwt = (sub: string, email: string, role: string, provider: string, scopes: string[], expiresAt: number) => {
  const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: 'kms-oidc-key-2026' }));
  const payload = btoa(
    JSON.stringify({
      iss: `https://auth.${provider.toLowerCase().replace(/\s+/g, '')}.khulnasoft.io/oauth2/v1`,
      sub,
      aud: 'https://api.khulnasoft.io',
      exp: Math.floor(expiresAt / 1000),
      iat: Math.floor(Date.now() / 1000),
      auth_time: Math.floor(Date.now() / 1000),
      email,
      email_verified: true,
      org: 'khulnasoft',
      role,
      scopes,
      amr: ['mfa', 'pwd', 'otp'],
    })
  );
  const signature = 'sig_cosign_kms_hardware_token_verifier_sample_hash_98a72b1';
  return `${header}.${payload}.${signature}`;
};

const DEFAULT_USERS: Record<string, UserProfile> = {
  okta: {
    id: 'usr-okta-8821',
    name: 'Alex Mercer',
    email: 'alex.mercer@khulnasoft.io',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    role: 'Platform Admin',
    org: 'khulnasoft',
    ssoProvider: 'Okta OIDC',
    scopes: ['openid', 'profile', 'email', 'khulnasoft:admin', 'k8s:cluster-admin', 'cosign:sign'],
    mfaVerified: true,
    idToken: '',
    accessToken: '',
    refreshTokenString: 'rf_okta_secure_session_token_9821a',
    tokenExpiresAt: Date.now() + 3600 * 1000 * 8, // 8 hours
    authTime: new Date().toISOString(),
  },
  azure: {
    id: 'usr-azure-4120',
    name: 'Sarah Connor',
    email: 'sarah.connor@khulnasoft.io',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    role: 'Security Officer',
    org: 'khulnasoft',
    ssoProvider: 'Azure AD OAuth2',
    scopes: ['openid', 'profile', 'email', 'security:read', 'security:write', 'audit:export'],
    mfaVerified: true,
    idToken: '',
    accessToken: '',
    refreshTokenString: 'rf_azure_ad_session_token_1102b',
    tokenExpiresAt: Date.now() + 3600 * 1000 * 8,
    authTime: new Date().toISOString(),
  },
};

// Initialize JWT tokens for default users
Object.keys(DEFAULT_USERS).forEach((key) => {
  const u = DEFAULT_USERS[key];
  u.idToken = createMockJwt(u.id, u.email, u.role, u.ssoProvider, u.scopes, u.tokenExpiresAt);
  u.accessToken = createMockJwt(u.id, u.email, u.role, u.ssoProvider, u.scopes, u.tokenExpiresAt);
});

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
    return DEFAULT_USERS.okta; // Default authenticated platform admin user
  });

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [inspectTokensOpen, setInspectTokensOpen] = useState<boolean>(false);

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const token = await fbUser.getIdToken();
        const profile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Firebase User',
          email: fbUser.email || 'user@firebase.app',
          avatarUrl: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
          role: 'Platform Admin',
          org: 'khulnasoft',
          ssoProvider: 'Google Auth (Firebase)',
          scopes: ['openid', 'profile', 'email', 'firestore:read', 'firestore:write'],
          mfaVerified: fbUser.emailVerified,
          idToken: token,
          accessToken: token,
          refreshTokenString: fbUser.refreshToken,
          tokenExpiresAt: Date.now() + 3600 * 1000 * 8,
          authTime: new Date().toISOString(),
        };

        setUser(profile);

        // Sync Firestore User Profile document
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          await setDoc(userDocRef, {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || profile.name,
            photoURL: fbUser.photoURL || profile.avatarUrl,
            lastLogin: serverTimestamp(),
            createdAt: serverTimestamp(),
          }, { merge: true });
        } catch (err) {
          console.warn('Firestore user profile sync warning:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [user]);

  // Google Login via Firebase
  const loginWithGoogle = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      setAuthError(err?.message || 'Google sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate OIDC / OAuth2 Login flow
  const login = async (provider: 'okta' | 'azure' | 'keycloak' | 'ping' = 'okta') => {
    setIsLoading(true);
    setAuthError(null);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const selectedUserTemplate = DEFAULT_USERS[provider] || DEFAULT_USERS.okta;
    const expiresAt = Date.now() + 3600 * 1000 * 8;
    const freshUser: UserProfile = {
      ...selectedUserTemplate,
      tokenExpiresAt: expiresAt,
      authTime: new Date().toISOString(),
      idToken: createMockJwt(
        selectedUserTemplate.id,
        selectedUserTemplate.email,
        selectedUserTemplate.role,
        selectedUserTemplate.ssoProvider,
        selectedUserTemplate.scopes,
        expiresAt
      ),
      accessToken: createMockJwt(
        selectedUserTemplate.id,
        selectedUserTemplate.email,
        selectedUserTemplate.role,
        selectedUserTemplate.ssoProvider,
        selectedUserTemplate.scopes,
        expiresAt
      ),
    };

    setUser(freshUser);
    setIsLoading(false);
  };

  // Logout session
  const logout = async () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    try {
      await signOut(auth);
    } catch (e) {
      // Ignore
    }
  };

  // Refresh OIDC Token
  const refreshToken = async () => {
    if (!user) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    const newExpiresAt = Date.now() + 3600 * 1000 * 8;
    const refreshedUser: UserProfile = {
      ...user,
      tokenExpiresAt: newExpiresAt,
      idToken: createMockJwt(user.id, user.email, user.role, user.ssoProvider, user.scopes, newExpiresAt),
      accessToken: createMockJwt(user.id, user.email, user.role, user.ssoProvider, user.scopes, newExpiresAt),
    };

    setUser(refreshedUser);
    setIsLoading(false);
  };

  // Verify MFA Step-up
  const verifyMfa = (code: string) => {
    if (!user) return false;
    if (code.length === 6) {
      setUser({ ...user, mfaVerified: true });
      return true;
    }
    return false;
  };

  // Switch Role
  const switchRole = (newRole: RoleType) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      role: newRole,
      idToken: createMockJwt(user.id, user.email, newRole, user.ssoProvider, user.scopes, user.tokenExpiresAt),
      accessToken: createMockJwt(user.id, user.email, newRole, user.ssoProvider, user.scopes, user.tokenExpiresAt),
    };
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
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

