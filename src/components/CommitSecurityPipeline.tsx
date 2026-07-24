import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  FileCheck2, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  GitCommit,
  Play,
  RefreshCw,
  Search,
  Check,
  XCircle,
  Clock,
  Layers,
  Container,
  FileCode,
  FileSpreadsheet,
  FileText,
  Server,
  ArrowRight,
  ArrowDown,
  Terminal,
  ChevronDown,
  ChevronUp,
  Download,
  Copy,
  Sparkles,
  Zap,
  Filter,
  Shield,
  BadgeAlert,
  GitBranch,
  Rocket
} from 'lucide-react';

export interface CommitSecurityScanStage {
  id: 'secret-scan' | 'dependency-scan' | 'sbom' | 'license-scan' | 'container-scan' | 'policy-check' | 'deploy';
  name: string;
  shortName: string;
  order: number;
  description: string;
  status: 'PENDING' | 'RUNNING' | 'PASSED' | 'WARNING' | 'BLOCKED';
  durationMs: number;
  findingsCount: number;
  summary: string;
  details: {
    tool: string;
    rulesEvaluated: number;
    logs: string[];
    findings?: Array<{
      id: string;
      severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
      title: string;
      location: string;
      remediation: string;
    }>;
  };
}

export interface CommitRecord {
  sha: string;
  shortSha: string;
  repo: string;
  branch: string;
  author: string;
  avatar: string;
  message: string;
  timestamp: string;
  overallStatus: 'PASSED' | 'BLOCKED' | 'RUNNING';
  stages: CommitSecurityScanStage[];
}

