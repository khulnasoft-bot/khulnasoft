import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  GitBranch, 
  GitCommit, 
  Send, 
  CheckCircle2, 
  Clock, 
  Layers, 
  FileText, 
  ShieldCheck, 
  Cpu, 
  Network, 
  Code, 
  Copy, 
  Check, 
  BookOpen, 
  Download, 
  ArrowRight,
  Workflow,
  AlertCircle,
  FileCode,
  Terminal,
  Zap,
  BarChart3,
  Share2
} from 'lucide-react';
import { MOCK_REPOSITORIES } from '../data/mockData';

interface AiRepoAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRepoId?: string;
}

type PipelineStage = 'idle' | 'webhook' | 'analyzer' | 'llm' | 'artifacts' | 'portal_published';

type ArtifactTab = 'architecture' | 'api_docs' | 'adrs' | 'changelog' | 'security_quality' | 'dependencies';

export const AiRepoAnalyzerModal: React.FC<AiRepoAnalyzerModalProps> = ({
  isOpen,
  onClose,
  defaultRepoId = 'repo-core-api',
}) => {
  const [selectedRepoId, setSelectedRepoId] = useState(defaultRepoId);
  const [branch, setBranch] = useState('main');
  const [commitMsg, setCommitMsg] = useState('feat(gateway): implement gRPC streaming proxy & OTel trace context propagation');
  const [commitSha, setCommitSha] = useState('7f9a2d3e');
  const [author, setAuthor] = useState('alex-dev');

  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('idle');
  const [activeTab, setActiveTab] = useState<ArtifactTab>('architecture');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Pipeline step timers & logs
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    setSelectedRepoId(defaultRepoId);
  }, [defaultRepoId]);

  if (!isOpen) return null;

  const currentRepo = MOCK_REPOSITORIES.find((r) => r.id === selectedRepoId) || MOCK_REPOSITORIES[0];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleRunPipeline = () => {
    setPipelineStage('webhook');
    setLogs(['[00:00.01] ⚡ GitHub Webhook received: push event on refs/heads/' + branch]);

    setTimeout(() => {
      setPipelineStage('analyzer');
      setLogs((prev) => [
        ...prev,
        '[00:00.45] 🔍 Repository Analyzer triggered: AST tree-sitter parsing 42 changed files',
        '[00:00.82] 📦 Extracted 14 imports, 3 API endpoints, and 2 database schema migrations',
      ]);
    }, 1000);

    setTimeout(() => {
      setPipelineStage('llm');
      setLogs((prev) => [
        ...prev,
        '[00:01.30] 🤖 Gemini 3.6 Flash LLM Analysis started: reasoning over AST context',
        '[00:01.85] 🧠 Identified architectural shift: REST to gRPC streaming migration detected',
      ]);
    }, 2200);

    setTimeout(() => {
      setPipelineStage('artifacts');
      setLogs((prev) => [
        ...prev,
        '[00:02.50] 📐 Synthesizing Mermaid architecture diagrams & UML sequences...',
        '[00:02.90] 📄 Generating OpenAPI 3.1 schema specs & ADR-009 decision record...',
        '[00:03.20] 🛡️ Running Trivy CVE scan & Cosign KMS provenance signature...',
      ]);
    }, 3600);

    setTimeout(() => {
      setPipelineStage('portal_published');
      setLogs((prev) => [
        ...prev,
        '[00:04.10] 🚀 Automated publication complete! All 6 artifacts synced to Developer Portal',
      ]);
    }, 4800);
  };

  const isCompleted = pipelineStage === 'portal_published';

  // Sample Generated Content
  const sampleMermaidDiagram = `graph TD
    A[Client Gateway / Edge] -->|gRPC / HTTP2| B[${currentRepo.name}]
    B -->|OTel Tracing| C[Jaeger / OpenTelemetry Collector]
    B -->|Async Events| D[Kafka Broker - Topic: telemetry-events]
    D --> E[ClickHouse Analytics Engine]
    B -->|Read/Write| F[(PostgreSQL Core DB)]
    
    subgraph Security & Policy
      G[Cilium eBPF Guard] -.->|Syscall Audit| B
      H[Cosign KMS Engine] -.->|Verified Image| B
    end`;

  const sampleUmlSequence = `sequenceDiagram
    autonumber
    actor Developer
    participant GitHub as GitHub Webhook
    participant Analyzer as Repo Analyzer
    participant LLM as Gemini 3.6 Flash
    participant Portal as Developer Portal

    Developer->>GitHub: git push origin ${branch}
    GitHub->>Analyzer: POST /api/webhooks/github (HMAC Verified)
    Analyzer->>Analyzer: Tree-Sitter AST Diff & Package Parsing
    Analyzer->>LLM: Send Code Changes & Metadata Context
    LLM->>LLM: Synthesize Diagrams, ADRs, Docs & Security Report
    LLM->>Portal: Auto-Publish Documentation & Graph Update`;

  const sampleAdrContent = `# ADR-009: Adoption of gRPC Streaming and OpenTelemetry Context Propagation

**Status:** Accepted  
**Date:** ${new Date().toISOString().split('T')[0]}  
**Authors:** ${author} / KhulnaSoft AI Architecture Agent  
**Repository:** \`${currentRepo.org}/${currentRepo.name}\`

## Context
As system request volume scaled past 150k rps, the legacy JSON REST endpoints in \`${currentRepo.name}\` introduced latency overhead and serialization bottlenecks.

## Decision
We transition internal inter-service communication to bi-directional gRPC streaming using Protocol Buffers v3 and enforce W3C TraceContext propagation via OpenTelemetry SDK.

## Consequences
- **Positive:** 62% reduction in serialization CPU overhead, sub-millisecond p99 latency.
- **Positive:** Automated OpenAPI & gRPC proto docs auto-published to Portal.
- **Compliance:** Verified by Trivy CVE scanner & Cosign container provenance.`;

  const sampleOpenApiSpec = `{
  "openapi": "3.1.0",
  "info": {
    "title": "${currentRepo.name} API",
    "version": "2.4.0",
    "description": "Auto-generated specification by KhulnaSoft AI Repo Analyzer"
  },
  "paths": {
    "/api/v2/stream/telemetry": {
      "post": {
        "summary": "Stream OpenTelemetry Spans & Metric Batches",
        "operationId": "streamTelemetryData",
        "responses": {
          "200": { "description": "Stream established successfully" },
          "401": { "description": "Invalid OIDC Token" }
        }
      }
    }
  }
}`;

  const sampleChangelog = `## Release v2.4.0-rc.1 (${new Date().toISOString().split('T')[0]}) - Automated Release Notes

### 🚀 Features & Enhancements
- **gRPC Streaming Proxy**: Added high-throughput gRPC proxy with W3C trace context header forwarding (\`${commitSha}\`).
- **eBPF Syscall Filtering**: Enabled Cilium zero-trust socket monitoring for kernel-level protection.
- **OTel Metrics Exporter**: Implemented sub-millisecond ClickHouse stream producer.

### 🛡️ Security & Compliance
- **Trivy Vulnerability Scan**: 0 Critical, 0 High vulnerabilities detected in base Docker image \`golang:1.22-alpine\`.
- **Cosign Signed Artifact**: Image digest \`sha256:8f3c2a1e...\` verified with KMS OIDC identity.`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        id="ai-repo-analyzer-modal-container"
        className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-slate-100">AI Repository Analyzer Pipeline</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                  Automated Webhook Workflow
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Every push triggers GitHub Webhook → Repo AST Analysis → LLM Synthesis → Auto-generated Architecture, Specs, ADRs & Security Reports.
              </p>
            </div>
          </div>

          <button
            id="btn-close-analyzer-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Push Event Trigger Control */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
                  <GitCommit className="w-4 h-4" />
                  <span>GitHub Push Webhook Simulator</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Simulate a push event on your repository to execute the automated analysis workflow.
                </p>
              </div>

              <button
                id="btn-trigger-analyzer-pipeline"
                onClick={handleRunPipeline}
                disabled={pipelineStage !== 'idle' && pipelineStage !== 'portal_published'}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50 shrink-0"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>{pipelineStage === 'idle' ? 'Trigger Push Webhook' : pipelineStage === 'portal_published' ? 'Re-Trigger Pipeline' : 'Pipeline Executing...'}</span>
              </button>
            </div>

            {/* Input fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">Target Repository</label>
                <select
                  value={selectedRepoId}
                  onChange={(e) => setSelectedRepoId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {MOCK_REPOSITORIES.map((repo) => (
                    <option key={repo.id} value={repo.id}>
                      {repo.org}/{repo.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">Target Branch</label>
                <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono">
                  <GitBranch className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="bg-transparent w-full focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">Commit SHA & Author</label>
                <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono">
                  <span className="text-cyan-400 font-bold">{commitSha}</span>
                  <span className="text-slate-600">|</span>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="bg-transparent w-full focus:outline-none text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">Commit Message</label>
                <input
                  type="text"
                  value={commitMsg}
                  onChange={(e) => setCommitMsg(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Visual Pipeline Flow Diagram */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Workflow className="w-4 h-4 text-cyan-400" />
                <span>Automated Execution Pipeline</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {pipelineStage === 'idle' ? 'Ready' : pipelineStage === 'portal_published' ? '✅ Completed' : '⚡ Running'}
              </span>
            </div>

            {/* Step Nodes Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs font-mono">
              {/* Stage 1 */}
              <div
                className={`p-3 rounded-xl border transition-all ${
                  pipelineStage === 'webhook'
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 ring-2 ring-cyan-500/30'
                    : pipelineStage !== 'idle'
                    ? 'bg-slate-900 border-slate-700 text-slate-200'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-[10px] text-slate-400 font-bold mb-1">1. Webhook</div>
                <div className="flex items-center justify-center space-x-1 font-sans font-bold">
                  <Send className="w-3.5 h-3.5" />
                  <span>GitHub Push</span>
                </div>
              </div>

              {/* Stage 2 */}
              <div
                className={`p-3 rounded-xl border transition-all ${
                  pipelineStage === 'analyzer'
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 ring-2 ring-cyan-500/30'
                    : ['llm', 'artifacts', 'portal_published'].includes(pipelineStage)
                    ? 'bg-slate-900 border-slate-700 text-slate-200'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-[10px] text-slate-400 font-bold mb-1">2. Analyzer</div>
                <div className="flex items-center justify-center space-x-1 font-sans font-bold">
                  <Code className="w-3.5 h-3.5" />
                  <span>Repo AST Parser</span>
                </div>
              </div>

              {/* Stage 3 */}
              <div
                className={`p-3 rounded-xl border transition-all ${
                  pipelineStage === 'llm'
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 ring-2 ring-cyan-500/30'
                    : ['artifacts', 'portal_published'].includes(pipelineStage)
                    ? 'bg-slate-900 border-slate-700 text-slate-200'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-[10px] text-slate-400 font-bold mb-1">3. LLM Reasoning</div>
                <div className="flex items-center justify-center space-x-1 font-sans font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Gemini Synthesis</span>
                </div>
              </div>

              {/* Stage 4 */}
              <div
                className={`p-3 rounded-xl border transition-all ${
                  pipelineStage === 'artifacts'
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 ring-2 ring-cyan-500/30'
                    : pipelineStage === 'portal_published'
                    ? 'bg-slate-900 border-slate-700 text-slate-200'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-[10px] text-slate-400 font-bold mb-1">4. Multi-Artifacts</div>
                <div className="flex items-center justify-center space-x-1 font-sans font-bold">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Docs/Graphs/ADRs</span>
                </div>
              </div>

              {/* Stage 5 */}
              <div
                className={`p-3 rounded-xl border transition-all col-span-2 md:col-span-1 ${
                  pipelineStage === 'portal_published'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-[10px] text-slate-400 font-bold mb-1">5. Sync</div>
                <div className="flex items-center justify-center space-x-1 font-sans font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Portal Sync</span>
                </div>
              </div>
            </div>

            {/* Terminal Pipeline Logs */}
            {logs.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] space-y-1 max-h-32 overflow-y-auto text-slate-300">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <Terminal className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Generated Artifacts Inspector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-100 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Auto-Generated Platform Artifacts</span>
              </h3>

              <div className="text-xs text-slate-400 font-mono">
                Status: {isCompleted ? 'Published to Portal' : 'Preview Mode'}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-mono">
              <button
                onClick={() => setActiveTab('architecture')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                  activeTab === 'architecture'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                📐 Architecture & UML
              </button>

              <button
                onClick={() => setActiveTab('api_docs')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                  activeTab === 'api_docs'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                📄 API Docs & OpenAPI
              </button>

              <button
                onClick={() => setActiveTab('adrs')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                  activeTab === 'adrs'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                📋 ADR Decision Records
              </button>

              <button
                onClick={() => setActiveTab('changelog')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                  activeTab === 'changelog'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                📝 Changelog & Releases
              </button>

              <button
                onClick={() => setActiveTab('security_quality')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                  activeTab === 'security_quality'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                🛡️ Security & Coverage
              </button>

              <button
                onClick={() => setActiveTab('dependencies')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                  activeTab === 'dependencies'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                🔗 SBOM & Dependencies
              </button>
            </div>

            {/* Tab Panels */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              {/* Architecture & UML Tab */}
              {activeTab === 'architecture' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Mermaid Component Topology & UML Sequence</h4>
                      <p className="text-[11px] text-slate-400">Synthesized directly from AST code imports and service bindings.</p>
                    </div>
                    <button
                      onClick={() => handleCopy(sampleMermaidDiagram, 'mermaid')}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-800 flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedSection === 'mermaid' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSection === 'mermaid' ? 'Copied' : 'Copy Mermaid Code'}</span>
                    </button>
                  </div>

                  {/* Mermaid Visual Simulation Box */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-3">
                    <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Topological Component Diagram</div>
                    <pre className="text-slate-300 overflow-x-auto bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-[11px] leading-relaxed">
                      {sampleMermaidDiagram}
                    </pre>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-3">
                    <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">UML Push Sequence Flow</div>
                    <pre className="text-slate-300 overflow-x-auto bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-[11px] leading-relaxed">
                      {sampleUmlSequence}
                    </pre>
                  </div>
                </div>
              )}

              {/* API Docs Tab */}
              {activeTab === 'api_docs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">OpenAPI 3.1 & gRPC Endpoint Documentation</h4>
                      <p className="text-[11px] text-slate-400">Auto-extracted schema contracts, request parameters & status response codes.</p>
                    </div>
                    <button
                      onClick={() => handleCopy(sampleOpenApiSpec, 'openapi')}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-800 flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedSection === 'openapi' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSection === 'openapi' ? 'Copied' : 'Copy OpenAPI JSON'}</span>
                    </button>
                  </div>

                  <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
                    {sampleOpenApiSpec}
                  </pre>
                </div>
              )}

              {/* ADR Tab */}
              {activeTab === 'adrs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Architecture Decision Record (ADR-009)</h4>
                      <p className="text-[11px] text-slate-400">Auto-generated governance document capture for team audit compliance.</p>
                    </div>
                    <button
                      onClick={() => handleCopy(sampleAdrContent, 'adr')}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-800 flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedSection === 'adr' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSection === 'adr' ? 'Copied' : 'Copy ADR Markdown'}</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2 whitespace-pre-wrap font-sans leading-relaxed">
                    {sampleAdrContent}
                  </div>
                </div>
              )}

              {/* Changelog Tab */}
              {activeTab === 'changelog' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Semantic Release Notes & Changelogs</h4>
                      <p className="text-[11px] text-slate-400">Extracted from conventional commit history and pull request code diffs.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2 whitespace-pre-wrap font-sans leading-relaxed">
                    {sampleChangelog}
                  </div>
                </div>
              )}

              {/* Security & Quality Tab */}
              {activeTab === 'security_quality' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">Test Coverage</div>
                      <div className="text-2xl font-black text-emerald-400 mt-1">94.2%</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">+1.8% from previous push</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">Trivy Vulnerability Scan</div>
                      <div className="text-2xl font-black text-slate-100 mt-1">0 Critical</div>
                      <p className="text-[11px] text-emerald-400 mt-0.5">100% SBOM compliant</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">Cosign KMS Provenance</div>
                      <div className="text-2xl font-black text-cyan-400 mt-1">Signed</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Digest sha256:8f3c2a1e</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Dependencies Tab */}
              {activeTab === 'dependencies' && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Extracted Runtime Dependencies ({currentRepo.dependencies.length})</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentRepo.dependencies.map((dep, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <span className="font-bold text-slate-200">{dep.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400">{dep.version}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                            {dep.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs font-mono">
          <div className="text-slate-400">
            Powered by Gemini 3.6 Flash & KhulnaSoft Repo Indexer Engine
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
