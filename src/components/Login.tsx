import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Key, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  Loader2,
  AlertCircle,
  Globe,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Login: React.FC = () => {
  const { loginWithGoogle, login, isLoading, authError } = useAuth();
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans transition-colors duration-200 ${
      theme === 'light' 
        ? 'bg-slate-100 text-slate-900' 
        : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-cyan-600/20 via-indigo-600/15 to-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10">
        {/* Top Platform Identity */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-xl shadow-cyan-500/25 mb-4 border border-white/10 ring-4 ring-cyan-500/10">
            <Cpu className="w-7 h-7 text-white" />
          </div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              KhulnaSoft
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/90 text-cyan-400 border border-cyan-800/80 uppercase tracking-widest shadow-sm">
              Platform
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">AI-Native Developer & Cloud Security Systems</p>
        </div>

        {/* Card Box */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-slate-950/80">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-white tracking-tight">Welcome Back</h1>
            <p className="text-xs text-slate-400 mt-1">
              Sign in to access your developer portal, AI repository catalog, and security tools.
            </p>
          </div>

          {/* Auth Error Banner if any */}
          {authError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/80 border border-red-800/80 text-red-200 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{authError}</div>
            </div>
          )}

          {/* Primary Action: Sign in with Google */}
          <div className="space-y-4">
            <button
              id="google-signin-btn"
              onClick={() => loginWithGoogle()}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-medium text-sm py-3 px-4 rounded-xl transition-all shadow-lg shadow-white/5 hover:shadow-white/10 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-slate-700 animate-spin" />
              ) : (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                  />
                </svg>
              )}
              <span className="text-slate-900 font-semibold">
                {isLoading ? 'Authenticating...' : 'Sign in with Google'}
              </span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-500 font-mono font-medium shrink-0">
                Or Enterprise OIDC SSO
              </span>
            </div>

            {/* Alternative Enterprise SSO Options */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                id="sso-okta-btn"
                onClick={() => login('okta')}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium py-2.5 px-3 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                <Key className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Okta SSO</span>
              </button>

              <button
                id="sso-azure-btn"
                onClick={() => login('azure')}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium py-2.5 px-3 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Azure AD</span>
              </button>
            </div>
          </div>

          {/* Footer Security Highlights */}
          <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center space-x-1.5">
              <Lock className="w-3 h-3 text-cyan-500" />
              <span>TLS 1.3 Encrypted</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Globe className="w-3 h-3 text-indigo-400" />
              <span>OAuth 2.0 / Supabase</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <p className="text-center text-[11px] text-slate-500 mt-6 font-mono">
          KhulnaSoft Platform &copy; {new Date().getFullYear()} &bull; Secure Authentication
        </p>
      </div>
    </div>
  );
};
