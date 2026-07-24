import React, { useState } from 'react';
import {
  Layers,
  Server,
  Database,
  Globe,
  Cpu,
  Code2,
  FileText,
  Search,
  Bot,
  Package,
  Rocket,
  GitPullRequest,
  ShieldCheck,
  Activity,
  BarChart3,
  GitFork,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  FolderTree,
  Box,
  Terminal,
  Cloud,
  Container,
  GitBranch,
  Sparkles,
  Zap,
  HardDrive,
  Radio,
  FileCode,
  Archive,
  FlaskConical,
  BookOpen,
  Filter
} from 'lucide-react';

export interface ArchitectureServiceNode {
  id: string;
  name: string;
  category: 'Portal' | 'Service' | 'Data' | 'Integration';
  tech: string;
  status: 'HEALTHY' | 'SYNCED' | 'ACTIVE';
  description: string;
  metrics: string;
  dependencies: string[];
}

export const PLATFORM_SERVICES: ArchitectureServiceNode[] = [
  // Portal Layer
  { id: 'portal', name: 'KhulnaSoft Portal', category: 'Portal', tech: 'Next.js 15 / React 19', status: 'HEALTHY', description: 'Unified developer platform web console and micro-frontend portal.', metrics: '12ms latency • 99.99% uptime', dependencies: ['repo-service', 'doc-service', 'search-service', 'ai-service'] },
  
  // Services Layer
  { id: 'repo-service', name: 'Repository Service', category: 'Service', tech: 'Go gRPC / GitHub API', status: 'ACTIVE', description: 'Manages source code AST parsing, branch metadata, and git hooks.', metrics: '4.8k req/sec', dependencies: ['postgres', 'redis', 'kafka'] },
  { id: 'doc-service', name: 'Documentation Service', category: 'Service', tech: 'Node.js / Markdown Engine', status: 'HEALTHY', description: 'Automated OpenAPI spec parsing & Gemini AI doc generation.', metrics: '120ms gen time', dependencies: ['minio', 'qdrant'] },
  { id: 'search-service', name: 'Search Service', category: 'Service', tech: 'OpenSearch / Rust', status: 'HEALTHY', description: 'Sub-millisecond code search and elastic query engine.', metrics: '8ms avg search', dependencies: ['opensearch', 'redis'] },
  { id: 'ai-service', name: 'AI Service', category: 'Service', tech: '@google/genai / Gemini 3.6', status: 'ACTIVE', description: 'Server-side Gemini proxying with RAG embeddings & thinking controls.', metrics: '500M tokens/mo', dependencies: ['qdrant', 'redis'] },
  { id: 'package-registry', name: 'Package Registry', category: 'Service', tech: 'OCI / Helm / NPM Proxy', status: 'HEALTHY', description: 'Signed artifact storage for OCI containers, Helm charts & NPM.', metrics: '1.82M downloads/mo', dependencies: ['minio', 'postgres'] },
  { id: 'release-manager', name: 'Release Manager', category: 'Service', tech: 'Go / Cosign KMS', status: 'HEALTHY', description: 'Automated release tags, CHANGELOG compilation & KMS signatures.', metrics: '42 releases/mo', dependencies: ['kafka', 'minio'] },
  { id: 'cicd-service', name: 'CI/CD Service', category: 'Service', tech: 'ArgoCD / Tekton', status: 'ACTIVE', description: 'GitOps pipeline orchestration and Kubernetes deployment triggers.', metrics: '12m avg build', dependencies: ['kafka', 'kubernetes'] },
  { id: 'security-center', name: 'Security Center', category: 'Service', tech: 'Trivy / TruffleHog / OPA', status: 'HEALTHY', description: '7-stage commit security gatekeeper, CVE audits & Rego policy engine.', metrics: '94% pass rate', dependencies: ['clickhouse', 'postgres'] },
  { id: 'monitoring', name: 'Monitoring Service', category: 'Service', tech: 'Prometheus / OpenTelemetry', status: 'HEALTHY', description: 'Distributed tracing spans, metric collection & alert triggers.', metrics: '10k spans/sec', dependencies: ['clickhouse'] },
  { id: 'analytics', name: 'Analytics Service', category: 'Service', tech: 'ClickHouse / D3.js', status: 'HEALTHY', description: 'Developer productivity analytics, commit frequency & heatmaps.', metrics: 'Real-time DQL', dependencies: ['clickhouse'] },
  { id: 'knowledge-graph', name: 'Knowledge Graph', category: 'Service', tech: 'D3 Force / GraphEngine', status: 'HEALTHY', description: 'Interactive AST dependency tree & inter-repository graph.', metrics: '1,420 graph nodes', dependencies: ['qdrant', 'postgres'] },

  // Data Tier
  { id: 'postgres', name: 'PostgreSQL', category: 'Data', tech: 'Cloud SQL Postgres 16', status: 'HEALTHY', description: 'Relational data store for accounts, RBAC, and repository state.', metrics: '100% HA Replica', dependencies: [] },
  { id: 'redis', name: 'Redis', category: 'Data', tech: 'Redis Cluster v7.2', status: 'HEALTHY', description: 'Ultra-fast session cache, API rate limiting & pub/sub bus.', metrics: '0.4ms latency', dependencies: [] },
  { id: 'opensearch', name: 'OpenSearch', category: 'Data', tech: 'OpenSearch 2.12', status: 'HEALTHY', description: 'Distributed text index for full-text code & log queries.', metrics: '1.2 TB indexed', dependencies: [] },
  { id: 'qdrant', name: 'Qdrant', category: 'Data', tech: 'Qdrant Vector DB', status: 'HEALTHY', description: 'High-density vector embeddings for code RAG and Gemini AI.', metrics: '12M vector points', dependencies: [] },
  { id: 'clickhouse', name: 'ClickHouse', category: 'Data', tech: 'ClickHouse Columnar DB', status: 'HEALTHY', description: 'Analytical columnar storage for OTel spans & telemetry logs.', metrics: '450M rows/sec', dependencies: [] },
  { id: 'minio', name: 'MinIO', category: 'Data', tech: 'MinIO Object Storage', status: 'HEALTHY', description: 'S3-compatible binary store for build artifacts and SBOMs.', metrics: '4.2 TB stored', dependencies: [] },
  { id: 'kafka', name: 'Kafka', category: 'Data', tech: 'Apache Kafka Event Bus', status: 'HEALTHY', description: 'Asynchronous event streaming broker for webhook events & pipelines.', metrics: '15k msg/sec', dependencies: [] },

  // Integrations Tier
  { id: 'github', name: 'GitHub Integration', category: 'Integration', tech: 'GitHub Apps / REST / GraphQL', status: 'ACTIVE', description: 'Webhook events, commit triggers & pull request comments.', metrics: 'Synced', dependencies: [] },
  { id: 'docker', name: 'Docker Engine', category: 'Integration', tech: 'OCI BuildKit', status: 'ACTIVE', description: 'Multi-arch container builds & rootless image creation.', metrics: 'Layer Cached', dependencies: [] },
  { id: 'kubernetes', name: 'Kubernetes (GKE)', category: 'Integration', tech: 'GKE Cluster v1.30', status: 'ACTIVE', description: 'Production container orchestration with HPA auto-scalers.', metrics: '24 Nodes', dependencies: [] },
  { id: 'cloud', name: 'Cloud Infrastructure', category: 'Integration', tech: 'Google Cloud Platform', status: 'ACTIVE', description: 'Cloud Run ingress, Cloud SQL DB, and GCP KMS keys.', metrics: 'us-east1', dependencies: [] }
];

