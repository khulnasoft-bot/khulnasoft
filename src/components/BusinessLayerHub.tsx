import React, { useState } from 'react';
import {
  Building2,
  Code2,
  Users,
  Star,
  Download,
  Rocket,
  Package,
  ShieldCheck,
  BookOpen,
  MapPin,
  DollarSign,
  HeartHandshake,
  TrendingUp,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  GitPullRequest,
  Layers,
  ArrowUpRight,
  Sparkles,
  GitFork,
  Eye,
  Globe,
  Award,
  Zap,
  ChevronRight,
  BarChart3,
  Calendar,
  FileText
} from 'lucide-react';
import { MOCK_REPOSITORIES } from '../data/mockData';

export const BusinessLayerHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'all' | 'repos' | 'contributors' | 'stars' | 'downloads' | 'releases' | 'packages' | 'security' | 'docs' | 'roadmaps' | 'funding' | 'sponsors'
  >('all');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  // Filtered Repositories
  const filteredRepos = MOCK_REPOSITORIES.filter((repo) => {
    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = selectedLanguage === 'all' || repo.language.toLowerCase() === selectedLanguage.toLowerCase();
    return matchesSearch && matchesLang;
  });

  // Comprehensive Contributors List
  const topContributors = [
    { name: 'Aria Thorne', role: 'Staff Systems Architect', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', commits: 342, prs: 88, primaryRepo: 'core-api', bio: 'Specializing in gRPC, Go connection pooling, and Zero-Trust auth.' },
    { name: 'Marcus Chen', role: 'Principal AI Engineer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', commits: 289, prs: 64, primaryRepo: 'ai-gateway', bio: 'Building Gemini API proxying, streaming context, and vector search.' },
    { name: 'Devon Vance', role: 'Lead DevOps Engineer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', commits: 215, prs: 52, primaryRepo: 'k8s-operator', bio: 'Kubernetes CRDs, ArgoCD GitOps pipelines, and Istio service mesh.' },
    { name: 'Elena Rostova', role: 'Senior Security Specialist', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', commits: 180, prs: 41, primaryRepo: 'telemetry-collector', bio: 'Cosign KMS signing, Trivy vulnerability audits, and OPA Rego rules.' },
    { name: 'Sophia Wu', role: 'Full-Stack Lead', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', commits: 194, prs: 46, primaryRepo: 'developer-portal', bio: 'React 19, TypeScript micro-frontends, and real-time WebSockets.' },
    { name: 'Viktor Lindqvist', role: 'Platform Reliability Eng', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', commits: 162, prs: 38, primaryRepo: 'k8s-operator', bio: 'HPA auto-scalers, Prometheus metrics, and OpenTelemetry collector.' },
  ];

  // Releases Data
  const releasesList = [
    { version: 'v2.10.0', date: 'Jul 22, 2026', repo: 'khulnasoft/core-api', tag: 'Latest Release', changelog: 'Added multiplexed gRPC connection pooling & strict OIDC token revocation checks.', downloads: 14200 },
    { version: 'v2.4.2', date: 'Jul 18, 2026', repo: 'khulnasoft/ai-gateway', tag: 'Stable', changelog: 'Upgraded @google/genai SDK to v2.4.0 with Gemini 3.6 Flash streaming thinking controls.', downloads: 28900 },
    { version: 'v1.8.1', date: 'Jul 10, 2026', repo: 'khulnasoft/k8s-operator', tag: 'LTS', changelog: 'Automated ArgoCD GitOps sync with Cosign KMS signed OCI container images.', downloads: 9400 },
  ];

  // Packages Data
  const packagesList = [
    { name: 'ghcr.io/khulnasoft/core-api', type: 'OCI Docker Image', downloads: '840K', version: 'v2.10.0', sbom: 'Clean', signed: true },
    { name: 'helm.khulnasoft.com/platform-charts', type: 'Helm Chart', downloads: '320K', version: 'v1.4.2', sbom: 'Clean', signed: true },
    { name: '@khulnasoft/sdk-typescript', type: 'NPM Package', downloads: '410K', version: 'v2.8.0', sbom: 'Clean', signed: true },
    { name: 'py.khulnasoft.org/khulnasoft-ai', type: 'PyPI Package', downloads: '250K', version: 'v1.9.4', sbom: 'Clean', signed: true },
  ];

  // Roadmaps Initiatives
  const roadmapItems = [
    { quarter: 'Q3 2026', title: 'Zero-Trust OIDC & 7-Stage DevSecOps Pipeline', status: 'Completed', progress: 100, owner: 'Aria Thorne & Elena Rostova' },
    { quarter: 'Q4 2026', title: 'Multi-Region GKE Kubernetes Automatic Failover', status: 'In Progress', progress: 65, owner: 'Devon Vance' },
    { quarter: 'Q1 2027', title: 'AI Code Generation with Real-Time Knowledge Graph Context', status: 'In Progress', progress: 40, owner: 'Marcus Chen' },
    { quarter: 'Q2 2027', title: 'SLSA Level 3 Cryptographic Provenance Certification', status: 'Planned', progress: 15, owner: 'Elena Rostova' },
  ];

  // Corporate Sponsors & Backers
  const sponsorTiers = [
    { tier: 'Diamond Sponsor', price: '$5,000 / mo', sponsors: [{ name: 'Google Cloud Platform', logo: '☁️', note: 'Supporting cloud credits & Gemini API infrastructure' }, { name: 'CNCF Technology Fund', logo: '🌐', note: 'Supporting open-source Kubernetes operators' }] },
    { tier: 'Platinum Sponsor', price: '$2,500 / mo', sponsors: [{ name: 'DevCorp Inc.', logo: '⚡', note: 'Sponsoring enterprise security policy tools' }, { name: 'OpenSource Alliance', logo: '🛡️', note: 'Funding vulnerability audits & SBOM specs' }] },
    { tier: 'Gold Backer', price: '$1,000 / mo', sponsors: [{ name: 'CloudScale Labs', logo: '🚀', note: 'Backing telemetry and tracing frameworks' }, { name: 'DataMesh Systems', logo: '📊', note: 'Sponsoring distributed database drivers' }] },
  ];

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Top Banner Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>KhulnaSoft Organization Business Layer</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px]">
                Enterprise Tier
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">
              Unified Organization Business & Open-Source Dashboard
            </h1>
            <p className="text-xs text-slate-400 max-w-3xl">
              Central operational nexus managing engineering assets, developer community metrics, package distribution, security posture, roadmap initiatives, cloud funding, and sponsorship revenue.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0 font-mono text-xs">
            <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center space-x-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span><strong>4,820</strong> Stars Total</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center space-x-2">
              <Download className="w-4 h-4 text-emerald-400" />
              <span><strong>1.82M</strong> Downloads</span>
            </div>
          </div>
        </div>

        {/* Executive KPI Stats Bar (11 Key Business Pillars) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase flex items-center justify-between">
              <span>Repositories</span>
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-lg font-black text-slate-100 mt-1">18 Repos</div>
            <div className="text-[10px] text-emerald-400 font-bold mt-0.5">100% Private/Public Monitored</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase flex items-center justify-between">
              <span>Contributors</span>
              <Users className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-lg font-black text-slate-100 mt-1">42 Active</div>
            <div className="text-[10px] text-indigo-300 mt-0.5">Across 6 Core Teams</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase flex items-center justify-between">
              <span>Stars</span>
              <Star className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-black text-amber-400 mt-1">4,820 ★</div>
            <div className="text-[10px] text-emerald-400 font-bold mt-0.5">+24% YoY Growth</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase flex items-center justify-between">
              <span>Downloads</span>
              <Download className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-black text-emerald-400 mt-1">1.82M / mo</div>
            <div className="text-[10px] text-slate-400 mt-0.5">4.2 TB Bandwidth</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase flex items-center justify-between">
              <span>Security Score</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-black text-emerald-400 mt-1">94% Pass</div>
            <div className="text-[10px] text-emerald-300 mt-0.5">Trivy & OPA Audited</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase flex items-center justify-between">
              <span>Sponsors ARR</span>
              <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-lg font-black text-rose-300 mt-1">$222K ARR</div>
            <div className="text-[10px] text-slate-400 mt-0.5">$18.5k / month recurring</div>
          </div>
        </div>

        {/* Tab Selector Bar for Quick Module Focus */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pt-2 pb-1 border-t border-slate-800/80 text-xs font-mono scrollbar-none">
          {[
            { id: 'all', label: 'All 11 Modules' },
            { id: 'repos', label: 'Repositories' },
            { id: 'contributors', label: 'Contributors' },
            { id: 'stars', label: 'Stars' },
            { id: 'downloads', label: 'Downloads' },
            { id: 'releases', label: 'Releases' },
            { id: 'packages', label: 'Packages' },
            { id: 'security', label: 'Security' },
            { id: 'docs', label: 'Documentation' },
            { id: 'roadmaps', label: 'Roadmaps' },
            { id: 'funding', label: 'Funding' },
            { id: 'sponsors', label: 'Sponsors' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: REPOSITORIES */}
      {(activeTab === 'all' || activeTab === 'repos') && (
        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <span>1. Repository Portfolio & Code Assets</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Active source code repositories managed under the KhulnaSoft organization namespace.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-500"
                />
              </div>

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-mono focus:border-cyan-500"
              >
                <option value="all">All Languages</option>
                <option value="go">Go</option>
                <option value="typescript">TypeScript</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRepos.map((repo) => (
              <div key={repo.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 text-sm flex items-center space-x-1.5">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <span>{repo.name}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-bold">
                    {repo.language}
                  </span>
                </div>

                <p className="text-slate-400 font-sans text-xs line-clamp-2">{repo.description}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-slate-800/80">
                  <span className="flex items-center space-x-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{repo.starCount}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-slate-400">
                    <GitFork className="w-3.5 h-3.5" />
                    <span>{repo.forkCount}</span>
                  </span>
                  <span className="text-emerald-400 font-bold">
                    Coverage: {repo.testCoverage}%
                  </span>
                  <span className="text-indigo-300">
                    {repo.license}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 2: CONTRIBUTORS */}
      {(activeTab === 'all' || activeTab === 'contributors') && (
        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>2. Core Engineering Contributors & Maintainers</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Top engineers driving commits, pull requests, architectural reviews, and security patches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topContributors.map((c, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3 font-mono text-xs">
                <img src={c.avatar} alt={c.name} className="w-11 h-11 rounded-xl object-cover border border-slate-800 shrink-0" />
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100">{c.name}</span>
                    <span className="text-[10px] text-cyan-300 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">{c.commits} Commits</span>
                  </div>
                  <div className="text-[11px] text-indigo-300 font-sans">{c.role}</div>
                  <p className="text-[11px] text-slate-400 font-sans line-clamp-2">{c.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 3: STARS & COMMUNITY TRACTION */}
      {(activeTab === 'all' || activeTab === 'stars') && (
        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>3. GitHub Stars & Community Engagement</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Repository bookmarking metrics, star acquisition history, and ecosystem growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 text-[11px]">Top Starred Repository</span>
              <div className="text-xl font-black text-amber-400 flex items-center justify-between">
                <span>ai-gateway</span>
                <span>612 ★</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">LLM router & Gemini API context orchestrator.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 text-[11px]">Second Starred Repository</span>
              <div className="text-xl font-black text-amber-400 flex items-center justify-between">
                <span>core-api</span>
                <span>428 ★</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">High-throughput gRPC microservice gateway.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 text-[11px]">Third Starred Repository</span>
              <div className="text-xl font-black text-amber-400 flex items-center justify-between">
                <span>k8s-operator</span>
                <span>310 ★</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">Kubernetes controller & CRD operator.</p>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: DOWNLOADS & BANDWIDTH */}
      {(activeTab === 'all' || activeTab === 'downloads') && (
        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Download className="w-5 h-5 text-emerald-400" />
              <span>4. Global Downloads & Package Consumption</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Binary pulls, OCI container image layer fetches, Helm chart installs, and npm packages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-500">OCI Container Images</div>
              <div className="text-lg font-black text-emerald-400">840,000 / mo</div>
              <div className="text-[10px] text-slate-400">ghcr.io/khulnasoft/*</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-500">NPM / JS SDK Packages</div>
              <div className="text-lg font-black text-emerald-400">410,000 / mo</div>
              <div className="text-[10px] text-slate-400">@khulnasoft/sdk-typescript</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-500">Helm Charts</div>
              <div className="text-lg font-black text-emerald-400">320,000 / mo</div>
              <div className="text-[10px] text-slate-400">helm.khulnasoft.com</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-500">PyPI & Go Modules</div>
              <div className="text-lg font-black text-emerald-400">250,000 / mo</div>
              <div className="text-[10px] text-slate-400">py.khulnasoft.org</div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5: RELEASES */}
      {(activeTab === 'all' || activeTab === 'releases') && (
        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Rocket className="w-5 h-5 text-cyan-400" />
              <span>5. Product Releases & Version Tag History</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Published release artifacts with automated CHANGELOG generation and binary signatures.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {releasesList.map((rel, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-cyan-300 text-sm">{rel.version}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">{rel.tag}</span>
                    <span className="text-slate-500 text-[11px]">({rel.repo})</span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs">{rel.changelog}</p>
                </div>

                <div className="text-right text-[11px] text-slate-400 shrink-0">
                  <div>Released: {rel.date}</div>
                  <div className="text-emerald-400 font-bold">{rel.downloads.toLocaleString()} Downloads</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 6: PACKAGES */}
      {(activeTab === 'all' || activeTab === 'packages') && (
        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Package className="w-5 h-5 text-indigo-400" />
              <span>6. Package Registry & Signed Artifacts</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cryptographically verified OCI images, Helm charts, and language packages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
            {packagesList.map((pkg, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-100 flex items-center space-x-2">
                    <span>{pkg.name}</span>
                    <span className="text-[10px] text-slate-400">({pkg.version})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans">{pkg.type} • {pkg.downloads} Downloads</div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                    Cosign Signed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 7: SECURITY & POLICY */}
      {(activeTab === 'all' || activeTab === 'security') && (
        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>7. Organization Security & Compliance Governance</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Zero secret leaks, zero critical CVEs, and 100% compliant open-source licensing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400">Security Score</span>
              <div className="text-2xl font-black text-emerald-400">94% Pass Rate</div>
              <p className="text-[11px] text-slate-400 font-sans">Strict Trivy CVE scanner & OPA Gatekeeper policy enforcement.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400">Secret Leak Prevention</span>
              <div className="text-2xl font-black text-emerald-400">0 Leaks Detected</div>
              <p className="text-[11px] text-slate-400 font-sans">TruffleHog & Gitleaks pre-commit scanners active.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400">FOSS License Compliance</span>
              <div className="text-2xl font-black text-cyan-300">100% Compliant</div>
              <p className="text-[11px] text-slate-400 font-sans">Permissive Apache-2.0, MIT, and BSD licenses only.</p>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 8: DOCUMENTATION */}
      {(activeTab === 'all' || activeTab === 'docs') && (
        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>8. Organization Documentation & Architecture Specs</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive OpenAPI documentation, architecture decision records (ADRs), and AI documentation generation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-slate-100 flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>OpenAPI v3.0 REST & gRPC Docs</span>
              </div>
              <p className="text-slate-400 font-sans text-xs">Complete endpoint references, request payloads, and auto-generated client SDKs.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-slate-100 flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Architecture Decision Records</span>
              </div>
              <p className="text-slate-400 font-sans text-xs">14 ADRs documenting event-driven architecture, gRPC connection pooling, and OTel.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-slate-100 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI Automated Doc Generator</span>
              </div>
              <p className="text-slate-400 font-sans text-xs">Gemini AI model auto-updates doc pages on every Git commit release.</p>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 9: ROADMAPS */}
      {(activeTab === 'all' || activeTab === 'roadmaps') && (
        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <span>9. Strategic Quarterly Roadmaps & Milestones</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Engineering deliverables, platform feature epics, and target release milestones.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {roadmapItems.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-cyan-300">{item.quarter}</span>
                    <span className="text-slate-100 font-sans text-xs font-bold">{item.title}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    item.status === 'In Progress' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                    'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}>
                    {item.status} ({item.progress}%)
                  </span>
                </div>

                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>

                <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                  <span>Lead Owner: <strong className="text-slate-300">{item.owner}</strong></span>
                  <span>Target Delivery</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 10: FUNDING & BUDGET */}
      {(activeTab === 'all' || activeTab === 'funding') && (
        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>10. Cloud Infrastructure & Open-Source Grants Funding</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cloud compute allocation, Gemini AI API budget, and open-source grant distributions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400">Monthly Cloud Infrastructure Budget</span>
              <div className="text-2xl font-black text-emerald-400">$14,250 / mo</div>
              <p className="text-[11px] text-slate-400 font-sans">Google Cloud Run, GKE Kubernetes clusters, and Cloud SQL PostgreSQL.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400">Open-Source Technology Grant</span>
              <div className="text-2xl font-black text-cyan-300">$150,000 Total</div>
              <p className="text-[11px] text-slate-400 font-sans">CNCF Open Source Technology Fund supporting zero-trust container security.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400">Gemini AI API Tokens Pool</span>
              <div className="text-2xl font-black text-indigo-300">500M Tokens / mo</div>
              <p className="text-[11px] text-slate-400 font-sans">Server-side Gemini 3.6 Flash thinking level API quota allocation.</p>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 11: SPONSORS & BACKERS */}
      {(activeTab === 'all' || activeTab === 'sponsors') && (
        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <HeartHandshake className="w-5 h-5 text-rose-400" />
              <span>11. Organization Corporate Sponsors & Community Backers</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Recurring monthly corporate sponsorships supporting ongoing platform maintenance and security tooling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {sponsorTiers.map((st, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-rose-300">{st.tier}</span>
                  <span className="text-slate-400 text-[11px]">{st.price}</span>
                </div>

                <div className="space-y-2">
                  {st.sponsors.map((sp, sIdx) => (
                    <div key={sIdx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                      <div className="font-bold text-slate-100 flex items-center space-x-2">
                        <span>{sp.logo}</span>
                        <span>{sp.name}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-sans">{sp.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
