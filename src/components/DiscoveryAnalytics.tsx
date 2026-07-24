import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  Activity, 
  Clock, 
  Layers, 
  RefreshCw, 
  CheckCircle2, 
  Code2, 
  Cpu, 
  Database, 
  Zap, 
  SlidersHorizontal, 
  Download, 
  BarChart3, 
  PieChart, 
  ArrowUpRight, 
  ShieldCheck, 
  Sparkles,
  Server,
  Filter,
  FileText
} from 'lucide-react';
import { MOCK_REPOSITORIES, MOCK_ORG_SYNC_STATS, MOCK_PIPELINE_EVENTS } from '../data/mockData';
import { Repository, OrgSyncStats, DiscoveryPipelineEvent } from '../types';

interface DiscoveryAnalyticsProps {
  onTriggerSync?: () => void;
}

export const DiscoveryAnalytics: React.FC<DiscoveryAnalyticsProps> = ({ onTriggerSync }) => {
  const [repositories, setRepositories] = useState<Repository[]>(MOCK_REPOSITORIES);
  const [stats, setStats] = useState<OrgSyncStats>(MOCK_ORG_SYNC_STATS);
  const [pipelineEvents, setPipelineEvents] = useState<DiscoveryPipelineEvent[]>(MOCK_PIPELINE_EVENTS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFilter, setSyncFilter] = useState<'all' | 'cloned' | 'indexed' | 'syncing'>('all');
  const [selectedLang, setSelectedLang] = useState<string>('all');
  const [activeSubView, setActiveSubView] = useState<'overview' | 'duration' | 'distribution' | 'pipeline'>('overview');

  // Fetch latest data from backend API if available
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/repositories');
        if (res.ok) {
          const data = await res.json();
          if (data.repositories) setRepositories(data.repositories);
        }
      } catch (err) {
        // Fallback to mock data
      }
    };
    fetchData();
  }, []);

  // Sync execution handler
  const handleRunSync = async () => {
    setIsSyncing(true);
    if (onTriggerSync) onTriggerSync();

    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgName: 'khulnasoft' }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.stats) setStats(data.stats);
        if (data.events) setPipelineEvents((prev) => [...data.events, ...prev]);
      }
    } catch (err) {
      // Graceful fallback
    } finally {
      setTimeout(() => setIsSyncing(false), 1200);
    }
  };

  // Language Breakdown Calculation
  const languageCounts = repositories.reduce((acc, repo) => {
    acc[repo.language] = (acc[repo.language] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalRepos = repositories.length || 1;
  const languagePercentages = Object.entries(languageCounts).map(([lang, count]) => ({
    language: lang,
    count,
    percentage: Math.round((count / totalRepos) * 100),
  })).sort((a, b) => b.count - a.count);

  // Framework Breakdown Calculation
  const frameworkCounts = repositories.reduce((acc, repo) => {
    repo.frameworks.forEach((fw) => {
      acc[fw] = (acc[fw] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const frameworkList = Object.entries(frameworkCounts)
    .map(([framework, count]) => ({ framework, count }))
    .sort((a, b) => b.count - a.count);

  // Simulated Sync Duration per Repo (ms or sec)
  const repoSyncDurations = repositories.map((r) => {
    const baseDurationSec = (r.linesOfCode || 50000) / 40000 + (r.dependencies.length * 0.3) + 1.2;
    return {
      id: r.id,
      name: r.name,
      lang: r.language,
      durationSec: parseFloat(baseDurationSec.toFixed(1)),
      linesOfCode: r.linesOfCode || 85000,
      status: r.discoveryStatus || 'indexed',
    };
  });

  const maxDuration = Math.max(...repoSyncDurations.map((d) => d.durationSec), 1);

  // Export report
  const handleExportReport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({ stats, repositories, pipelineEvents }, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `khulnasoft-discovery-analytics-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Controls & View Selector Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Phase 1 Discovery Telemetry Engine</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center space-x-2">
              <span>Repository Discovery & Catalog Analytics</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Real-time monitoring of organization indexing velocity, clone sync latencies, language distribution, and framework detection accuracy.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportReport}
              className="flex items-center space-x-2 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Telemetry</span>
            </button>

            <button
              onClick={handleRunSync}
              disabled={isSyncing}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing Catalog...' : 'Trigger Sync'}</span>
            </button>
          </div>
        </div>

        {/* View Switcher Sub-tabs */}
        <div className="flex items-center space-x-4 text-xs font-mono font-bold overflow-x-auto pt-1">
          <button
            onClick={() => setActiveSubView('overview')}
            className={`pb-2 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
              activeSubView === 'overview'
                ? 'text-cyan-400 border-cyan-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Discovery Overview</span>
          </button>

          <button
            onClick={() => setActiveSubView('duration')}
            className={`pb-2 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
              activeSubView === 'duration'
                ? 'text-cyan-400 border-cyan-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Sync Latencies & Timing</span>
          </button>

          <button
            onClick={() => setActiveSubView('distribution')}
            className={`pb-2 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
              activeSubView === 'distribution'
                ? 'text-cyan-400 border-cyan-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Language & Framework Radar</span>
          </button>

          <button
            onClick={() => setActiveSubView('pipeline')}
            className={`pb-2 border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
              activeSubView === 'pipeline'
                ? 'text-cyan-400 border-cyan-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Pipeline Stage Latencies</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-slate-500 text-[10px] uppercase font-bold flex items-center justify-between">
            <span>DISCOVERED REPOSITORIES</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-slate-100">{repositories.length} / {stats.totalDiscovered}</div>
          <div className="text-[10px] text-emerald-400">100% Organization Coverage</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-slate-500 text-[10px] uppercase font-bold flex items-center justify-between">
            <span>FULL SYNC DURATION</span>
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">2.4 min</div>
          <div className="text-[10px] text-cyan-300">Incremental Webhook: &lt; 30s</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-slate-500 text-[10px] uppercase font-bold flex items-center justify-between">
            <span>METADATA EXTRACTION</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-400">{stats.metadataSuccessRate}%</div>
          <div className="text-[10px] text-indigo-300">AST Parser & SBOM Success</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-slate-500 text-[10px] uppercase font-bold flex items-center justify-between">
            <span>FRAMEWORK ACCURACY</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{stats.frameworkAccuracy}%</div>
          <div className="text-[10px] text-slate-400">Confidence Score Index</div>
        </div>
      </div>

      {/* SUB-VIEW 1: OVERVIEW & PROGRESS */}
      {activeSubView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Discovery & Sync Progress Visualizer */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-slate-100 text-sm font-mono flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Repository Discovery Pipeline Status</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-800">
                Sync Engine Active
              </span>
            </div>

            {/* Overall Discovery Progress Bar */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Organization Inventory Indexing Progress:</span>
                <span className="text-emerald-400 font-bold">{stats.syncProgressPercent}% Complete</span>
              </div>
              <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${stats.syncProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Status Breakdown Grid */}
            <div className="grid grid-cols-4 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-500 text-[10px]">INDEXED</div>
                <div className="text-emerald-400 font-bold text-base mt-0.5">
                  {repositories.filter((r) => r.discoveryStatus === 'indexed' || !r.discoveryStatus).length}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-500 text-[10px]">SYNCING</div>
                <div className="text-cyan-400 font-bold text-base mt-0.5">
                  {repositories.filter((r) => r.discoveryStatus === 'syncing').length}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-500 text-[10px]">QUEUED</div>
                <div className="text-indigo-400 font-bold text-base mt-0.5">
                  {repositories.filter((r) => r.discoveryStatus === 'queued').length}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-500 text-[10px]">FAILED</div>
                <div className="text-slate-400 font-bold text-base mt-0.5">0</div>
              </div>
            </div>

            {/* Microservice Discovery List Table */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center justify-between">
                <span>Repository Discovery Queue</span>
                <span>Lines of Code</span>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 font-mono text-xs">
                {repositories.map((repo) => (
                  <div
                    key={repo.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <div>
                        <div className="font-bold text-slate-200">{repo.org}/{repo.name}</div>
                        <div className="text-[10px] text-slate-500">
                          {repo.language} • {repo.projectType} • {repo.frameworks.join(', ')}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-cyan-400 font-bold">{(repo.linesOfCode || 85000).toLocaleString()} LOC</div>
                      <div className="text-[10px] text-emerald-400">Metadata Parsed</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Discovery Events Feed */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-100 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Live Sync Events</span>
              </span>
              <span className="text-[10px] text-cyan-400">Polling Event Queue</span>
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {pipelineEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800 text-[10px]">
                      {evt.eventType}
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="font-bold text-slate-200">{evt.repoName}</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{evt.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: SYNC DURATIONS & LATENCY BAR CHART */}
      {activeSubView === 'duration' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 text-sm">Repository Clone & AST Sync Latency Spectrum</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Duration required for incremental fetch, AST metadata extraction, SBOM parsing, and vector indexing per repository.
                </p>
              </div>
              <span className="text-cyan-400 text-[11px] font-bold">Avg Latency: 2.1s / repo</span>
            </div>

            <div className="space-y-3">
              {repoSyncDurations.map((item) => {
                const widthPct = Math.max(12, Math.round((item.durationSec / maxDuration) * 100));

                return (
                  <div key={item.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-200">{item.name}</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 text-[10px]">
                          {item.lang}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-400 text-[11px]">{(item.linesOfCode).toLocaleString()} LOC</span>
                        <span className="text-cyan-400 font-bold">{item.durationSec}s</span>
                      </div>
                    </div>

                    <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: LANGUAGE & FRAMEWORK RADAR */}
      {activeSubView === 'distribution' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          {/* Primary Language Distribution */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>Primary Language Distribution</span>
              </span>
              <span className="text-slate-500 text-[10px]">{languagePercentages.length} Languages</span>
            </div>

            <div className="space-y-3">
              {languagePercentages.map((item) => (
                <div key={item.language} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{item.language}</span>
                    <span className="text-cyan-400 font-bold">{item.count} Repos ({item.percentage}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Framework Radar & Detection Confidence */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Detected Frameworks & Confidence</span>
              </span>
              <span className="text-emerald-400 font-bold text-[10px]">AST Inspection Engine</span>
            </div>

            <div className="space-y-2.5">
              {frameworkList.map((item) => (
                <div key={item.framework} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-200">{item.framework}</div>
                    <div className="text-[10px] text-slate-500">AST Confidence: 98.6%</div>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold text-xs">
                    {item.count} Repositories
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: PIPELINE STAGE LATENCIES */}
      {activeSubView === 'pipeline' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 font-mono text-xs">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-100 text-sm">Discovery Pipeline Stage Latency Breakdown</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Latency measured across each microservice pipeline component during an organization refresh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-slate-500 text-[10px] uppercase font-bold">1. GIT CLONE & FETCH</div>
              <div className="text-xl font-bold text-cyan-400">1.1s avg</div>
              <div className="text-[10px] text-slate-400">Incremental mirror fetch</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-slate-500 text-[10px] uppercase font-bold">2. AST METADATA PARSER</div>
              <div className="text-xl font-bold text-indigo-400">0.4s avg</div>
              <div className="text-[10px] text-slate-400">Tree-sitter AST & Manifests</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-slate-500 text-[10px] uppercase font-bold">3. DEPENDENCY & SBOM GRAPH</div>
              <div className="text-xl font-bold text-emerald-400">0.3s avg</div>
              <div className="text-[10px] text-slate-400">Vulnerability cross-reference</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-slate-500 text-[10px] uppercase font-bold">4. FRAMEWORK DETECTOR</div>
              <div className="text-xl font-bold text-amber-400">0.2s avg</div>
              <div className="text-[10px] text-slate-400">Pattern confidence scoring</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-slate-500 text-[10px] uppercase font-bold">5. HEALTH SCORE GENERATOR</div>
              <div className="text-xl font-bold text-purple-400">0.2s avg</div>
              <div className="text-[10px] text-slate-400">5-factor weighted matrix</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-slate-500 text-[10px] uppercase font-bold">6. SEARCH INDEX & VECTOR STORAGE</div>
              <div className="text-xl font-bold text-cyan-300">0.2s avg</div>
              <div className="text-[10px] text-slate-400">OpenSearch & Qdrant</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