export interface RepositoryDomainFolder {
  id: string;
  path: string;
  name: string;
  category: string;
  description: string;
  topics: string[];
  repoCount: number;
  featuredRepos: string[];
  icon: any;
  color: string;
}

export const REPOSITORY_DOMAINS: RepositoryDomainFolder[] = [
  {
    id: 'core',
    path: 'khulnasoft/core/*',
    name: 'Core Platform & SDKs',
    category: 'Core',
    description: 'Foundational framework runtime, developer SDKs, CLI tools, and system libraries.',
    topics: ['core', 'platform', 'sdk', 'cli', 'runtime'],
    repoCount: 4,
    featuredRepos: ['khulnasoft/core-api', 'khulnasoft/sdk-typescript', 'khulnasoft/cli', 'khulnasoft/core-go'],
    icon: Code2,
    color: 'text-cyan-400 border-cyan-800 bg-cyan-950/40'
  },
  {
    id: 'ai',
    path: 'khulnasoft/ai/*',
    name: 'AI & Machine Learning',
    category: 'AI',
    description: 'Gemini 3.6 Flash integrations, agentic workflows, LLM context routers, and vector embeddings.',
    topics: ['ai', 'alpha', 'agents', 'llm', 'models', 'rag'],
    repoCount: 3,
    featuredRepos: ['khulnasoft/ai-gateway', 'khulnasoft/agents-sdk', 'khulnasoft/llm-router'],
    icon: Bot,
    color: 'text-indigo-400 border-indigo-800 bg-indigo-950/40'
  },
  {
    id: 'security',
    path: 'khulnasoft/security/*',
    name: 'Security & Vulnerability Scanners',
    category: 'Security',
    description: '7-stage commit security pipelines, Trivy CVE scanners, SBOM generators, and OPA Rego rules.',
    topics: ['security', 'recon', 'scanners', 'cve', 'sbom', 'trufflehog'],
    repoCount: 3,
    featuredRepos: ['khulnasoft/commit-security', 'khulnasoft/cve-scanner', 'khulnasoft/sbom-generator'],
    icon: ShieldCheck,
    color: 'text-emerald-400 border-emerald-800 bg-emerald-950/40'
  },
  {
    id: 'infra',
    path: 'khulnasoft/infra/*',
    name: 'Infrastructure & Kubernetes',
    category: 'Infrastructure',
    description: 'Kubernetes CRD controllers, Helm deployment charts, Terraform IaC, and Dockerfiles.',
    topics: ['infra', 'kubernetes', 'terraform', 'docker', 'helm'],
    repoCount: 3,
    featuredRepos: ['khulnasoft/k8s-operator', 'khulnasoft/terraform-gcp', 'khulnasoft/docker-templates'],
    icon: Container,
    color: 'text-amber-400 border-amber-800 bg-amber-950/40'
  },
  {
    id: 'cloud',
    path: 'khulnasoft/cloud/*',
    name: 'Cloud Services & Portals',
    category: 'Cloud',
    description: 'Next.js developer portal, Cloud Run serverless orchestrator, and cloud deployment engines.',
    topics: ['cloud', 'portal', 'deployment', 'cloudrun', 'nextjs'],
    repoCount: 2,
    featuredRepos: ['khulnasoft/developer-portal', 'khulnasoft/cloud-deployer'],
    icon: Cloud,
    color: 'text-sky-400 border-sky-800 bg-sky-950/40'
  },
  {
    id: 'docs',
    path: 'khulnasoft/docs/*',
    name: 'Documentation & Knowledge',
    category: 'Docs',
    description: 'Technical manuals, interactive OpenAPI specs, video tutorials, and API reference guides.',
    topics: ['docs', 'documentation', 'tutorials', 'openapi'],
    repoCount: 2,
    featuredRepos: ['khulnasoft/documentation', 'khulnasoft/tutorials'],
    icon: BookOpen,
    color: 'text-purple-400 border-purple-800 bg-purple-950/40'
  },
  {
    id: 'labs',
    path: 'khulnasoft/labs/*',
    name: 'Research & Labs Experiments',
    category: 'Labs',
    description: 'Experimental AI research prototypes, canary proof-of-concepts, and sandbox code.',
    topics: ['labs', 'research', 'experiments', 'canary'],
    repoCount: 2,
    featuredRepos: ['khulnasoft/labs-wasm', 'khulnasoft/research-rag'],
    icon: FlaskConical,
    color: 'text-rose-400 border-rose-800 bg-rose-950/40'
  },
  {
    id: 'archive',
    path: 'khulnasoft/archive/*',
    name: 'Deprecated & Legacy Archive',
    category: 'Archive',
    description: 'Historical read-only repositories preserved for audit trail and backwards compatibility.',
    topics: ['archive', 'deprecated', 'legacy'],
    repoCount: 1,
    featuredRepos: ['khulnasoft/legacy-v1-api'],
    icon: Archive,
    color: 'text-slate-400 border-slate-800 bg-slate-950/40'
  }
];

