export type TabType = 
  | 'overview'
  | 'repos'
  | 'graph'
  | 'portal'
  | 'docs'
  | 'packages'
  | 'cicd'
  | 'production-platform'
  | 'distribution'
  | 'webhooks'
  | 'kubernetes'
  | 'observability'
  | 'security'
  | 'ai-assistant'
  | 'enterprise';

export interface HealthScoreBreakdown {
  overallScore: number; // 0-100
  documentationScore: number; // 0-20
  securityScore: number; // 0-20
  testingScore: number; // 0-20
  cicdScore: number; // 0-20
  maintenanceScore: number; // 0-20
  hasReadme: boolean;
  hasChangelog: boolean;
  hasLicense: boolean;
  hasContributing: boolean;
  hasCodeowners: boolean;
  branchProtectionEnabled: boolean;
}

export type ProjectType = 
  | 'Library' 
  | 'CLI' 
  | 'SDK' 
  | 'API' 
  | 'Service' 
  | 'Frontend' 
  | 'Backend' 
  | 'Monolith' 
  | 'Monorepo' 
  | 'Infrastructure' 
  | 'Documentation' 
  | 'AI Model' 
  | 'Research' 
  | 'Demo' 
  | 'Template';

export type MaturityLevel = 
  | 'Experimental' 
  | 'Prototype' 
  | 'Beta' 
  | 'Stable' 
  | 'Production' 
  | 'Deprecated' 
  | 'Archived';

export type DiscoveryStatus = 'cloned' | 'syncing' | 'queued' | 'indexed' | 'failed';

export interface Repository {
  id: string;
  githubId?: number;
  name: string;
  org: string;
  owner?: string;
  description: string;
  language: string;
  secondaryLanguages?: { name: string; percentage: number }[];
  starCount: number;
  forkCount: number;
  watchersCount?: number;
  openIssuesCount: number;
  isPrivate: boolean;
  isArchived?: boolean;
  isFork?: boolean;
  isTemplate?: boolean;
  isMirror?: boolean;
  defaultBranch: string;
  branchProtectionEnabled?: boolean;
  projectType: ProjectType;
  maturity: MaturityLevel;
  topics: string[];
  dependencies: { name: string; version: string; type: 'runtime' | 'dev'; ecosystem?: string }[];
  frameworks: string[];
  architecture: string; // e.g. 'Event-Driven Microservice', 'API Gateway'
  buildSystem: string; // e.g. 'Docker', 'Go Build', 'Cargo', 'Vite'
  dockerSupport: boolean;
  k8sSupport: boolean;
  openApiSupport: boolean;
  testCoverage: number; // percentage 0-100
  securityScore: number; // 0-100
  sbomStatus: 'Clean' | 'Warnings' | 'Critical';
  license: string;
  healthBreakdown: HealthScoreBreakdown;
  discoveryStatus?: DiscoveryStatus;
  linesOfCode?: number;
  diskSizeBytes?: number;
  lastSyncedAt?: string;
  lastCommit: {
    sha: string;
    message: string;
    author: string;
    date: string;
  };
  readmeMarkdown: string;
  architectureMermaid: string;
  contributors: { name: string; avatarUrl: string; commits: number }[];
  releasesCount: number;
  packagesCount: number;
  tags?: string[];
  healthMetrics?: RepoHealthMetrics;
}

