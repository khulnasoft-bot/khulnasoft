import { db } from './index';
import {
  users,
  repositories,
  githubOrganizations,
  repositoryNotes,
  repositoryDependencies,
  organizationSyncJobs,
  organizationMembers,
} from './schema';
import { eq, like, and, gte, lte, desc } from 'drizzle-orm';
import {
  CreateRepository,
  CreateOrganization,
  CreateNote,
  CreateDependency,
  RepositoryFilter,
  OrganizationFilter,
  NotesFilter,
} from '../schemas/api';

/**
 * USER OPERATIONS
 */
export async function getUserByEmail(email: string) {
  return db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

export async function getUserByUid(uid: string) {
  return db.query.users.findFirst({
    where: eq(users.uid, uid),
  });
}

export async function createUser(data: {
  uid: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
}) {
  return db.insert(users).values(data).returning();
}

export async function updateUserProfile(uid: string, data: Partial<typeof data>) {
  return db.update(users).set(data).where(eq(users.uid, uid)).returning();
}

/**
 * REPOSITORY OPERATIONS
 */
export async function createRepository(data: CreateRepository) {
  return db.insert(repositories).values(data).returning();
}

export async function getRepository(id: number) {
  return db.query.repositories.findFirst({
    where: eq(repositories.id, id),
    with: {
      organization: true,
      dependencies: true,
    },
  });
}

export async function getRepositoryByGithubId(githubRepoId: string) {
  return db.query.repositories.findFirst({
    where: eq(repositories.githubRepoId, githubRepoId),
    with: {
      organization: true,
      dependencies: true,
    },
  });
}

export async function searchRepositories(filters: RepositoryFilter) {
  const { search, language, minStars, maxStars, isPrivate, orgId, page, limit } = filters;
  const offset = (page - 1) * limit;

  const conditions = [];

  if (search) {
    conditions.push(
      or(
        like(repositories.name, `%${search}%`),
        like(repositories.description, `%${search}%`)
      )
    );
  }
  if (language) conditions.push(eq(repositories.language, language));
  if (isPrivate !== undefined) conditions.push(eq(repositories.isPrivate, isPrivate));
  if (orgId) conditions.push(eq(repositories.orgId, orgId));
  if (minStars !== undefined) conditions.push(gte(repositories.stars, minStars));
  if (maxStars !== undefined) conditions.push(lte(repositories.stars, maxStars));

  const query = conditions.length > 0 ? and(...conditions) : undefined;

  return db.query.repositories.findMany({
    where: query,
    with: {
      organization: true,
      dependencies: true,
    },
    limit,
    offset,
  });
}

export async function updateRepository(id: number, data: Partial<CreateRepository>) {
  return db.update(repositories).set(data).where(eq(repositories.id, id)).returning();
}

export async function updateRepositoryHealthScore(id: number, score: number) {
  return db.update(repositories)
    .set({ healthScore: score })
    .where(eq(repositories.id, id))
    .returning();
}

export async function deleteRepository(id: number) {
  return db.delete(repositories).where(eq(repositories.id, id)).returning();
}

/**
 * ORGANIZATION OPERATIONS
 */
export async function createOrganization(data: CreateOrganization) {
  return db.insert(githubOrganizations).values(data).returning();
}

export async function getOrganization(id: number) {
  return db.query.githubOrganizations.findFirst({
    where: eq(githubOrganizations.id, id),
    with: {
      repositories: true,
      syncJobs: true,
      members: true,
    },
  });
}

export async function getOrganizationByGithubId(githubId: string) {
  return db.query.githubOrganizations.findFirst({
    where: eq(githubOrganizations.githubId, githubId),
    with: {
      repositories: true,
      members: true,
    },
  });
}

export async function searchOrganizations(filters: OrganizationFilter) {
  const { search, syncStatus, page, limit } = filters;
  const offset = (page - 1) * limit;

  const conditions = [];

  if (search) {
    conditions.push(
      or(
        like(githubOrganizations.name, `%${search}%`),
        like(githubOrganizations.login, `%${search}%`)
      )
    );
  }
  if (syncStatus) conditions.push(eq(githubOrganizations.syncStatus, syncStatus));

  const query = conditions.length > 0 ? and(...conditions) : undefined;

  return db.query.githubOrganizations.findMany({
    where: query,
    with: {
      repositories: true,
      syncJobs: true,
    },
    limit,
    offset,
  });
}

export async function updateOrganization(
  id: number,
  data: Partial<typeof githubOrganizations.$inferInsert>
) {
  return db.update(githubOrganizations).set(data).where(eq(githubOrganizations.id, id)).returning();
}

/**
 * ORGANIZATION SYNC JOB OPERATIONS
 */
export async function createSyncJob(data: {
  orgId: number;
  syncType: 'full' | 'incremental';
}) {
  return db.insert(organizationSyncJobs).values(data).returning();
}

export async function getSyncJob(id: number) {
  return db.query.organizationSyncJobs.findFirst({
    where: eq(organizationSyncJobs.id, id),
    with: {
      organization: true,
    },
  });
}

export async function getLatestSyncJob(orgId: number) {
  return db.query.organizationSyncJobs.findFirst({
    where: eq(organizationSyncJobs.orgId, orgId),
    with: {
      organization: true,
    },
    orderBy: desc(organizationSyncJobs.startedAt),
  });
}

export async function updateSyncJob(
  id: number,
  data: Partial<typeof organizationSyncJobs.$inferInsert>
) {
  return db
    .update(organizationSyncJobs)
    .set(data)
    .where(eq(organizationSyncJobs.id, id))
    .returning();
}

/**
 * NOTES OPERATIONS
 */
export async function createNote(userId: number, data: CreateNote) {
  return db.insert(repositoryNotes).values({ ...data, userId }).returning();
}

export async function getNote(id: number) {
  return db.query.repositoryNotes.findFirst({
    where: eq(repositoryNotes.id, id),
    with: {
      author: true,
    },
  });
}

export async function getUserNotes(userId: number, filters: NotesFilter) {
  const { status, repoId, page, limit } = filters;
  const offset = (page - 1) * limit;

  const conditions = [eq(repositoryNotes.userId, userId)];

  if (status) conditions.push(eq(repositoryNotes.status, status));
  if (repoId) conditions.push(eq(repositoryNotes.repoId, repoId));

  return db.query.repositoryNotes.findMany({
    where: and(...conditions),
    with: {
      author: true,
    },
    orderBy: desc(repositoryNotes.createdAt),
    limit,
    offset,
  });
}

export async function updateNote(
  id: number,
  data: Partial<typeof repositoryNotes.$inferInsert>
) {
  return db.update(repositoryNotes).set(data).where(eq(repositoryNotes.id, id)).returning();
}

export async function deleteNote(id: number) {
  return db.delete(repositoryNotes).where(eq(repositoryNotes.id, id)).returning();
}

/**
 * DEPENDENCY OPERATIONS
 */
export async function createDependency(data: CreateDependency) {
  return db.insert(repositoryDependencies).values(data).returning();
}

export async function getRepositoryDependencies(repoId: number) {
  return db.query.repositoryDependencies.findMany({
    where: eq(repositoryDependencies.repoId, repoId),
    with: {
      repository: true,
    },
  });
}

export async function getDependenciesWithVulnerabilities(repoId: number) {
  return db.query.repositoryDependencies.findMany({
    where: and(
      eq(repositoryDependencies.repoId, repoId),
      gte(repositoryDependencies.vulnerabilityCount, 1)
    ),
  });
}

export async function updateDependency(
  id: number,
  data: Partial<typeof repositoryDependencies.$inferInsert>
) {
  return db
    .update(repositoryDependencies)
    .set(data)
    .where(eq(repositoryDependencies.id, id))
    .returning();
}

export async function deleteDependency(id: number) {
  return db.delete(repositoryDependencies).where(eq(repositoryDependencies.id, id)).returning();
}

/**
 * ORGANIZATION MEMBERS OPERATIONS
 */
export async function getOrganizationMembers(orgId: number) {
  return db.query.organizationMembers.findMany({
    where: eq(organizationMembers.orgId, orgId),
    with: {
      organization: true,
    },
  });
}

export async function createOrganizationMember(data: {
  orgId: number;
  githubUserId: string;
  login: string;
  avatarUrl?: string;
  role?: string;
  permissions?: string;
}) {
  return db.insert(organizationMembers).values(data).returning();
}

export async function updateOrganizationMember(
  id: number,
  data: Partial<typeof organizationMembers.$inferInsert>
) {
  return db
    .update(organizationMembers)
    .set(data)
    .where(eq(organizationMembers.id, id))
    .returning();
}

// Helper for batch operations
export async function createRepositoriesBatch(
  orgId: number,
  repos: Omit<CreateRepository, 'orgId'>[]
) {
  return db
    .insert(repositories)
    .values(repos.map((r) => ({ ...r, orgId })))
    .returning();
}

// Helper to check database connectivity
export async function healthCheckDb() {
  try {
    await db.execute(sql`SELECT 1`);
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    throw new Error(`Database health check failed: ${error}`);
  }
}

// Import sql for health check
import { sql, or } from 'drizzle-orm';