export const RecommendedPlatformArchitecture: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('portal');
  const [selectedDomainId, setSelectedDomainId] = useState<string>('core');
  const [activeTab, setActiveTab] = useState<'architecture' | 'repository-taxonomy'>('architecture');
  const [filterCategory, setFilterCategory] = useState<'All' | 'Portal' | 'Service' | 'Data' | 'Integration'>('All');

  const selectedNode = PLATFORM_SERVICES.find((s) => s.id === selectedNodeId) || PLATFORM_SERVICES[0];
  const selectedDomain = REPOSITORY_DOMAINS.find((d) => d.id === selectedDomainId) || REPOSITORY_DOMAINS[0];

  const filteredNodes = filterCategory === 'All' 
    ? PLATFORM_SERVICES 
    : PLATFORM_SERVICES.filter((n) => n.category === filterCategory);

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold mb-1">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Recommended Production Architecture & Repository Taxonomy</span>
            </div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center space-x-2">
              <span>KhulnaSoft Platform Blueprint</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl font-mono">
              3-Tier Architecture (Next.js Portal ➔ 11 Core Microservices ➔ 7 Middleware Data Stores ➔ Runtime Integrations) + Clean GitHub Domain Repository Organization.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0 font-mono text-xs">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                activeTab === 'architecture'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Platform 3-Tier Architecture</span>
            </button>

            <button
              onClick={() => setActiveTab('repository-taxonomy')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                activeTab === 'repository-taxonomy'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Suggested Repos Organization</span>
            </button>
          </div>
        </div>

        {/* Quick Summary Pill Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs pt-1">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Portal Layer</div>
            <div className="text-slate-100 font-extrabold mt-0.5">Next.js SPA / SSR</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Core Microservices</div>
            <div className="text-cyan-400 font-extrabold mt-0.5">11 Autonomous Services</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Data & Middleware</div>
            <div className="text-emerald-400 font-extrabold mt-0.5">7 Distributed Engines</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Domain Repositories</div>
            <div className="text-amber-400 font-extrabold mt-0.5">8 Structured Namespaces</div>
          </div>
        </div>
      </div>

      {/* TAB 1: RECOMMENDED PLATFORM ARCHITECTURE DIAGRAM */}
      {activeTab === 'architecture' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-8 font-mono text-xs">
          
          {/* Controls & Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>Interactive Platform Topology Map</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any service component to inspect runtime specifications, dependencies, and health metrics.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-400 text-[11px]">Filter Layer:</span>
              {(['All', 'Portal', 'Service', 'Data', 'Integration'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* VISUAL DIAGRAM CANVAS */}
          <div className="space-y-6">
            
            {/* TIER 1: PORTAL (NEXT.JS) */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border-2 border-cyan-500/80 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-cyan-400 font-black tracking-wider uppercase text-xs flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Tier 1: Presentation & Developer Portal</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                  Next.js 15 App Router
                </span>
              </div>

              <div
                onClick={() => setSelectedNodeId('portal')}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedNodeId === 'portal' ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/30' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-slate-100 font-extrabold text-sm">Portal (Next.js)</div>
                    <div className="text-slate-400 text-xs font-sans">Unified developer console, micro-frontend UI, SSO OAuth, and interactive dashboards.</div>
                  </div>
                </div>

                <div className="text-right text-[11px]">
                  <span className="text-emerald-400 font-bold flex items-center space-x-1 justify-end">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>HEALTHY</span>
                  </span>
                  <div className="text-slate-500 text-[10px]">12ms Response</div>
                </div>
              </div>
            </div>

            {/* DIVIDER LINE */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dashed border-slate-800"></div></div>
              <span className="relative px-4 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] text-cyan-400 font-bold">
                gRPC / REST / WebSocket Protocol Gateway
              </span>
            </div>

            {/* TIER 2: 11 CORE MICROSERVICES */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-indigo-400 font-black tracking-wider uppercase text-xs flex items-center space-x-2">
                  <Server className="w-4 h-4 text-indigo-400" />
                  <span>Tier 2: Core Platform Services (11 Microservices)</span>
                </span>
                <span className="text-slate-500 text-[10px]">Independent Cloud Run & GKE Workloads</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  { id: 'repo-service', label: 'Repository Service', icon: Code2 },
                  { id: 'doc-service', label: 'Documentation Service', icon: FileText },
                  { id: 'search-service', label: 'Search Service', icon: Search },
                  { id: 'ai-service', label: 'AI Service', icon: Bot },
                  { id: 'package-registry', label: 'Package Registry', icon: Package },
                  { id: 'release-manager', label: 'Release Manager', icon: Rocket },
                  { id: 'cicd-service', label: 'CI/CD Service', icon: GitPullRequest },
                  { id: 'security-center', label: 'Security Center', icon: ShieldCheck },
                  { id: 'monitoring', label: 'Monitoring', icon: Activity },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                  { id: 'knowledge-graph', label: 'Knowledge Graph', icon: GitFork },
                ].map((s) => {
                  const node = PLATFORM_SERVICES.find((n) => n.id === s.id)!;
                  const isSelected = selectedNodeId === s.id;
                  const IconComp = s.icon;

                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedNodeId(s.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-950/50 border-cyan-400 ring-1 ring-cyan-400/40 shadow-lg'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-slate-200 text-xs truncate">{node.name}</span>
                      </div>

                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 ml-2" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DIVIDER LINE */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dashed border-slate-800"></div></div>
              <span className="relative px-4 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] text-emerald-400 font-bold">
                High-Availability Storage & Event Broker Layer
              </span>
            </div>

            {/* TIER 3: DATA & MIDDLEWARE STACK */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-emerald-400 font-black tracking-wider uppercase text-xs flex items-center space-x-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Tier 3: Distributed Data & Middleware Infrastructure (7 Engines)</span>
                </span>
                <span className="text-slate-500 text-[10px]">Cloud SQL / Managed Middleware</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {[
                  { id: 'postgres', name: 'PostgreSQL', icon: Database, color: 'text-indigo-400' },
                  { id: 'redis', name: 'Redis', icon: Zap, color: 'text-rose-400' },
                  { id: 'opensearch', name: 'OpenSearch', icon: Search, color: 'text-cyan-400' },
                  { id: 'qdrant', name: 'Qdrant', icon: Sparkles, color: 'text-purple-400' },
                  { id: 'clickhouse', name: 'ClickHouse', icon: BarChart3, color: 'text-amber-400' },
                  { id: 'minio', name: 'MinIO', icon: HardDrive, color: 'text-sky-400' },
                  { id: 'kafka', name: 'Kafka', icon: Radio, color: 'text-emerald-400' },
                ].map((d) => {
                  const isSelected = selectedNodeId === d.id;
                  const IconComp = d.icon;
                  return (
                    <div
                      key={d.id}
                      onClick={() => setSelectedNodeId(d.id)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer space-y-1 ${
                        isSelected
                          ? 'bg-slate-900 border-emerald-400 ring-1 ring-emerald-400/40'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <IconComp className={`w-4 h-4 mx-auto ${d.color}`} />
                      <div className="font-bold text-slate-200 text-xs">{d.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DIVIDER LINE */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dashed border-slate-800"></div></div>
              <span className="relative px-4 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] text-amber-400 font-bold">
                External Ecosystem & Runtime Engine Integrations
              </span>
            </div>

            {/* TIER 4: INTEGRATIONS / RUNTIME */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-amber-400 font-black tracking-wider uppercase text-xs flex items-center space-x-2">
                  <Box className="w-4 h-4 text-amber-400" />
                  <span>Tier 4: Integrations & Runtime Providers</span>
                </span>
                <span className="text-slate-500 text-[10px]">Cloud & Container Drivers</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'github', name: 'GitHub', icon: GitBranch },
                  { id: 'docker', name: 'Docker', icon: Container },
                  { id: 'kubernetes', name: 'Kubernetes', icon: Server },
                  { id: 'cloud', name: 'Cloud (GCP)', icon: Cloud },
                ].map((ig) => {
                  const isSelected = selectedNodeId === ig.id;
                  const IconComp = ig.icon;
                  return (
                    <div
                      key={ig.id}
                      onClick={() => setSelectedNodeId(ig.id)}
                      className={`p-3 rounded-xl border flex items-center space-x-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 border-amber-400 ring-1 ring-amber-400/40'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400">
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <div className="font-bold text-slate-200 text-xs">{ig.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* NODE INSPECTOR CARD */}
          {selectedNode && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-extrabold text-slate-100">{selectedNode.name}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800 text-[10px] font-bold">
                      {selectedNode.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">{selectedNode.description}</p>
                </div>

                <div className="text-right text-xs">
                  <div className="text-cyan-300 font-bold">{selectedNode.tech}</div>
                  <div className="text-slate-500 text-[11px]">{selectedNode.metrics}</div>
                </div>
              </div>

              {selectedNode.dependencies.length > 0 && (
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-500 font-bold">Service Dependencies:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.dependencies.map((depId) => (
                      <span
                        key={depId}
                        onClick={() => setSelectedNodeId(depId)}
                        className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-300 text-[10px] cursor-pointer transition-colors"
                      >
                        {depId}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SUGGESTED REPOSITORY ORGANIZATION TAXONOMY */}
      {activeTab === 'repository-taxonomy' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <FolderTree className="w-4 h-4 text-cyan-400" />
                <span>Suggested Domain Repository Organization & Topics Metadata</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Group repositories into explicit domain namespaces (using GitHub Topics and org metadata for clean operational scalability).
              </p>
            </div>

            <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold">
              8 Standard Domains Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {REPOSITORY_DOMAINS.map((domain) => {
              const isSelected = selectedDomainId === domain.id;
              const IconComp = domain.icon;

              return (
                <div
                  key={domain.id}
                  onClick={() => setSelectedDomainId(domain.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-slate-950 border-cyan-400 ring-2 ring-cyan-400/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 text-xs flex items-center space-x-1.5">
                      <IconComp className="w-4 h-4 text-cyan-400" />
                      <span>{domain.path}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-bold">
                      {domain.repoCount} Repos
                    </span>
                  </div>

                  <p className="text-slate-300 font-sans text-xs line-clamp-2">{domain.description}</p>

                  {/* GitHub Topics Pills */}
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">GitHub Topics:</div>
                    <div className="flex flex-wrap gap-1">
                      {domain.topics.map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800 text-[10px]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Featured Repos */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-1">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Sample Repositories:</div>
                    <div className="space-y-0.5 text-[11px] text-slate-300 font-mono">
                      {domain.featuredRepos.map((r) => (
                        <div key={r} className="flex items-center space-x-1">
                          <ChevronRight className="w-3 h-3 text-cyan-400" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Domain Detail Inspector */}
          {selectedDomain && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                  <FolderTree className="w-4 h-4 text-cyan-400" />
                  <span>Domain Specification: {selectedDomain.name} ({selectedDomain.path})</span>
                </span>
                <span className="text-xs text-slate-400">{selectedDomain.repoCount} Repositories assigned</span>
              </div>
              <p className="text-xs text-slate-300 font-sans">{selectedDomain.description}</p>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-500 font-bold">Active GitHub Topics Taxonomy:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDomain.topics.map((tp) => (
                    <span key={tp} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 text-[11px] font-bold">
                      #{tp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
