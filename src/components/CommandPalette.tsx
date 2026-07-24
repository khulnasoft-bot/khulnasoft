import React, { useState, useEffect } from 'react';
import { Search, Code2, BookOpen, ShieldAlert, Cpu, Sparkles, ArrowRight, X, TrendingUp, BarChart2 } from 'lucide-react';
import { MOCK_REPOSITORIES, MOCK_VULNERABILITIES, MOCK_PACKAGES } from '../data/mockData';
import { TabType } from '../types';
import { SearchAnalyticsDashboard } from './SearchAnalyticsDashboard';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: TabType) => void;
  onSelectRepo: (repoId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onSelectRepo,
}) => {
  const [query, setQuery] = useState('');
  const [activePaletteMode, setActivePaletteMode] = useState<'results' | 'analytics'>('results');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredRepos = MOCK_REPOSITORIES.filter(
    r => r.name.toLowerCase().includes(query.toLowerCase()) || r.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredVulns = MOCK_VULNERABILITIES.filter(
    v => v.title.toLowerCase().includes(query.toLowerCase()) || v.cveId.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectQuery = (selectedText: string) => {
    setQuery(selectedText);
    setActivePaletteMode('results');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/50">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (activePaletteMode === 'analytics' && e.target.value.trim() !== '') {
                setActivePaletteMode('results');
              }
            }}
            placeholder="Search repositories, CVEs, packages, knowledge graph, or ask AI..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-mono text-slate-500 hover:text-slate-300 cursor-pointer px-1.5"
            >
              Clear
            </button>
          )}
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Toggle Switcher */}
        <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/80 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActivePaletteMode('results')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activePaletteMode === 'results'
                  ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Search Results ({filteredRepos.length + filteredVulns.length})</span>
            </button>

            <button
              onClick={() => setActivePaletteMode('analytics')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activePaletteMode === 'analytics'
                  ? 'bg-gradient-to-r from-cyan-950 to-indigo-950 text-cyan-300 border border-cyan-800/80'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Search Analytics & Trending</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </button>
          </div>

          <span className="text-[10px] text-slate-500 hidden sm:inline">⌘K Command Palette</span>
        </div>

        {/* Search Results / Analytics Container */}
        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          {activePaletteMode === 'analytics' ? (
            <SearchAnalyticsDashboard
              onSelectQuery={handleSelectQuery}
              onSelectTab={onSelectTab}
              onClosePalette={onClose}
            />
          ) : (
            <>
              {/* Quick AI Action Suggestion */}
              {query.trim() && (
                <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-800/50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <div>
                      <div className="text-xs font-semibold text-cyan-200">Ask KhulnaSoft AI Engine</div>
                      <div className="text-[11px] text-slate-400">"{query}"</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onSelectTab('ai-assistant');
                      onClose();
                    }}
                    className="flex items-center space-x-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>Ask AI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Repositories */}
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-2">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Repositories ({filteredRepos.length})</span>
                </div>
                <div className="space-y-1">
                  {filteredRepos.map((repo) => (
                    <div
                      key={repo.id}
                      onClick={() => {
                        onSelectRepo(repo.id);
                        onSelectTab('repos');
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer border border-transparent hover:border-slate-700/60 transition-colors"
                    >
                      <div>
                        <div className="text-xs font-semibold text-slate-200 flex items-center space-x-2">
                          <span>{repo.org}/{repo.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                            {repo.language}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-lg">{repo.description}</div>
                      </div>
                      <div className="text-right text-[10px] text-slate-400 font-mono">
                        <div>Cov: {repo.testCoverage}%</div>
                        <div>Sec: {repo.securityScore}/100</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security & Vulnerabilities */}
              {filteredVulns.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    <span>Security Alerts & CVEs</span>
                  </div>
                  <div className="space-y-1">
                    {filteredVulns.map((vuln) => (
                      <div
                        key={vuln.id}
                        onClick={() => {
                          onSelectTab('security');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer border border-transparent hover:border-slate-700/60 transition-colors"
                      >
                        <div>
                          <div className="text-xs font-semibold text-rose-300 flex items-center space-x-2">
                            <span>{vuln.cveId}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                              {vuln.severity}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">{vuln.title}</div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{vuln.repositoryName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Embedded Search Analytics Preview at bottom of empty search */}
              {!query && (
                <div className="pt-2 border-t border-slate-800/60">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      <span>Want to explore platform search trends?</span>
                    </div>
                    <button
                      onClick={() => setActivePaletteMode('analytics')}
                      className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                    >
                      View Search Analytics
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[11px] text-slate-500 flex items-center justify-between font-mono">
          <span>Navigate with ↑↓ • Select with ↵</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};

