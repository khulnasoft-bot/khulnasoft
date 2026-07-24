import React, { useState } from 'react';
import { 
  GitPullRequest, 
  Layers, 
  Plus, 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Code2,
  Cpu,
  Workflow,
  Search,
  Users,
  Boxes,
  Server,
  Activity,
  BookOpen,
  ShieldAlert,
  Package as PackageIcon,
  MapPin,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Filter,
  Database,
  Lock,
  RefreshCw,
  Play,
  Zap,
  AlertTriangle,
  Globe,
  Building2,
  Check,
  Copy,
  Radio,
  BarChart3
} from 'lucide-react';
import { MOCK_REPOSITORIES, SYSTEM_STATS } from '../data/mockData';
import { TabType, Repository } from '../types';

interface DeveloperPortalViewProps {
  onSelectTab: (tab: TabType) => void;
  onSelectRepo: (repoId: string) => void;
  onOpenAiRepoAnalyzer?: () => void;
}

export type PortalTab = 
  | 'dashboard'
  | 'catalog'
  | 'architecture'
  | 'ownership'
  | 'dependencies'
  | 'deployments'
  | 'monitoring'
  | 'documentation'
  | 'pipelines'
  | 'packages'
  | 'roadmaps'
  | 'security';

export const DeveloperPortalView: React.FC<DeveloperPortalViewProps> = ({
  onSelectTab,
  onSelectRepo,
  onOpenAiRepoAnalyzer,
}) => {
  const [activePortalTab, setActivePortalTab] = useState<PortalTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOwnerFilter, setSelectedOwnerFilter] = useState<string>('All');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string>('All');
  
  // Scaffold Modal
  const [showScaffoldModal, setShowScaffoldModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [serviceTemplate, setServiceTemplate] = useState('go-grpc');
  const [selectedOwner, setSelectedOwner] = useState('Core Platform Team');
  const [isScaffolding, setIsScaffolding] = useState(false);
  const [scaffoldComplete, setScaffoldComplete] = useState(false);

  // Search matching across ALL 18 repositories
  const filteredRepos = MOCK_REPOSITORIES.filter((repo) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !query ||
      repo.name.toLowerCase().includes(query) ||
      repo.org.toLowerCase().includes(query) ||
      repo.description.toLowerCase().includes(query) ||
      repo.language.toLowerCase().includes(query) ||
      repo.architecture.toLowerCase().includes(query) ||
      repo.topics.some(t => t.toLowerCase().includes(query)) ||
      repo.frameworks.some(f => f.toLowerCase().includes(query));

    const matchesLanguage = selectedLanguageFilter === 'All' || repo.language === selectedLanguageFilter;
    
    return matchesSearch && matchesLanguage;
  });

  const handleScaffoldService = () => {
    if (!newServiceName.trim()) return;
    setIsScaffolding(true);
    setTimeout(() => {
      setIsScaffolding(false);
      setScaffoldComplete(true);
      setTimeout(() => {
        setShowScaffoldModal(false);
        setScaffoldComplete(false);
        setNewServiceName('');
      }, 1500);
    }, 1200);
  };

  const portalTabs: { id: PortalTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, badge: 'Live' },
    { id: 'catalog', label: 'Repository Catalog', icon: Code2, badge: `${MOCK_REPOSITORIES.length}` },
    { id: 'architecture', label: 'Architecture', icon: Layers },
    { id: 'ownership', label: 'Ownership', icon: Users },
    { id: 'dependencies', label: 'Dependencies', icon: Boxes },
    { id: 'deployments', label: 'Deployments', icon: Server, badge: 'GitOps' },
    { id: 'monitoring', label: 'Monitoring', icon: BarChart3 },
    { id: 'documentation', label: 'Documentation', icon: BookOpen },
    { id: 'pipelines', label: 'Pipelines', icon: Workflow, badge: '6 Active' },
    { id: 'packages', label: 'Packages', icon: PackageIcon },
    { id: 'roadmaps', label: 'Roadmaps', icon: TrendingUp },
    { id: 'security', label: 'Security', icon: ShieldAlert, badge: 'Pass 94%' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Portal Top Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-800/60 shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold mb-1">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI-Native Internal Developer Portal</span>
              <span className="px-2 py-0.2 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px]">
                Backstage Equivalent
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-100 flex items-center space-x-3">
              <span>Developer Portal Control Hub</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Centralized platform orchestrating software catalog, architecture diagrams, ownership, cross-repo dependencies, multi-region deployments, monitoring, pipelines, and security.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onOpenAiRepoAnalyzer && (
              <button
                id="btn-open-analyzer-portal"
                onClick={onOpenAiRepoAnalyzer}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer"
              >
                <Workflow className="w-4 h-4 text-cyan-400" />
                <span>AI Push Pipeline</span>
              </button>
            )}

            <button
              id="btn-scaffold-microservice"
              onClick={() => setShowScaffoldModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Scaffold New Microservice</span>
            </button>
          </div>
        </div>

        {/* Global Live Repository Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search every repository by name, tag, owner, language, framework, or architecture (e.g., 'core-api', 'ebpf', 'gemini', 'go')..."
            className="w-full bg-slate-950/90 border border-indigo-900/80 hover:border-cyan-500/80 rounded-2xl pl-10 pr-28 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-all shadow-inner font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-28 top-2.5 text-[10px] text-slate-400 hover:text-slate-200 font-mono"
            >
              Clear
            </button>
          )}
          <div className="absolute right-3 top-2.5 text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
            {filteredRepos.length} Repos Found
          </div>
        </div>

        {/* Sub Navigation Bar for the 12 Backstage Modules */}
        <div className="flex space-x-1.5 overflow-x-auto pb-1 text-xs scrollbar-none border-t border-slate-800/80 pt-3">
          {portalTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activePortalTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePortalTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-slate-950/40 text-slate-950 font-black' : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Global Search Results Overlay Banner when Query is Active */}
      {searchQuery && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-300 font-bold flex items-center space-x-2">
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Universal Search Results for "{searchQuery}": {filteredRepos.length} matching repositories</span>
            </span>
            <button
              onClick={() => setActivePortalTab('catalog')}
              className="text-slate-400 hover:text-cyan-300 text-[11px] underline"
            >
              View in Catalog Matrix →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredRepos.slice(0, 6).map((repo) => (
              <div
                key={repo.id}
                onClick={() => {
                  onSelectRepo(repo.id);
                  onSelectTab('repos');
                }}
                className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-200">{repo.org}/{repo.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {repo.language}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{repo.description}</p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Coverage: {repo.testCoverage}%</span>
                  <span className="text-emerald-400 font-bold">Security Score: {repo.securityScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PORTAL TAB 1: DASHBOARD */}
      {activePortalTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Total Repos</div>
              <div className="text-2xl font-black text-slate-100">{SYSTEM_STATS.totalRepos}</div>
              <div className="text-[10px] text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>100% Synced</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Active Services</div>
              <div className="text-2xl font-black text-cyan-400">{SYSTEM_STATS.totalServices}</div>
              <div className="text-[10px] text-slate-400">Kubernetes Pods</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Deployments</div>
              <div className="text-2xl font-black text-indigo-400">{SYSTEM_STATS.totalDeployments}</div>
              <div className="text-[10px] text-indigo-300">ArgoCD GitOps</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Active Builds</div>
              <div className="text-2xl font-black text-emerald-400">{SYSTEM_STATS.activeBuilds}</div>
              <div className="text-[10px] text-emerald-400">GH Actions Active</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Test Coverage</div>
              <div className="text-2xl font-black text-amber-400">{SYSTEM_STATS.avgTestCoverage}%</div>
              <div className="text-[10px] text-slate-400">Avg across repos</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Security Rating</div>
              <div className="text-2xl font-black text-emerald-400">{SYSTEM_STATS.securityScore}/100</div>
              <div className="text-[10px] text-emerald-400">eBPF Inspected</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Service Catalog Preview & Active PRs */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <span>Core Software Catalog ({MOCK_REPOSITORIES.length} Repositories)</span>
                  </div>
                  <button
                    onClick={() => setActivePortalTab('catalog')}
                    className="text-xs text-cyan-400 hover:underline font-mono"
                  >
                    View All Matrix →
                  </button>
                </div>

                <div className="space-y-3">
                  {MOCK_REPOSITORIES.slice(0, 5).map((repo) => (
                    <div
                      key={repo.id}
                      onClick={() => {
                        onSelectRepo(repo.id);
                        onSelectTab('repos');
                      }}
                      className="p-4 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-cyan-200">{repo.org}/{repo.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {repo.language}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                            {repo.frameworks[0]}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">{repo.description}</p>
                      </div>

                      <div className="text-right text-[11px] font-mono shrink-0 pl-3">
                        <span className="text-emerald-400 font-semibold block">99.99% Uptime</span>
                        <span className="text-slate-500">Coverage: {repo.testCoverage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active PRs & AI Reviews */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                  <GitPullRequest className="w-4 h-4 text-indigo-400" />
                  <span>Active Pull Requests & Gemini Reviews</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-100 flex items-center space-x-2">
                        <span>#142 feat(auth): integrate OIDC token revocation & OpenTelemetry spans</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                          AI Approved
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">khulnasoft/core-api • Author: Aria Thorne • 10m ago</div>
                    </div>
                    <button
                      onClick={() => onSelectTab('ai-assistant')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono cursor-pointer shrink-0"
                    >
                      View Review
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-100 flex items-center space-x-2">
                        <span>#89 feat(gemini): streaming thinking level controls and prompt policy</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                          CI Passed
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">khulnasoft/ai-gateway • Author: Marcus Chen • 25m ago</div>
                    </div>
                    <button
                      onClick={() => onSelectTab('cicd')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono cursor-pointer shrink-0"
                    >
                      Pipeline
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: AI Assistant Insights & CLI */}
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>AI Portal Recommendations</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-bold text-cyan-300">Upgrade `google.golang.org/grpc`</div>
                    <p className="text-slate-400 text-[11px]">
                      Core API holds v1.62.0. v1.64.0 is available with HTTP/2 stream multiplexing optimizations.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-bold text-emerald-400">eBPF Security Pass</div>
                    <p className="text-slate-400 text-[11px]">
                      Zero kernel syscall anomalies detected in US-Central GKE cluster over last 24 hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Developer CLI */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
                  <Terminal className="w-4 h-4" />
                  <span>Developer CLI Cheatsheet</span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-slate-500 text-[10px]"># Init Dev Session</div>
                    <div className="text-cyan-300 font-bold">khulnasoft dev --org=khulnasoft</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-slate-500 text-[10px]"># Query Knowledge Graph</div>
                    <div className="text-cyan-300 font-bold">khulnasoft graph query repo-core-api</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-slate-500 text-[10px]"># Deploy via GitOps</div>
                    <div className="text-cyan-300 font-bold">khulnasoft deploy --target=gke-prod</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PORTAL TAB 2: REPOSITORY CATALOG */}
      {activePortalTab === 'catalog' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-100 flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <span>Complete Repository Matrix ({filteredRepos.length})</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Filterable catalog of every repository in the organization.</p>
            </div>

            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="text-slate-400">Language:</span>
              <select
                value={selectedLanguageFilter}
                onChange={(e) => setSelectedLanguageFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-cyan-400 font-bold focus:outline-none"
              >
                <option value="All">All Languages</option>
                <option value="Go">Go</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Python">Python</option>
                <option value="Rust">Rust</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRepos.map((repo) => (
              <div
                key={repo.id}
                onClick={() => {
                  onSelectRepo(repo.id);
                  onSelectTab('repos');
                }}
                className="p-5 rounded-2xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800/80 hover:border-cyan-500/60 transition-all cursor-pointer space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-sm text-cyan-200 group-hover:text-cyan-400 transition-colors">
                    {repo.org}/{repo.name}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    {repo.language}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {repo.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-900 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Architecture:</span>
                    <span className="text-slate-200 font-bold truncate max-w-[160px]">{repo.architecture}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Test Coverage:</span>
                    <span className="text-amber-400 font-bold">{repo.testCoverage}%</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Security Rating:</span>
                    <span className="text-emerald-400 font-bold">{repo.securityScore}/100</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PORTAL TAB 3: ARCHITECTURE */}
      {activePortalTab === 'architecture' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-100 flex items-center space-x-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>Enterprise Architecture & Service Mesh Topology</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">C4 microservices structure, gRPC contracts, and eBPF network paths.</p>
            </div>
            <button
              onClick={() => onSelectTab('graph')}
              className="px-3.5 py-2 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 font-mono text-xs font-bold transition-all cursor-pointer flex items-center space-x-2"
            >
              <span>Explore Knowledge Graph</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="text-cyan-400 font-bold uppercase tracking-wider">C4 Top-Level System Boundary Diagram</div>
            <pre className="p-4 bg-slate-900 text-cyan-200 rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
{`[Client Mobile / Web Apps]
     │ (HTTPS / gRPC)
     ▼
[khulnasoft/core-api] ─── (JWT Auth) ───► [khulnasoft/auth-service]
     │
     ├──► [khulnasoft/ai-gateway] ───► [@google/genai Gemini 3.6]
     │
     ├──► [khulnasoft/knowledge-graph] ───► [(Neo4j / PostgreSQL)]
     │
     └──► [khulnasoft/ebpf-agent] ───► [(Linux Kernel Ring Buffer)]`}
            </pre>
          </div>
        </div>
      )}

      {/* PORTAL TAB 4: OWNERSHIP */}
      {activePortalTab === 'ownership' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-black text-slate-100 flex items-center space-x-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Engineering Team Ownership & DRI Directory</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Directly Responsible Individuals (DRI), on-call rotation, and Slack channels per service.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-cyan-300 text-sm">Core Platform Team</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">6 Repos</span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <div>DRI: <strong className="text-slate-100">Aria Thorne (@aria)</strong></div>
                <div>On-Call: <span className="text-emerald-400 font-bold">Devon Vance (Primary)</span></div>
                <div>Slack: <code className="text-cyan-400">#team-platform-core</code></div>
                <div>Primary Service: <code className="text-slate-400">khulnasoft/core-api</code></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-cyan-300 text-sm">AI Systems & Agents</span>
                <span className="text-[10px] text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">4 Repos</span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <div>DRI: <strong className="text-slate-100">Marcus Chen (@mchen)</strong></div>
                <div>On-Call: <span className="text-emerald-400 font-bold">Elena Rostova (Primary)</span></div>
                <div>Slack: <code className="text-cyan-400">#team-ai-gateway</code></div>
                <div>Primary Service: <code className="text-slate-400">khulnasoft/ai-gateway</code></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-cyan-300 text-sm">Security & eBPF Ops</span>
                <span className="text-[10px] text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">3 Repos</span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <div>DRI: <strong className="text-slate-100">Elena Rostova (@elena)</strong></div>
                <div>On-Call: <span className="text-emerald-400 font-bold">Siddharth N. (Primary)</span></div>
                <div>Slack: <code className="text-cyan-400">#team-secops-ebpf</code></div>
                <div>Primary Service: <code className="text-slate-400">khulnasoft/ebpf-agent</code></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PORTAL TAB 5: DEPENDENCIES */}
      {activePortalTab === 'dependencies' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-black text-slate-100 flex items-center space-x-2">
              <Boxes className="w-5 h-5 text-cyan-400" />
              <span>Cross-Repository Dependency Tree & Version Drift</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Tracking runtime dependencies, SDK versions, and CVE vulnerabilities.</p>
          </div>

          <div className="space-y-3 text-xs font-mono">
            {MOCK_REPOSITORIES.map((repo) => (
              <div key={repo.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-cyan-300">{repo.org}/{repo.name}</span>
                  <span className="text-[10px] text-slate-400">{repo.dependencies.length} Tracked Dependencies</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {repo.dependencies.map((dep, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
                      {dep.name} <strong className="text-cyan-400">{dep.version}</strong>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PORTAL TAB 6: DEPLOYMENTS */}
      {activePortalTab === 'deployments' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-black text-slate-100 flex items-center space-x-2">
              <Server className="w-5 h-5 text-indigo-400" />
              <span>Multi-Cluster GitOps Deployments (ArgoCD & Kubernetes)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Real-time sync status across US-Central GKE, EU-West EKS, and Asia-East Cloud Run.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100">gke-us-central1-prod</span>
                <span className="text-[10px] text-emerald-400 font-bold">Synced</span>
              </div>
              <div className="text-slate-400 text-[11px]">Kubernetes v1.29 • 42 Replicas</div>
              <div className="text-cyan-400 text-[10px]">ArgoCD Revision: a7b3c91</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100">eks-eu-west1-staging</span>
                <span className="text-[10px] text-emerald-400 font-bold">Synced</span>
              </div>
              <div className="text-slate-400 text-[11px]">Kubernetes v1.28 • 18 Replicas</div>
              <div className="text-cyan-400 text-[10px]">ArgoCD Revision: 8f921e3</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100">cloudrun-asia-east1</span>
                <span className="text-[10px] text-emerald-400 font-bold">Synced</span>
              </div>
              <div className="text-slate-400 text-[11px]">Serverless Container • Auto-scale 0-50</div>
              <div className="text-cyan-400 text-[10px]">ArgoCD Revision: c4d8e20</div>
            </div>
          </div>
        </div>
      )}

      {/* PORTAL TAB 7: MONITORING */}
      {activePortalTab === 'monitoring' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-black text-slate-100 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <span>Prometheus & OpenTelemetry Monitoring</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">p99 latency, error rates, and OpenTelemetry trace spans across microservices.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px]">p99 Latency (Core API)</div>
              <div className="text-2xl font-black text-emerald-400">1.42 ms</div>
              <div className="text-[10px] text-slate-500">Target &lt; 5.0ms</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px]">OTel Trace Ingestion Rate</div>
              <div className="text-2xl font-black text-cyan-400">14.2k spans/sec</div>
              <div className="text-[10px] text-slate-500">ClickHouse Storage</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px]">Error Rate (5xx HTTP)</div>
              <div className="text-2xl font-black text-emerald-400">0.001%</div>
              <div className="text-[10px] text-emerald-400">Within Error Budget</div>
            </div>
          </div>
        </div>
      )}

      {/* PORTAL TAB 8: DOCUMENTATION */}
      {activePortalTab === 'documentation' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-100 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span>Unified Documentation Hub (docs.khulnasoft.com)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Centralized documentation engine auto-compiled from repositories.</p>
            </div>
            <button
              onClick={() => onSelectTab('docs')}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md"
            >
              Open Documentation Platform →
            </button>
          </div>
        </div>
      )}

      {/* PORTAL TAB 9: PIPELINES */}
      {activePortalTab === 'pipelines' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-100 flex items-center space-x-2">
                <Workflow className="w-5 h-5 text-emerald-400" />
                <span>CI/CD Automation Pipelines</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">GitHub Actions workflow execution status and test coverage stats.</p>
            </div>
            <button
              onClick={() => onSelectTab('cicd')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs font-bold transition-all cursor-pointer"
            >
              Open CI/CD Platform →
            </button>
          </div>
        </div>
      )}

      {/* PORTAL TAB 10: PACKAGES */}
      {activePortalTab === 'packages' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-100 flex items-center space-x-2">
                <PackageIcon className="w-5 h-5 text-amber-400" />
                <span>Package Registry & Artifact Storage</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Docker/OCI images, npm modules, Go packages, and Python wheels.</p>
            </div>
            <button
              onClick={() => onSelectTab('packages')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs font-bold transition-all cursor-pointer"
            >
              Open Package Registry →
            </button>
          </div>
        </div>
      )}

      {/* PORTAL TAB 11: ROADMAPS */}
      {activePortalTab === 'roadmaps' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 font-mono text-xs">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-black text-slate-100 font-sans flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>Engineering Roadmap & Migration Milestones</span>
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">Key technology initiatives across Q3 & Q4 2026.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-100">Q3 Initiative: Complete Cilium eBPF Kernel Policy Rollout</span>
                <span className="text-emerald-400">85% Complete</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[85%]" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-100">Q4 Initiative: Gemini 3.6 Flash Multi-Agent Subsystem</span>
                <span className="text-cyan-400">60% Complete</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full w-[60%]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PORTAL TAB 12: SECURITY */}
      {activePortalTab === 'security' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-100 flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-emerald-400" />
                <span>Security & Compliance Operations Center</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">SAST scanning, eBPF kernel enforcement, and SBOM verification.</p>
            </div>
            <button
              onClick={() => onSelectTab('security')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs font-bold transition-all cursor-pointer"
            >
              Open Security Center →
            </button>
          </div>
        </div>
      )}

      {/* Scaffold Modal */}
      {showScaffoldModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-cyan-300 flex items-center space-x-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <span>Scaffold New Microservice</span>
              </h2>
              <button
                onClick={() => setShowScaffoldModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Generates GitHub repository, Dockerfile, Helm charts, OpenTelemetry tracing, and ArgoCD sync specs automatically.
            </p>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Service Name</label>
                <input
                  type="text"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="e.g. payment-gateway"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Template Architecture</label>
                <select
                  value={serviceTemplate}
                  onChange={(e) => setServiceTemplate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="go-grpc">Go gRPC + OTel Gateway</option>
                  <option value="typescript-ai">TypeScript Gemini AI Microservice</option>
                  <option value="python-data">Python FastAPI + Kafka Stream</option>
                  <option value="rust-ebpf">Rust eBPF Kernel Probe</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Owner Team</label>
                <select
                  value={selectedOwner}
                  onChange={(e) => setSelectedOwner(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Core Platform Team">Core Platform Team</option>
                  <option value="AI Systems & Agents">AI Systems & Agents</option>
                  <option value="Security & eBPF Ops">Security & eBPF Ops</option>
                </select>
              </div>
            </div>

            {scaffoldComplete ? (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold text-center">
                ✓ Repository & GitOps Specs Created Successfully!
              </div>
            ) : (
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setShowScaffoldModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScaffoldService}
                  disabled={isScaffolding || !newServiceName.trim()}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isScaffolding ? 'Provisioning Repos & Helm Specs...' : 'Scaffold Service'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
