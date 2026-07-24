import React, { useState, useEffect } from 'react';
import { 
  Github, 
  Workflow, 
  Cpu, 
  Container, 
  FileCode, 
  ShieldCheck, 
  Package, 
  Rocket, 
  CheckCircle2, 
  Clock, 
  Play, 
  RotateCcw, 
  Server, 
  Globe, 
  HardDrive, 
  Radio, 
  Cloud, 
  Terminal, 
  Activity, 
  ChevronRight, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowDown, 
  ArrowRight,
  Layers,
  AlertTriangle,
  Lock,
  Boxes,
  Zap
} from 'lucide-react';
import { MOCK_REPOSITORIES } from '../data/mockData';
import { DeploymentHeatmap } from '../components/DeploymentHeatmap';
import { DeploymentGate } from '../components/DeploymentGate';

// 9 Stages of the Production Platform Pipeline
export interface PipelineStage {
  id: string;
  number: number;
  name: string;
  subtitle: string;
  icon: React.ElementType;
  status: 'passed' | 'running' | 'queued' | 'failed';
  durationSeconds: number;
  logs: string[];
  details: {
    label: string;
    value: string;
  }[];
  artifacts?: string[];
}

// 6 Deployment Targets
export interface TargetPlatform {
  id: 'kubernetes' | 'docker' | 'vm' | 'baremetal' | 'edge' | 'cloud';
  name: string;
  icon: React.ElementType;
  typeBadge: string;
  description: string;
  activeInstances: number;
  region: string;
  uptime: string;
  status: 'healthy' | 'degraded' | 'syncing';
  techStack: string[];
  metrics: {
    cpu: string;
    ram: string;
    latency: string;
  };
  sampleManifest: string;
}