export interface DiscoveryPipelineEvent {
  id: string;
  repoId: string;
  repoName: string;
  eventType: 
    | 'RepositoryDiscovered' 
    | 'RepositoryUpdated' 
    | 'RepositoryCloned' 
    | 'RepositoryIndexed' 
    | 'MetadataGenerated' 
    | 'HealthCalculated' 
    | 'FrameworkDetected' 
    | 'DependencyUpdated';
  timestamp: string;
  detail: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

export interface OrgSyncStats {
  totalDiscovered: number;
  syncProgressPercent: number;
  metadataSuccessRate: number;
  frameworkAccuracy: number;
  dependencySuccessRate: number;
  lastFullSyncTime: string;
  languageBreakdown: Record<string, number>;
  projectTypeBreakdown: Record<string, number>;
  maturityBreakdown: Record<string, number>;
  healthScoreDistribution: { range: string; count: number }[];
}

export interface CommitFrequencyDataPoint {
  date: string;
  commits: number;
  authorsCount: number;
}

export interface BuildHistoryDataPoint {
  buildNumber: number;
  date: string;
  status: 'success' | 'failed' | 'cancelled';
  durationSec: number;
  successRate: number; // cumulative % e.g. 96.5
}

export interface RepoHealthMetrics {
  buildSuccessRate: number; // 0-100%
  totalBuilds30Days: number;
  passedBuilds30Days: number;
  failedBuilds30Days: number;
  avgBuildDurationSec: number;
  totalCommits30Days: number;
  activeContributors30Days: number;
  meanTimeToRecoveryMinutes: number;
  commitFrequency: CommitFrequencyDataPoint[];
  buildHistory: BuildHistoryDataPoint[];
}

export type KnowledgeNodeType = 
  | 'repository' 
  | 'file' 
  | 'function' 
  | 'class' 
  | 'package' 
  | 'service' 
  | 'docker_image' 
  | 'helm_chart' 
  | 'issue' 
  | 'pr' 
  | 'commit' 
  | 'person' 
  | 'team' 
  | 'project';

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: KnowledgeNodeType;
  repoId?: string;
  properties: Record<string, string | number | boolean>;
  healthScore?: number;
}

export type KnowledgeEdgeRelation = 
  | 'imports' 
  | 'depends_on' 
  | 'calls' 
  | 'implements' 
  | 'deploys' 
  | 'references' 
  | 'owns' 
  | 'documents' 
  | 'publishes';

export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  relation: KnowledgeEdgeRelation;
  metadata?: string;
}

export interface CiCdStep {
  name: string;
  status: 'passed' | 'failed' | 'running' | 'skipped';
  durationSeconds: number;
  logs: string[];
}

export interface CiCdPipeline {
  id: string;
  repoId: string;
  repoName: string;
  pipelineName: string;
  status: 'success' | 'failed' | 'running' | 'queued';
  commitSha: string;
  commitMessage: string;
  branch: string;
  author: string;
  triggeredBy: string;
  durationSeconds: number;
  coveragePercent: number;
  vulnerabilityCount: number;
  runnerType: string;
  createdAt: string;
  steps: CiCdStep[];
}

export interface PackageArtifact {
  id: string;
  name: string;
  type: 'docker' | 'helm' | 'npm' | 'pypi' | 'crates' | 'golang' | 'binary' | 'sdk';
  version: string;
  repoId: string;
  repoName: string;
  sizeMB: number;
  downloadCount: number;
  tags: string[];
  sbomCount: number;
  signedStatus: 'COSIGN_VERIFIED' | 'NOT_SIGNED' | 'EXPIRED';
  provenanceDigest: string;
  createdAt: string;
  description?: string;
  pullCommand?: string;
  downloadUrl?: string;
  license?: string;
  codeSnippet?: string;
  supportedArchitectures?: string[];
}

export interface DeploymentTarget {
  id: string;
  name: string;
  environment: 'production' | 'staging' | 'dev' | 'edge';
  cloudProvider: 'AWS' | 'GCP' | 'Azure' | 'Hetzner' | 'BareMetal' | 'K8s';
  region: string;
  status: 'healthy' | 'degraded' | 'syncing' | 'failed';
  replicaCount: number;
  activeVersion: string;
  gitOpsTool: 'ArgoCD' | 'Flux' | 'Terraform';
  clusterName: string;
  lastDeployed: string;
  endpointUrl: string;
  cpuUsageMillicores?: number;
  cpuLimitMillicores?: number;
  cpuUsagePercent?: number;
  memoryUsageMB?: number;
  memoryLimitMB?: number;
  memoryUsagePercent?: number;
  lastMetricsFetchedAt?: string;
}

export interface KubernetesCluster {
  id: string;
  name: string;
  provider: string;
  region: string;
  nodeCount: number;
  cpuUsagePercent: number;
  memUsagePercent: number;
  namespacesCount: number;
  activePodsCount: number;
  serviceMesh: 'Istio' | 'Linkerd' | 'Cilium';
  gitOpsStatus: 'Synced' | 'OutOfSync' | 'Progressing';
  hpaRulesCount: number;
}

