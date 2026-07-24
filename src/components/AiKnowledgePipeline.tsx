import React, { useState } from 'react';
import { 
  GitBranch, 
  FileText, 
  AlertCircle, 
  MessageSquare, 
  GitPullRequest, 
  Tag, 
  BookOpen, 
  Network, 
  Database, 
  Cpu, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Search
} from 'lucide-react';

export const AiKnowledgePipeline: React.FC = () => {
  const [isReindexing, setIsReindexing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now (2026-07-24 08:35 UTC)');
  const [indexedDocsCount, setIndexedDocsCount] = useState<number>(24850);
  const [vectorEmbeddingsCount, setVectorEmbeddingsCount] = useState<number>(312400);

  const handleReindex = () => {
    setIsReindexing(true);
    setTimeout(() => {
      setIsReindexing(false);
      setLastSyncTime(new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC');
      setIndexedDocsCount((prev) => prev + 120);
      setVectorEmbeddingsCount((prev) => prev + 1450);
    }, 1500);
  };

  const sources = [
    { label: 'GitHub Repos', count: '18 Active', icon: GitBranch, color: 'text-indigo-400', bg: 'bg-indigo-950/80 border-indigo-800' },
    { label: 'Documentation', count: '1,420 Pages', icon: FileText, color: 'text-cyan-400', bg: 'bg-cyan-950/80 border-cyan-800' },
    { label: 'Issues', count: '382 Active', icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-950/80 border-rose-800' },
    { label: 'Discussions', count: '128 Threads', icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-950/80 border-purple-800' },
    { label: 'PRs', count: '84 Merged', icon: GitPullRequest, color: 'text-emerald-400', bg: 'bg-emerald-950/80 border-emerald-800' },
    { label: 'Releases', count: '46 Tagged', icon: Tag, color: 'text-amber-400', bg: 'bg-amber-950/80 border-amber-800' },
    { label: 'Wiki', count: '210 Articles', icon: BookOpen, color: 'text-teal-400', bg: 'bg-teal-950/80 border-teal-800' },
  ];

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-cyan-400 font-bold mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Knowledge Ingestion & Graph Pipeline</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
              Live Continuous Sync
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <span>One AI Service Understands Every Repository</span>
          </h2>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <span className="text-slate-400 text-[11px]">
            Last Sync: <strong className="text-slate-200">{lastSyncTime}</strong>
          </span>

          <button
            onClick={handleReindex}
            disabled={isReindexing}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isReindexing ? 'animate-spin' : ''}`} />
            <span>{isReindexing ? 'Re-indexing...' : 'Re-index Sources'}</span>
          </button>
        </div>
      </div>

      {/* Visual Pipeline Flow Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 font-mono text-xs">
        {/* Step 1: 7 Knowledge Sources */}
        <div className="lg:col-span-5 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>1. Knowledge Sources (7 Services)</span>
            <span className="text-cyan-400">7 Connected</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
            {sources.map((src) => {
              const Icon = src.icon;
              return (
                <div
                  key={src.label}
                  className={`p-2 rounded-lg border ${src.bg} flex items-center space-x-2 text-[11px]`}
                >
                  <Icon className={`w-3.5 h-3.5 ${src.color} shrink-0`} />
                  <div className="truncate">
                    <div className="font-bold text-slate-200 text-[10px] truncate">{src.label}</div>
                    <div className="text-[9px] text-slate-400">{src.count}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Arrow */}
        <div className="hidden lg:flex lg:col-span-1 items-center justify-center text-slate-600">
          <ArrowRight className="w-5 h-5 text-cyan-500 animate-pulse" />
        </div>

        {/* Step 2: Knowledge Graph */}
        <div className="lg:col-span-2 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>2. Knowledge Graph</span>
            <Network className="w-3.5 h-3.5 text-purple-400" />
          </div>

          <div className="space-y-1">
            <div className="text-xl font-black text-slate-100">14,820 Nodes</div>
            <div className="text-[10px] text-purple-300 font-bold">38,400 Dependency Edges</div>
          </div>

          <div className="text-[9px] text-slate-500">AST & Cross-repo relations mapped</div>
        </div>

        {/* Step Arrow */}
        <div className="hidden lg:flex lg:col-span-1 items-center justify-center text-slate-600">
          <ArrowRight className="w-5 h-5 text-purple-500 animate-pulse" />
        </div>

        {/* Step 3: Vector DB & LLM */}
        <div className="lg:col-span-3 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>3. VectorDB & LLM</span>
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center space-x-1 text-emerald-400 text-[9px] font-bold">
                <Database className="w-3 h-3" />
                <span>Qdrant Embeddings</span>
              </div>
              <div className="text-sm font-bold text-slate-200">{vectorEmbeddingsCount.toLocaleString()}</div>
            </div>

            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center space-x-1 text-cyan-400 text-[9px] font-bold">
                <Sparkles className="w-3 h-3" />
                <span>LLM Engine</span>
              </div>
              <div className="text-sm font-bold text-slate-200">Gemini 3.6</div>
            </div>
          </div>

          <div className="text-[9px] text-emerald-400 font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Sub-second semantic latency across all repos</span>
          </div>
        </div>
      </div>
    </div>
  );
};
