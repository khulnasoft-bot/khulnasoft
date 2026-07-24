import React, { useState } from 'react';
import { 
  BookOpen, 
  Code2, 
  FileText, 
  Search, 
  Terminal, 
  Layers, 
  CheckCircle2, 
  Download,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Workflow,
  Zap,
  Globe,
  Cpu,
  ShieldCheck,
  Server,
  Box,
  Compass,
  FileCode,
  GraduationCap,
  Lightbulb,
  ArrowRight,
  Copy,
  Check,
  Filter,
  Share2
} from 'lucide-react';
import { MOCK_REPOSITORIES } from '../data/mockData';

interface DocPlatformViewProps {
  onOpenAiRepoAnalyzer?: () => void;
}

export type DocCategory = 
  | 'All' 
  | 'AI' 
  | 'Security' 
  | 'Infrastructure' 
  | 'Libraries' 
  | 'CLI' 
  | 'SDK' 
  | 'Research' 
  | 'Architecture' 
  | 'Tutorials' 
  | 'Examples';

export const DocPlatformView: React.FC<DocPlatformViewProps> = ({ onOpenAiRepoAnalyzer }) => {
  const [selectedCategory, setSelectedCategory] = useState<DocCategory>('All');
  const [selectedRepo, setSelectedRepo] = useState(MOCK_REPOSITORIES[0]);
  const [docVersion, setDocVersion] = useState('v2.4.0');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'mdx' | 'openapi' | 'pipeline' | 'search_index'>('mdx');
  const [copiedCode, setCopiedCode] = useState(false);

  const categories: { label: DocCategory; icon: React.ReactNode; count: number }[] = [
    { label: 'All', icon: <Globe className="w-3.5 h-3.5" />, count: MOCK_REPOSITORIES.length },
    { label: 'AI', icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />, count: 3 },
    { label: 'Security', icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />, count: 2 },
    { label: 'Infrastructure', icon: <Server className="w-3.5 h-3.5 text-indigo-400" />, count: 4 },
    { label: 'Libraries', icon: <Box className="w-3.5 h-3.5 text-amber-400" />, count: 5 },
    { label: 'CLI', icon: <Terminal className="w-3.5 h-3.5 text-purple-400" />, count: 2 },
    { label: 'SDK', icon: <Code2 className="w-3.5 h-3.5 text-blue-400" />, count: 3 },
    { label: 'Research', icon: <Cpu className="w-3.5 h-3.5 text-pink-400" />, count: 1 },
    { label: 'Architecture', icon: <Layers className="w-3.5 h-3.5 text-orange-400" />, count: 4 },
    { label: 'Tutorials', icon: <GraduationCap className="w-3.5 h-3.5 text-teal-400" />, count: 6 },
    { label: 'Examples', icon: <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />, count: 8 },
  ];

  // Map repos to categories loosely for filtering
  const filteredRepos = MOCK_REPOSITORIES.filter((repo) => {
    const matchesSearch = 
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.architecture.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === 'All') return matchesSearch;
    if (selectedCategory === 'AI') return matchesSearch && (repo.tags.includes('ai') || repo.name.includes('ai') || repo.name.includes('indexer'));
    if (selectedCategory === 'Security') return matchesSearch && (repo.tags.includes('security') || repo.tags.includes('ebpf') || repo.name.includes('auth'));
    if (selectedCategory === 'Infrastructure') return matchesSearch && (repo.tags.includes('k8s') || repo.tags.includes('gitops') || repo.tags.includes('gke'));
    if (selectedCategory === 'Libraries' || selectedCategory === 'SDK') return matchesSearch && (repo.tags.includes('sdk') || repo.tags.includes('ts'));
    if (selectedCategory === 'CLI') return matchesSearch && (repo.tags.includes('cli') || repo.name.includes('cli'));
    if (selectedCategory === 'Architecture') return matchesSearch && repo.architecture.length > 0;
    return matchesSearch;
  });

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const sampleMdxSnippet = `import { Callout, Tabs, Tab } from '@theme/mdx-components';
import { Mermaid } from '@theme/Mermaid';

# ${selectedRepo.name} Developer Integration Guide

Welcome to the official developer documentation for **\`${selectedRepo.org}/${selectedRepo.name}\`**.

<Callout type="info" title="Centralized Platform Engine">
  This service automatically publishes versioned API specs and architectural graphs directly to <code>docs.khulnasoft.com</code> on every Git push.
</Callout>

## Architecture Topology

<Mermaid value={\`${selectedRepo.architectureMermaid}\`} />

## Installation & SDK Setup

\`\`\`bash
# Install via KhulnaSoft Package Registry
pnpm add @khulnasoft/${selectedRepo.name.replace('repo-', '')}-sdk
\`\`\`
`;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Hub URL Indicator */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-800/60 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Globe className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black text-slate-100">Unified Documentation Platform</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold">
                  docs.khulnasoft.com
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Single unified documentation portal powered by Next.js, Docusaurus, MDX, OpenAPI 3.1 & Gemini AI generation.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            {onOpenAiRepoAnalyzer && (
              <button
                id="btn-trigger-analyzer-from-docs"
                onClick={onOpenAiRepoAnalyzer}
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold px-3.5 py-2 rounded-xl shadow-lg transition-all cursor-pointer shrink-0"
              >
                <Workflow className="w-4 h-4" />
                <span>Trigger Push Analyzer</span>
              </button>
            )}

            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200">
              <span className="text-slate-400 font-sans">Version:</span>
              <select
                value={docVersion}
                onChange={(e) => setDocVersion(e.target.value)}
                className="bg-transparent text-cyan-400 font-bold focus:outline-none cursor-pointer"
              >
                <option value="v2.4.0">v2.4.0 (Latest)</option>
                <option value="v2.3.1">v2.3.1</option>
                <option value="v2.0.0-LTS">v2.0.0-LTS</option>
              </select>
            </div>
          </div>
        </div>

        {/* Global Search Bar (Algolia Style) */}
        <div className="relative max-w-3xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across all docs, OpenAPI specs, ADRs, SDKs, and tutorials (e.g. gRPC streaming, Cilium eBPF, OTel traces)..."
            className="w-full bg-slate-950/90 border border-slate-800 hover:border-slate-700 rounded-2xl pl-10 pr-24 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner"
          />
          <div className="absolute right-3 top-2.5 text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            Press / to search
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex space-x-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(cat.label)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.label
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950/80 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedCategory === cat.label ? 'bg-slate-950/40 text-slate-950' : 'bg-slate-900 text-slate-500'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Repository Contribution Pipeline Visual Banner */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
          <span className="flex items-center space-x-2 text-cyan-400">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Automated Documentation Contribution Pipeline</span>
          </span>
          <span className="text-slate-500 font-normal text-[10px]">Stack: Docusaurus + Next.js + OpenAPI + MDX + Mermaid</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 text-center text-[11px]">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-[9px] text-slate-500 uppercase font-bold">Input</div>
            <div className="font-bold text-slate-200 mt-0.5">README.md</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-[9px] text-cyan-400 uppercase font-bold">AI Engine</div>
            <div className="font-bold text-slate-200 mt-0.5">Gemini Refines</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-[9px] text-indigo-400 uppercase font-bold">Format</div>
            <div className="font-bold text-slate-200 mt-0.5">MDX & OpenAPI</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-[9px] text-purple-400 uppercase font-bold">Version</div>
            <div className="font-bold text-slate-200 mt-0.5">{docVersion}</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-[9px] text-emerald-400 uppercase font-bold">Search Index</div>
            <div className="font-bold text-slate-200 mt-0.5">Algolia Synced</div>
          </div>

          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-300">
            <div className="text-[9px] text-cyan-400 uppercase font-bold">Published</div>
            <div className="font-bold mt-0.5">docs.khulnasoft.com</div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Repository Directory Sidebar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
            <span>Repositories ({filteredRepos.length})</span>
            <span className="text-[10px] text-cyan-400 font-mono">Category: {selectedCategory}</span>
          </div>

          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredRepos.map((repo) => {
              const isSelected = repo.id === selectedRepo.id;
              return (
                <button
                  key={repo.id}
                  onClick={() => setSelectedRepo(repo)}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500/60 shadow-lg shadow-cyan-950/20 text-cyan-200'
                      : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs">{repo.name}</div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {repo.language}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-1">{repo.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Documentation Renderer & Spec Inspector */}
        <div className="lg:col-span-3 space-y-4">
          {/* Active Tab Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex space-x-2 text-xs font-mono font-bold">
              <button
                onClick={() => setActiveTab('mdx')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'mdx'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                📄 MDX Developer Guide
              </button>

              <button
                onClick={() => setActiveTab('openapi')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'openapi'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                ⚡ OpenAPI 3.1 Inspector
              </button>

              <button
                onClick={() => setActiveTab('pipeline')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'pipeline'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                🔄 Contribution Flow
              </button>

              <button
                onClick={() => setActiveTab('search_index')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'search_index'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                🔍 Search Indexing
              </button>
            </div>

            <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Live on docs.khulnasoft.com</span>
            </span>
          </div>

          {/* Panel: MDX Guide */}
          {activeTab === 'mdx' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
                    <span>{selectedRepo.org}/{selectedRepo.name}</span>
                    <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                      MDX Spec
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Auto-generated from repository README.md, AST specs & Gemini documentation enhancer.
                  </p>
                </div>

                <button
                  onClick={() => handleCopyCode(sampleMdxSnippet)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-800 flex items-center space-x-1.5 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied MDX' : 'Copy MDX'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                {selectedRepo.readmeMarkdown}
              </div>

              {/* Mermaid Architecture Section */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Mermaid Architecture Sequence</span>
                  <span className="text-[10px] text-slate-500 font-normal">Rendered by @docusaurus/theme-mermaid</span>
                </div>
                <pre className="p-3 bg-slate-900 rounded-lg text-cyan-200 overflow-x-auto border border-slate-800 text-[11px] leading-relaxed">
                  {selectedRepo.architectureMermaid}
                </pre>
              </div>
            </div>
          )}

          {/* Panel: OpenAPI Inspector */}
          {activeTab === 'openapi' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-100">OpenAPI v3.1 Spec Explorer</h2>
                  <p className="text-xs text-slate-400">Interactive REST and gRPC API contract endpoints for {selectedRepo.name}.</p>
                </div>
                <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
                  OpenAPI 3.1.0
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800 text-[10px]">
                        GET
                      </span>
                      <span className="text-slate-200 font-bold">/api/v1/health</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">200 OK</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">Returns cluster health, active gRPC stream counts, and database latency.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 font-bold border border-indigo-800 text-[10px]">
                        POST
                      </span>
                      <span className="text-slate-200 font-bold">/api/v2/stream/telemetry</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">201 Created</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">Streams OpenTelemetry trace spans to ClickHouse with eBPF syscall audit tags.</p>
                </div>
              </div>
            </div>
          )}

          {/* Panel: Pipeline Breakdown */}
          {activeTab === 'pipeline' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-slate-100 font-sans">Repository Contribution Flow</h2>
              <p className="text-xs text-slate-400 font-sans">How every push to {selectedRepo.name} automatically generates website documentation.</p>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-200">Step 1: Readme & AST Extraction</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Parses package.json, main Go/TS code, and README headers.</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-cyan-400">Step 2: AI Gemini Enhancement</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Fills in missing code examples, fixes formatting, generates Mermaid graphs.</div>
                  </div>
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-200">Step 3: Docusaurus / Next.js Build & Algolia Indexing</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Compiles MDX pages and updates search indexes for docs.khulnasoft.com.</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            </div>
          )}

          {/* Panel: Search Index */}
          {activeTab === 'search_index' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 font-mono text-xs">
              <h2 className="text-lg font-bold text-slate-100 font-sans">Algolia Search Index Telemetry</h2>
              <p className="text-xs text-slate-400 font-sans">Sub-10ms instant search index status across all KhulnaSoft documentation pages.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Indexed Pages</div>
                  <div className="text-2xl font-black text-cyan-400 mt-1">1,482</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Across 14 microservice repos</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Search Query Latency</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">6.2 ms</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">P99 instant response</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Last Re-Index</div>
                  <div className="text-2xl font-black text-slate-100 mt-1">45s ago</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Triggered by Git Push</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
