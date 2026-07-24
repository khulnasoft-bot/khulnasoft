import { db } from './index.ts';
import { 
  githubApps, 
  githubOrganizations, 
  repositories, 
  organizationSyncJobs, 
  organizationMembers, 
  repositoryDependencies 
} from './schema.ts';
import { eq, desc, like, or } from 'drizzle-orm';

// ==================== GITHUB APPS SERVICE ====================

export async function getAllGitHubApps() {
  try {
    return await db.select().from(githubApps).orderBy(desc(githubApps.createdAt));
  } catch (error) {
    console.error('Failed to fetch GitHub apps from DB:', error);
    return [];
  }
}

export async function createGitHubAppRecord(data: {
  appId: string;
  name: string;
  slug?: string;
  clientId?: string;
  clientSecret?: string;
  privateKey?: string;
  webhookSecret?: string;
  installationId?: string;
  orgName: string;
  status?: string;
  permissions?: string;
  events?: string;
}) {
  try {
    const result = await db.insert(githubApps).values({
      appId: data.appId,
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      clientId: data.clientId || 'Iv1.' + Math.random().toString(36).substring(2, 12),
      clientSecret: data.clientSecret || 'secret_' + Math.random().toString(36).substring(2, 16),
      privateKey: data.privateKey || '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA...\n-----END RSA PRIVATE KEY-----',
      webhookSecret: data.webhookSecret || 'whsec_' + Math.random().toString(36).substring(2, 16),
      installationId: data.installationId || Math.floor(10000000 + Math.random() * 90000000).toString(),
      orgName: data.orgName,
      status: data.status || 'active',
      permissions: data.permissions || JSON.stringify({ contents: 'read', metadata: 'read', pull_requests: 'write', checks: 'write' }),
      events: data.events || JSON.stringify(['push', 'pull_request', 'repository', 'installation']),
    }).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to create GitHub app record:', error);
    throw error;
  }
}