export interface SecurityVulnerability {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  cveId: string;
  packageName: string;
  affectedVersion: string;
  fixedVersion: string;
  repositoryId: string;
  repositoryName: string;
  status: 'OPEN' | 'RESOLVED' | 'IGNORED';
  summary: string;
  discoveredAt: string;
}

export interface PolicyRule {
  id: string;
  name: string;
  category: 'Security' | 'Compliance' | 'Architecture' | 'Cost';
  status: 'ENFORCED' | 'AUDIT' | 'DISABLED';
  evaluationResult: 'PASSED' | 'VIOLATION';
  description: string;
}

export interface AiAssistantMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  codeSnippets?: { language: string; filename: string; code: string }[];
  diagramMermaid?: string;
  citations?: string[];
  suggestedActions?: string[];
}

export interface SystemOverviewStats {
  totalRepos: number;
  totalServices: number;
  totalDeployments: number;
  activeBuilds: number;
  avgTestCoverage: number;
  securityScore: number;
  knowledgeGraphNodes: number;
  knowledgeGraphEdges: number;
  monthlyCloudCostUSD: number;
}

export interface WebhookConfig {
  id: string;
  repoId: string;
  repoName: string;
  url: string;
  contentType: 'application/json' | 'application/x-www-form-urlencoded';
  secretMasked: string;
  events: string[];
  active: boolean;
  sslVerification: boolean;
  createdAt: string;
  lastDeliveryStatus: '200 OK' | '202 Accepted' | '500 Server Error' | '502 Bad Gateway' | '404 Not Found';
  lastDeliveryTime: string;
  totalDeliveries: number;
  failureRate: number;
}

export interface WebhookDeliveryLog {
  id: string;
  webhookId: string;
  repoName: string;
  event: string;
  action?: string;
  timestamp: string;
  durationMs: number;
  statusCode: number;
  statusText: string;
  guid: string;
  signatureVerified: boolean;
  requestHeaders: Record<string, string>;
  requestPayload: any;
  responseHeaders: Record<string, string>;
  responseBody: string;
}

export type DistributionArtifactType =
  | 'docker'
  | 'helm'
  | 'npm'
  | 'pypi'
  | 'crates'
  | 'go'
  | 'github_releases'
  | 'oci';

export interface DistributionArtifact {
  id: string;
  type: DistributionArtifactType;
  name: string;
  version: string;
  registryUrl: string;
  pullCommand: string;
  sizeBytes: number;
  digest: string;
  cosignSigned: boolean;
  slsaProvenanceLevel: 1 | 2 | 3;
  downloadCount: number;
  publishedAt: string;
}

export interface ReleasePipelineStage {
  id: 'tag' | 'ci' | 'tests' | 'security' | 'package' | 'publish' | 'release_notes' | 'announcement';
  name: string;
  subtitle: string;
  status: 'passed' | 'running' | 'queued' | 'failed' | 'skipped';
  durationSeconds: number;
  logs: string[];
  summary: string;
}

export interface ReleasePipelineRun {
  id: string;
  repoId: string;
  repoName: string;
  tag: string;
  commitSha: string;
  author: string;
  triggeredBy: string;
  startedAt: string;
  completedAt?: string;
  status: 'passed' | 'running' | 'failed';
  stages: ReleasePipelineStage[];
  publishedArtifacts: DistributionArtifact[];
  releaseNotesMarkdown: string;
  announcementsSent: {
    channel: 'slack' | 'discord' | 'email' | 'webhook' | 'devto' | 'twitter';
    status: 'sent' | 'pending' | 'failed';
    target: string;
  }[];
}

export interface AutoPublishConfig {
  repoId: string;
  repoName: string;
  autoPublishEnabled: boolean;
  tagPattern: string; // e.g. "v*.*.*"
  requireApproval: boolean;
  enabledArtifacts: DistributionArtifactType[];
  cosignSigningEnabled: boolean;
  slsaProvenanceEnabled: boolean;
  slackNotificationChannel: string;
  discordWebhookUrl: string;
}

