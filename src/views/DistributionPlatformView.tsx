import React, { useState, useEffect } from 'react';
import { 
  Tag, 
  Workflow, 
  CheckCircle2, 
  ShieldCheck, 
  Package, 
  Send, 
  FileText, 
  Bell, 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  ExternalLink, 
  Globe, 
  Sparkles, 
  Clock, 
  Container, 
  Terminal, 
  Search, 
  Filter, 
  Sliders, 
  CheckSquare, 
  XSquare, 
  ChevronRight, 
  Lock, 
  Cpu, 
  Layers, 
  Share2, 
  Download, 
  Boxes, 
  Code2, 
  GitCommit, 
  AlertCircle,
  Radio,
  Zap,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus
} from 'lucide-react';
import { MOCK_REPOSITORIES } from '../data/mockData';
import { 
  ReleasePipelineRun, 
  ReleasePipelineStage, 
  DistributionArtifact, 
  DistributionArtifactType, 
  AutoPublishConfig 
} from '../types';

// Mock Auto-Publish Configs
const INITIAL_AUTO_PUBLISH_CONFIGS: AutoPublishConfig[] = [
  {
    repoId: 'repo-core-api',
    repoName: 'khulnasoft/core-api',
    autoPublishEnabled: true,
    tagPattern: 'v*.*.*',
    requireApproval: false,
    enabledArtifacts: ['docker', 'helm', 'npm', 'github_releases', 'oci'],
    cosignSigningEnabled: true,
    slsaProvenanceEnabled: true,
    slackNotificationChannel: '#releases-core',
    discordWebhookUrl: 'https://discord.com/api/webhooks/123/releases'
  },
  {
    repoId: 'repo-ai-gateway',
    repoName: 'khulnasoft/ai-gateway',
    autoPublishEnabled: true,
    tagPattern: 'v*.*.*',
    requireApproval: false,
    enabledArtifacts: ['docker', 'npm', 'pypi', 'github_releases', 'oci'],
    cosignSigningEnabled: true,
    slsaProvenanceEnabled: true,
    slackNotificationChannel: '#releases-ai',
    discordWebhookUrl: 'https://discord.com/api/webhooks/124/releases'
  },
  {
    repoId: 'repo-ebpf-agent',
    repoName: 'khulnasoft/ebpf-agent',
    autoPublishEnabled: true,
    tagPattern: 'v*.*.*',
    requireApproval: true,
    enabledArtifacts: ['docker', 'crates', 'go', 'github_releases', 'oci'],
    cosignSigningEnabled: true,
    slsaProvenanceEnabled: true,
    slackNotificationChannel: '#releases-infra',
    discordWebhookUrl: 'https://discord.com/api/webhooks/125/releases'
  },
  {
    repoId: 'repo-knowledge-graph',
    repoName: 'khulnasoft/knowledge-graph',
    autoPublishEnabled: false,
    tagPattern: 'v*.*.*-release',
    requireApproval: true,
    enabledArtifacts: ['docker', 'helm', 'npm', 'oci'],
    cosignSigningEnabled: false,
    slsaProvenanceEnabled: true,
    slackNotificationChannel: '#releases-data',
    discordWebhookUrl: ''
  }
];

