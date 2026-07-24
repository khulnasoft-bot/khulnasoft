import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle, GitBranch, ShieldCheck, ChevronDown, Clock, Activity } from 'lucide-react';
import { MOCK_REPOSITORIES } from '../data/mockData';

export interface RepoSyncStatus {
  repoId: string;
  name: string;
  org: string;
  lastFetched: Date;
  statusCode: number;
  statusText: string;
  isSyncing: boolean;
  webhookLatencyMs: number;
}

export const SyncStatusIndicator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGlobalSyncing, setIsGlobalSyncing] = useState(false);
  const [lastGlobalSync, setLastGlobalSync] = useState<Date>(new Date());
  const [now, setNow] = useState<Date>(new Date());

  const [repoStatuses, setRepoStatuses] = useState<RepoSyncStatus[]>(() =>
    MOCK_REPOSITORIES.map((repo, idx) => ({
      repoId: repo.id,
      name: repo.name,
      org: repo.org,
      lastFetched: new Date(Date.now() - (idx + 1) * 45000),
      statusCode: 200,
      statusText: 'OK',
      isSyncing: false,
      webhookLatencyMs: 18 + idx * 7,
    }))
  );

  // Tick timer every second to keep timestamps fresh
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTriggerGlobalSync = () => {
    setIsGlobalSyncing(true);
    setRepoStatuses((prev) =>
      prev.map((r) => ({ ...r, isSyncing: true }))
    );

    setTimeout(() => {
      const freshTime = new Date();
      setLastGlobalSync(freshTime);
      setRepoStatuses((prev) =>
        prev.map((r) => ({
          ...r,
          lastFetched: freshTime,
          statusCode: 200,
          statusText: 'OK (304 Not Modified)',
          isSyncing: false,
          webhookLatencyMs: Math.floor(Math.random() * 20) + 12,
        }))
      );
      setIsGlobalSyncing(false);
    }, 1200);
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative inline-block text-left">
      <button
        id="btn-sync-status-indicator"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer group"
      >
        <div className="relative flex items-center justify-center">
          {isGlobalSyncing ? (
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          ) : (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1.5 text-slate-300">
          <span className="font-bold text-slate-200">GitHub Sync</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
            200 OK
          </span>
          <span className="text-slate-500 hidden xl:inline">({getTimeAgo(lastGlobalSync)})</span>
        </div>

        <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Sync Details Dropdown Modal */}
      {isOpen && (
        <div 
          id="sync-status-details-modal"
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-4 space-y-3 font-mono text-xs"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <GitBranch className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-slate-100 font-sans">GitHub Real-Time Webhooks</span>
            </div>

            <button
              id="btn-trigger-manual-sync"
              onClick={handleTriggerGlobalSync}
              disabled={isGlobalSyncing}
              className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] transition-colors cursor-pointer flex items-center space-x-1"
            >
              <RefreshCw className={`w-3 h-3 ${isGlobalSyncing ? 'animate-spin' : ''}`} />
              <span>{isGlobalSyncing ? 'Syncing...' : 'Sync All'}</span>
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Global Status:</span>
            <span className="text-emerald-400 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>HTTP 200 OK • Webhook Active</span>
            </span>
          </div>

          {/* Repo Sync List */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Connected Repositories ({repoStatuses.length})
            </div>

            {repoStatuses.map((repo) => (
              <div
                key={repo.repoId}
                className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-[11px]"
              >
                <div>
                  <div className="font-bold text-slate-200">
                    {repo.org}/{repo.name}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center space-x-2 mt-0.5">
                    <span>Fetched: {getTimeAgo(repo.lastFetched)}</span>
                    <span>•</span>
                    <span>{repo.webhookLatencyMs}ms latency</span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      repo.statusCode === 200
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {repo.statusCode} {repo.statusText}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-500 text-center pt-1 border-t border-slate-800 font-sans">
            Auto-synced via KhulnaSoft App Webhook Event Stream.
          </div>
        </div>
      )}
    </div>
  );
};
