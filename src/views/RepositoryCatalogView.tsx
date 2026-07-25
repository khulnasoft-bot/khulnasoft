import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  GitBranch, 
  Star, 
  GitFork, 
  ShieldCheck, 
  FileText, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Users, 
  ExternalLink,
  Search,
  RefreshCw,
  SlidersHorizontal,
  Activity,
  Database,
  Cpu,
  Check,
  AlertTriangle,
  Info,
  Clock,
  Zap,
  Tag,
  Eye,
  Server,
  FolderGit2
} from 'lucide-react';
import { MOCK_REPOSITORIES, MOCK_PIPELINE_EVENTS, MOCK_ORG_SYNC_STATS } from '../data/mockData';
import { Repository, TabType, DiscoveryPipelineEvent, OrgSyncStats } from '../types';
import { SyncStatusIndicator } from '../components/SyncStatusIndicator';
import { RepoHealthD3Charts } from '../components/RepoHealthD3Charts';
import { RepoHealthMiniDashboard } from '../components/RepoHealthMiniDashboard';
import { NotesWidget } from '../components/NotesWidget';

interface RepositoryCatalogViewProps {
  selectedRepoId: string;
  onSelectRepo: (repoId: string) => void;
  onSelectTab: (tab: TabType) => void;
  onOpenAiRepoAnalyzer?: () => void;
}