export const MOCK_COMMIT_SCANS: CommitRecord[] = [
  {
    sha: '8f92a10b4c8912d0912f9812a1012938102931a2',
    shortSha: '8f92a10',
    repo: 'khulnasoft/core-api',
    branch: 'main',
    author: 'Aria Thorne',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    message: 'feat(grpc): optimize multiplexed connection pooling & OTel spans',
    timestamp: '12 mins ago',
    overallStatus: 'PASSED',
    stages: [
      {
        id: 'secret-scan',
        name: '1. Secret Scan',
        shortName: 'Secret Scan',
        order: 1,
        description: 'TruffleHog & Gitleaks entropy analysis for leaked API keys, RSA/SSH private keys, GCP/AWS credentials.',
        status: 'PASSED',
        durationMs: 420,
        findingsCount: 0,
        summary: 'Clean: 0 secret leaks or high-entropy credentials detected across 14 modified files.',
        details: {
          tool: 'TruffleHog v3.68 & Gitleaks v8.18',
          rulesEvaluated: 850,
          logs: [
            '[08:40:01] Initializing Git diff entropy scanner for commit 8f92a10...',
            '[08:40:01] Scanning 14 modified source files (+182 -42 lines)...',
            '[08:40:02] Evaluating against 850 active entropy patterns (GCP, AWS, Stripe, RSA, JWT)...',
            '[08:40:02] PASSED: 0 plain-text credentials or high-entropy tokens detected.'
          ]
        }
      },
      {
        id: 'dependency-scan',
        name: '2. Dependency Scan',
        shortName: 'Dependency Scan',
        order: 2,
        description: 'OSV / Snyk / Trivy scan of runtime and dev packages against NVD CVE database.',
        status: 'PASSED',
        durationMs: 890,
        findingsCount: 0,
        summary: '0 Vulnerabilities: All 48 Go & Node runtime dependencies pass CVE audit.',
        details: {
          tool: 'Trivy v0.50 & OSV-Scanner v1.7',
          rulesEvaluated: 142000,
          logs: [
            '[08:40:02] Parsing manifest files: go.mod, go.sum, package.json...',
            '[08:40:03] Cross-referencing 48 dependencies with National Vulnerability Database (NVD)...',
            '[08:40:03] Checking google.golang.org/grpc@v1.62.0 -> SAFE',
            '[08:40:03] Checking go.opentelemetry.io/otel@v1.24.0 -> SAFE',
            '[08:40:03] PASSED: 0 CVEs found (0 Critical, 0 High, 0 Medium, 0 Low).'
          ]
        }
      },
      {
        id: 'sbom',
        name: '3. SBOM Generation',
        shortName: 'SBOM',
        order: 3,
        description: 'Software Bill of Materials export compliant with CycloneDX v1.5 and SPDX v2.3 specs.',
        status: 'PASSED',
        durationMs: 610,
        findingsCount: 0,
        summary: 'Generated CycloneDX v1.5 JSON SBOM manifest (482 components cryptographically hashed).',
        details: {
          tool: 'syft v1.2.0 (CycloneDX v1.5 JSON spec)',
          rulesEvaluated: 482,
          logs: [
            '[08:40:03] Extracting artifact layer signatures & dependency graph nodes...',
            '[08:40:04] Generating SHA-256 cryptographic hashes for 482 build components...',
            '[08:40:04] Formatted output to /artifacts/sbom-8f92a10.cdx.json',
            '[08:40:04] PASSED: SBOM successfully compiled & stored in artifact registry.'
          ]
        }
      },
      {
        id: 'license-scan',
        name: '4. License Scan',
        shortName: 'License Scan',
        order: 4,
        description: 'FOSS open-source legal compliance audit enforcing permissive licenses (MIT, Apache-2.0, BSD).',
        status: 'PASSED',
        durationMs: 340,
        findingsCount: 0,
        summary: '100% Compliant: All components use Apache-2.0, MIT, or BSD-3-Clause. Zero AGPL/GPL copyleft violations.',
        details: {
          tool: 'FOSSA CLI v3.8.1 & LicenseFinder',
          rulesEvaluated: 64,
          logs: [
            '[08:40:04] Auditing licenses for 482 third-party packages...',
            '[08:40:04] Policy: DENY [AGPL-1.0, AGPL-3.0, SSPL, CC-BY-NC]',
            '[08:40:04] Policy: ALLOW [MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC]',
            '[08:40:05] PASSED: All dependencies match enterprise compliance policy.'
          ]
        }
      },
      {
        id: 'container-scan',
        name: '5. Container Scan',
        shortName: 'Container Scan',
        order: 5,
        description: 'Trivy OCI container image vulnerability & rootless container configuration inspection.',
        status: 'PASSED',
        durationMs: 1240,
        findingsCount: 0,
        summary: 'Clean OCI Image: khulnasoft/core-api:8f92a10 built on distroless/static-debian12 with UID 10001 non-root.',
        details: {
          tool: 'Trivy Container Scanner v0.50',
          rulesEvaluated: 18500,
          logs: [
            '[08:40:05] Pulling target OCI image khulnasoft/core-api:8f92a10...',
            '[08:40:05] Inspecting base image layers (distroless/static-debian12)...',
            '[08:40:06] Verifying user privileges: UID=10001 (non-root execution verified)',
            '[08:40:06] Scanning binaries & static libraries for OS vulnerabilities...',
            '[08:40:06] PASSED: Zero critical or high vulnerabilities in OCI container image.'
          ]
        }
      },
      {
        id: 'policy-check',
        name: '6. Policy Check',
        shortName: 'Policy Check',
        order: 6,
        description: 'Open Policy Agent (OPA) Rego policy enforcement for image signatures & security contexts.',
        status: 'PASSED',
        durationMs: 290,
        findingsCount: 0,
        summary: 'OPA Policy Gate: Passed Cosign KMS key signature verification & Kubernetes SecurityContext check.',
        details: {
          tool: 'Open Policy Agent (OPA) & Cosign KMS',
          rulesEvaluated: 12,
          logs: [
            '[08:40:06] Evaluating Rego policies from repo/security/policies.rego...',
            '[08:40:06] [Rule 1/3] enforce_cosign_kms_signature -> PASS (Signed with GCP KMS key_id: k8s-cosign-prod)',
            '[08:40:07] [Rule 2/3] require_read_only_root_filesystem -> PASS',
            '[08:40:07] [Rule 3/3] deny_privileged_containers -> PASS',
            '[08:40:07] PASSED: All 3 OPA gatekeeper rules satisfied.'
          ]
        }
      },
      {
        id: 'deploy',
        name: '7. Deploy',
        shortName: 'Deploy',
        order: 7,
        description: 'Automated GitOps deployment trigger via ArgoCD to production Kubernetes cluster.',
        status: 'PASSED',
        durationMs: 1520,
        findingsCount: 0,
        summary: 'Deployed: ArgoCD synced revision 8f92a10 to khulnasoft-prod-us-east1 (12/12 Pods Healthy).',
        details: {
          tool: 'ArgoCD GitOps Engine v2.10',
          rulesEvaluated: 4,
          logs: [
            '[08:40:07] Security pipeline green. Dispatching deployment payload to ArgoCD API...',
            '[08:40:08] Target: cluster khulnasoft-prod-us-east1 / namespace khulnasoft-prod',
            '[08:40:08] Rolling update initialized for Deployment/core-api (12 replicas)...',
            '[08:40:09] Readiness probe 12/12 succeeded. Health check OK.',
            '[08:40:09] SUCCESS: Commit 8f92a10 live in production environment!'
          ]
        }
      }
    ]
  },
  {
    sha: 'e7b102a991823901238910238120391203910239',
    shortSha: 'e7b102a',
    repo: 'khulnasoft/telemetry-collector',
    branch: 'feat/buffer-queue',
    author: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    message: 'refactor(collector): update batch processing buffer queue',
    timestamp: '3 hours ago',
    overallStatus: 'BLOCKED',
    stages: [
      {
        id: 'secret-scan',
        name: '1. Secret Scan',
        shortName: 'Secret Scan',
        order: 1,
        description: 'TruffleHog & Gitleaks entropy analysis for leaked API keys, RSA/SSH private keys, GCP/AWS credentials.',
        status: 'BLOCKED',
        durationMs: 410,
        findingsCount: 1,
        summary: 'CRITICAL LEAK: High-entropy AWS Access Key (AKIAIOSFODNN7EXAMPLE) detected in config/test.env!',
        details: {
          tool: 'TruffleHog v3.68 & Gitleaks v8.18',
          rulesEvaluated: 850,
          logs: [
            '[05:12:01] Initializing Git diff entropy scanner...',
            '[05:12:01] Scanning commit e7b102a diff (3 files changed, +42 -12 lines)...',
            '[05:12:02] ALERT: Rule aws-access-token MATCHED in config/test.env:4',
            '[05:12:02] Secret Type: AWS Access Key ID (entropy score: 4.82)',
            '[05:12:02] BLOCKED: Commit security check failed. Pipeline terminated at Stage 1!'
          ],
          findings: [
            {
              id: 'F-001',
              severity: 'CRITICAL',
              title: 'Plain-text AWS Credentials Leaked in Commit Diff',
              location: 'config/test.env:4',
              remediation: 'Revoke AWS key AKIAIOSFODNN7EXAMPLE immediately and store in HashiCorp Vault.'
            }
          ]
        }
      },
      {
        id: 'dependency-scan',
        name: '2. Dependency Scan',
        shortName: 'Dependency Scan',
        order: 2,
        description: 'OSV / Snyk / Trivy scan of runtime and dev packages against NVD CVE database.',
        status: 'PENDING',
        durationMs: 0,
        findingsCount: 0,
        summary: 'Skipped: Prior stage (Secret Scan) failed and blocked execution.',
        details: { tool: 'Trivy v0.50', rulesEvaluated: 0, logs: ['Stage skipped due to Stage 1 block.'] }
      },
      {
        id: 'sbom',
        name: '3. SBOM Generation',
        shortName: 'SBOM',
        order: 3,
        description: 'Software Bill of Materials export compliant with CycloneDX v1.5 and SPDX v2.3 specs.',
        status: 'PENDING',
        durationMs: 0,
        findingsCount: 0,
        summary: 'Skipped: Prior stage failed.',
        details: { tool: 'syft v1.2.0', rulesEvaluated: 0, logs: ['Stage skipped.'] }
      },
      {
        id: 'license-scan',
        name: '4. License Scan',
        shortName: 'License Scan',
        order: 4,
        description: 'FOSS open-source legal compliance audit enforcing permissive licenses (MIT, Apache-2.0, BSD).',
        status: 'PENDING',
        durationMs: 0,
        findingsCount: 0,
        summary: 'Skipped: Prior stage failed.',
        details: { tool: 'FOSSA CLI v3.8.1', rulesEvaluated: 0, logs: ['Stage skipped.'] }
      },
      {
        id: 'container-scan',
        name: '5. Container Scan',
        shortName: 'Container Scan',
        order: 5,
        description: 'Trivy OCI container image vulnerability & rootless container configuration inspection.',
        status: 'PENDING',
        durationMs: 0,
        findingsCount: 0,
        summary: 'Skipped: Prior stage failed.',
        details: { tool: 'Trivy Container Scanner v0.50', rulesEvaluated: 0, logs: ['Stage skipped.'] }
      },
      {
        id: 'policy-check',
        name: '6. Policy Check',
        shortName: 'Policy Check',
        order: 6,
        description: 'Open Policy Agent (OPA) Rego policy enforcement for image signatures & security contexts.',
        status: 'PENDING',
        durationMs: 0,
        findingsCount: 0,
        summary: 'Skipped: Prior stage failed.',
        details: { tool: 'OPA Gatekeeper', rulesEvaluated: 0, logs: ['Stage skipped.'] }
      },
      {
        id: 'deploy',
        name: '7. Deploy',
        shortName: 'Deploy',
        order: 7,
        description: 'Automated GitOps deployment trigger via ArgoCD to production Kubernetes cluster.',
        status: 'PENDING',
        durationMs: 0,
        findingsCount: 0,
        summary: 'Skipped: Prior stage failed. Deployment blocked.',
        details: { tool: 'ArgoCD', rulesEvaluated: 0, logs: ['Deployment blocked.'] }
      }
    ]
  }
];