// Initial Release Pipeline Runs
const INITIAL_PIPELINE_RUNS: ReleasePipelineRun[] = [
  {
    id: 'rel-run-201',
    repoId: 'repo-core-api',
    repoName: 'khulnasoft/core-api',
    tag: 'v2.4.0',
    commitSha: 'a71f92b',
    author: 'alex.dev',
    triggeredBy: 'Git Tag Push (v2.4.0)',
    startedAt: '2026-07-24T06:12:00Z',
    completedAt: '2026-07-24T06:15:32Z',
    status: 'passed',
    stages: [
      {
        id: 'tag',
        name: '1. Tag',
        subtitle: 'Git Tag Event & SemVer Validation',
        status: 'passed',
        durationSeconds: 2,
        summary: 'Tag v2.4.0 verified & GPG signature validated',
        logs: [
          '[00:00:01] Received tag push event: refs/tags/v2.4.0',
          '[00:00:01] Validated Semantic Versioning rule: 2.4.0',
          '[00:00:02] Verified GPG key ID 0x3F82A109 for tagger alex.dev',
          '[00:00:02] Triggering automated release pipeline rel-run-201'
        ]
      },
      {
        id: 'ci',
        name: '2. CI',
        subtitle: 'Cross-Platform Compilation Matrix',
        status: 'passed',
        durationSeconds: 45,
        summary: 'Built binaries for linux/amd64, linux/arm64, darwin/arm64',
        logs: [
          '[00:00:03] Starting build matrix (Go 1.22, Node.js 20)',
          '[00:00:15] Compiled linux/amd64 binary (size: 42.1MB)',
          '[00:00:28] Compiled linux/arm64 binary (size: 40.8MB)',
          '[00:00:42] Compiled darwin/arm64 binary (size: 43.5MB)',
          '[00:00:45] CI cross-compilation matrix completed successfully'
        ]
      },
      {
        id: 'tests',
        name: '3. Tests',
        subtitle: 'Unit, Integration & E2E Test Suite',
        status: 'passed',
        durationSeconds: 38,
        summary: '412/412 tests passed (Code Coverage: 92.4%)',
        logs: [
          '[00:00:46] Running unit tests via jest & go test...',
          '[00:00:65] Unit tests: 348 passed, 0 failed',
          '[00:00:72] Integration tests: 64 passed, 0 failed',
          '[00:00:84] Code coverage calculated: 92.4% (Threshold: 85%)'
        ]
      },
      {
        id: 'security',
        name: '4. Security',
        subtitle: 'SAST, Container Scanning & Cosign Sign',
        status: 'passed',
        durationSeconds: 28,
        summary: '0 Vulnerabilities (Trivy/Grype). Cosign KMS Signed',
        logs: [
          '[00:00:85] Executing Trivy SAST scanner on workspace...',
          '[00:00:95] Container image vulnerability scan: 0 Critical, 0 High, 2 Low',
          '[00:01:05] Cosign KMS signing container manifest with key aws-kms://arn:aws:kms...',
          '[00:01:13] Cosign signature attached to image digest sha256:8f2a91b...'
        ]
      },
      {
        id: 'package',
        name: '5. Package',
        subtitle: 'Multi-Format Bundling & SLSA L3 Provenance',
        status: 'passed',
        durationSeconds: 22,
        summary: 'Generated Docker, Helm, npm, PyPI, OCI & GitHub Release assets',
        logs: [
          '[00:01:14] Generating Helm Chart package core-api-2.4.0.tgz',
          '[00:01:20] Packaging npm module @khulnasoft/core-api@2.4.0',
          '[00:01:28] Bundling SLSA Level 3 build provenance attestation',
          '[00:01:36] Artifact packaging complete (6 target formats)'
        ]
      },
      {
        id: 'publish',
        name: '6. Publish',
        subtitle: 'Automated Registry Dispatch',
        status: 'passed',
        durationSeconds: 30,
        summary: 'Published to GHCR, Docker Hub, Helm Registry, npm, PyPI',
        logs: [
          '[00:01:37] Pushed ghcr.io/khulnasoft/core-api:v2.4.0 (OCI)',
          '[00:01:48] Published @khulnasoft/core-api@2.4.0 to registry.npmjs.org',
          '[00:01:55] Uploaded Helm chart to helm.khulnasoft.io/charts',
          '[00:02:07] All 6 registry publication tasks returned 200 OK'
        ]
      },
      {
        id: 'release_notes',
        name: '7. Release Notes',
        subtitle: 'AI Release Notes & Changelog Synthesis',
        status: 'passed',
        durationSeconds: 12,
        summary: 'Synthesized 14 commits & 3 pull requests into changelog',
        logs: [
          '[00:02:08] Parsing Git log delta between v2.3.9 and v2.4.0...',
          '[00:02:14] Gemini 3.6 Pro AI generating release highlights...',
          '[00:02:20] Generated Markdown CHANGELOG with contributor credits'
        ]
      },
      {
        id: 'announcement',
        name: '8. Announcement',
        subtitle: 'Multi-Channel Dispatch',
        status: 'passed',
        durationSeconds: 15,
        summary: 'Broadcasted to Slack (#releases-core), Discord & Webhooks',
        logs: [
          '[00:02:21] Dispatched Slack webhook to #releases-core (HTTP 200)',
          '[00:02:28] Sent Discord announcement card (HTTP 200)',
          '[00:02:35] Triggered outbound downstream webhook endpoints',
          '[00:02:36] Distribution Pipeline rel-run-201 completed successfully!'
        ]
      }
    ],
    publishedArtifacts: [
      {
        id: 'art-1',
        type: 'docker',
        name: 'khulnasoft/core-api',
        version: 'v2.4.0',
        registryUrl: 'https://hub.docker.com/r/khulnasoft/core-api',
        pullCommand: 'docker pull khulnasoft/core-api:v2.4.0',
        sizeBytes: 42100000,
        digest: 'sha256:8f2a91b490f84a1e9c2d1538a7b9c03f',
        cosignSigned: true,
        slsaProvenanceLevel: 3,
        downloadCount: 1420,
        publishedAt: '2026-07-24T06:15:00Z'
      },
      {
        id: 'art-2',
        type: 'oci',
        name: 'ghcr.io/khulnasoft/core-api',
        version: 'v2.4.0',
        registryUrl: 'https://ghcr.io/khulnasoft/core-api',
        pullCommand: 'docker pull ghcr.io/khulnasoft/core-api:v2.4.0',
        sizeBytes: 42100000,
        digest: 'sha256:91b490f84a1e9c2d1538a7b9c03f8f2a',
        cosignSigned: true,
        slsaProvenanceLevel: 3,
        downloadCount: 980,
        publishedAt: '2026-07-24T06:15:05Z'
      },
      {
        id: 'art-3',
        type: 'helm',
        name: 'core-api',
        version: '2.4.0',
        registryUrl: 'https://helm.khulnasoft.io/charts',
        pullCommand: 'helm install core-api khulnasoft/core-api --version 2.4.0',
        sizeBytes: 14500,
        digest: 'sha256:7391a2b3c4d5e6f7a8b9c0d1e2f3a4b5',
        cosignSigned: true,
        slsaProvenanceLevel: 3,
        downloadCount: 520,
        publishedAt: '2026-07-24T06:15:10Z'
      },
      {
        id: 'art-4',
        type: 'npm',
        name: '@khulnasoft/core-api',
        version: '2.4.0',
        registryUrl: 'https://www.npmjs.com/package/@khulnasoft/core-api',
        pullCommand: 'npm install @khulnasoft/core-api@2.4.0',
        sizeBytes: 380000,
        digest: 'sha256:0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a',
        cosignSigned: true,
        slsaProvenanceLevel: 3,
        downloadCount: 3840,
        publishedAt: '2026-07-24T06:15:15Z'
      },
      {
        id: 'art-5',
        type: 'pypi',
        name: 'khulnasoft-core-api',
        version: '2.4.0',
        registryUrl: 'https://pypi.org/project/khulnasoft-core-api/',
        pullCommand: 'pip install khulnasoft-core-api==2.4.0',
        sizeBytes: 520000,
        digest: 'sha256:a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
        cosignSigned: true,
        slsaProvenanceLevel: 3,
        downloadCount: 1250,
        publishedAt: '2026-07-24T06:15:20Z'
      },
      {
        id: 'art-6',
        type: 'github_releases',
        name: 'core-api binaries',
        version: 'v2.4.0',
        registryUrl: 'https://github.com/khulnasoft/core-api/releases/tag/v2.4.0',
        pullCommand: 'gh release download v2.4.0 --repo khulnasoft/core-api',
        sizeBytes: 126400000,
        digest: 'sha256:f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0',
        cosignSigned: true,
        slsaProvenanceLevel: 3,
        downloadCount: 610,
        publishedAt: '2026-07-24T06:15:25Z'
      }
    ],
    releaseNotesMarkdown: `## 🚀 Release v2.4.0 - Core API Infrastructure

### 🌟 What's New
- **High-Performance gRPC Streaming**: Added bidirectional streaming endpoints for eBPF kernel telemetry feeds.
- **Cosign KMS Integration**: Automated container image signing with AWS KMS / GCP KMS hardware security keys.
- **Zero-Downtime Hot Reloads**: Dynamic route table updates without service pod restarts.

### 🐛 Bug Fixes & Refactors
- Fixed TCP connection leak on high-throughput WebSocket proxying (#342).
- Reduced memory footprint during heavy payload serialization by 18%.

### 🔐 Security & Compliance
- Upgraded dependencies to eliminate CVE-2026-1049.
- Generated SLSA Level 3 build provenance attestations.

***
*Published automatically via KhulnaSoft One Release Pipeline.*`,
    announcementsSent: [
      { channel: 'slack', status: 'sent', target: '#releases-core' },
      { channel: 'discord', status: 'sent', target: 'Webhook #releases' },
      { channel: 'email', status: 'sent', target: 'dev-team@khulnasoft.com' },
      { channel: 'webhook', status: 'sent', target: 'https://api.khulnasoft.io/events/release' }
    ]
  }
];

