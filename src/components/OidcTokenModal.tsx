import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Key, 
  Copy, 
  Check, 
  RefreshCw, 
  Lock, 
  UserCheck, 
  Cpu, 
  Layers, 
  Clock, 
  Terminal, 
  X,
  ExternalLink,
  Zap
} from 'lucide-react';
import { useAuth, RoleType } from '../context/AuthContext';

interface OidcTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OidcTokenModal: React.FC<OidcTokenModalProps> = ({ isOpen, onClose }) => {
  const { user, refreshToken, isLoading, switchRole, verifyMfa } = useAuth();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'idToken' | 'accessToken' | 'claims' | 'mfa'>('claims');
  const [mfaInput, setMfaInput] = useState('');
  const [mfaSuccess, setMfaSuccess] = useState(false);

  if (!isOpen || !user) return null;

  const handleCopy = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const decodeJwtPayload = (jwt: string) => {
    try {
      const parts = jwt.split('.');
      if (parts.length === 3) {
        return JSON.parse(atob(parts[1]));
      }
    } catch (e) {
      // Fallback
    }
    return {};
  };

  const claims = decodeJwtPayload(user.idToken);

  const handleVerifyMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyMfa(mfaInput)) {
      setMfaSuccess(true);
      setTimeout(() => setMfaSuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-5 font-mono text-xs shadow-2xl relative">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-bold mb-1">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>Enterprise OIDC / OAuth2 Security Tokens</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                {user.ssoProvider}
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-100 flex items-center space-x-2">
              <span>{user.name}</span>
              <span className="text-xs text-slate-400 font-normal">({user.email})</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-slate-800 pb-2">
          {[
            { id: 'claims', label: 'Decoded JWT Claims' },
            { id: 'idToken', label: 'Raw ID Token (JWT)' },
            { id: 'accessToken', label: 'Raw Access Token' },
            { id: 'mfa', label: 'MFA & Step-Up Auth' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Decoded JWT Claims */}
        {activeTab === 'claims' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-500 uppercase">Issuer (iss)</div>
                <div className="text-cyan-300 font-bold truncate mt-0.5">{claims.iss || 'https://auth.khulnasoft.io'}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-500 uppercase">Subject (sub)</div>
                <div className="text-slate-200 font-bold truncate mt-0.5">{claims.sub || user.id}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-500 uppercase">Assigned Role</div>
                <div className="text-emerald-400 font-bold truncate mt-0.5">{user.role}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-500 uppercase">Token Expires</div>
                <div className="text-amber-300 font-bold truncate mt-0.5">
                  {new Date(user.tokenExpiresAt).toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Claims Code View */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>RS256 Verified Claims Payload:</span>
                <button
                  onClick={() => handleCopy('claims-json', JSON.stringify(claims, null, 2))}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-bold cursor-pointer"
                >
                  {copiedField === 'claims-json' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Claims JSON</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-cyan-200 text-[11px] max-h-48 overflow-y-auto">
                {JSON.stringify(claims, null, 2)}
              </pre>
            </div>

            {/* Role Switcher */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-slate-400 text-[11px] font-bold">RBAC Role Simulation Switcher:</div>
              <div className="flex flex-wrap gap-2">
                {(['Platform Admin', 'Security Officer', 'Senior DevOps', 'Developer', 'Auditor'] as RoleType[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => switchRole(r)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      user.role === r
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Raw ID Token */}
        {activeTab === 'idToken' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span>OpenID Connect ID Token (JWT):</span>
              <button
                onClick={() => handleCopy('id-token', user.idToken)}
                className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-bold cursor-pointer"
              >
                {copiedField === 'id-token' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy Token</span>
              </button>
            </div>
            <textarea
              readOnly
              value={user.idToken}
              className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-3 text-cyan-300 font-mono text-[10px] resize-none focus:outline-none"
            />
          </div>
        )}

        {/* Tab 3: Access Token */}
        {activeTab === 'accessToken' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span>OAuth2 Bearer Access Token:</span>
              <button
                onClick={() => handleCopy('access-token', user.accessToken)}
                className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-bold cursor-pointer"
              >
                {copiedField === 'access-token' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy Bearer Token</span>
              </button>
            </div>
            <textarea
              readOnly
              value={user.accessToken}
              className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-3 text-emerald-300 font-mono text-[10px] resize-none focus:outline-none"
            />
          </div>
        )}

        {/* Tab 4: MFA Step-Up */}
        {activeTab === 'mfa' && (
          <form onSubmit={handleVerifyMfaSubmit} className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>TOTP / Hardware Security Key MFA Verification</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Current MFA Status: {user.mfaVerified ? (
                <span className="text-emerald-400 font-bold">VERIFIED (TOTP / YubiKey)</span>
              ) : (
                <span className="text-amber-400 font-bold">PENDING STEP-UP</span>
              )}
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Enter 6-digit TOTP code (e.g. 123456)"
                value={mfaInput}
                onChange={(e) => setMfaInput(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono w-64 text-xs"
              />
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                Verify Code
              </button>
            </div>
            {mfaSuccess && (
              <div className="text-emerald-400 font-bold flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>MFA Verification Successful! Session elevated to Level 2.</span>
              </div>
            )}
          </form>
        )}

        {/* Footer Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={refreshToken}
            disabled={isLoading}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl cursor-pointer text-xs font-bold transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Refreshing Token...' : 'Trigger Silent Token Refresh'}</span>
          </button>

          <button
            onClick={onClose}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl cursor-pointer text-xs"
          >
            Close Token Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
