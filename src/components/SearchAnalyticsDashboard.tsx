import React, { useState } from 'react';
import { 
  TrendingUp, 
  Search, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  BarChart3, 
  Clock, 
  Tag, 
  ArrowUpRight, 
  Flame, 
  Layers, 
  Code2, 
  CheckCircle2,
  Filter
} from 'lucide-react';
import { TabType } from '../types';

export interface TrendingQueryItem {
  id: string;
  query: string;
  category: 'Docs' | 'Components' | 'Security' | 'Infrastructure' | 'AI';
  count: number;
  growth: string;
  isHot?: boolean;
  targetTab?: TabType;
  description: string;
}

export const TRENDING_QUERIES: TrendingQueryItem[] = [
  {
    id: 'tq-1',
    query: 'OIDC JWT Token Claims Inspection',
    category: 'Security',
    count: 3420,
    growth: '+320%',
    isHot: true,
    targetTab: 'enterprise',
    description: 'Inspect Okta & Azure AD RS256 JWT claims, role assignments & scope permissions.'
  },
  {
    id: 'tq-2',
    query: 'Kubernetes ResourceQuota Limits',
    category: 'Infrastructure',
    count: 2890,
    growth: '+185%',
    isHot: true,
    targetTab: 'kubernetes',
    description: 'Manage CPU, Memory, and Storage quotas per namespace in GKE & EKS clusters.'
  },
  {
    id: 'tq-3',
    query: 'Gemini 3.6 Flash Code Refactoring',
    category: 'AI',
    count: 2410,
    growth: '+410%',
    isHot: true,
    targetTab: 'repos',
    description: 'AI-assisted code security reviews, dependency graphs & automated refactoring.'
  },
  {
    id: 'tq-4',
    query: 'ArgoCD Canary Rollout Topology Map',
    category: 'Infrastructure',
    count: 1980,
    growth: '+120%',
    targetTab: 'cicd',
    description: 'Interactive D3 pipeline DAG visualization with Cosign signature checks.'
  },
  {
    id: 'tq-5',
    query: 'OpenTelemetry Flamegraph Latency',
    category: 'Infrastructure',
    count: 1750,
    growth: '+95%',
    targetTab: 'observability',
    description: 'eBPF auto-instrumentation & live distributed trace latency profiling.'
  },
  {
    id: 'tq-6',
    query: 'CVE-2024-3094 Security Advisory',
    category: 'Security',
    count: 1620,
    growth: '+250%',
    isHot: true,
    targetTab: 'security',
    description: 'Vulnerability triage, SBOM software supply chain audit & patch status.'
  },
  {
    id: 'tq-7',
    query: 'Dark/Light Theme Toggle Component',
    category: 'Components',
    count: 1240,
    growth: '+85%',
    targetTab: 'repos',
    description: 'Global ThemeProvider React context and accessibility-first dark mode styling.'
  }
];

export const POPULAR_DOCS = [
  {
    title: 'Zero Trust Microservices Architecture Standard',
    category: 'Architecture',
    readTime: '6 min read',
    tabTarget: 'enterprise' as TabType
  },
  {
    title: 'Configuring Okta & Azure AD OIDC SSO',
    category: 'Security',
    readTime: '4 min read',
    tabTarget: 'enterprise' as TabType
  },
  {
    title: 'Prometheus & OpenTelemetry Collector Setup',
    category: 'Observability',
    readTime: '8 min read',
    tabTarget: 'observability' as TabType
  },
  {
    title: 'Kubernetes Namespace Limits & LimitRanges Guide',
    category: 'DevOps',
    readTime: '5 min read',
    tabTarget: 'kubernetes' as TabType
  }
];

interface SearchAnalyticsDashboardProps {
  onSelectQuery: (queryText: string) => void;
  onSelectTab: (tab: TabType) => void;
  onClosePalette: () => void;
}

export const SearchAnalyticsDashboard: React.FC<SearchAnalyticsDashboardProps> = ({
  onSelectQuery,
  onSelectTab,
  onClosePalette,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Security', 'Infrastructure', 'AI', 'Components', 'Docs'];

  const filteredQueries = selectedCategory === 'All'
    ? TRENDING_QUERIES
    : TRENDING_QUERIES.filter(q => q.category === selectedCategory || (selectedCategory === 'Docs' && q.category === 'Docs'));

  return (
    <div className="space-y-5 font-sans border-t border-slate-800/80 pt-4">
      {/* Header Banner & Analytics Summary Stats */}
      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold">
            <BarChart3 className="w-4 h-4" />
            <span>Search Analytics & Platform Intelligence</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
            Live Telemetry
          </span>
        </div>

        {/* Aggregate Stats Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 border-t border-slate-900">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
            <div className="text-slate-500 text-[9px] uppercase font-bold">24h Queries</div>
            <div className="text-slate-100 font-black text-sm">18,420</div>
            <div className="text-emerald-400 text-[9px] font-bold">+18.4% vs last week</div>
          </div>

          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
            <div className="text-slate-500 text-[9px] uppercase font-bold">Avg Search Latency</div>
            <div className="text-cyan-300 font-black text-sm">6.2 ms</div>
            <div className="text-slate-400 text-[9px]">Vector index cached</div>
          </div>

          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800/80">
            <div className="text-slate-500 text-[9px] uppercase font-bold">Top Domain</div>
            <div className="text-indigo-300 font-black text-sm">Security & IAM</div>
            <div className="text-slate-400 text-[9px]">38% total lookups</div>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Trending Searches Across Teams</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Updated 2m ago</div>
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs font-mono">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Search Query Items */}
      <div className="space-y-1.5 font-mono">
        {filteredQueries.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              onSelectQuery(item.query);
            }}
            className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 hover:border-cyan-500/50 cursor-pointer transition-all"
          >
            <div className="flex items-start space-x-2.5">
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-500/40 shrink-0 mt-0.5">
                <Search className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                  <span>{item.query}</span>
                  {item.isHot && (
                    <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-800 text-[9px] font-bold flex items-center space-x-0.5">
                      <Flame className="w-2.5 h-2.5 fill-current" />
                      <span>HOT</span>
                    </span>
                  )}
                  <span className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 text-[9px]">
                    {item.category}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5 max-w-md truncate">
                  {item.description}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <div className="text-right">
                <div className="text-emerald-400 text-[10px] font-bold flex items-center justify-end space-x-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>{item.growth}</span>
                </div>
                <div className="text-[9px] text-slate-500">{item.count.toLocaleString()} searches</div>
              </div>

              {item.targetTab && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTab(item.targetTab!);
                    onClosePalette();
                  }}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 text-slate-400 border border-slate-800 transition-colors cursor-pointer"
                  title={`Jump to ${item.targetTab} view`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Documentation Quick Links */}
      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 font-sans">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="flex items-center space-x-1.5 text-slate-300 font-bold uppercase tracking-wider text-[11px]">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Popular Developer Docs & Guides</span>
          </span>
          <span className="text-[10px] text-slate-500">Most referenced</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          {POPULAR_DOCS.map((doc, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSelectTab(doc.tabTarget);
                onClosePalette();
              }}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-slate-200 group-hover:text-indigo-300 font-bold text-[11px]">
                  {doc.title}
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-0.5">
                  <span>{doc.category}</span>
                  <span>•</span>
                  <span>{doc.readTime}</span>
                </div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
