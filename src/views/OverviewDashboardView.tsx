import React from 'react';
import { 
  Code2, 
  Workflow, 
  Container, 
  ShieldCheck, 
  Activity, 
  Sparkles, 
  DollarSign, 
  Share2, 
  ArrowUpRight, 
  TrendingUp, 
  GitBranch, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  SlidersHorizontal,
  Zap
} from 'lucide-react';
import { SYSTEM_STATS, MOCK_REPOSITORIES, MOCK_CICD_PIPELINES, MOCK_DEPLOYMENTS } from '../data/mockData';
import { TabType } from '../types';
import { useFeatureFlags } from '../context/FeatureFlagsContext';

interface OverviewDashboardViewProps {
  onSelectTab: (tab: TabType) => void;
  onSelectRepo: (repoId: string) => void;
}

export const OverviewDashboardView: React.FC<OverviewDashboardViewProps> = ({
  onSelectTab,
  onSelectRepo,
}) => {
  const { flags, isFlagEnabled } = useFeatureFlags();
  const activeFlags = flags.filter((f) => f.enabled);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-100">
              KhulnaSoft Engineering Control Plane
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
              v2.4.0 Live
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Continuous repository intelligence, AI documentation, knowledge graphs, CI/CD, and multi-cloud Kubernetes orchestration.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onSelectTab('ai-assistant')}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch AI Architecture Agent</span>
          </button>
        </div>
      </div>

      {/* Feature Flag Active Status Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-indigo-950 text-cyan-400 border border-indigo-800">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-200 flex items-center space-x-2">
              <span>Centralized Feature Flag Provider Active</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                {activeFlags.length} Enabled
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Live experimental toggles without redeploying: {activeFlags.slice(0, 3).map(f => f.name).join(' • ')}
              {activeFlags.length > 3 ? ` +${activeFlags.length - 3} more` : ''}
            </p>
          </div>
        </div>

        {isFlagEnabled('enableAiAutoHealing') && (
          <div className="flex items-center space-x-1.5 text-emerald-400 font-mono text-[11px] bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800/80 shrink-0">
            <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>AI Auto-Healing Active</span>
          </div>
        )}
      </div>

      {/* Primary KPI Grid */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Repositories</span>
            <Code2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 mt-2 font-mono">
            {SYSTEM_STATS.totalRepos}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>100% Indexed into Knowledge Graph</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Test Coverage</span>
            <Workflow className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 mt-2 font-mono">
            {SYSTEM_STATS.avgTestCoverage}%
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1 font-medium">
            <CheckCircle2 className="w-3 h-3" />
            <span>Passes Policy Gate (&gt;85%)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security Posture</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 mt-2 font-mono">
            {SYSTEM_STATS.securityScore}/100
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1 font-medium">
            <span>Zero-Trust RBAC & OCI Signing Active</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cloud Infra Cost</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 mt-2 font-mono">
            ${SYSTEM_STATS.monthlyCloudCostUSD.toLocaleString()}/mo
          </div>
          <div className="text-[11px] text-cyan-400 mt-1 flex items-center space-x-1 font-medium">
            <span>18 Nodes in EKS & GKE</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Repositories & Active Pipelines (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Repositories Catalog */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Core Enterprise Repositories
                </h2>
              </div>
              <button
                onClick={() => onSelectTab('repos')}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
              >
                <span>View All ({SYSTEM_STATS.totalRepos})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {MOCK_REPOSITORIES.map((repo) => (
                <div
                  key={repo.id}
                  onClick={() => {
                    onSelectRepo(repo.id);
                    onSelectTab('repos');
                  }}
                  className="p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-cyan-200">{repo.org}/{repo.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {repo.language}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                        {repo.architecture}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{repo.description}</p>
                    <div className="text-[11px] text-slate-500 font-mono flex items-center space-x-3 pt-1">
                      <span>Commit: {repo.lastCommit.sha} ({repo.lastCommit.date})</span>
                      <span>•</span>
                      <span>Coverage: {repo.testCoverage}%</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <div className="text-right text-[11px] font-mono hidden sm:block">
                      <div className="text-emerald-400 font-semibold">Security: {repo.securityScore}/100</div>
                      <div className="text-slate-400">SBOM: {repo.sbomStatus}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active CI/CD Runs */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Workflow className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Recent CI/CD Pipeline Runs
                </h2>
              </div>
              <button
                onClick={() => onSelectTab('cicd')}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
              >
                <span>Pipeline Console</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {MOCK_CICD_PIPELINES.map((pipe) => (
                <div
                  key={pipe.id}
                  onClick={() => onSelectTab('cicd')}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${pipe.status === 'success' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                    <div>
                      <div className="text-xs font-bold text-slate-200 flex items-center space-x-2">
                        <span>{pipe.repoName}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({pipe.branch})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{pipe.commitMessage}</div>
                    </div>
                  </div>

                  <div className="text-right text-[11px] font-mono shrink-0">
                    <div className={pipe.status === 'success' ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                      {pipe.status.toUpperCase()} ({pipe.durationSeconds}s)
                    </div>
                    <div className="text-slate-500">{pipe.createdAt}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Deployments & Knowledge Graph Preview */}
        <div className="space-y-6">
          {/* Active Deployments */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Container className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Active Multi-Cloud Targets
                </h2>
              </div>
              <button
                onClick={() => onSelectTab('kubernetes')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
              >
                <span>K8s Cluster View</span>
              </button>
            </div>

            <div className="space-y-3">
              {MOCK_DEPLOYMENTS.map((deploy) => (
                <div key={deploy.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{deploy.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {deploy.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
                    <span>{deploy.cloudProvider} • {deploy.region}</span>
                    <span>Replicas: {deploy.replicaCount}</span>
                  </div>
                  <div className="text-[10px] text-indigo-300 font-mono">
                    GitOps: {deploy.gitOpsTool} ({deploy.activeVersion})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Knowledge Graph Quick Entry */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-800/40 space-y-3">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold text-sm">
              <Share2 className="w-4 h-4 text-indigo-400" />
              <span>Enterprise Knowledge Graph</span>
            </div>
            <p className="text-xs text-slate-300">
              {SYSTEM_STATS.knowledgeGraphNodes} indexed nodes and {SYSTEM_STATS.knowledgeGraphEdges} relations connecting code, services, Helm charts, OCI images, and teams.
            </p>
            <button
              onClick={() => onSelectTab('graph')}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <span>Explore Knowledge Graph Canvas</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