export const ProductionPlatformView: React.FC = () => {
  const [selectedRepo, setSelectedRepo] = useState(MOCK_REPOSITORIES[0]);
  const [selectedStageId, setSelectedStageId] = useState<string>('github');
  const [selectedTargetId, setSelectedTargetId] = useState<'kubernetes' | 'docker' | 'vm' | 'baremetal' | 'edge' | 'cloud'>('kubernetes');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  // Initial stage data generator based on selected repository
  const [stages, setStages] = useState<PipelineStage[]>([
    {
      id: 'github',
      number: 1,
      name: 'GitHub',
      subtitle: 'Source Control & Trigger',
      icon: Github,
      status: 'passed',
      durationSeconds: 2,
      details: [
        { label: 'Event', value: 'push' },
        { label: 'Branch', value: 'main' },
        { label: 'Commit SHA', value: selectedRepo.lastCommit.sha },
        { label: 'Committer', value: selectedRepo.lastCommit.author }
      ],
      logs: [
        `[00:00:01] Received webhook from github.com/${selectedRepo.org}/${selectedRepo.name}`,
        `[00:00:01] Trigger commit: "${selectedRepo.lastCommit.message}"`,
        `[00:00:02] Verified GPG signature for author ${selectedRepo.lastCommit.author}`,
        `[00:00:02] Webhook event dispatch OK -> github-actions.runner.khulnasoft.internal`
      ]
    },
    {
      id: 'github-actions',
      number: 2,
      name: 'GitHub Actions',
      subtitle: 'Workflow Orchestration',
      icon: Workflow,
      status: 'passed',
      durationSeconds: 4,
      details: [
        { label: 'Workflow', value: '.github/workflows/production-release.yml' },
        { label: 'Runner Matrix', value: 'ubuntu-22.04-ephemeral' },
        { label: 'Job ID', value: 'job-984210' },
        { label: 'Secret Store', value: 'Vault OIDC' }
      ],
      logs: [
        `[00:00:02] Initializing GitHub Actions runner pool (3 parallel jobs)`,
        `[00:00:03] Authenticating with HashiCorp Vault via OIDC token...`,
        `[00:00:04] Injected build secrets: GCR_WRITE_TOKEN, COSIGN_PRIVATE_KEY`,
        `[00:00:05] Workflow matrix dispatched to Build Farm cluster`
      ]
    },
    {
      id: 'build-farm',
      number: 3,
      name: 'Build Farm',
      subtitle: 'Distributed Runners',
      icon: Cpu,
      status: 'passed',
      durationSeconds: 12,
      details: [
        { label: 'Cluster', value: 'build-farm-us-central1' },
        { label: 'Nodes Allocated', value: '4 x c3-highcpu-16' },
        { label: 'Cache Engine', value: 'Bazel Remote Cache' },
        { label: 'Cache Hit Rate', value: '94.2%' }
      ],
      logs: [
        `[00:00:05] Provisioned pod build-runner-pod-7x9q in GKE Build Farm`,
        `[00:00:07] Restoring Bazel / BuildKit layer cache from Google Cloud Storage`,
        `[00:00:10] Cache hit: 1,420 compilation artifacts reused (saved 4.2 minutes)`,
        `[00:00:16] Build environment ready: ${selectedRepo.buildSystem} v2.4`
      ]
    },
    {
      id: 'docker-build',
      number: 4,
      name: 'Docker Build',
      subtitle: 'Multi-Arch Container Compilation',
      icon: Container,
      status: 'passed',
      durationSeconds: 28,
      details: [
        { label: 'Engine', value: 'BuildKit v0.13.1' },
        { label: 'Architectures', value: 'linux/amd64, linux/arm64' },
        { label: 'Base Image', value: 'gcr.io/distroless/static-debian12' },
        { label: 'Final Image Size', value: '28.4 MB' }
      ],
      logs: [
        `[00:00:17] Executing docker buildx build --platform linux/amd64,linux/arm64`,
        `[00:00:22] Step 1/8: FROM gcr.io/distroless/static-debian12:nonroot`,
        `[00:00:35] Step 8/8: COPY --from=builder /app/bin/server /server`,
        `[00:00:44] Exported OCI image manifest: sha256:e8f3b92a1... (28.4 MB)`
      ]
    },
    {
      id: 'sbom',
      number: 5,
      name: 'SBOM',
      subtitle: 'Software Bill of Materials',
      icon: FileCode,
      status: 'passed',
      durationSeconds: 6,
      details: [
        { label: 'Generator', value: 'Syft v1.2.0' },
        { label: 'Formats', value: 'SPDX-JSON, CycloneDX v1.5' },
        { label: 'Total Packages', value: '142 cataloged' },
        { label: 'Provenance', value: 'SLSA Level 3 Attestation' }
      ],
      logs: [
        `[00:00:45] Cataloging container filesystem layer dependencies...`,
        `[00:00:48] Syft identified 142 packages (Go modules, OS libraries, SSL certs)`,
        `[00:00:50] Generated sbom.spdx.json (112 KB) & sbom.cyclonedx.json`,
        `[00:00:51] Attached SLSA provenance attestation manifest`
      ],
      artifacts: ['sbom.spdx.json', 'sbom.cyclonedx.json', 'attestation.slsa.json']
    },
    {
      id: 'security-scan',
      number: 6,
      name: 'Security Scan',
      subtitle: 'Vulnerability & SAST Check',
      icon: ShieldCheck,
      status: 'passed',
      durationSeconds: 9,
      details: [
        { label: 'Scanner', value: 'Trivy v0.50 + Semgrep' },
        { label: 'CVE Findings', value: '0 Critical, 0 High' },
        { label: 'License Policy', value: '100% Compliant (Apache 2.0 / MIT)' },
        { label: 'Policy Status', value: 'PASSED (Score 98/100)' }
      ],
      logs: [
        `[00:00:51] Running Trivy vulnerability scanner on OCI image...`,
        `[00:00:54] Scanning OS packages & language dependencies against CVE DB 2026-07-24`,
        `[00:00:57] Vulnerability Report: 0 Critical, 0 High, 2 Low (Accepted)`,
        `[00:01:00] SAST Semgrep analysis complete: 0 secret leaks detected. Security gate: PASSED`
      ],
      artifacts: ['security-report.json', 'trivy-scan.sarif']
    },
    {
      id: 'artifact-store',
      number: 7,
      name: 'Artifact Store',
      subtitle: 'OCI Registry & Signing',
      icon: Package,
      status: 'passed',
      durationSeconds: 7,
      details: [
        { label: 'Registry', value: 'gcr.io/khulnasoft/images' },
        { label: 'Image Digest', value: 'sha256:7f9c2d1...' },
        { label: 'Signing Tool', value: 'Cosign v2.2.0 (Keyless)' },
        { label: 'Transparency Log', value: 'Rekor Log #892104' }
      ],
      logs: [
        `[00:01:00] Pushing image gcr.io/khulnasoft/${selectedRepo.name}:v1.8.4 to Registry`,
        `[00:01:04] Cosign signing container image with OIDC identity certificate`,
        `[00:01:06] Published signature attestation to Rekor public transparency log`,
        `[00:01:07] Image immutably tagged and verified in Harbor Artifact Registry`
      ],
      artifacts: ['gcr.io/khulnasoft/images:v1.8.4', 'cosign.sig']
    },
    {
      id: 'deployment',
      number: 8,
      name: 'Deployment',
      subtitle: 'GitOps Progressive Rollout',
      icon: Rocket,
      status: 'passed',
      durationSeconds: 15,
      details: [
        { label: 'Engine', value: 'ArgoCD GitOps v2.10' },
        { label: 'Strategy', value: 'Canary (10% -> 50% -> 100%)' },
        { label: 'Auto-Rollback', value: 'Prometheus SLA Enabled' },
        { label: 'Sync Status', value: 'Synced & Healthy' }
      ],
      logs: [
        `[00:01:07] ArgoCD detected commit update in gitops-manifests repository`,
        `[00:01:10] Initiating Canary rollout to GKE Production cluster...`,
        `[00:01:15] Traffic Split: 10% Canary / 90% Stable. Monitoring latency metrics...`,
        `[00:01:22] Canary metrics green (0 error rate, p99 1.4ms). Promoted to 100% Traffic.`
      ]
    },
    {
      id: 'production',
      number: 9,
      name: 'Production',
      subtitle: 'Live Healthy Target Cluster',
      icon: Globe,
      status: 'passed',
      durationSeconds: 0,
      details: [
        { label: 'Status', value: '100% Operational' },
        { label: 'Replicas', value: '42 Pods across 3 Zones' },
        { label: 'Service Mesh', value: 'Cilium eBPF mTLS' },
        { label: 'Observability', value: 'OpenTelemetry Spans Live' }
      ],
      logs: [
        `[00:01:22] Production deployment healthy across all 6 deployment targets`,
        `[00:01:23] Ingress router serving traffic on https://api.khulnasoft.com`,
        `[00:01:23] eBPF kernel probes actively monitoring network syscalls`,
        `[00:01:23] Deployment pipeline completed successfully in 1m 23s.`
      ]
    }
  ]);

  // Update pipeline stages when selected repository changes
  useEffect(() => {
    setStages(prevStages => prevStages.map(stg => {
      if (stg.id === 'github') {
        return {
          ...stg,
          details: [
            { label: 'Event', value: 'push' },
            { label: 'Branch', value: 'main' },
            { label: 'Commit SHA', value: selectedRepo.lastCommit.sha },
            { label: 'Committer', value: selectedRepo.lastCommit.author }
          ],
          logs: [
            `[00:00:01] Received webhook from github.com/${selectedRepo.org}/${selectedRepo.name}`,
            `[00:00:01] Trigger commit: "${selectedRepo.lastCommit.message}"`,
            `[00:00:02] Verified GPG signature for author ${selectedRepo.lastCommit.author}`,
            `[00:00:02] Webhook event dispatch OK -> github-actions.runner.khulnasoft.internal`
          ]
        };
      }
      if (stg.id === 'artifact-store') {
        return {
          ...stg,
          logs: [
            `[00:01:00] Pushing image gcr.io/khulnasoft/${selectedRepo.name}:v1.8.4 to Registry`,
            `[00:01:04] Cosign signing container image with OIDC identity certificate`,
            `[00:01:06] Published signature attestation to Rekor public transparency log`,
            `[00:01:07] Image immutably tagged and verified in Harbor Artifact Registry`
          ]
        };
      }
      return stg;
    }));
  }, [selectedRepo]);

  // Simulate pipeline execution step-by-step
  const handleRunPipelineSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationProgress(0);

    // Reset all stages to queued except first
    setStages(prev => prev.map((s, idx) => ({
      ...s,
      status: idx === 0 ? 'running' : 'queued'
    })));

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < stages.length) {
        const nextStageId = stages[currentStep].id;
        setSelectedStageId(nextStageId);
        setSimulationProgress(Math.round((currentStep / (stages.length - 1)) * 100));

        setStages(prev => prev.map((s, idx) => {
          if (idx < currentStep) return { ...s, status: 'passed' };
          if (idx === currentStep) return { ...s, status: 'running' };
          return { ...s, status: 'queued' };
        }));
      } else {
        clearInterval(interval);
        setStages(prev => prev.map(s => ({ ...s, status: 'passed' })));
        setSimulationProgress(100);
        setIsSimulating(false);
      }
    }, 900);
  };

  // 6 Deployment Targets Specs
  const deploymentTargets: TargetPlatform[] = [
    {
      id: 'kubernetes',
      name: 'Kubernetes Platform',
      icon: Container,
      typeBadge: 'GKE / EKS / AKS',
      description: 'Declarative GitOps cluster management with ArgoCD, Istio service mesh, eBPF security policies, and HPA auto-scaling.',
      activeInstances: 42,
      region: 'US-Central / EU-West / Asia-East',
      uptime: '99.99%',
      status: 'healthy',
      techStack: ['GKE v1.29', 'ArgoCD', 'Helm v3', 'Cilium eBPF', 'Istio mTLS'],
      metrics: {
        cpu: '18% / 128 Cores',
        ram: '34% / 256 GB',
        latency: '1.4 ms p99'
      },
      sampleManifest: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${selectedRepo.name}
  namespace: production
  labels:
    app.kubernetes.io/name: ${selectedRepo.name}
    gitops.khulnasoft.com/synced: "true"
spec:
  replicas: 6
  selector:
    matchLabels:
      app: ${selectedRepo.name}
  template:
    metadata:
      labels:
        app: ${selectedRepo.name}
    spec:
      containers:
      - name: app
        image: gcr.io/khulnasoft/${selectedRepo.name}:v1.8.4
        ports:
        - containerPort: 8080
        resources:
          limits:
            cpu: "2"
            memory: "2Gi"
          requests:
            cpu: "250m"
            memory: "512Mi"`
    },
    {
      id: 'docker',
      name: 'Docker Swarm & Engine',
      icon: Boxes,
      typeBadge: 'Container Runtime',
      description: 'Containerized deployment nodes running isolated Docker Engine runtimes with overlay networks and Healthcheck hooks.',
      activeInstances: 18,
      region: 'Multi-Region DC',
      uptime: '99.95%',
      status: 'healthy',
      techStack: ['Docker v26.0', 'Compose v2', 'Containerd', 'Portainer'],
      metrics: {
        cpu: '24% / 64 Cores',
        ram: '42% / 128 GB',
        latency: '2.1 ms p99'
      },
      sampleManifest: `version: '3.8'
services:
  ${selectedRepo.name}:
    image: gcr.io/khulnasoft/${selectedRepo.name}:v1.8.4
    deploy:
      replicas: 4
      update_config:
        parallelism: 2
        delay: 10s
        order: start-first
      restart_policy:
        condition: on-failure
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=info`
    },
    {
      id: 'vm',
      name: 'Virtual Machines (VM)',
      icon: Server,
      typeBadge: 'IaaS Compute',
      description: 'Hardened cloud VM instances provisioned via Terraform & Packer with systemd process supervision and cloud-init.',
      activeInstances: 12,
      region: 'AWS us-east-1 / GCP us-central1',
      uptime: '99.98%',
      status: 'healthy',
      techStack: ['Ubuntu 24.04 LTS', 'Systemd', 'Terraform', 'Packer AMI', 'Vault'],
      metrics: {
        cpu: '15% / 48 Cores',
        ram: '28% / 96 GB',
        latency: '3.2 ms p99'
      },
      sampleManifest: `# /etc/systemd/system/${selectedRepo.name}.service
[Unit]
Description=Khulnasoft ${selectedRepo.name} Production Service
After=network.target

[Service]
Type=simple
User=khulnasoft
ExecStart=/usr/local/bin/${selectedRepo.name} --config=/etc/${selectedRepo.name}/prod.yaml
Restart=always
RestartSec=5s
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target`
    },
    {
      id: 'baremetal',
      name: 'Bare Metal Servers',
      icon: HardDrive,
      typeBadge: 'Physical Infrastructure',
      description: 'Dedicated high-performance hardware servers with direct kernel network access, NVMe RAID storage, and eBPF acceleration.',
      activeInstances: 8,
      region: 'Equinix Metal / Hetzner DC',
      uptime: '99.999%',
      status: 'healthy',
      techStack: ['Linux Kernel 6.8', 'eBPF Express Data Path (XDP)', 'PXE Boot', 'Ansible'],
      metrics: {
        cpu: '9% / 256 Cores',
        ram: '19% / 512 GB',
        latency: '0.4 ms p99'
      },
      sampleManifest: `# Ansible Playbook: Deploy to Bare Metal Node
- name: Provision Bare Metal Node
  hosts: metal_prod_nodes
  become: yes
  tasks:
    - name: Ensure low-latency Linux kernel parameters
      sysctl:
        name: net.core.somaxconn
        value: '65535'
    - name: Deploy binary artifact
      get_url:
        url: "https://artifacts.khulnasoft.internal/bin/${selectedRepo.name}-v1.8.4"
        dest: "/opt/khulnasoft/bin/${selectedRepo.name}"
        mode: '0755'`
    },
    {
      id: 'edge',
      name: 'Edge Compute Nodes',
      icon: Radio,
      typeBadge: 'Global Edge Network',
      description: 'Sub-10ms global edge nodes running lightweight WebAssembly / K3s runtimes adjacent to end-user locations.',
      activeInstances: 140,
      region: '280 Points of Presence (PoPs)',
      uptime: '99.99%',
      status: 'healthy',
      techStack: ['K3s Edge', 'Wasmtime', 'Cloudflare Workers', 'AWS Greengrass'],
      metrics: {
        cpu: '8% / Distributed',
        ram: '12% / Distributed',
        latency: '8.0 ms Global'
      },
      sampleManifest: `// Edge Node Worker Execution Specification
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    // Sub-10ms edge routing and local cache lookup
    const cache = caches.default;
    let response = await cache.match(request);
    if (!response) {
      response = await fetch("https://origin.khulnasoft.com" + url.pathname, request);
      ctx.waitUntil(cache.put(request, response.clone()));
    }
    return response;
  }
};`
    },
    {
      id: 'cloud',
      name: 'Cloud Serverless',
      icon: Cloud,
      typeBadge: 'PaaS / Serverless',
      description: 'Zero-maintenance serverless containers with instant auto-scaling from 0 to 1,000 requests per second.',
      activeInstances: 64,
      region: 'GCP Cloud Run / AWS Lambda',
      uptime: '100.0%',
      status: 'healthy',
      techStack: ['GCP Cloud Run', 'AWS Lambda', 'Google Cloud Functions', 'KNative'],
      metrics: {
        cpu: 'Auto-scaled',
        ram: 'Auto-scaled',
        latency: '14 ms cold / 1.2 ms warm'
      },
      sampleManifest: `# Google Cloud Run Service Manifest
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: ${selectedRepo.name}-cloudrun
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "1"
        autoscaling.knative.dev/maxScale: "100"
    spec:
      containers:
      - image: gcr.io/khulnasoft/${selectedRepo.name}:v1.8.4
        resources:
          limits:
            memory: 1Gi
            cpu: 1000m`
    }
  ];

  const currentStage = stages.find(s => s.id === selectedStageId) || stages[0];
  const currentTarget = deploymentTargets.find(t => t.id === selectedTargetId) || deploymentTargets[0];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1500);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-800/60 shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold mb-1">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Production Platform End-to-End Delivery Pipeline</span>
              <span className="px-2 py-0.2 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px]">
                Fully Automated
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-100 flex items-center space-x-3">
              <span>Production Platform Orchestrator</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Complete automated software delivery workflow from code check-in to secure multi-target production deployment across Kubernetes, Docker, VM, Bare Metal, Edge, and Cloud.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {/* Repository Selector */}
            <div className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
              <Github className="w-4 h-4 text-slate-400" />
              <select
                value={selectedRepo.id}
                onChange={(e) => {
                  const repo = MOCK_REPOSITORIES.find(r => r.id === e.target.value);
                  if (repo) setSelectedRepo(repo);
                }}
                className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer"
              >
                {MOCK_REPOSITORIES.map(r => (
                  <option key={r.id} value={r.id} className="bg-slate-900 text-slate-200">
                    {r.org}/{r.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleRunPipelineSimulation}
              disabled={isSimulating}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className={`w-4 h-4 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? `Running Pipeline (${simulationProgress}%)...` : 'Run Production Pipeline'}</span>
            </button>
          </div>
        </div>

        {/* Global Progress Bar during Simulation */}
        {isSimulating && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300">
              <span>Simulating Live Build & Deployment for {selectedRepo.org}/{selectedRepo.name}...</span>
              <span>{simulationProgress}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${simulationProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 1: THE PIPELINE WORKFLOW (GitHub -> ... -> Production) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Workflow className="w-5 h-5 text-cyan-400" />
              <span>Production Pipeline Architecture (9 Sequential Stages)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Click any stage to inspect logs, build details, SBOM, and security attestations.</p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Target Repo: <strong className="text-cyan-300">{selectedRepo.org}/{selectedRepo.name}</strong></span>
          </div>
        </div>

        {/* Pipeline Visual Diagram Grid (Horizontal on Large, Scrollable on Small) */}
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center min-w-[1020px] justify-between relative py-2">
            {/* Connecting Line behind nodes */}
            <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-800 -translate-y-1/2 z-0" />

            {stages.map((stg, index) => {
              const Icon = stg.icon;
              const isSelected = selectedStageId === stg.id;
              const isLast = index === stages.length - 1;

              return (
                <div key={stg.id} className="relative z-10 flex items-center">
                  <button
                    onClick={() => setSelectedStageId(stg.id)}
                    className={`flex flex-col items-center p-3 rounded-2xl border transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-cyan-950/90 border-cyan-400 shadow-xl shadow-cyan-500/20 scale-105'
                        : stg.status === 'passed'
                        ? 'bg-slate-950 border-slate-800 hover:border-cyan-500/50'
                        : stg.status === 'running'
                        ? 'bg-indigo-950 border-indigo-400 animate-pulse'
                        : 'bg-slate-950/50 border-slate-800/80 opacity-60'
                    }`}
                  >
                    {/* Circle Stage Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-colors mb-2 ${
                      isSelected
                        ? 'bg-cyan-400 text-slate-950 shadow-md'
                        : stg.status === 'passed'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : stg.status === 'running'
                        ? 'bg-indigo-500 text-slate-950'
                        : 'bg-slate-900 text-slate-500'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="text-center font-mono space-y-0.5">
                      <div className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                        {stg.name}
                      </div>
                      <div className="text-[9px] text-slate-500 font-medium max-w-[85px] truncate">
                        {stg.subtitle}
                      </div>
                      <div className="text-[9px] text-slate-400 pt-0.5">
                        {stg.status === 'passed' && <span className="text-emerald-400">✓ {stg.durationSeconds}s</span>}
                        {stg.status === 'running' && <span className="text-indigo-400 font-bold">Running...</span>}
                        {stg.status === 'queued' && <span className="text-slate-600">Queued</span>}
                      </div>
                    </div>
                  </button>

                  {!isLast && (
                    <div className="mx-1 text-slate-600">
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Stage Inspector Box */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                <currentStage.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-cyan-400 font-bold">Stage {currentStage.number} of 9</span>
                  <span className="text-sm font-bold text-slate-100">• {currentStage.name}</span>
                  <span className="text-xs text-slate-400">({currentStage.subtitle})</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Execution status: <span className="text-emerald-400 font-bold font-mono">PASSED</span> ({currentStage.durationSeconds}s runtime)
                </div>
              </div>
            </div>

            {currentStage.artifacts && currentStage.artifacts.length > 0 && (
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="text-slate-400">Generated Artifacts:</span>
                {currentStage.artifacts.map((art, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800 text-[11px]">
                    {art}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Metadata Grid & Log Terminal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Stage Attributes */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 space-y-3 font-mono text-xs">
              <div className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                Stage Specifications
              </div>
              <div className="space-y-2">
                {currentStage.details.map((d, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-slate-800/50 pb-1.5">
                    <span className="text-slate-400">{d.label}:</span>
                    <span className="text-cyan-300 font-bold truncate max-w-[170px]">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal Stdout Logs */}
            <div className="lg:col-span-2 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-slate-800">
                <span className="flex items-center space-x-1.5 text-cyan-300 font-bold">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Terminal Logs — {currentStage.name}</span>
                </span>
                <span className="text-[10px] text-slate-500">stdout/stderr</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-slate-300 text-[11px] space-y-1 overflow-x-auto max-h-40 leading-relaxed">
                {currentStage.logs.map((log, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-slate-600 select-none">$</span>
                    <span className="text-slate-300">{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: DEPLOYMENT ACTIVITY HEATMAP */}
      <DeploymentHeatmap />

      {/* SECTION 3: MULTI-FACTOR DEPLOYMENT GATE */}
      <DeploymentGate />

      {/* SECTION 4: DEPLOYMENT TARGETS (Kubernetes, Docker, VM, Bare Metal, Edge, Cloud) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-100 flex items-center space-x-2">
              <Server className="w-5 h-5 text-indigo-400" />
              <span>Production Deployment Targets (6 Target Environments)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              The platform orchestrator supports unified target deployment across container, virtual, bare metal, edge, and serverless runtimes.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>All 6 Deployment Targets Online & Synced</span>
          </div>
        </div>

        {/* 6 Target Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {deploymentTargets.map((target) => {
            const Icon = target.icon;
            const isSelected = selectedTargetId === target.id;

            return (
              <div
                key={target.id}
                onClick={() => setSelectedTargetId(target.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 group ${
                  isSelected
                    ? 'bg-gradient-to-b from-indigo-950/80 to-slate-950 border-indigo-500 shadow-xl shadow-indigo-950/40 ring-1 ring-indigo-400'
                    : 'bg-slate-950/80 hover:bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-indigo-500 text-slate-950' : 'bg-slate-900 text-cyan-400 border border-slate-800'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {target.name}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400">{target.typeBadge}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {target.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {target.description}
                </p>

                <div className="pt-2 border-t border-slate-900 grid grid-cols-3 gap-2 text-[10px] font-mono text-center">
                  <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                    <div className="text-slate-500">Active</div>
                    <div className="text-cyan-300 font-bold">{target.activeInstances}</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                    <div className="text-slate-500">Latency</div>
                    <div className="text-emerald-400 font-bold">{target.metrics.latency}</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900/80 border border-slate-800">
                    <div className="text-slate-500">Uptime</div>
                    <div className="text-indigo-300 font-bold">{target.uptime}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Target Inspector & Deployment Manifest Viewer */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800">
                <currentTarget.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">{currentTarget.name} — Target Spec Inspector</h3>
                <p className="text-xs text-slate-400">Region: {currentTarget.region} • Stack: {currentTarget.techStack.join(', ')}</p>
              </div>
            </div>

            <button
              onClick={() => handleCopyCode(currentTarget.sampleManifest)}
              className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono cursor-pointer shrink-0"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Manifest Copied!' : 'Copy Deployment Spec'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Live Metrics */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs font-mono">
              <div className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                Target Node Health
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">CPU Usage:</span>
                  <span className="text-emerald-400 font-bold">{currentTarget.metrics.cpu}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">RAM Usage:</span>
                  <span className="text-cyan-400 font-bold">{currentTarget.metrics.ram}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">p99 Latency:</span>
                  <span className="text-indigo-300 font-bold">{currentTarget.metrics.latency}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px]">
                <div className="text-slate-400 mb-1">Supported Tech Stack:</div>
                <div className="flex flex-wrap gap-1">
                  {currentTarget.techStack.map((tech, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[10px]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Code / YAML / Config Manifest Box */}
            <div className="lg:col-span-2 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-slate-800">
                <span className="text-cyan-300 font-bold">Auto-Generated Production Deployment Spec</span>
                <span className="text-[10px] text-slate-500">YAML / HCL / Bash</span>
              </div>

              <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 text-cyan-200 text-[11px] overflow-x-auto leading-relaxed max-h-56">
                {currentTarget.sampleManifest}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