export const DistributionPlatformView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'artifacts' | 'autopublish' | 'announcements'>('pipeline');
  const [pipelineRuns, setPipelineRuns] = useState<ReleasePipelineRun[]>(INITIAL_PIPELINE_RUNS);
  const [selectedRunId, setSelectedRunId] = useState<string>(INITIAL_PIPELINE_RUNS[0].id);
  const [autoPublishConfigs, setAutoPublishConfigs] = useState<AutoPublishConfig[]>(INITIAL_AUTO_PUBLISH_CONFIGS);
  
  // Interactive Simulation Controls
  const [selectedSimRepo, setSelectedSimRepo] = useState(MOCK_REPOSITORIES[0]);
  const [simTag, setSimTag] = useState('v2.5.0-rc1');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStageIndex, setSimStageIndex] = useState<number>(-1);
  const [copiedArtifactId, setCopiedArtifactId] = useState<string | null>(null);
  
  // Filters
  const [artifactTypeFilter, setArtifactTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentRun = pipelineRuns.find((r) => r.id === selectedRunId) || pipelineRuns[0];

  const handleCopyCommand = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedArtifactId(id);
    setTimeout(() => setCopiedArtifactId(null), 1500);
  };

  // Toggle Auto-Publish for a repo
  const handleToggleAutoPublish = (repoId: string) => {
    setAutoPublishConfigs((prev) =>
      prev.map((c) =>
        c.repoId === repoId ? { ...c, autoPublishEnabled: !c.autoPublishEnabled } : c
      )
    );
  };

  // Trigger New Interactive Release Pipeline
  const handleTriggerReleasePipeline = () => {
    if (isSimulating) return;

    setIsSimulating(true);
    setSimStageIndex(0);

    const newRunId = `rel-run-${Date.now().toString().slice(-4)}`;
    
    // Create new initial running pipeline stage object
    const stageTemplates: ReleasePipelineStage[] = [
      {
        id: 'tag',
        name: '1. Tag',
        subtitle: 'Git Tag Event & SemVer Validation',
        status: 'running',
        durationSeconds: 1,
        summary: `Received git tag ${simTag}`,
        logs: [
          `[00:00:01] Received tag push trigger: refs/tags/${simTag}`,
          `[00:00:01] Validating SemVer rules for ${simTag}...`,
          `[00:00:01] GPG Signature check: PASSED`
        ]
      },
      {
        id: 'ci',
        name: '2. CI',
        subtitle: 'Cross-Platform Compilation Matrix',
        status: 'queued',
        durationSeconds: 0,
        summary: 'Waiting for CI worker node allocation...',
        logs: []
      },
      {
        id: 'tests',
        name: '3. Tests',
        subtitle: 'Unit, Integration & E2E Test Suite',
        status: 'queued',
        durationSeconds: 0,
        summary: 'Queued test suite execution...',
        logs: []
      },
      {
        id: 'security',
        name: '4. Security',
        subtitle: 'SAST, Container Scanning & Cosign Sign',
        status: 'queued',
        durationSeconds: 0,
        summary: 'Queued security scanning...',
        logs: []
      },
      {
        id: 'package',
        name: '5. Package',
        subtitle: 'Multi-Format Bundling & SLSA L3 Provenance',
        status: 'queued',
        durationSeconds: 0,
        summary: 'Queued artifact packaging...',
        logs: []
      },
      {
        id: 'publish',
        name: '6. Publish',
        subtitle: 'Automated Registry Dispatch',
        status: 'queued',
        durationSeconds: 0,
        summary: 'Queued registry dispatch...',
        logs: []
      },
      {
        id: 'release_notes',
        name: '7. Release Notes',
        subtitle: 'AI Release Notes & Changelog Synthesis',
        status: 'queued',
        durationSeconds: 0,
        summary: 'Queued release notes synthesis...',
        logs: []
      },
      {
        id: 'announcement',
        name: '8. Announcement',
        subtitle: 'Multi-Channel Dispatch',
        status: 'queued',
        durationSeconds: 0,
        summary: 'Queued channel broadcast...',
        logs: []
      }
    ];

    const cleanTag = simTag.replace(/^v/, '');

    const newArtifacts: DistributionArtifact[] = [
      {
        id: `art-sim-1-${Date.now()}`,
        type: 'docker',
        name: selectedSimRepo.name,
        version: simTag,
        registryUrl: `https://hub.docker.com/r/${selectedSimRepo.org}/${selectedSimRepo.name}`,
        pullCommand: `docker pull ${selectedSimRepo.org}/${selectedSimRepo.name}:${simTag}`,
        sizeBytes: 44200000,
        digest: `sha256:${Math.random().toString(16).substring(2, 34)}`,
        cosignSigned: true,
        slsaProvenanceLevel: 3,
        downloadCount: 1,
        publishedAt: new Date().toISOString()
      },
      {
        id: `art-sim-2-${Date.now()}`,
        type: 'helm',
        name: selectedSimRepo.name,
        version: cleanTag,
        registryUrl: `https://helm.khulnasoft.io/charts`,
        pullCommand: `helm install ${selectedSimRepo.name} khulnasoft/${selectedSimRepo.name} --version ${cleanTag}`,
        sizeBytes: 15200,
        digest: `sha256:${Math.random().toString(16).substring(2, 34)}`,
        cosignSigned: true,
        slsaProvenanceLevel: 3,
        downloadCount: 1,
        publishedAt: new Date().toISOString()
      },
      {
        id: `art-sim-3-${Date.now()}`,
        type: 'npm',
        name: `@${selectedSimRepo.org}/${selectedSimRepo.name}`,
        version: cleanTag,
        registryUrl: `https://www.npmjs.com/package/@${selectedSimRepo.org}/${selectedSimRepo.name}`,
        pullCommand: `npm install @${selectedSimRepo.org}/${selectedSimRepo.name}@${cleanTag}`,
        sizeBytes: 410000,
        digest: `sha256:${Math.random().toString(16).substring(2, 34)}`,
        cosignSigned: true,
        slsaProvenanceLevel: 3,
        downloadCount: 1,
        publishedAt: new Date().toISOString()
      },
      {
        id: `art-sim-4-${Date.now()}`,
        type: 'pypi',
        name: `${selectedSimRepo.org}-${selectedSimRepo.name}`,
        version: cleanTag,
        registryUrl: `https://pypi.org/project/${selectedSimRepo.name}/`,
        pullCommand: `pip install ${selectedSimRepo.name}==${cleanTag}`,
        sizeBytes: 580000,
        digest: `sha256:${Math.random().toString(16).substring(2, 34)}`,
        cosignSigned: true,
        slsaProvenanceLevel: 3,
        downloadCount: 1,
        publishedAt: new Date().toISOString()
      },
      {
        id: `art-sim-5-${Date.now()}`,
        type: 'crates',
        name: `${selectedSimRepo.name}`,
        version: cleanTag,
        registryUrl: `https://crates.io/crates/${selectedSimRepo.name}`,
        pullCommand: `cargo add ${selectedSimRepo.name}@${cleanTag}`,
        sizeBytes: 890000,
        digest: `sha256:${Math.random().toString(16).substring(2, 34)}`,
        cosignSigned: true,
        slsaProvenanceLevel: 3,
        downloadCount: 1,
        publishedAt: new Date().toISOString()
      },
      {
        id: `art-sim-6-${Date.now()}`,
        type: 'go',
        name: `github.com/${selectedSimRepo.org}/${selectedSimRepo.name}`,
        version: simTag,
        registryUrl: `https://pkg.go.dev/github.com/${selectedSimRepo.org}/${selectedSimRepo.name}`,
        pullCommand: `go get github.com/${selectedSimRepo.org}/${selectedSimRepo.name}@${simTag}`,
        sizeBytes: 2100000,
        digest: `sha256:${Math.random().toString(16).substring(2, 34)}`,
        cosignSigned: true,
        slsaProvenanceLevel: 3,
        downloadCount: 1,
        publishedAt: new Date().toISOString()
      },
      {
        id: `art-sim-7-${Date.now()}`,
        type: 'github_releases',
        name: `${selectedSimRepo.name} binaries`,
        version: simTag,
        registryUrl: `https://github.com/${selectedSimRepo.org}/${selectedSimRepo.name}/releases/tag/${simTag}`,
        pullCommand: `gh release download ${simTag} --repo ${selectedSimRepo.org}/${selectedSimRepo.name}`,
        sizeBytes: 138000000,
        digest: `sha256:${Math.random().toString(16).substring(2, 34)}`,
        cosignSigned: true,
        slsaProvenanceLevel: 3,
        downloadCount: 1,
        publishedAt: new Date().toISOString()
      },
      {
        id: `art-sim-8-${Date.now()}`,
        type: 'oci',
        name: `ghcr.io/${selectedSimRepo.org}/${selectedSimRepo.name}`,
        version: simTag,
        registryUrl: `https://ghcr.io/${selectedSimRepo.org}/${selectedSimRepo.name}`,
        pullCommand: `docker pull ghcr.io/${selectedSimRepo.org}/${selectedSimRepo.name}:${simTag}`,
        sizeBytes: 44200000,
        digest: `sha256:${Math.random().toString(16).substring(2, 34)}`,
        cosignSigned: true,
        slsaProvenanceLevel: 3,
        downloadCount: 1,
        publishedAt: new Date().toISOString()
      }
    ];

    const newPipelineRun: ReleasePipelineRun = {
      id: newRunId,
      repoId: selectedSimRepo.id,
      repoName: `${selectedSimRepo.org}/${selectedSimRepo.name}`,
      tag: simTag,
      commitSha: selectedSimRepo.lastCommit.sha,
      author: selectedSimRepo.lastCommit.author,
      triggeredBy: `Git Tag Push (${simTag})`,
      startedAt: new Date().toISOString(),
      status: 'running',
      stages: stageTemplates,
      publishedArtifacts: newArtifacts,
      releaseNotesMarkdown: `## 🚀 Release ${simTag} - ${selectedSimRepo.name}

### 🌟 Automated Build Highlights
- Multi-architecture build matrix compiled for x86_64, ARM64, and WASM.
- Published 8 artifact formats automatically (Docker, Helm, npm, PyPI, crates.io, Go modules, GitHub Releases, OCI Images).
- Cosign KMS signature & SLSA Level 3 Provenance verified.

***
*Published automatically via KhulnaSoft One Release Pipeline.*`,
      announcementsSent: [
        { channel: 'slack', status: 'pending', target: '#releases' },
        { channel: 'discord', status: 'pending', target: 'Webhook #releases' },
        { channel: 'email', status: 'pending', target: 'dev-team@khulnasoft.com' },
        { channel: 'webhook', status: 'pending', target: 'https://api.khulnasoft.io/events/release' }
      ]
    };

    setPipelineRuns((prev) => [newPipelineRun, ...prev]);
    setSelectedRunId(newRunId);
  };

  // Step timer for live simulation
  useEffect(() => {
    if (!isSimulating || simStageIndex < 0 || simStageIndex >= 8) return;

    const timer = setTimeout(() => {
      setPipelineRuns((prevRuns) =>
        prevRuns.map((run) => {
          if (run.id !== selectedRunId) return run;

          const updatedStages = [...run.stages];
          
          // Complete current stage
          updatedStages[simStageIndex] = {
            ...updatedStages[simStageIndex],
            status: 'passed',
            durationSeconds: Math.floor(Math.random() * 15) + 5,
            logs: [
              ...updatedStages[simStageIndex].logs,
              `[00:00:05] Stage ${updatedStages[simStageIndex].name} PASSED successfully`
            ]
          };

          // Advance next stage if exists
          if (simStageIndex + 1 < 8) {
            updatedStages[simStageIndex + 1] = {
              ...updatedStages[simStageIndex + 1],
              status: 'running',
              logs: [
                `[00:00:01] Starting ${updatedStages[simStageIndex + 1].name}...`,
                `[00:00:02] Executing workflow step for stage ${updatedStages[simStageIndex + 1].name}`
              ]
            };
          }

          const isFinished = simStageIndex + 1 >= 8;

          return {
            ...run,
            status: isFinished ? 'passed' : 'running',
            completedAt: isFinished ? new Date().toISOString() : undefined,
            stages: updatedStages,
            announcementsSent: isFinished
              ? run.announcementsSent.map((a) => ({ ...a, status: 'sent' as const }))
              : run.announcementsSent
          };
        })
      );

      if (simStageIndex + 1 < 8) {
        setSimStageIndex(simStageIndex + 1);
      } else {
        setIsSimulating(false);
        setSimStageIndex(-1);
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [isSimulating, simStageIndex, selectedRunId]);

  // Artifact Icon helper
  const getArtifactBadge = (type: DistributionArtifactType) => {
    switch (type) {
      case 'docker':
        return <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono font-bold">Docker</span>;
      case 'helm':
        return <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono font-bold">Helm</span>;
      case 'npm':
        return <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-mono font-bold">npm</span>;
      case 'pypi':
        return <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono font-bold">PyPI</span>;
      case 'crates':
        return <span className="px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800 text-[10px] font-mono font-bold">crates.io</span>;
      case 'go':
        return <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold">Go Module</span>;
      case 'github_releases':
        return <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono font-bold">GitHub Release</span>;
      case 'oci':
        return <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">OCI Image</span>;
    }
  };

  // Get all published artifacts across runs
  const allPublishedArtifacts = pipelineRuns.flatMap((r) => r.publishedArtifacts);

  const filteredArtifacts = allPublishedArtifacts.filter((art) => {
    const matchesType = artifactTypeFilter === 'all' || art.type === artifactTypeFilter;
    const matchesSearch = !searchQuery || art.name.toLowerCase().includes(searchQuery.toLowerCase()) || art.version.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold mb-1">
            <Send className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>One Release Pipeline • Zero-Touch Auto Publish</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px]">
              8 Artifact Formats
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center space-x-3">
            <span>Automated Distribution Platform</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            "Every project should publish automatically." Push a git tag to compile, test, sign with Cosign KMS, package SLSA L3 provenance, publish to 8 registries, write release notes, and announce across channels.
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
            <div className="text-[10px] text-slate-500 uppercase">Auto-Publish Repos</div>
            <div className="text-sm font-bold text-emerald-400">3 / 4 Enabled</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
            <div className="text-[10px] text-slate-500 uppercase">Supported Registries</div>
            <div className="text-sm font-bold text-cyan-300">8 Formats</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
            <div className="text-[10px] text-slate-500 uppercase">Cosign KMS Security</div>
            <div className="text-sm font-bold text-indigo-400">SLSA Level 3</div>
          </div>
        </div>
      </div>

      {/* Trigger & Interactive Release Builder Panel */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            <Tag className="w-4 h-4 text-cyan-400" />
            <span>Interactive Tag Release Simulator</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Simulate an automated tag push event to trigger the 8-stage distribution pipeline
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs font-mono">
          {/* Repo selector */}
          <div className="md:col-span-4 space-y-1">
            <label className="text-slate-400 text-[10px] uppercase font-bold">Target Repository</label>
            <select
              value={selectedSimRepo.id}
              onChange={(e) => {
                const found = MOCK_REPOSITORIES.find((r) => r.id === e.target.value);
                if (found) setSelectedSimRepo(found);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-cyan-300 font-bold focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {MOCK_REPOSITORIES.map((repo) => (
                <option key={repo.id} value={repo.id} className="bg-slate-900 text-slate-200">
                  {repo.org}/{repo.name} ({repo.language})
                </option>
              ))}
            </select>
          </div>

          {/* Tag name input */}
          <div className="md:col-span-3 space-y-1">
            <label className="text-slate-400 text-[10px] uppercase font-bold">Release Tag (SemVer)</label>
            <input
              type="text"
              value={simTag}
              onChange={(e) => setSimTag(e.target.value)}
              placeholder="e.g. v2.5.0"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-bold focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Trigger button */}
          <div className="md:col-span-5 flex items-end">
            <button
              onClick={handleTriggerReleasePipeline}
              disabled={isSimulating}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-black px-4 py-2 rounded-xl transition-all shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
            >
              <Play className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? `Publishing Tag ${simTag}...` : `Run One Release Pipeline (${simTag})`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-6 text-xs font-mono font-bold">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`pb-3 transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'pipeline' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Workflow className="w-4 h-4" />
          <span>One Release Pipeline Flow</span>
          <span className="px-1.5 py-0.2 text-[9px] rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            8 Stages
          </span>
        </button>

        <button
          onClick={() => setActiveTab('artifacts')}
          className={`pb-3 transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'artifacts' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Artifacts Catalog</span>
          <span className="px-1.5 py-0.2 text-[9px] rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
            {allPublishedArtifacts.length} Artifacts
          </span>
        </button>

        <button
          onClick={() => setActiveTab('autopublish')}
          className={`pb-3 transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'autopublish' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Auto-Publish Rules</span>
          <span className="px-1.5 py-0.2 text-[9px] rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            Rule Matrix
          </span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`pb-3 transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'announcements' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Release Notes & Broadcasts</span>
        </button>
      </div>

      {/* TAB 1: ONE RELEASE PIPELINE FLOW */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {/* Active Pipeline Selector Header */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center space-x-3">
              <span className="text-slate-500 font-bold uppercase">Select Release Run:</span>
              <select
                value={selectedRunId}
                onChange={(e) => setSelectedRunId(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-cyan-300 font-bold px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
              >
                {pipelineRuns.map((run) => (
                  <option key={run.id} value={run.id} className="bg-slate-900 text-slate-200">
                    {run.repoName} - {run.tag} ({run.status.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-3 text-slate-400">
              <span>Triggered By: <strong className="text-slate-200">{currentRun.triggeredBy}</strong></span>
              <span>Commit: <strong className="text-cyan-300">{currentRun.commitSha}</strong></span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                currentRun.status === 'passed'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : currentRun.status === 'running'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 animate-pulse'
                  : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}>
                {currentRun.status}
              </span>
            </div>
          </div>

          {/* VISUAL PIPELINE FLOW: Tag ↓ CI ↓ Tests ↓ Security ↓ Package ↓ Publish ↓ Release Notes ↓ Announcement */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                  <Workflow className="w-4 h-4 text-cyan-400" />
                  <span>One Release Pipeline Stage Sequence</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Universal release workflow executing automatically upon tag push event
                </p>
              </div>

              <div className="text-xs font-mono text-cyan-400 font-bold">
                Total Duration: {currentRun.stages.reduce((acc, curr) => acc + curr.durationSeconds, 0)}s
              </div>
            </div>

            {/* Stage Diagram Flow Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 relative pt-2">
              {currentRun.stages.map((stage, idx) => {
                const isPassed = stage.status === 'passed';
                const isRunning = stage.status === 'running';

                return (
                  <div
                    key={stage.id}
                    className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 relative transition-all ${
                      isRunning
                        ? 'bg-slate-950 border-cyan-400 shadow-md ring-1 ring-cyan-500/30'
                        : isPassed
                        ? 'bg-slate-950/80 border-emerald-800/80'
                        : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                      <span className="text-slate-400">{idx + 1}</span>
                      {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      {isRunning && <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />}
                      {stage.status === 'queued' && <Clock className="w-3.5 h-3.5 text-slate-600" />}
                    </div>

                    <div className="space-y-0.5">
                      <div className="font-bold text-xs text-slate-200 font-mono truncate">{stage.name}</div>
                      <div className="text-[9px] text-slate-400 truncate">{stage.subtitle}</div>
                    </div>

                    <div className="text-[10px] font-mono font-bold text-cyan-400 pt-1 border-t border-slate-900">
                      {stage.durationSeconds > 0 ? `${stage.durationSeconds}s` : 'Queued'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stage Logs & Details Accordion List */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Stage Execution Logs & Output Details
            </h3>

            <div className="space-y-2">
              {currentRun.stages.map((stage) => (
                <div key={stage.id} className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden text-xs font-mono">
                  <div className="p-3.5 bg-slate-950/80 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        stage.status === 'passed' ? 'bg-emerald-400' : stage.status === 'running' ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'
                      }`} />
                      <span className="font-bold text-slate-200 text-sm">{stage.name}</span>
                      <span className="text-slate-500">— {stage.subtitle}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-slate-400 font-bold">{stage.summary}</span>
                      <span className="text-cyan-400 font-bold">{stage.durationSeconds}s</span>
                    </div>
                  </div>

                  {stage.logs.length > 0 && (
                    <div className="p-3 bg-slate-950 border-t border-slate-800 text-cyan-300 space-y-1 text-[11px] font-mono leading-relaxed overflow-x-auto">
                      {stage.logs.map((logLine, i) => (
                        <div key={i} className="whitespace-pre">{logLine}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ARTIFACTS CATALOG (Docker, Helm, npm, PyPI, crates, Go, GitHub Releases, OCI) */}
      {activeTab === 'artifacts' && (
        <div className="space-y-6">
          {/* Artifact Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search artifacts by package name, version, tag..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
              <span className="text-slate-500 font-bold text-[11px] uppercase mr-1">Format:</span>
              {[
                { id: 'all', label: 'All (8 Formats)' },
                { id: 'docker', label: 'Docker' },
                { id: 'helm', label: 'Helm' },
                { id: 'npm', label: 'npm' },
                { id: 'pypi', label: 'PyPI' },
                { id: 'crates', label: 'crates.io' },
                { id: 'go', label: 'Go Modules' },
                { id: 'github_releases', label: 'GitHub' },
                { id: 'oci', label: 'OCI' }
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setArtifactTypeFilter(fmt.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                    artifactTypeFilter === fmt.id
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Artifact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArtifacts.map((art) => (
              <div
                key={art.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      {getArtifactBadge(art.type)}
                      <h4 className="font-bold text-sm text-slate-100 font-mono mt-2 truncate max-w-[220px]">
                        {art.name}
                      </h4>
                      <div className="text-xs font-mono text-cyan-300 font-bold mt-0.5">
                        {art.version}
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-1">
                      {art.cosignSigned && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>Cosign Signed</span>
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                        SLSA L{art.slsaProvenanceLevel} Provenance
                      </span>
                    </div>
                  </div>

                  {/* Pull Command */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                    <div className="text-slate-400 flex items-center justify-between text-[10px]">
                      <span>Install / Pull Command:</span>
                      <button
                        onClick={() => handleCopyCommand(art.id, art.pullCommand)}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer font-bold"
                      >
                        {copiedArtifactId === art.id ? (
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
                      {art.pullCommand}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <div>
                    Digest: <span className="text-slate-300">{art.digest.substring(0, 16)}...</span>
                  </div>
                  <a
                    href={art.registryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-bold"
                  >
                    <span>Registry</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AUTO-PUBLISH RULES MATRIX ("Every project should publish automatically") */}
      {activeTab === 'autopublish' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Repository Auto-Publish Rule Matrix</span>
            </h3>
            <p className="text-xs text-slate-400">
              Configure automated publication rules for every repository in your organization. When enabled, pushing a tag matching the specified pattern automatically executes the 8-stage distribution pipeline and broadcasts to linked notification channels.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[10px] uppercase font-bold tracking-wider">
                    <th className="py-3 px-4">Repository</th>
                    <th className="py-3 px-4">Auto-Publish Status</th>
                    <th className="py-3 px-4">Tag Pattern</th>
                    <th className="py-3 px-4">Target Artifact Formats</th>
                    <th className="py-3 px-4">Cosign KMS & SLSA</th>
                    <th className="py-3 px-4">Notification Targets</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {autoPublishConfigs.map((cfg) => (
                    <tr key={cfg.repoId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-100">
                        {cfg.repoName}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleAutoPublish(cfg.repoId)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                            cfg.autoPublishEnabled
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {cfg.autoPublishEnabled ? 'ENABLED (Auto-Publish)' : 'DISABLED'}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-cyan-300 font-bold">
                        {cfg.tagPattern}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {cfg.enabledArtifacts.map((art) => getArtifactBadge(art))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1 text-[10px] text-emerald-400 font-bold">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Cosign KMS + SLSA L3</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-slate-400">
                        <div>Slack: <strong className="text-slate-200">{cfg.slackNotificationChannel}</strong></div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleToggleAutoPublish(cfg.repoId)}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-[11px] font-bold cursor-pointer"
                        >
                          Configure
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RELEASE NOTES & BROADCAST ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 Cols: AI Generated Release Notes Markdown */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>AI Automated Release Notes Generator</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono font-bold">
                Gemini 3.6 Pro
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
              {currentRun.releaseNotesMarkdown}
            </div>
          </div>

          {/* Right 5 Cols: Multi-Channel Broadcast Channels */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3">
              <Bell className="w-4 h-4 text-emerald-400" />
              <span>Multi-Channel Announcement Status</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {currentRun.announcementsSent.map((ann, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-200 uppercase">{ann.channel}</div>
                    <div className="text-[10px] text-slate-400">{ann.target}</div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    ann.status === 'sent'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                  }`}>
                    {ann.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
