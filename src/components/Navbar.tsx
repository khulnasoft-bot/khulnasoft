import React, { useState } from 'react';
import { 
  Terminal, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Bell, 
  ChevronDown, 
  Layers,
  SlidersHorizontal,
  Workflow,
  Key,
  LogOut,
  UserCheck,
  RefreshCw,
  Lock,
  Globe,
  Sun,
  Moon
} from 'lucide-react';
import { useFeatureFlags } from '../context/FeatureFlagsContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SyncStatusIndicator } from './SyncStatusIndicator';

interface NavbarProps {
  activeTab: string;
  onOpenSearch: () => void;
  onOpenAiAssistant: () => void;
  onOpenFeatureFlags: () => void;
  onOpenAiRepoAnalyzer?: () => void;
  selectedOrg: string;
  setSelectedOrg: (org: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenAiAssistant,
  onOpenFeatureFlags,
  onOpenAiRepoAnalyzer,
  selectedOrg,
  setSelectedOrg,
}) => {
  const { flags } = useFeatureFlags();
  const { user, isAuthenticated, login, loginWithGoogle, logout, isLoading, setInspectTokensOpen } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const activeFlagsCount = flags.filter((f) => f.enabled).length;

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 text-slate-100 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-slate-900/90">
      {/* Left: Brand logo & Org Switcher */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                KhulnaSoft
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 uppercase tracking-widest">
                Platform
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">AI-Native Engineering Systems</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-800 hidden md:block" />

        {/* Organization selector */}
        <div className="relative hidden md:flex items-center">
          <div className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-200">{selectedOrg}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Center: Search Trigger Bar */}
      <div className="flex-1 max-w-md mx-4 hidden lg:block">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between bg-slate-950/60 hover:bg-slate-950/90 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs rounded-xl px-3.5 py-2 transition-all shadow-inner group cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            <span className="text-slate-400 font-normal">Search repos, docs, APIs, CVEs, or graph...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 bg-slate-800/80 border border-slate-700/80 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: AI Engine Status & Quick Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Real-time GitHub Sync Status Indicator */}
        <SyncStatusIndicator />

        {/* AI Repo Analyzer Trigger Button */}
        {onOpenAiRepoAnalyzer && (
          <button
            id="btn-open-ai-repo-analyzer"
            onClick={onOpenAiRepoAnalyzer}
            className="hidden md:flex items-center space-x-1.5 bg-gradient-to-r from-cyan-950 to-indigo-950 hover:from-cyan-900 hover:to-indigo-900 border border-cyan-800/80 rounded-xl px-2.5 py-1.5 text-xs text-cyan-300 font-mono transition-all cursor-pointer shadow-sm"
            title="AI Repository Analyzer Pipeline"
          >
            <Workflow className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Analyzer</span>
          </button>
        )}

        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="lg:hidden p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 cursor-pointer"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Feature Flags Button */}
        <button
          id="btn-open-feature-flags"
          onClick={onOpenFeatureFlags}
          className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 font-mono transition-colors cursor-pointer"
          title="Enterprise Feature Flags"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Flags</span>
          <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
            {activeFlagsCount}
          </span>
        </button>

        {/* AI Agent Status Button */}
        <button
          onClick={onOpenAiAssistant}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 border border-cyan-500/30 rounded-xl px-3 py-1.5 text-xs font-medium text-cyan-300 shadow-sm transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">AI Assistant</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
        </button>

        {/* Zero Trust Security Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-xs px-2.5 py-1 rounded-lg font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-medium text-[11px]">Zero Trust</span>
        </div>

        {/* Global Theme Toggle (Light / Dark Mode) */}
        <button
          id="btn-toggle-theme"
          onClick={toggleTheme}
          className="p-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-amber-400 hover:text-amber-300 transition-all cursor-pointer font-mono text-xs flex items-center space-x-1.5 shadow-sm"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
          )}
          <span className="hidden sm:inline text-[10px] text-slate-200 font-bold uppercase tracking-wider">
            {theme === 'dark' ? 'Light' : 'Dark'}
          </span>
        </button>

        {/* Notification Bell */}
        <div className="relative cursor-pointer p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500 ring-2 ring-slate-900" />
        </div>

        {/* User Profile Avatar & SSO Menu Dropdown */}
        <div className="relative border-l border-slate-800 pl-3">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl p-1 pr-2.5 cursor-pointer transition-all"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover ring-2 ring-cyan-500/50"
                />
                <div className="hidden md:block text-left font-mono">
                  <div className="text-[11px] font-bold text-slate-100 leading-tight">{user.name}</div>
                  <div className="text-[9px] text-cyan-400 leading-tight">{user.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 font-mono text-xs space-y-3 z-50">
                  {/* User Profile Header */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                    <div className="text-slate-200 font-bold">{user.name}</div>
                    <div className="text-slate-400 text-[10px] truncate">{user.email}</div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[9px] font-bold">
                        {user.ssoProvider}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-bold">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setInspectTokensOpen(true);
                      }}
                      className="w-full flex items-center space-x-2 text-left p-2 rounded-xl hover:bg-slate-800 text-cyan-300 font-bold transition-all cursor-pointer"
                    >
                      <Key className="w-4 h-4 text-cyan-400" />
                      <span>Inspect OIDC JWT Tokens</span>
                    </button>

                    <div className="text-[10px] text-slate-500 font-bold pt-2 uppercase border-t border-slate-800">
                      Authentication & Identity Providers:
                    </div>

                    <button
                      onClick={() => { loginWithGoogle(); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center justify-center space-x-2 p-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 hover:from-amber-500/30 hover:to-red-500/30 text-amber-300 border border-amber-500/40 font-bold transition-all cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4 text-amber-400" />
                      <span>Sign In with Google (Supabase)</span>
                    </button>

                    <div className="grid grid-cols-2 gap-1 text-[10px]">
                      <button
                        onClick={() => { login('okta'); setIsUserMenuOpen(false); }}
                        className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 text-left font-bold"
                      >
                        Okta (Admin)
                      </button>
                      <button
                        onClick={() => { login('azure'); setIsUserMenuOpen(false); }}
                        className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 text-left font-bold"
                      >
                        Azure AD (Sec)
                      </button>
                    </div>
                  </div>

                  {/* Sign Out */}
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => { logout(); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center justify-center space-x-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 p-2 rounded-xl font-bold cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      <span>End OIDC Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => login('okta')}
              disabled={isLoading}
              className="flex items-center space-x-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-all shadow-md shadow-cyan-500/20"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Authenticating...' : 'OIDC Login'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};