export const CommitSecurityPipeline: React.FC = () => {
  const [commits, setCommits] = useState<CommitRecord[]>(MOCK_COMMIT_SCANS);
  const [selectedCommitSha, setSelectedCommitSha] = useState<string>(MOCK_COMMIT_SCANS[0].sha);
  const [selectedStageId, setSelectedStageId] = useState<string>('secret-scan');
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'flow' | 'pipeline' | 'sbom-viewer' | 'policy-editor'>('flow');
  const [copiedText, setCopiedText] = useState(false);
  const [customCommitMessage, setCustomCommitMessage] = useState('');
  const [testScenario, setTestScenario] = useState<'CLEAN' | 'SECRET_LEAK' | 'CVE_FAIL' | 'LICENSE_FAIL'>('CLEAN');

  const selectedCommit = commits.find((c) => c.sha === selectedCommitSha) || commits[0];
  const activeStage = selectedCommit.stages.find((s) => s.id === selectedStageId) || selectedCommit.stages[0];

  // Trigger real-time commit security pipeline execution animation
  const handleRunCommitPipeline = () => {
    setIsScanning(true);
    
    // Create new commit entry
    const newSha = Math.random().toString(16).substring(2, 12) + Math.random().toString(16).substring(2, 12);
    const shortSha = newSha.substring(0, 7);

    const initialStages: CommitSecurityScanStage[] = [
      {
        id: 'secret-scan',
        name: '1. Secret Scan',
        shortName: 'Secret Scan',
        order: 1,
        description: 'TruffleHog & Gitleaks entropy analysis for leaked API keys, RSA/SSH private keys, GCP/AWS credentials.',
        status: 'RUNNING',
        durationMs: 0,
        findingsCount: testScenario === 'SECRET_LEAK' ? 1 : 0,
        summary: testScenario === 'SECRET_LEAK' 
          ? 'CRITICAL LEAK: High-entropy GCP API Key detected in diff!' 
          : 'Clean: 0 secret leaks or credentials found.',
        details: {
          tool: 'TruffleHog v3.68 & Gitleaks v8.18',
          rulesEvaluated: 850,
          logs: [
            '[LIVE SCAN] Initializing Git diff entropy scanner...',
            '[LIVE SCAN] Analyzing commit diff lines...',
            testScenario === 'SECRET_LEAK' ? '[ALERT] Leaked API Key AIzaSyB...' : '[OK] 0 secrets detected.'
          ]
        }
      },
      {
        id: 'dependency-scan',
        name: '2. Dependency Scan',
        shortName: 'Dependency Scan',
        order: 2,
        description: 'OSV / Snyk / Trivy scan of runtime and dev packages against NVD CVE database.',
        status: 'PENDING',
        durationMs: 0,
        findingsCount: testScenario === 'CVE_FAIL' ? 2 : 0,
        summary: 'Pending execution...',
        details: { tool: 'Trivy v0.50', rulesEvaluated: 142000, logs: ['Waiting for stage 1...'] }
      },
      {
        id: 'sbom',
        name: '3. SBOM Generation',
        shortName: 'SBOM',
        order: 3,
        description: 'Software Bill of Materials export compliant with CycloneDX v1.5 and SPDX v2.3 specs.',
        status: 'PENDING',
        durationMs: 0,
        findingsCount: 0,
        summary: 'Pending execution...',
        details: { tool: 'syft v1.2.0', rulesEvaluated: 482, logs: ['Waiting for stage 2...'] }
      },
      {
        id: 'license-scan',
        name: '4. License Scan',
        shortName: 'License Scan',
        order: 4,
        description: 'FOSS open-source legal compliance audit enforcing permissive licenses (MIT, Apache-2.0, BSD).',
        status: 'PENDING',
        durationMs: 0,
        findingsCount: testScenario === 'LICENSE_FAIL' ? 1 : 0,
        summary: 'Pending execution...',
        details: { tool: 'FOSSA CLI v3.8.1', rulesEvaluated: 64, logs: ['Waiting for stage 3...'] }
      },
      {
        id: 'container-scan',
        name: '5. Container Scan',
        shortName: 'Container Scan',
        order: 5,
        description: 'Trivy OCI container image vulnerability & rootless container configuration inspection.',
        status: 'PENDING',
        durationMs: 0,
        findingsCount: 0,
        summary: 'Pending execution...',
        details: { tool: 'Trivy Container Scanner v0.50', rulesEvaluated: 18500, logs: ['Waiting for stage 4...'] }
      },
      {
        id: 'policy-check',
        name: '6. Policy Check',
        shortName: 'Policy Check',
        order: 6,
        description: 'Open Policy Agent (OPA) Rego policy enforcement for image signatures & security contexts.',
        status: 'PENDING',
        durationMs: 0,
        findingsCount: 0,
        summary: 'Pending execution...',
        details: { tool: 'OPA Gatekeeper', rulesEvaluated: 12, logs: ['Waiting for stage 5...'] }
      },
      {
        id: 'deploy',
        name: '7. Deploy',
        shortName: 'Deploy',
        order: 7,
        description: 'Automated GitOps deployment trigger via ArgoCD to production Kubernetes cluster.',
        status: 'PENDING',
        durationMs: 0,
        findingsCount: 0,
        summary: 'Pending execution...',
        details: { tool: 'ArgoCD', rulesEvaluated: 4, logs: ['Waiting for stage 6...'] }
      }
    ];

    const newCommitRecord: CommitRecord = {
      sha: newSha,
      shortSha,
      repo: 'khulnasoft/core-api',
      branch: 'main',
      author: 'You (Developer)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      message: customCommitMessage.trim() || 'feat(sec): trigger automated commit security pipeline',
      timestamp: 'Just now',
      overallStatus: 'RUNNING',
      stages: initialStages
    };

    setCommits((prev) => [newCommitRecord, ...prev]);
    setSelectedCommitSha(newSha);

    // Step-by-step pipeline runner simulation
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      setCommits((prevCommits) => {
        return prevCommits.map((c) => {
          if (c.sha !== newSha) return c;

          const hasFailed = 
            (testScenario === 'SECRET_LEAK' && currentStep >= 1) ||
            (testScenario === 'CVE_FAIL' && currentStep >= 2) ||
            (testScenario === 'LICENSE_FAIL' && currentStep >= 4);

          const updatedStages = c.stages.map((stg, idx) => {
            if (testScenario === 'SECRET_LEAK' && idx === 0) {
              return {
                ...stg,
                status: 'BLOCKED' as const,
                durationMs: 380,
                summary: 'BLOCKED: High-entropy GCP API Key detected in src/config.ts!',
                details: {
                  ...stg.details,
                  logs: [
                    ...stg.details.logs,
                    '[CRITICAL] TruffleHog flagged raw API Key leak in commit diff!',
                    '[BLOCKED] Commit security check failed. Pipeline aborted.'
                  ]
                }
              };
            }

            if (testScenario === 'CVE_FAIL' && idx === 1) {
              if (currentStep === 1) return { ...stg, status: 'RUNNING' as const };
              return {
                ...stg,
                status: 'BLOCKED' as const,
                durationMs: 720,
                summary: 'BLOCKED: CVE-2024-3094 (XZ Utils Backdoor) detected in package tree!',
                details: {
                  ...stg.details,
                  logs: [
                    '[08:40:02] Scanning package manifests...',
                    '[CRITICAL] Found CVE-2024-3094 in liblzma dependency!',
                    '[BLOCKED] Critical vulnerability policy gate failed.'
                  ]
                }
              };
            }

            if (testScenario === 'LICENSE_FAIL' && idx === 3) {
              if (currentStep < 4) {
                if (idx < currentStep) return { ...stg, status: 'PASSED' as const, durationMs: 300 };
                if (idx === currentStep) return { ...stg, status: 'RUNNING' as const };
                return { ...stg, status: 'PENDING' as const };
              }
              return {
                ...stg,
                status: 'BLOCKED' as const,
                durationMs: 410,
                summary: 'BLOCKED: AGPL-3.0 copyleft license detected in package dependency!',
                details: {
                  ...stg.details,
                  logs: [
                    '[08:40:04] Auditing FOSS licenses...',
                    '[DENIED] Found AGPL-3.0 package: github.com/agpl-pkg/lib',
                    '[BLOCKED] Enterprise license policy violation.'
                  ]
                }
              };
            }

            if (hasFailed && idx > (testScenario === 'SECRET_LEAK' ? 0 : testScenario === 'CVE_FAIL' ? 1 : 3)) {
              return {
                ...stg,
                status: 'PENDING' as const,
                summary: 'Skipped due to prior stage security failure.'
              };
            }

            if (idx < currentStep) {
              return {
                ...stg,
                status: 'PASSED' as const,
                durationMs: 200 + Math.floor(Math.random() * 400),
                summary: `Stage passed successfully in ${200 + Math.floor(Math.random() * 400)}ms.`
              };
            } else if (idx === currentStep) {
              return {
                ...stg,
                status: 'RUNNING' as const,
                summary: `Executing ${stg.name} inspection...`
              };
            } else {
              return {
                ...stg,
                status: 'PENDING' as const
              };
            }
          });

          const isDone = hasFailed || currentStep >= 7;

          return {
            ...c,
            overallStatus: hasFailed ? 'BLOCKED' : isDone ? 'PASSED' : 'RUNNING',
            stages: updatedStages
          };
        });
      });

      if (
        (testScenario === 'SECRET_LEAK' && currentStep >= 1) ||
        (testScenario === 'CVE_FAIL' && currentStep >= 2) ||
        (testScenario === 'LICENSE_FAIL' && currentStep >= 4) ||
        currentStep >= 7
      ) {
        clearInterval(interval);
        setIsScanning(false);
      }
    }, 600);
  };

  const sampleSbomJson = `{
  "bomFormat": "CycloneDX",
  "specVersion": "1.5",
  "serialNumber": "urn:uuid:8f92a10b-4c89-42d0-912f-9812a1012938",
  "version": 1,
  "metadata": {
    "timestamp": "${new Date().toISOString()}",
    "tools": [
      {
        "vendor": "anchore",
        "name": "syft",
        "version": "1.2.0"
      }
    ],
    "component": {
      "bom-ref": "pkg:golang/khulnasoft/core-api@8f92a10",
      "type": "application",
      "name": "khulnasoft/core-api",
      "version": "8f92a10",
      "licenses": [
        { "license": { "id": "Apache-2.0" } }
      ]
    }
  },
  "components": [
    {
      "bom-ref": "pkg:golang/google.golang.org/grpc@v1.62.0",
      "type": "library",
      "name": "google.golang.org/grpc",
      "version": "v1.62.0",
      "licenses": [
        { "license": { "id": "Apache-2.0" } }
      ],
      "hashes": [
        { "alg": "SHA-256", "content": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" }
      ]
    },
    {
      "bom-ref": "pkg:golang/go.opentelemetry.io/otel@v1.24.0",
      "type": "library",
      "name": "go.opentelemetry.io/otel",
      "version": "v1.24.0",
      "licenses": [
        { "license": { "id": "Apache-2.0" } }
      ]
    }
  ]
}`;

  const copySbomToClipboard = () => {
    navigator.clipboard.writeText(sampleSbomJson);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner & Control Bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Automated Every Commit DevSecOps Pipeline</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                Enforced on All Git Commits
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-100 flex items-center space-x-2">
              <span>Strict 7-Stage Commit Security Gatekeeper</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              No commit enters cluster deployment without passing: Secret Scan ➔ Dependency Scan ➔ SBOM ➔ License Scan ➔ Container Scan ➔ Policy Check ➔ Deploy.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setActiveTab('flow')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'flow' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              Visual Flow
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pipeline' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              Commit History
            </button>
            <button
              onClick={() => setActiveTab('sbom-viewer')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'sbom-viewer' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              CycloneDX SBOM
            </button>
            <button
              onClick={() => setActiveTab('policy-editor')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'policy-editor' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              OPA Rego Sandbox
            </button>
          </div>
        </div>

        {/* Interactive Commit Scanner Simulation Panel */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="flex items-center space-x-2 text-slate-200 font-bold">
              <GitCommit className="w-4 h-4 text-cyan-400" />
              <span>Simulate New Git Commit Push & Trigger Security Gates</span>
            </span>

            {/* Test Scenarios */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-slate-400">Scan Mode:</span>
              <select
                value={testScenario}
                onChange={(e) => setTestScenario(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-cyan-300 font-bold focus:border-cyan-500"
              >
                <option value="CLEAN">Clean Commit (100% Pass & Deploy)</option>
                <option value="SECRET_LEAK">Secret Leak (Block @ Stage 1)</option>
                <option value="CVE_FAIL">Critical CVE (Block @ Stage 2)</option>
                <option value="LICENSE_FAIL">AGPL Copyleft (Block @ Stage 4)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <input
              type="text"
              value={customCommitMessage}
              onChange={(e) => setCustomCommitMessage(e.target.value)}
              placeholder="e.g. feat(auth): add OAuth OIDC session tokens & OTel telemetry..."
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2 text-slate-200 text-xs font-mono"
            />

            <button
              onClick={handleRunCommitPipeline}
              disabled={isScanning}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-bold px-5 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 text-xs shrink-0 shadow-lg shadow-cyan-500/10"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scanning Stages...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Push Commit & Run Pipeline</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* VISUAL PIPELINE FLOW TAB (EXPLICIT DIRECTORY DIAGRAM) */}
      {activeTab === 'flow' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Every Commit Security Pipeline Sequential Architecture</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Commit ID <span className="text-cyan-300 font-bold">{selectedCommit.shortSha}</span> • Repository: <span className="text-slate-200">{selectedCommit.repo}</span>
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                selectedCommit.overallStatus === 'PASSED' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                selectedCommit.overallStatus === 'BLOCKED' ? 'bg-rose-950 text-rose-400 border-rose-800' :
                'bg-cyan-950 text-cyan-300 border-cyan-800 animate-pulse'
              }`}>
                Pipeline Outcome: {selectedCommit.overallStatus}
              </span>
            </div>
          </div>

          {/* Vertical Flow Sequence matching the user's prompt */}
          <div className="flex flex-col items-center justify-center max-w-2xl mx-auto space-y-3 py-2">
            
            {/* Root Node: Every Commit */}
            <div className="w-full bg-slate-950 border-2 border-cyan-500/80 p-4 rounded-2xl shadow-xl shadow-cyan-500/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                  <GitCommit className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-cyan-300 font-extrabold text-sm uppercase tracking-wider">Every Commit</div>
                  <div className="text-slate-400 text-xs font-sans truncate max-w-xs sm:max-w-md">{selectedCommit.message}</div>
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-400">
                <div className="font-bold text-slate-200">{selectedCommit.author}</div>
                <div>{selectedCommit.timestamp}</div>
              </div>
            </div>

            <ArrowDown className="w-5 h-5 text-cyan-400 animate-bounce" />

            {/* Sequence Loop over 7 Stages */}
            {selectedCommit.stages.map((stage, idx) => {
              const isSelected = selectedStageId === stage.id;

              let borderClass = 'border-slate-800 bg-slate-950/80';
              let icon = <Clock className="w-4 h-4 text-slate-500" />;
              let badge = <span className="text-slate-500 font-bold">PENDING</span>;

              if (stage.status === 'PASSED') {
                borderClass = 'border-emerald-800/80 bg-slate-950';
                icon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
                badge = <span className="text-emerald-400 font-bold">PASSED ({stage.durationMs}ms)</span>;
              } else if (stage.status === 'BLOCKED') {
                borderClass = 'border-rose-800 bg-rose-950/30';
                icon = <XCircle className="w-4 h-4 text-rose-400" />;
                badge = <span className="text-rose-400 font-bold">BLOCKED</span>;
              } else if (stage.status === 'RUNNING') {
                borderClass = 'border-cyan-500 bg-cyan-950/30 animate-pulse';
                icon = <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />;
                badge = <span className="text-cyan-300 font-bold">SCANNING...</span>;
              }

              return (
                <React.Fragment key={stage.id}>
                  <div
                    onClick={() => setSelectedStageId(stage.id)}
                    className={`w-full p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${borderClass} ${
                      isSelected ? 'ring-2 ring-cyan-400/50 shadow-lg' : 'hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs">
                        {stage.order}
                      </div>
                      <div>
                        <div className="font-bold text-slate-100 text-xs flex items-center space-x-2">
                          <span>{stage.shortName}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({stage.details.tool})</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-sans mt-0.5 line-clamp-1">{stage.summary}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="text-right text-xs">{badge}</div>
                      {icon}
                    </div>
                  </div>

                  {/* Arrow connector except after last element */}
                  {idx < selectedCommit.stages.length - 1 && (
                    <ArrowDown className={`w-4 h-4 ${stage.status === 'PASSED' ? 'text-emerald-400' : 'text-slate-700'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Stage Deep-Dive Drawer Console */}
          {activeStage && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>Stage Inspector: {activeStage.name}</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{activeStage.description}</p>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-slate-400">Scanner Engine: <strong className="text-cyan-300">{activeStage.details.tool}</strong></span>
                  <span className="text-slate-400">Rules Evaluated: <strong className="text-slate-200">{activeStage.details.rulesEvaluated.toLocaleString()}</strong></span>
                </div>
              </div>

              {/* Log Output */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-[11px] space-y-1 max-h-[200px] overflow-y-auto">
                {activeStage.details.logs.map((log, lIdx) => (
                  <div
                    key={lIdx}
                    className={`${
                      log.includes('CRITICAL') || log.includes('BLOCKED') || log.includes('ALERT')
                        ? 'text-rose-400 font-bold'
                        : log.includes('PASSED') || log.includes('SUCCESS') || log.includes('SAFE')
                        ? 'text-emerald-400 font-bold'
                        : 'text-slate-300'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* COMMIT HISTORY LIST TAB */}
      {activeTab === 'pipeline' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-300 font-bold">
            <span>Recent Repository Commit Submissions ({commits.length})</span>
            <span className="text-[10px] text-slate-500">All commits automatically evaluated against 7 DevSecOps gates</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {commits.map((c) => (
              <button
                key={c.sha}
                onClick={() => {
                  setSelectedCommitSha(c.sha);
                  setSelectedStageId('secret-scan');
                  setActiveTab('flow');
                }}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedCommitSha === c.sha
                    ? 'bg-slate-950 border-cyan-500 ring-1 ring-cyan-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-cyan-300 text-xs flex items-center space-x-1">
                    <GitCommit className="w-3.5 h-3.5" />
                    <span>{c.shortSha}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.overallStatus === 'PASSED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    c.overallStatus === 'BLOCKED' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                    'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  }`}>
                    {c.overallStatus}
                  </span>
                </div>

                <div className="text-slate-200 font-sans text-xs font-medium truncate mb-2">{c.message}</div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80 pt-2">
                  <span>{c.repo}</span>
                  <span>{c.timestamp}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CYCLONEDX SBOM SPEC VIEWER */}
      {activeTab === 'sbom-viewer' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                <span>CycloneDX v1.5 JSON Software Bill of Materials (SBOM)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Cryptographically signed manifest export storing 482 components with SHA-256 integrity hashes.
              </p>
            </div>

            <button
              onClick={copySbomToClipboard}
              className="bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-800/80 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1.5 text-xs"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? 'Copied JSON!' : 'Copy CycloneDX JSON'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-cyan-300 text-[11px] overflow-x-auto max-h-[420px]">
            {sampleSbomJson}
          </pre>
        </div>
      )}

      {/* TAB 4: OPA REGO POLICY EDITOR */}
      {activeTab === 'policy-editor' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-indigo-400" />
                <span>Open Policy Agent (OPA) Rego Gatekeeper Rules</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Declarative Rego policies evaluated at Stage 6 prior to ArgoCD K8s deployment.
              </p>
            </div>

            <span className="px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-bold">
              OPA Engine Active
            </span>
          </div>

          <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-indigo-300 text-[11px] overflow-x-auto max-h-[380px]">
{`package khulnasoft.commit.security

default allow = false

# Rule 1: Enforce Cosign KMS signature on OCI container
allow {
  input.stage == "policy-check"
  input.cosign_kms_signature_valid == true
  input.container_user_uid != 0
  not has_forbidden_licenses
}

# Rule 2: Deny root execution
deny[msg] {
  input.container_user_uid == 0
  msg := "BLOCKED: Container image is configured to run as root (UID 0)."
}

# Rule 3: Deny GPL/AGPL viral copyleft licenses
has_forbidden_licenses {
  some i
  input.licenses[i] == "AGPL-3.0"
}`}
          </pre>
        </div>
      )}
    </div>
  );
};