export async function updateGitHubAppStatus(id: number, status: string) {
  try {
    const result = await db.update(githubApps)
      .set({ status, updatedAt: new Date() })
      .where(eq(githubApps.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error('Failed to update GitHub app status:', error);
    throw error;
  }
}

// ==================== ORGANIZATION & SYNC SERVICE ====================

export async function getAllOrganizations() {
  try {
    return await db.select().from(githubOrganizations).orderBy(desc(githubOrganizations.createdAt));
  } catch (error) {
    console.error('Failed to fetch GitHub organizations from DB:', error);
    return [];
  }
}

export async function upsertOrganizationRecord(data: {
  githubId: string;
  name: string;
  login: string;
  avatarUrl?: string;
  installationId?: string;
  repoCount?: number;
  memberCount?: number;
  syncStatus?: string;
  lastSyncedAt?: Date;
}) {
  try {
    const result = await db.insert(githubOrganizations)
      .values({
        githubId: data.githubId,
        name: data.name,
        login: data.login,
        avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=120&auto=format&fit=crop&q=80',
        installationId: data.installationId || 'inst-884920',
        repoCount: data.repoCount || 0,
        memberCount: data.memberCount || 0,
        syncStatus: data.syncStatus || 'completed',
        lastSyncedAt: data.lastSyncedAt || new Date(),
      })
      .onConflictDoUpdate({
        target: githubOrganizations.githubId,
        set: {
          name: data.name,
          login: data.login,
          repoCount: data.repoCount,
          memberCount: data.memberCount,
          syncStatus: data.syncStatus,
          lastSyncedAt: data.lastSyncedAt || new Date(),
        },
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Failed to upsert GitHub organization:', error);
    throw error;
  }
}

export async function createSyncJobRecord(orgId: number, syncType = 'full') {
  try {
    const result = await db.insert(organizationSyncJobs).values({
      orgId,
      syncType,
      status: 'running',
      startedAt: new Date(),
    }).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to create sync job:', error);
    throw error;
  }
}

export async function completeSyncJobRecord(jobId: number, reposDiscovered: number, reposSynced: number, errorMessage?: string) {
  try {
    const result = await db.update(organizationSyncJobs)
      .set({
        status: errorMessage ? 'failed' : 'completed',
        reposDiscovered,
        reposSynced,
        errorMessage: errorMessage || null,
        completedAt: new Date(),
      })
      .where(eq(organizationSyncJobs.id, jobId))
      .returning();
    return result[0];
  } catch (error) {
    console.error('Failed to complete sync job:', error);
    throw error;
  }
}

// ==================== REPOSITORY DISCOVERY SERVICE ====================

export async function getAllDiscoveredRepositories() {
  try {
    return await db.select().from(repositories).orderBy(desc(repositories.updatedAt));
  } catch (error) {
    console.error('Failed to fetch discovered repositories from DB:', error);
    return [];
  }
}

export async function upsertRepositoryRecord(data: {
  githubRepoId: string;
  orgId?: number;
  name: string;
  fullName: string;
  description?: string;
  defaultBranch?: string;
  isPrivate?: boolean;
  language?: string;
  frameworks?: string[];
  topics?: string[];
  stars?: number;
  forks?: number;
  openIssues?: number;
  license?: string;
  healthScore?: number;
  architecture?: string;
  astMetadata?: Record<string, any>;
}) {
  try {
    const result = await db.insert(repositories)
      .values({
        githubRepoId: data.githubRepoId,
        orgId: data.orgId || null,
        name: data.name,
        fullName: data.fullName,
        description: data.description || '',
        defaultBranch: data.defaultBranch || 'main',
        isPrivate: data.isPrivate ?? false,
        language: data.language || 'TypeScript',
        frameworks: data.frameworks ? JSON.stringify(data.frameworks) : '[]',
        topics: data.topics ? JSON.stringify(data.topics) : '[]',
        stars: data.stars ?? 0,
        forks: data.forks ?? 0,
        openIssues: data.openIssues ?? 0,
        license: data.license || 'Apache-2.0',
        healthScore: data.healthScore ?? 92,
        architecture: data.architecture || 'Microservice',
        astMetadata: data.astMetadata ? JSON.stringify(data.astMetadata) : null,
      })
      .onConflictDoUpdate({
        target: repositories.githubRepoId,
        set: {
          name: data.name,
          fullName: data.fullName,
          description: data.description || '',
          language: data.language || 'TypeScript',
          frameworks: data.frameworks ? JSON.stringify(data.frameworks) : '[]',
          topics: data.topics ? JSON.stringify(data.topics) : '[]',
          stars: data.stars ?? 0,
          forks: data.forks ?? 0,
          openIssues: data.openIssues ?? 0,
          healthScore: data.healthScore ?? 92,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Failed to upsert repository:', error);
    throw error;
  }
}

export async function seedInitialGitHubData() {
  try {
    // Check if we already have GitHub apps
    const existingApps = await getAllGitHubApps();
    if (existingApps.length === 0) {
      await createGitHubAppRecord({
        appId: '1084920',
        name: 'KhulnaSoft Intelligence App',
        slug: 'khulnasoft-intelligence-app',
        clientId: 'Iv1.884920a1b2c3d4e5',
        orgName: 'khulnasoft',
        status: 'active',
      });
      await createGitHubAppRecord({
        appId: '1095831',
        name: 'KhulnaSoft Security Scanner',
        slug: 'khulnasoft-security-scanner',
        clientId: 'Iv1.958310f6e5d4c3b2',
        orgName: 'khulnasoft-dev',
        status: 'active',
      });
    }

    // Check if we have organizations
    const existingOrgs = await getAllOrganizations();
    let orgRecord;
    if (existingOrgs.length === 0) {
      orgRecord = await upsertOrganizationRecord({
        githubId: 'org-99381',
        name: 'KhulnaSoft Enterprise',
        login: 'khulnasoft',
        repoCount: 18,
        memberCount: 42,
        syncStatus: 'completed',
      });
    } else {
      orgRecord = existingOrgs[0];
    }

    // Check if we have repositories in PostgreSQL
    const existingRepos = await getAllDiscoveredRepositories();
    if (existingRepos.length === 0 && orgRecord) {
      await upsertRepositoryRecord({
        githubRepoId: 'repo-core-api',
        orgId: orgRecord.id,
        name: 'core-api',
        fullName: 'khulnasoft/core-api',
        description: 'High-performance core REST & gRPC API gateway for platform orchestration.',
        language: 'Go',
        frameworks: ['Gin', 'gRPC', 'OpenTelemetry'],
        topics: ['api', 'gateway', 'golang', 'microservices', 'opentelemetry'],
        stars: 342,
        forks: 89,
        openIssues: 4,
        healthScore: 94,
        architecture: 'gRPC Gateway Microservice',
      });

      await upsertRepositoryRecord({
        githubRepoId: 'repo-ai-gateway',
        orgId: orgRecord.id,
        name: 'ai-gateway',
        fullName: 'khulnasoft/ai-gateway',
        description: 'Unified Gemini & LLM proxy with dynamic prompt routing and token caching.',
        language: 'TypeScript',
        frameworks: ['Express', 'Google GenAI SDK', 'Redis', 'Vite'],
        topics: ['ai', 'llm', 'gemini', 'proxy', 'rag', 'typescript'],
        stars: 520,
        forks: 114,
        openIssues: 2,
        healthScore: 98,
        architecture: 'AI Model Proxy & Middleware',
      });

      await upsertRepositoryRecord({
        githubRepoId: 'repo-sec-scanner',
        orgId: orgRecord.id,
        name: 'security-scanner',
        fullName: 'khulnasoft/security-scanner',
        description: 'Static analysis and SBOM vulnerability auditor for container & repository code.',
        language: 'Python',
        frameworks: ['FastAPI', 'Trivy', 'Bandit', 'Drizzle'],
        topics: ['security', 'sbom', 'vulnerability', 'ast', 'python'],
        stars: 188,
        forks: 41,
        openIssues: 1,
        healthScore: 91,
        architecture: 'Security Worker & AST Engine',
      });
    }
  } catch (err) {
    console.error('Error seeding initial GitHub PostgreSQL records:', err);
  }
}
