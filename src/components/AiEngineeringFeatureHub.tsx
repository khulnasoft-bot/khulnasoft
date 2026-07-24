import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  GitPullRequest, 
  Code2, 
  Layers, 
  Calendar, 
  FileText, 
  Bot, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  Copy, 
  Check, 
  GitBranch, 
  Terminal, 
  Zap, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  ListOrdered, 
  BookOpen, 
  Compass, 
  HelpCircle,
  FileCode,
  Tag,
  CheckSquare,
  MessageSquare,
  Network
} from 'lucide-react';
import { MOCK_REPOSITORIES } from '../data/mockData';

export const AiEngineeringFeatureHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'search' | 'architecture' | 'pr-review' | 'code-deps' | 'release-roadmap' | 'issues-docs'
  >('search');

  // Search State
  const [searchQuery, setSearchQuery] = useState('How does JWT token revocation work across microservices?');
  const [searchType, setSearchType] = useState<'semantic' | 'repo'>('semantic');
  const [searchResults, setSearchResults] = useState<any[]>([
    {
      id: 'res-1',
      title: 'oidc_middleware.go (khulnasoft/core-api)',
      repo: 'khulnasoft/core-api',
      matchType: 'Code Vector Embedding',
      score: 0.96,
      snippet: 'func ValidateJWTWithRevocation(token string) bool {\n  if RedisRevocationCache.Contains(token) { return false }\n  return jwt.VerifyRS256(token)\n}',
      citation: 'src/auth/oidc_middleware.go:42'
    },
    {
      id: 'res-2',
      title: 'Issue #182: Distributed Revocation Cache Invalidation',
      repo: 'khulnasoft/identity-service',
      matchType: 'Issue & Discussion Index',
      score: 0.91,
      snippet: 'Discussed adopting Redis Pub/Sub to broadcast token revocation events to all K8s worker pods in <50ms.',
      citation: 'github.com/khulnasoft/identity-service/issues/182'
    },
    {
      id: 'res-3',
      title: 'Architecture Doc: Token Lifecycle ADR-004',
      repo: 'khulnasoft/docs-platform',
      matchType: 'Documentation Search',
      score: 0.88,
      snippet: 'ADR-004 specifies short-lived access tokens (15m) combined with OIDC refresh token rotation.',
      citation: 'docs/architecture/adr-004-token-lifecycle.md'
    }
  ]);

  // Architecture Q&A State
  const [qaPrompt, setQaPrompt] = useState('Generate Mermaid diagram for event flow from Gateway to Identity Service and Kafka.');
  const [qaResponse, setQaResponse] = useState<string | null>(`### Architecture Q&A: KhulnaSoft Gateway Event Stream

The system routes HTTP/gRPC traffic through the **API Gateway** before dispatching audit events to **Kafka**:

\`\`\`mermaid
graph TD
  Client[Client Request] --> Gateway[khulnasoft/core-api]
  Gateway -->|Validate Token| Auth[khulnasoft/identity-service]
  Gateway -->|Publish Event| Kafka[(Apache Kafka Cluster)]
  Kafka --> Telemetry[khulnasoft/telemetry-collector]
  Telemetry --> DB[(ClickHouse Storage)]
\`\`\`

#### Key Component Reasoning:
- **Zero-Trust Token Check**: Gateway queries in-memory L1 cache, falling back to identity-service gRPC endpoint.
- **Asynchronous Audit Logging**: Event payloads are buffered in Kafka with idempotent producer IDs.`);
  const [isGeneratingQa, setIsGeneratingQa] = useState(false);

  // PR Review State
  const [selectedPrId, setSelectedPrId] = useState('PR-402');
  const [prReviewOutput, setPrReviewOutput] = useState<any>({
    title: 'PR #402: Add Redis-backed token revocation in gRPC middleware',
    author: 'dev-lead',
    repo: 'khulnasoft/core-api',
    securityScore: 94,
    findings: [
      {
        type: 'Security',
        level: 'PASS',
        title: 'JWT Secret Handling',
        detail: 'No hardcoded credentials found. Keys injected via Kubernetes Secrets.'
      },
      {
        type: 'Performance',
        level: 'WARNING',
        title: 'Redis Connection Pool Allocation',
        detail: 'New Redis connection instantiated per gRPC interceptor request instead of using singleton pool.'
      },
      {
        type: 'Test Coverage',
        level: 'PASS',
        title: 'Unit & Integration Tests',
        detail: 'Includes 4 mock Redis cluster integration tests covering failover edge cases.'
      }
    ],
    suggestedPatch: `// Optimization Patch for pr-402/middleware.go
var redisPool *redis.Pool

func init() {
    redisPool = redis.NewPool(func() (redis.Conn, error) {
        return redis.Dial("tcp", os.Getenv("REDIS_URL"))
    }, 10)
}`
  });

  // Code & Dependency Reasoning State
  const [depAnalysisOutput, setDepAnalysisOutput] = useState<any>({
    package: '@google/genai v0.1.2 → v0.2.0',
    affectedRepos: ['khulnasoft/core-api', 'khulnasoft/ai-gateway'],
    breakingChanges: [
      'Deprecated generateContentLegacy() in favor of unified GoogleGenAI SDK client.',
      'Chat session object requires systemInstruction inside config object.'
    ],
    recommendedAction: 'Apply automated codemod across 12 source files in core-api repository.'
  });

  // Release & Roadmap State
  const [releaseNotesOutput, setReleaseNotesOutput] = useState<string>(`## Release v2.4.0 (Enterprise AI Engineering Layer)

### 🚀 Major Enhancements
- **Semantic Repository Search**: Sub-second vector search across 18 repos, PRs, issues, and wikis.
- **Automated PR Reviews**: Instant security, performance, and coverage auditing with 1-click patch fixes.
- **Roadmap Synthesis**: Auto-generated Q3/Q4 engineering roadmap from GitHub milestones.

### 🛡️ Security Fixes
- Addressed CVE-2026-8812 in gRPC transport layer by upgrading Protobuf compiler.
- Enforced default-deny Pod Security Standards across Kubernetes namespaces.`);

  const [roadmapTimeline, setRoadmapTimeline] = useState<any[]>([
    {
      quarter: 'Q3 2026',
      title: 'AI Engineering Layer & Graph Vectors',
      status: 'IN_PROGRESS',
      progress: 85,
      items: ['Semantic repo search', 'Automatic PR reviewer', 'Wiki/Issue Knowledge Graph']
    },
    {
      quarter: 'Q4 2026',
      title: 'Autonomous Kubernetes Auto-remediation',
      status: 'PLANNED',
      progress: 30,
      items: ['HPA GitOps sync', 'Self-healing pod restart policies', 'Cost-anomaly AI alerts']
    }
  ]);

  // Issues & Docs State
  const [issueSummaryOutput, setIssueSummaryOutput] = useState<any>({
    issueNumber: '#382',
    title: 'High latency spikes during batch database exports',
    participants: 6,
    summary: 'Team identified thread contention in PostgreSQL connection pool during scheduled 02:00 UTC export jobs.',
    rootCause: 'Connection max_connections limit reached; lock contention on telemetry_events table.',
    actionItems: [
      'Scale Postgres connection pool size to 100 with PgBouncer',
      'Refactor telemetry export query to read from replica read-only endpoint'
    ]
  });

  const [docGenMarkdown, setDocGenMarkdown] = useState<string>(`# KhulnaSoft Core API Developer Guide

## System Architecture
The Core API serves as the centralized entry point for all microservice communications.

### Endpoints
- \`POST /api/gemini/analyze\` - Triggers AI engineering reasoning pipeline.
- \`POST /api/gemini/chat\` - Interactive Staff Engineer Q&A endpoint.`);

  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedPatch, setCopiedPatch] = useState(false);

  const handleRunSemanticSearch = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSearchResults([
        {
          id: `res-${Date.now()}`,
          title: `Result for "${searchQuery}"`,
          repo: 'khulnasoft/core-api',
          matchType: 'Semantic Vector Match (Score: 0.98)',
          score: 0.98,
          snippet: `Match found in codebase: "func HandleRequest() - matches query context: ${searchQuery}"`,
          citation: 'src/server/handler.go:88'
        },
        ...searchResults
      ]);
    }, 800);
  };

  const handleAskArchitecture = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: qaPrompt,
          taskType: 'complex'
        })
      });
      const data = await res.json();
      setQaResponse(data.text);
    } catch (e) {
      setQaResponse(`### Architecture Analysis Response
      
\`\`\`mermaid
graph TD
  Gateway[API Gateway] --> AI[AI Engine]
  AI --> DB[(Knowledge Graph)]
\`\`\`
Processed architecture Q&A for: ${qaPrompt}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 font-sans">
      {/* Top Feature Category Navigation Tabs */}
      <div className="flex items-center space-x-1 border-b border-slate-800 pb-2 overflow-x-auto font-mono text-xs">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'search'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-950 hover:bg-slate-800 text-slate-300'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Repository & Semantic Search</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'architecture'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-950 hover:bg-slate-800 text-slate-300'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Architecture Q&A</span>
        </button>

        <button
          onClick={() => setActiveTab('pr-review')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'pr-review'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-950 hover:bg-slate-800 text-slate-300'
          }`}
        >
          <GitPullRequest className="w-4 h-4" />
          <span>Automatic PR Review</span>
        </button>

        <button
          onClick={() => setActiveTab('code-deps')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'code-deps'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-950 hover:bg-slate-800 text-slate-300'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Code & Dependency Reasoning</span>
        </button>

        <button
          onClick={() => setActiveTab('release-roadmap')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'release-roadmap'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-950 hover:bg-slate-800 text-slate-300'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Release & Roadmap Planner</span>
        </button>

        <button
          onClick={() => setActiveTab('issues-docs')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'issues-docs'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
              : 'bg-slate-950 hover:bg-slate-800 text-slate-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Issues Summarizer & Docs Generator</span>
        </button>
      </div>

      {/* TAB 1: REPOSITORY & SEMANTIC SEARCH */}
      {activeTab === 'search' && (
        <div className="space-y-5 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-200 font-bold flex items-center space-x-2 text-sm">
                <Search className="w-4 h-4 text-cyan-400" />
                <span>Multi-Repo Vector & Semantic Intelligence Search</span>
              </span>

              <div className="flex items-center space-x-2 text-[10px]">
                <button
                  onClick={() => setSearchType('semantic')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    searchType === 'semantic' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Semantic Vector Search
                </button>
                <button
                  onClick={() => setSearchType('repo')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    searchType === 'repo' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Repository Search
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunSemanticSearch()}
                placeholder="Query codebase, issue discussions, docs, PRs or wikis..."
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-slate-100 text-xs font-mono"
              />
              <button
                onClick={handleRunSemanticSearch}
                disabled={isProcessing}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2.5 rounded-xl font-bold cursor-pointer transition-all flex items-center space-x-1.5 shrink-0"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Search Knowledge Graph</span>
              </button>
            </div>
          </div>

          {/* Search Results Display */}
          <div className="space-y-3">
            <div className="text-slate-400 font-bold text-xs">
              Semantic Search Matches ({searchResults.length} indexed chunks):
            </div>

            {searchResults.map((res) => (
              <div key={res.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 text-sm">{res.title}</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px]">
                    {res.matchType}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px] whitespace-pre-wrap">
                  {res.snippet}
                </div>
                <div className="text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Source: {res.citation}</span>
                  <span>Repo: {res.repo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ARCHITECTURE Q&A */}
      {activeTab === 'architecture' && (
        <div className="space-y-5 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-slate-200 font-bold flex items-center space-x-2 text-sm">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Enterprise Architecture Reasoning & Q&A Engine</span>
            </span>

            <div className="flex items-center space-x-2">
              <textarea
                value={qaPrompt}
                onChange={(e) => setQaPrompt(e.target.value)}
                rows={2}
                placeholder="Ask structural architecture questions..."
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-slate-100 text-xs font-mono"
              />
              <button
                onClick={handleAskArchitecture}
                disabled={isProcessing}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-6 rounded-xl font-bold cursor-pointer transition-all flex items-center space-x-1.5 shrink-0"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Reason Architecture</span>
              </button>
            </div>
          </div>

          {qaResponse && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="text-slate-200 font-bold text-sm border-b border-slate-900 pb-2 flex items-center space-x-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>AI Architecture Reasoning Output</span>
              </div>
              <div className="text-slate-300 leading-relaxed font-sans text-xs whitespace-pre-wrap">
                {qaResponse}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AUTOMATIC PR REVIEW */}
      {activeTab === 'pr-review' && (
        <div className="space-y-5 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-200 font-bold flex items-center space-x-2 text-sm">
                <GitPullRequest className="w-4 h-4 text-indigo-400" />
                <span>Automated PR Security & Quality Reviewer</span>
              </span>

              <select
                value={selectedPrId}
                onChange={(e) => setSelectedPrId(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 text-xs"
              >
                <option value="PR-402">PR #402: Redis-backed token revocation</option>
                <option value="PR-389">PR #389: OpenTelemetry span propagation</option>
                <option value="PR-374">PR #374: Helm v3 deployment template bump</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 text-sm">{prReviewOutput.title}</span>
                <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  Security Score: {prReviewOutput.securityScore}/100
                </span>
              </div>

              <div className="space-y-2">
                {prReviewOutput.findings.map((f: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{f.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        f.level === 'PASS' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                      }`}>
                        {f.level}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{f.detail}</p>
                  </div>
                ))}
              </div>

              {/* Suggested Fix Patch */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-cyan-400 font-bold text-xs">
                  <span>Suggested Optimization Code Patch:</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(prReviewOutput.suggestedPatch);
                      setCopiedPatch(true);
                      setTimeout(() => setCopiedPatch(false), 2000);
                    }}
                    className="p-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 text-[10px] flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedPatch ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
                    <span>{copiedPatch ? 'Copied' : 'Copy Patch'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 text-[11px] overflow-x-auto">
                  <code>{prReviewOutput.suggestedPatch}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CODE & DEPENDENCY REASONING */}
      {activeTab === 'code-deps' && (
        <div className="space-y-5 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-slate-200 font-bold flex items-center space-x-2 text-sm">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>Cross-Repository Dependency & Code Explanation Engine</span>
            </span>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300">{depAnalysisOutput.package}</span>
                <span className="text-slate-400">Affected Repos: {depAnalysisOutput.affectedRepos.join(', ')}</span>
              </div>

              <div className="space-y-1">
                <div className="text-slate-300 font-bold">Breaking Changes Detected:</div>
                <ul className="list-disc list-inside text-slate-400 space-y-1">
                  {depAnalysisOutput.breakingChanges.map((b: string, i: number) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-bold">
                Action: {depAnalysisOutput.recommendedAction}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: RELEASE & ROADMAP PLANNER */}
      {activeTab === 'release-roadmap' && (
        <div className="space-y-5 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <span className="text-slate-200 font-bold flex items-center space-x-2 text-sm">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Auto-Generated Release Notes & Engineering Roadmap</span>
            </span>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Release Notes */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-slate-200 font-bold border-b border-slate-800 pb-2">
                  Auto-Generated Release Notes (v2.4.0)
                </div>
                <pre className="text-slate-300 text-[11px] whitespace-pre-wrap font-sans leading-relaxed">
                  {releaseNotesOutput}
                </pre>
              </div>

              {/* Roadmap Timeline */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="text-slate-200 font-bold border-b border-slate-800 pb-2">
                  Quarterly Engineering Roadmap
                </div>

                <div className="space-y-3">
                  {roadmapTimeline.map((item) => (
                    <div key={item.quarter} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-300">{item.quarter}: {item.title}</span>
                        <span className="text-emerald-400 font-bold">{item.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400" style={{ width: `${item.progress}%` }} />
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.items.join(' • ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ISSUES & DOCS GENERATOR */}
      {activeTab === 'issues-docs' && (
        <div className="space-y-5 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <span className="text-slate-200 font-bold flex items-center space-x-2 text-sm">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Multi-Thread Issue Summarization & Documentation Builder</span>
            </span>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Issue Summarizer */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-slate-200">Issue {issueSummaryOutput.issueNumber}: {issueSummaryOutput.title}</span>
                  <span className="text-slate-400 text-[10px]">{issueSummaryOutput.participants} Participants</span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans">{issueSummaryOutput.summary}</p>
                <div className="text-rose-400 font-bold text-[10px]">Root Cause: {issueSummaryOutput.rootCause}</div>
                <div className="space-y-1">
                  <span className="text-emerald-400 font-bold text-[10px]">Key Action Items:</span>
                  <ul className="list-disc list-inside text-slate-400 text-[10px] space-y-0.5">
                    {issueSummaryOutput.actionItems.map((act: string, i: number) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Documentation Generation */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-slate-200">Auto-Generated Developer Documentation</span>
                  <span className="text-cyan-400 text-[10px] font-bold">Markdown / OpenAPI</span>
                </div>
                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 text-[11px] font-mono leading-relaxed overflow-x-auto">
                  <code>{docGenMarkdown}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
