import React, { useState } from 'react';
import { 
  Package, 
  Container, 
  ShieldCheck, 
  FileCheck, 
  Download, 
  Copy, 
  CheckCircle2, 
  Search,
  ExternalLink,
  Globe,
  Terminal,
  Code2,
  Lock,
  Layers,
  Cpu,
  Boxes,
  FileCode,
  Zap,
  Check,
  Info,
  Server,
  Share2,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Filter,
  Sparkles,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { PackageArtifact } from '../types';

// Extended Mock Packages for registry.khulnasoft.com
const REGISTRY_PACKAGES: PackageArtifact[] = [
  // 1. Docker / OCI Images
  {
    id: 'pkg-docker-core-api',
    name: 'core-api',
    type: 'docker',
    version: 'v2.4.0',
    repoId: 'repo-core-api',
    repoName: 'khulnasoft/core-api',
    sizeMB: 38.4,
    downloadCount: 184200,
    tags: ['latest', 'v2.4.0', 'prod-ready', 'amd64', 'arm64'],
    sbomCount: 42,
    signedStatus: 'COSIGN_VERIFIED',
    provenanceDigest: 'sha256:8f2a91b490f84a1e9c2d1538a7b9c03f8f2a91b4',
    createdAt: '10 mins ago',
    description: 'High-throughput enterprise gRPC/REST gateway & event processing backend.',
    pullCommand: 'docker pull registry.khulnasoft.com/core-api:v2.4.0',
    license: 'Apache-2.0',
    supportedArchitectures: ['linux/amd64', 'linux/arm64']
  },
  {
    id: 'pkg-docker-ai-gateway',
    name: 'ai-gateway',
    type: 'docker',
    version: 'v1.9.0',
    repoId: 'repo-ai-gateway',
    repoName: 'khulnasoft/ai-gateway',
    sizeMB: 52.1,
    downloadCount: 92400,
    tags: ['latest', 'v1.9.0', 'gemini-3.6'],
    sbomCount: 38,
    signedStatus: 'COSIGN_VERIFIED',
    provenanceDigest: 'sha256:4b9a11c8d7e2f3a4b5c6d7e8f9a0b1c2',
    createdAt: '25 mins ago',
    description: 'Gemini AI agent orchestration middleware with streaming thinking controls.',
    pullCommand: 'docker pull registry.khulnasoft.com/ai-gateway:v1.9.0',
    license: 'Apache-2.0',
    supportedArchitectures: ['linux/amd64', 'linux/arm64']
  },

  // 2. Helm Charts
  {
    id: 'pkg-helm-core-chart',
    name: 'charts/core-api',
    type: 'helm',
    version: '2.4.0',
    repoId: 'repo-core-api',
    repoName: 'khulnasoft/core-api',
    sizeMB: 0.8,
    downloadCount: 42100,
    tags: ['stable', 'v2.4.0'],
    sbomCount: 8,
    signedStatus: 'COSIGN_VERIFIED',
    provenanceDigest: 'sha256:7a8101293b4c5d6e7f8a9b0c1d2e3f4a',
    createdAt: '12 mins ago',
    description: 'Production-ready Helm chart with HPA auto-scaling, Istio VirtualServices, and PodDisruptionBudgets.',
    pullCommand: 'helm install core-api https://registry.khulnasoft.com/helm/charts --version 2.4.0',
    downloadUrl: 'https://registry.khulnasoft.com/helm/charts/core-api-2.4.0.tgz',
    license: 'Apache-2.0'
  },
  {
    id: 'pkg-helm-k8s-operator',
    name: 'charts/khulnasoft-operator',
    type: 'helm',
    version: '1.2.1',
    repoId: 'repo-k8s-operator',
    repoName: 'khulnasoft/k8s-operator',
    sizeMB: 1.2,
    downloadCount: 18900,
    tags: ['stable', 'v1.2.1'],
    sbomCount: 12,
    signedStatus: 'COSIGN_VERIFIED',
    provenanceDigest: 'sha256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    createdAt: '1 hour ago',
    description: 'Custom Kubernetes Controller CRD deployment chart for automated cloud cluster provisioning.',
    pullCommand: 'helm install operator https://registry.khulnasoft.com/helm/charts --version 1.2.1',
    downloadUrl: 'https://registry.khulnasoft.com/helm/charts/khulnasoft-operator-1.2.1.tgz',
    license: 'Apache-2.0'
  },

  // 3. Python (PyPI)
  {
    id: 'pkg-python-sdk',
    name: 'khulnasoft-sdk',
    type: 'pypi',
    version: '2.4.0',
    repoId: 'repo-core-api',
    repoName: 'khulnasoft/core-api',
    sizeMB: 4.2,
    downloadCount: 312000,
    tags: ['py3-none-any', 'pypi'],
    sbomCount: 18,
    signedStatus: 'COSIGN_VERIFIED',
    provenanceDigest: 'sha256:9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c',
    createdAt: '1 day ago',
    description: 'Official Python client library for KhulnaSoft API, AI Agent pipelines, and eBPF kernel telemetry feeds.',
    pullCommand: 'pip install --index-url https://registry.khulnasoft.com/pypi/simple khulnasoft-sdk==2.4.0',
    license: 'MIT',
    codeSnippet: `from khulnasoft import KhulnaSoftClient

client = KhulnaSoftClient(api_key="kh_live_...")
response = client.ai.generate_runbook(service_id="core-api")
print(response.markdown)`
  },

  // 4. Node (npm)
  {
    id: 'pkg-npm-sdk',
    name: '@khulnasoft/sdk',
    type: 'npm',
    version: '2.4.0',
    repoId: 'repo-ai-gateway',
    repoName: 'khulnasoft/ai-gateway',
    sizeMB: 2.1,
    downloadCount: 540000,
    tags: ['latest', 'typescript', 'esm'],
    sbomCount: 14,
    signedStatus: 'COSIGN_VERIFIED',
    provenanceDigest: 'sha256:91f20a3b4c5d6e7f8a9b0c1d2e3f4a5b',
    createdAt: '1 day ago',
    description: 'TypeScript / Node.js SDK for platform API, streaming AI agents, and webhooks integration.',
    pullCommand: 'npm install @khulnasoft/sdk@2.4.0 --registry=https://registry.khulnasoft.com/npm/',
    license: 'MIT',
    codeSnippet: `import { KhulnaSoft } from '@khulnasoft/sdk';

const khulnasoft = new KhulnaSoft({ apiKey: process.env.KHULNASOFT_API_KEY });
const agent = await khulnasoft.ai.getAgent('antigravity');
const stream = await agent.runStream({ prompt: 'Audit security rules' });`
  },

  // 5. Rust (crates.io)
  {
    id: 'pkg-crates-ebpf',
    name: 'khulnasoft-ebpf',
    type: 'crates',
    version: '1.4.0',
    repoId: 'repo-ebpf-agent',
    repoName: 'khulnasoft/ebpf-agent',
    sizeMB: 8.9,
    downloadCount: 88400,
    tags: ['kernel', 'ebpf', 'no_std'],
    sbomCount: 22,
    signedStatus: 'COSIGN_VERIFIED',
    provenanceDigest: 'sha256:3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f',
    createdAt: '3 days ago',
    description: 'High-performance Rust crate for eBPF kernel probe bytecode compilation and XDP packet filter attachment.',
    pullCommand: 'cargo add khulnasoft-ebpf@1.4.0 --registry khulnasoft',
    license: 'MIT OR Apache-2.0',
    codeSnippet: `use khulnasoft_ebpf::{ProbeBuilder, XdpFlags};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let probe = ProbeBuilder::new("eth0")
        .with_flags(XdpFlags::SKB_MODE)
        .load()?;
    println!("eBPF probe attached: ID {}", probe.id());
    Ok(())
}`
  },

  // 6. Go Modules
  {
    id: 'pkg-go-agent',
    name: 'registry.khulnasoft.com/go/ebpf-agent',
    type: 'golang',
    version: 'v1.4.0',
    repoId: 'repo-ebpf-agent',
    repoName: 'khulnasoft/ebpf-agent',
    sizeMB: 12.4,
    downloadCount: 165000,
    tags: ['go1.22', 'v1.4.0'],
    sbomCount: 31,
    signedStatus: 'COSIGN_VERIFIED',
    provenanceDigest: 'sha256:5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a',
    createdAt: '2 days ago',
    description: 'Go module providing Cilium-compatible eBPF telemetry hooks and ring buffer consumer routines.',
    pullCommand: 'go get registry.khulnasoft.com/go/ebpf-agent@v1.4.0',
    license: 'Apache-2.0',
    codeSnippet: `package main

import (
    "fmt"
    "registry.khulnasoft.com/go/ebpf-agent/telemetry"
)

func main() {
    agent, _ := telemetry.NewAgent("eth0")
    agent.Start()
    fmt.Println("KhulnaSoft eBPF Go agent listening...")
}`
  },

  // 7. Binary Downloads
  {
    id: 'pkg-bin-cli-linux',
    name: 'khulnasoft-cli',
    type: 'binary',
    version: 'v2.4.0',
    repoId: 'repo-core-api',
    repoName: 'khulnasoft/core-api',
    sizeMB: 28.5,
    downloadCount: 210000,
    tags: ['linux-amd64', 'linux-arm64', 'darwin-arm64', 'windows-x64'],
    sbomCount: 16,
    signedStatus: 'COSIGN_VERIFIED',
    provenanceDigest: 'sha256:2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c',
    createdAt: '1 hour ago',
    description: 'Standalong cross-platform KhulnaSoft CLI executable for local debugging, pipeline triggering, and SSH tunneling.',
    pullCommand: 'curl -sSL https://registry.khulnasoft.com/cli/install.sh | sh',
    downloadUrl: 'https://registry.khulnasoft.com/binaries/khulnasoft-cli-v2.4.0-linux-amd64.tar.gz',
    license: 'Apache-2.0',
    supportedArchitectures: ['linux/amd64', 'linux/arm64', 'darwin/arm64', 'windows/amd64']
  },

  // 8. SDKs
  {
    id: 'pkg-sdk-unified',
    name: 'KhulnaSoft Multi-Language SDKs',
    type: 'sdk',
    version: 'v2.4.0',
    repoId: 'repo-core-api',
    repoName: 'khulnasoft/core-api',
    sizeMB: 18.2,
    downloadCount: 890000,
    tags: ['ts', 'python', 'go', 'rust', 'java', 'csharp'],
    sbomCount: 28,
    signedStatus: 'COSIGN_VERIFIED',
    provenanceDigest: 'sha256:8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e',
    createdAt: 'Just now',
    description: 'Unified official language bindings for TS, Python, Go, Rust, Java, and C# with auto-generated OpenAPI 3.1 types.',
    pullCommand: 'npm install @khulnasoft/sdk --registry=https://registry.khulnasoft.com/npm/',
    license: 'Apache-2.0',
    codeSnippet: `// TypeScript
import { KhulnaSoft } from '@khulnasoft/sdk';
const client = new KhulnaSoft();

# Python
from khulnasoft import KhulnaSoftClient
client = KhulnaSoftClient()`
  }
];

export const PackageRegistryView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeAuthTab, setActiveAuthTab] = useState<'docker' | 'helm' | 'npm' | 'pypi' | 'crates' | 'go' | 'cli'>('docker');
  const [selectedPkgForModal, setSelectedPkgForModal] = useState<PackageArtifact | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filteredPackages = REGISTRY_PACKAGES.filter((pkg) => {
    const matchesCategory = selectedCategory === 'all' || pkg.type === selectedCategory;
    const matchesSearch = 
      !searchQuery || 
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      pkg.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadge = (type: string) => {
    switch (type) {
      case 'docker':
        return <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono font-bold">Docker / OCI</span>;
      case 'helm':
        return <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono font-bold">Helm Chart</span>;
      case 'pypi':
        return <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold">Python (PyPI)</span>;
      case 'npm':
        return <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-mono font-bold">Node (npm)</span>;
      case 'crates':
        return <span className="px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800 text-[10px] font-mono font-bold">Rust (Cargo)</span>;
      case 'golang':
        return <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold">Go Module</span>;
      case 'binary':
        return <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono font-bold">Binary CLI</span>;
      case 'sdk':
        return <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">Language SDK</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono font-bold">{type}</span>;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Domain Identity */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold mb-1">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 font-black text-sm tracking-wide">registry.khulnasoft.com</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>TLS 1.3 Active</span>
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center space-x-3">
            <Boxes className="w-7 h-7 text-cyan-400" />
            <span>Universal Package & Artifact Registry</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Unified private registry for Docker, Helm, PyPI, npm, Cargo crates, Go modules, binary executables, and official SDKs with Cosign KMS container signatures & SLSA Level 3 build provenance.
          </p>
        </div>

        {/* Global Registry Metrics */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
            <div className="text-[10px] text-slate-500 uppercase">Formats Hosted</div>
            <div className="text-sm font-bold text-cyan-300">8 Package Types</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
            <div className="text-[10px] text-slate-500 uppercase">Cosign KMS Signatures</div>
            <div className="text-sm font-bold text-emerald-400">100% Signed</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
            <div className="text-[10px] text-slate-500 uppercase">Total Pulls</div>
            <div className="text-sm font-bold text-indigo-300">2.48M Monthly</div>
          </div>
        </div>
      </div>

      {/* QUICK SETUP & AUTHENTICATION DRAWER */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Quick Registry Authentication & Configuration</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">Domain: registry.khulnasoft.com</span>
        </div>

        {/* Auth Sub-tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-1 text-xs font-mono">
          {[
            { id: 'docker', label: 'Docker / OCI' },
            { id: 'helm', label: 'Helm' },
            { id: 'pypi', label: 'Python (PyPI)' },
            { id: 'npm', label: 'Node (npm)' },
            { id: 'crates', label: 'Rust (Cargo)' },
            { id: 'go', label: 'Go Modules' },
            { id: 'cli', label: 'CLI Binary' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveAuthTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold shrink-0 ${
                activeAuthTab === tab.id
                  ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Auth Snippet Box */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-200 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Setup Commands for registry.khulnasoft.com:</span>
            <button
              onClick={() => {
                let code = '';
                if (activeAuthTab === 'docker') code = 'docker login registry.khulnasoft.com -u token -p $KHULNASOFT_PAT';
                if (activeAuthTab === 'helm') code = 'helm repo add khulnasoft https://registry.khulnasoft.com/helm/charts';
                if (activeAuthTab === 'pypi') code = 'pip config set global.index-url https://registry.khulnasoft.com/pypi/simple/';
                if (activeAuthTab === 'npm') code = 'npm config set @khulnasoft:registry https://registry.khulnasoft.com/npm/';
                if (activeAuthTab === 'crates') code = 'cargo login $KHULNASOFT_PAT --registry khulnasoft';
                if (activeAuthTab === 'go') code = 'export GOPROXY=https://registry.khulnasoft.com/go,direct';
                if (activeAuthTab === 'cli') code = 'curl -sSL https://registry.khulnasoft.com/cli/install.sh | sh';
                handleCopy('auth-setup', code);
              }}
              className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-bold cursor-pointer"
            >
              {copiedId === 'auth-setup' ? (
                <span className="text-emerald-400 flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>Copied!</span>
                </span>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Configuration</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-200 text-[11px] font-mono">
            {activeAuthTab === 'docker' && (
              <code>docker login registry.khulnasoft.com -u token -p $KHULNASOFT_PAT</code>
            )}
            {activeAuthTab === 'helm' && (
              <code>helm repo add khulnasoft https://registry.khulnasoft.com/helm/charts && helm repo update</code>
            )}
            {activeAuthTab === 'pypi' && (
              <code>pip config set global.index-url https://registry.khulnasoft.com/pypi/simple/</code>
            )}
            {activeAuthTab === 'npm' && (
              <code>npm config set @khulnasoft:registry https://registry.khulnasoft.com/npm/</code>
            )}
            {activeAuthTab === 'crates' && (
              <code>cargo login $KHULNASOFT_PAT --registry khulnasoft</code>
            )}
            {activeAuthTab === 'go' && (
              <code>export GOPROXY=https://registry.khulnasoft.com/go,direct</code>
            )}
            {activeAuthTab === 'cli' && (
              <code>curl -sSL https://registry.khulnasoft.com/cli/install.sh | sh</code>
            )}
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search packages by name, description, format, tags..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Format Selector Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0">
          <span className="text-slate-500 font-bold text-[10px] uppercase mr-1">Category:</span>
          {[
            { id: 'all', label: 'All' },
            { id: 'docker', label: 'Docker' },
            { id: 'helm', label: 'Helm' },
            { id: 'pypi', label: 'Python' },
            { id: 'npm', label: 'Node' },
            { id: 'crates', label: 'Rust' },
            { id: 'golang', label: 'Go' },
            { id: 'binary', label: 'Binaries' },
            { id: 'sdk', label: 'SDKs' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* PACKAGES CATALOG GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header Title & Badges */}
              <div className="flex items-start justify-between">
                <div>
                  {getCategoryBadge(pkg.type)}
                  <h3 className="font-mono font-black text-base text-slate-100 mt-2 truncate max-w-[220px]">
                    {pkg.name}
                  </h3>
                  <div className="text-xs font-mono text-cyan-300 font-bold mt-0.5">
                    {pkg.version}
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-1">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>COSIGN SIGNED</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {pkg.sbomCount} Clean SBOM
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {pkg.description}
              </p>

              {/* Pull Command or Code Snippet */}
              {pkg.pullCommand && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                  <div className="text-slate-400 flex items-center justify-between text-[10px]">
                    <span>Installation Command:</span>
                    <button
                      onClick={() => handleCopy(pkg.id, pkg.pullCommand!)}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer font-bold"
                    >
                      {copiedId === pkg.id ? (
                        <span className="text-emerald-400 flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Copied!</span>
                        </span>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-slate-200 bg-slate-900/90 p-2 rounded-lg border border-slate-800/80 text-[10px] font-mono truncate select-all">
                    {pkg.pullCommand}
                  </div>
                </div>
              )}

              {/* Download executable button for binaries / charts */}
              {pkg.downloadUrl && (
                <a
                  href={pkg.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Download Direct Executable / Archive</span>
                </a>
              )}
            </div>

            {/* Bottom Footer Stats & Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <div className="flex items-center space-x-3">
                <span>Size: <strong className="text-slate-200">{pkg.sizeMB} MB</strong></span>
                <span>Pulls: <strong className="text-cyan-300">{pkg.downloadCount.toLocaleString()}</strong></span>
              </div>

              <button
                onClick={() => setSelectedPkgForModal(pkg)}
                className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-bold cursor-pointer"
              >
                <span>Inspect Package</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* INSPECTOR MODAL */}
      {selectedPkgForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 font-mono text-xs shadow-2xl relative">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  {getCategoryBadge(selectedPkgForModal.type)}
                  <span className="text-slate-500">•</span>
                  <span className="text-cyan-400 font-bold">{selectedPkgForModal.version}</span>
                </div>
                <h3 className="text-xl font-black text-slate-100 mt-1">{selectedPkgForModal.name}</h3>
              </div>

              <button
                onClick={() => setSelectedPkgForModal(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-300 leading-relaxed text-xs">
              {selectedPkgForModal.description}
            </p>

            {/* Cosign KMS Signature Verification Digest */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="text-emerald-400 font-bold flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Cosign KMS Hardware Signature & SLSA Provenance Digest</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                Digest: <span className="text-slate-200 font-bold">{selectedPkgForModal.provenanceDigest}</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Signer Identity: <span className="text-cyan-300">keyless.kms.khulnasoft.io/release-signer</span>
              </div>
            </div>

            {/* Code Snippet if Available */}
            {selectedPkgForModal.codeSnippet && (
              <div className="space-y-1">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Usage Code Example</div>
                <pre className="p-3 rounded-xl bg-slate-950 text-cyan-200 text-[11px] leading-relaxed border border-slate-800 overflow-x-auto">
                  {selectedPkgForModal.codeSnippet}
                </pre>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedPkgForModal(null)}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