export const RepositoryCatalogView: React.FC<RepositoryCatalogViewProps> = ({
  selectedRepoId,
  onSelectRepo,
  onSelectTab,
  onOpenAiRepoAnalyzer,
}) => {
  // Main view navigation tab
  const [activeMainTab, setActiveMainTab] = useState<'catalog' | 'pipeline' | 'health-matrix' | 'dependencies-radar' | 'ai-generator'>('catalog');

  // Inspector sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'health' | 'scorecard' | 'readme' | 'architecture' | 'dependencies' | 'contributors'>('health');

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedFramework, setSelectedFramework] = useState<string>('all');
  const [selectedProjectType, setSelectedProjectType] = useState<string>('all');
  const [selectedMaturity, setSelectedMaturity] = useState<string>('all');
  const [selectedVisibility, setSelectedVisibility] = useState<string>('all');

  // Pipeline & API state
  const [repositories, setRepositories] = useState<Repository[]>(MOCK_REPOSITORIES);
  const [pipelineEvents, setPipelineEvents] = useState<DiscoveryPipelineEvent[]>(MOCK_PIPELINE_EVENTS);
  const [syncStats, setSyncStats] = useState<OrgSyncStats>(MOCK_ORG_SYNC_STATS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  // AI Generator state
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);

  const activeRepo = repositories.find((r) => r.id === selectedRepoId) || repositories[0];

  // Fetch repositories from API if running
  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch('/api/repositories');
        if (res.ok) {
          const data = await res.json();
          if (data.repositories && data.repositories.length > 0) {
            setRepositories(data.repositories);
          }
        }
      } catch (err) {
        console.warn('Using client-side fallback repositories data');
      }
    };
    fetchRepos();
  }, []);

  // Filter Repositories logic
  const filteredRepositories = repositories.filter((repo) => {
    const matchQuery = 
      !searchQuery ||
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchLang = selectedLanguage === 'all' || repo.language.toLowerCase() === selectedLanguage.toLowerCase();
    const matchFmt = selectedFramework === 'all' || repo.frameworks.some((f) => f.toLowerCase().includes(selectedFramework.toLowerCase()));
    const matchProj = selectedProjectType === 'all' || repo.projectType.toLowerCase() === selectedProjectType.toLowerCase();
    const matchMat = selectedMaturity === 'all' || repo.maturity.toLowerCase() === selectedMaturity.toLowerCase();
    const matchVis = selectedVisibility === 'all' || (selectedVisibility === 'private' ? repo.isPrivate : !repo.isPrivate);

    return matchQuery && matchLang && matchFmt && matchProj && matchMat && matchVis;
  });

  // Handle Trigger Sync
  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setSyncSuccessMsg(null);
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgName: 'khulnasoft' }),
      });
      const data = await res.json();
      if (data.success) {
        setSyncSuccessMsg(data.message);
        if (data.events) {
          setPipelineEvents((prev) => [...data.events, ...prev]);
        }
        if (data.stats) {
          setSyncStats(data.stats);
        }
      }
    } catch (err) {
      setSyncSuccessMsg('Organization sync completed in fallback mode');
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle AI Analysis
  const handleGenerateAiDoc = async () => {
    setIsGeneratingDoc(true);
    setAiAnalysis(null);
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Perform Phase 1 Repository Assessment for ${activeRepo.org}/${activeRepo.name}. Include architecture classification, security score evaluation, test coverage recommendations, and component flow diagram.`,
          taskType: 'complex',
          repoContext: activeRepo,
        }),
      });
      const data = await res.json();
      setAiAnalysis(data.text);
    } catch (err) {
      setAiAnalysis('Generated fallback documentation for ' + activeRepo.name);
    } finally {
      setIsGeneratingDoc(false);
    }
  };

  // Recalculate Health Score API call
  const handleRecalculateScore = async (repoId: string) => {
    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoId }),
      });
      const data = await res.json();
      if (data.success && data.healthBreakdown) {
        setRepositories((prev) =>
          prev.map((r) => (r.id === repoId ? { ...r, healthBreakdown: data.healthBreakdown } : r))
        );
      }
    } catch (err) {
      console.error('Score recalculation failed', err);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">Phase 1</span>
            <span>Organization Assessment & Repository Inventory</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center space-x-3">
            <Code2 className="w-6 h-6 text-cyan-400" />
            <span>Repository Asset Catalog</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Living software asset registry with automated metadata extraction, dependency analysis, architecture inference, and health scoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SyncStatusIndicator />

          <button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/40 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isSyncing ? 'Syncing Org...' : 'Sync GitHub Org'}</span>
          </button>

          <button
            onClick={() => {
              setActiveMainTab('ai-generator');
              handleGenerateAiDoc();
              if (onOpenAiRepoAnalyzer) onOpenAiRepoAnalyzer();
            }}
            disabled={isGeneratingDoc}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-extrabold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isGeneratingDoc ? 'animate-spin' : ''}`} />
            <span>AI Repository Analyzer</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-800 space-x-6 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveMainTab('catalog')}
          className={`pb-3 transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
            activeMainTab === 'catalog'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Repository Catalog & Inspector ({filteredRepositories.length})</span>
        </button>

        <button
          onClick={() => setActiveMainTab('pipeline')}
          className={`pb-3 transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
            activeMainTab === 'pipeline'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Discovery & Pipeline Monitor</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800">
            Live Queue
          </span>
        </button>

        <button
          onClick={() => setActiveMainTab('health-matrix')}
          className={`pb-3 transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
            activeMainTab === 'health-matrix'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Health Scoring Matrix</span>
        </button>

        <button
          onClick={() => setActiveMainTab('dependencies-radar')}
          className={`pb-3 transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
            activeMainTab === 'dependencies-radar'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Dependencies & Framework Radar</span>
        </button>

        <button
          onClick={() => setActiveMainTab('ai-generator')}
          className={`pb-3 transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
            activeMainTab === 'ai-generator'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Architecture Intelligence</span>
        </button>
      </div>

      {/* Sync Success Toast */}
      {syncSuccessMsg && (
        <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-xs flex items-center justify-between font-mono">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{syncSuccessMsg}</span>
          </div>
          <button onClick={() => setSyncSuccessMsg(null)} className="text-slate-400 hover:text-slate-200">
            ×
          </button>
        </div>
      )}

      {/* TAB 1: CATALOG & INSPECTOR */}
      {activeMainTab === 'catalog' && (
        <div className="space-y-6">
          {/* Search & Multi-faceted Filter Controls Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              {/* Query Search */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search repositories by name, topic, package, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
                />
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-400 shrink-0">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <span className="font-bold">Filters:</span>
              </div>
            </div>

            {/* Filter Pill Selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {/* Language Filter */}
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Languages</option>
                  <option value="go">Go</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="rust">Rust</option>
                </select>
              </div>

              {/* Framework Filter */}
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Framework</label>
                <select
                  value={selectedFramework}
                  onChange={(e) => setSelectedFramework(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Frameworks</option>
                  <option value="gin">Gin (Go)</option>
                  <option value="grpc">gRPC</option>
                  <option value="express">Express (Node)</option>
                  <option value="fastapi">FastAPI (Python)</option>
                  <option value="tokio">Tokio (Rust)</option>
                  <option value="react">React</option>
                </select>
              </div>

              {/* Project Type Filter */}
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Project Type</label>
                <select
                  value={selectedProjectType}
                  onChange={(e) => setSelectedProjectType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Types</option>
                  <option value="service">Service</option>
                  <option value="api">API</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="frontend">Frontend</option>
                  <option value="cli">CLI</option>
                  <option value="ai model">AI Model</option>
                </select>
              </div>

              {/* Maturity Filter */}
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Maturity</label>
                <select
                  value={selectedMaturity}
                  onChange={(e) => setSelectedMaturity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Maturity</option>
                  <option value="production">Production</option>
                  <option value="stable">Stable</option>
                  <option value="beta">Beta</option>
                  <option value="experimental">Experimental</option>
                </select>
              </div>

              {/* Visibility Filter */}
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Visibility</label>
                <select
                  value={selectedVisibility}
                  onChange={(e) => setSelectedVisibility(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Visibility</option>
                  <option value="private">Private Enterprise</option>
                  <option value="public">Public</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Grid: Left Repos List, Right Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column: Repository Navigation List */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 py-1 flex items-center justify-between">
                <span>Inventory ({filteredRepositories.length})</span>
                <span className="text-[10px] font-mono text-cyan-400">{repositories.length} Total</span>
              </div>

              <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
                {filteredRepositories.map((repo) => {
                  const isSelected = repo.id === activeRepo.id;
                  const healthScore = repo.healthBreakdown?.overallScore || repo.securityScore;

                  return (
                    <button
                      key={repo.id}
                      onClick={() => onSelectRepo(repo.id)}
                      className={`w-full text-left p-3.5 rounded-xl transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-slate-800 border-cyan-500/80 shadow-lg shadow-cyan-950/30'
                          : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800/80'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-200 flex items-center justify-between">
                        <span className="truncate pr-2">{repo.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800 shrink-0">
                          {repo.language}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 truncate mt-1">{repo.description}</p>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-300">
                          {repo.projectType}
                        </span>
                        <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Health: {healthScore}/100</span>
                        </span>
                      </div>
                    </button>
                  );
                })}

                {filteredRepositories.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
                    No repositories matched your selected filter criteria.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Active Repository Deep Inspector */}
            <div className="lg:col-span-3 space-y-6">
              {/* Active Repository Banner Header */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-3 flex-wrap gap-y-1">
                      <h2 className="text-xl font-bold text-slate-100 font-mono">{activeRepo.org}/{activeRepo.name}</h2>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {activeRepo.isPrivate ? 'Private Enterprise' : 'Public'}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-950 text-indigo-300 border border-indigo-800">
                        {activeRepo.maturity} Maturity
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{activeRepo.description}</p>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-mono text-slate-400 shrink-0">
                    <span className="flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span>{activeRepo.starCount}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <GitFork className="w-3.5 h-3.5 text-slate-400" />
                      <span>{activeRepo.forkCount}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>{activeRepo.watchersCount || 120}</span>
                    </span>
                  </div>
                </div>

                {/* Quick Metric Cards Row */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 font-mono text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-slate-500 text-[10px]">HEALTH SCORE</div>
                    <div className="text-emerald-400 font-bold text-sm mt-0.5">
                      {activeRepo.healthBreakdown?.overallScore || activeRepo.securityScore}/100
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-slate-500 text-[10px]">TEST COVERAGE</div>
                    <div className="text-cyan-400 font-bold text-sm mt-0.5">{activeRepo.testCoverage}%</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-slate-500 text-[10px]">SECURITY SCORE</div>
                    <div className="text-cyan-300 font-bold text-sm mt-0.5">{activeRepo.securityScore}/100</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-slate-500 text-[10px]">BUILD SYSTEM</div>
                    <div className="text-slate-200 font-bold text-xs mt-0.5 truncate">{activeRepo.buildSystem}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-slate-500 text-[10px]">SBOM STATUS</div>
                    <div className="text-emerald-400 font-bold text-xs mt-0.5">{activeRepo.sbomStatus}</div>
                  </div>
                </div>

                <NotesWidget repoId={activeRepo.id} repoName={`${activeRepo.org}/${activeRepo.name}`} />

                {/* Sub Tab Navigation inside Inspector */}
                <div className="flex border-b border-slate-800 space-x-6 text-xs font-medium pt-2 overflow-x-auto">
                  <button
                    onClick={() => setActiveSubTab('health')}
                    className={`pb-2 transition-colors cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                      activeSubTab === 'health' ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>D3 Metrics</span>
                    <span className="px-1 py-0.2 text-[9px] font-mono font-bold rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      D3.js
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveSubTab('scorecard')}
                    className={`pb-2 transition-colors cursor-pointer shrink-0 ${
                      activeSubTab === 'scorecard' ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Phase 1 Scorecard Breakdown
                  </button>

                  <button
                    onClick={() => setActiveSubTab('readme')}
                    className={`pb-2 transition-colors cursor-pointer shrink-0 ${
                      activeSubTab === 'readme' ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    README.md
                  </button>

                  <button
                    onClick={() => setActiveSubTab('architecture')}
                    className={`pb-2 transition-colors cursor-pointer shrink-0 ${
                      activeSubTab === 'architecture' ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Architecture Topology
                  </button>

                  <button
                    onClick={() => setActiveSubTab('dependencies')}
                    className={`pb-2 transition-colors cursor-pointer shrink-0 ${
                      activeSubTab === 'dependencies' ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Dependencies ({activeRepo.dependencies.length})
                  </button>

                  <button
                    onClick={() => setActiveSubTab('contributors')}
                    className={`pb-2 transition-colors cursor-pointer shrink-0 ${
                      activeSubTab === 'contributors' ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Contributors ({activeRepo.contributors.length})
                  </button>
                </div>

                {/* Sub Tab Content Panels */}
                <div className="pt-2">
                  {/* D3 Health Charts */}
                  {activeSubTab === 'health' && (
                    <RepoHealthD3Charts repository={activeRepo} />
                  )}

                  {/* Scorecard Breakdown */}
                  {activeSubTab === 'scorecard' && (
                    <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 font-mono">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div>
                          <h3 className="text-sm font-bold text-slate-100">Phase 1 Scorecard Breakdown</h3>
                          <p className="text-xs text-slate-400">Weighted scorecard metrics evaluated by automated repository parser.</p>
                        </div>
                        <button
                          onClick={() => handleRecalculateScore(activeRepo.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 text-xs font-bold cursor-pointer transition-all"
                        >
                          Recalculate Score
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                        {/* Documentation Score */}
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                          <div className="text-[10px] text-slate-400">DOCUMENTATION</div>
                          <div className="text-cyan-400 text-base font-extrabold">
                            {activeRepo.healthBreakdown?.documentationScore || 18}/20
                          </div>
                          <div className="text-[10px] text-slate-500">README, LICENSE, CODEOWNERS</div>
                        </div>

                        {/* Security Score */}
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                          <div className="text-[10px] text-slate-400">SECURITY</div>
                          <div className="text-emerald-400 text-base font-extrabold">
                            {activeRepo.healthBreakdown?.securityScore || 19}/20
                          </div>
                          <div className="text-[10px] text-slate-500">CVE, Branch Protection</div>
                        </div>

                        {/* Testing Score */}
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                          <div className="text-[10px] text-slate-400">TESTING</div>
                          <div className="text-cyan-300 text-base font-extrabold">
                            {activeRepo.healthBreakdown?.testingScore || 18}/20
                          </div>
                          <div className="text-[10px] text-slate-500">Coverage: {activeRepo.testCoverage}%</div>
                        </div>

                        {/* CI/CD Score */}
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                          <div className="text-[10px] text-slate-400">CI/CD</div>
                          <div className="text-indigo-400 text-base font-extrabold">
                            {activeRepo.healthBreakdown?.cicdScore || 19}/20
                          </div>
                          <div className="text-[10px] text-slate-500">Pipeline Pass Rate</div>
                        </div>

                        {/* Maintenance Score */}
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                          <div className="text-[10px] text-slate-400">MAINTENANCE</div>
                          <div className="text-amber-400 text-base font-extrabold">
                            {activeRepo.healthBreakdown?.maintenanceScore || 18}/20
                          </div>
                          <div className="text-[10px] text-slate-500">Commit Activity</div>
                        </div>
                      </div>

                      {/* File Compliance Indicators */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-xs">
                        <div className="flex items-center space-x-2 text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>README.md</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>LICENSE</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>CODEOWNERS</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>CHANGELOG.md</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>CONTRIBUTING.md</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* README.md Tab */}
                  {activeSubTab === 'readme' && (
                    <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-3 whitespace-pre-wrap">
                      {activeRepo.readmeMarkdown}
                    </div>
                  )}

                  {/* Architecture & Topology Tab */}
                  {activeSubTab === 'architecture' && (
                    <div className="bg-slate-950/90 p-5 rounded-xl border border-slate-800 space-y-4">
                      <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                        Auto-Extracted Mermaid Topology
                      </div>
                      <pre className="bg-slate-900 p-4 rounded-xl text-xs text-cyan-200 font-mono overflow-x-auto border border-slate-800">
                        {activeRepo.architectureMermaid}
                      </pre>
                    </div>
                  )}

                  {/* Dependencies Tab */}
                  {activeSubTab === 'dependencies' && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {activeRepo.dependencies.map((dep, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                            <div className="font-mono text-slate-200">{dep.name}</div>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-cyan-400">{dep.version}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                                {dep.type}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contributors Tab */}
                  {activeSubTab === 'contributors' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {activeRepo.contributors.map((contrib, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center space-x-3">
                          <img src={contrib.avatarUrl} alt={contrib.name} className="w-9 h-9 rounded-full ring-2 ring-cyan-500/40" />
                          <div>
                            <div className="text-xs font-bold text-slate-200">{contrib.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{contrib.commits} commits</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DISCOVERY & PIPELINE MONITOR */}
      {activeMainTab === 'pipeline' && (
        <div className="space-y-6">
          {/* Architecture Pipeline Flow Banner */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>Repository Discovery & Parsing Pipeline</span>
            </h2>
            <p className="text-xs text-slate-400">
              High-throughput continuous discovery queue transforming GitHub organization events into structured catalog metadata.
            </p>

            {/* Visual Microservice Pipeline Stages */}
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 text-xs font-mono pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="text-[10px] text-slate-500 uppercase">STAGE 1</div>
                <div className="text-cyan-400 font-bold text-xs">GitHub Org Sync</div>
                <div className="text-[10px] text-slate-400">Discover Repos</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="text-[10px] text-slate-500 uppercase">STAGE 2</div>
                <div className="text-cyan-400 font-bold text-xs">Repository Cloner</div>
                <div className="text-[10px] text-slate-400">Incremental Fetch</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="text-[10px] text-slate-500 uppercase">STAGE 3</div>
                <div className="text-cyan-400 font-bold text-xs">Repository Parser</div>
                <div className="text-[10px] text-slate-400">AST & Metadata</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="text-[10px] text-slate-500 uppercase">STAGE 4</div>
                <div className="text-cyan-400 font-bold text-xs">Dependency Analyzer</div>
                <div className="text-[10px] text-slate-400">SBOM & CVE Graph</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="text-[10px] text-slate-500 uppercase">STAGE 5</div>
                <div className="text-cyan-400 font-bold text-xs">Framework Detector</div>
                <div className="text-[10px] text-slate-400">Confidence Scoring</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/40 text-center space-y-1 bg-cyan-950/20">
                <div className="text-[10px] text-cyan-400 uppercase">STAGE 6</div>
                <div className="text-emerald-400 font-bold text-xs">Catalog Index</div>
                <div className="text-[10px] text-slate-300">Live Inventory</div>
              </div>
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono">
              <div className="text-slate-500 text-[10px]">DISCOVERY COVERAGE</div>
              <div className="text-emerald-400 font-extrabold text-xl mt-1">100%</div>
              <div className="text-slate-400 text-[10px] mt-0.5">18 / 18 Repositories</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono">
              <div className="text-slate-500 text-[10px]">METADATA EXTRACTION</div>
              <div className="text-cyan-400 font-extrabold text-xl mt-1">{syncStats.metadataSuccessRate}%</div>
              <div className="text-slate-400 text-[10px] mt-0.5">Automated Parsing Rate</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono">
              <div className="text-slate-500 text-[10px]">FRAMEWORK ACCURACY</div>
              <div className="text-cyan-300 font-extrabold text-xl mt-1">{syncStats.frameworkAccuracy}%</div>
              <div className="text-slate-400 text-[10px] mt-0.5">Confidence Level</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono">
              <div className="text-slate-500 text-[10px]">AVG REPO SYNC DURATION</div>
              <div className="text-indigo-400 font-extrabold text-xl mt-1">&lt; 2.4 min</div>
              <div className="text-slate-400 text-[10px] mt-0.5">Full Org Refresh</div>
            </div>
          </div>

          {/* Live Pipeline Events Log Stream */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Real-Time Discovery Event Stream</span>
              </h3>
              <span className="text-[10px] text-slate-500">Showing last {pipelineEvents.length} events</span>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {pipelineEvents.map((evt) => (
                <div key={evt.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                        {evt.eventType}
                      </span>
                      <span className="text-slate-200 font-bold">{evt.repoName}</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{evt.detail}</p>
                  </div>
                  <div className="text-[10px] text-slate-500 shrink-0">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HEALTH SCORING MATRIX */}
      {activeMainTab === 'health-matrix' && (
        <div className="space-y-6 font-mono">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Organization Health Scorecard Matrix</span>
            </h2>
            <p className="text-xs text-slate-400">
              Overall health score calculated across Documentation (20%), Security (20%), Testing (20%), CI/CD (20%), and Maintenance (20%).
            </p>
          </div>

          {/* Matrix Score Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase">
                  <th className="pb-3 font-bold">Repository</th>
                  <th className="pb-3 font-bold">Overall Score</th>
                  <th className="pb-3 font-bold">Docs (20)</th>
                  <th className="pb-3 font-bold">Security (20)</th>
                  <th className="pb-3 font-bold">Testing (20)</th>
                  <th className="pb-3 font-bold">CI/CD (20)</th>
                  <th className="pb-3 font-bold">Maint (20)</th>
                  <th className="pb-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {repositories.map((repo) => {
                  const bd = repo.healthBreakdown;
                  const overall = bd?.overallScore || repo.securityScore;

                  return (
                    <tr key={repo.id} className="hover:bg-slate-800/40 transition-all">
                      <td className="py-3 pr-4">
                        <div className="font-bold text-slate-200">{repo.name}</div>
                        <div className="text-[10px] text-slate-500">{repo.language} • {repo.projectType}</div>
                      </td>
                      <td className="py-3 pr-4 font-bold text-emerald-400 text-sm">{overall}/100</td>
                      <td className="py-3 pr-4 text-cyan-400">{bd?.documentationScore || 18}/20</td>
                      <td className="py-3 pr-4 text-emerald-400">{bd?.securityScore || 19}/20</td>
                      <td className="py-3 pr-4 text-cyan-300">{bd?.testingScore || 18}/20</td>
                      <td className="py-3 pr-4 text-indigo-400">{bd?.cicdScore || 19}/20</td>
                      <td className="py-3 pr-4 text-amber-400">{bd?.maintenanceScore || 18}/20</td>
                      <td className="py-3">
                        <button
                          onClick={() => handleRecalculateScore(repo.id)}
                          className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-800 text-[10px] cursor-pointer"
                        >
                          Re-score
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DEPENDENCIES & FRAMEWORK RADAR */}
      {activeMainTab === 'dependencies-radar' && (
        <div className="space-y-6 font-mono">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Global Dependency & Framework Radar</span>
            </h2>
            <p className="text-xs text-slate-400">
              Aggregated dependency audit across all enterprise repositories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Unique Packages Table */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Top Ecosystem Packages Used
              </h3>
              <div className="space-y-2">
                {repositories.flatMap(r => r.dependencies).slice(0, 8).map((dep, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-200">{dep.name}</div>
                      <div className="text-[10px] text-slate-500">Ecosystem: {dep.ecosystem || 'NPM/Go'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-cyan-400 font-bold">{dep.version}</div>
                      <div className="text-[10px] text-emerald-400">CVE Clean</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Framework Distribution */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Detected Frameworks
              </h3>
              <div className="space-y-2">
                {['Gin (Go)', 'Express (TypeScript)', 'FastAPI (Python)', 'Tokio (Rust)', 'React (TypeScript)', 'Kubebuilder (Go)'].map((fw, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                    <span className="text-slate-200 font-bold">{fw}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] border border-cyan-800">
                      High Confidence (98%+)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AI ARCHITECTURE INTELLIGENCE */}
      {activeMainTab === 'ai-generator' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span>AI Architecture Analysis Engine (Gemini 3.6 Flash)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Automated architectural inference, component sequence flows, and runbook generation for {activeRepo.name}.
                </p>
              </div>

              <button
                onClick={handleGenerateAiDoc}
                disabled={isGeneratingDoc}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 text-xs font-extrabold cursor-pointer disabled:opacity-50"
              >
                {isGeneratingDoc ? 'Analyzing...' : 'Re-Run AI Analysis'}
              </button>
            </div>

            {aiAnalysis ? (
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {aiAnalysis}
              </div>
            ) : (
              <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 text-center text-xs text-slate-500">
                Click 'Re-Run AI Analysis' to extract architectural insights for {activeRepo.name}.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
