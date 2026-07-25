import { z } from 'zod';

/**
 * Repository Schemas
 */
export const CreateRepositorySchema = z.object({
  githubRepoId: z.string().min(1, 'GitHub repo ID required'),
  orgId: z.number().int().positive('Valid organization ID required'),
  name: z.string().min(1, 'Repository name required').max(255),
  fullName: z.string().min(1, 'Full repository name required'),
  description: z.string().optional().nullable(),
  defaultBranch: z.string().default('main'),
  isPrivate: z.boolean().default(false),
  language: z.string().default('TypeScript'),
  frameworks: z.string().optional().nullable(),
  topics: z.string().optional().nullable(),
  stars: z.number().int().default(0),
  forks: z.number().int().default(0),
  openIssues: z.number().int().default(0),
  license: z.string().optional().nullable(),
  healthScore: z.number().int().min(0).max(100).default(90),
  architecture: z.string().default('Microservice'),
});

export const UpdateRepositorySchema = CreateRepositorySchema.partial();

export const RepositoryFilterSchema = z.object({
  search: z.string().optional(),
  language: z.string().optional(),
  minStars: z.number().int().optional(),
  maxStars: z.number().int().optional(),
  isPrivate: z.boolean().optional(),
  orgId: z.number().int().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

/**
 * Organization Schemas
 */
export const CreateOrganizationSchema = z.object({
  githubId: z.string().min(1, 'GitHub org ID required'),
  name: z.string().min(1, 'Organization name required'),
  login: z.string().min(1, 'GitHub login required'),
  avatarUrl: z.string().url().optional().nullable(),
});

export const SyncOrganizationSchema = z.object({
  orgId: z.number().int().positive('Valid organization ID required'),
  syncType: z.enum(['full', 'incremental']).default('full'),
});

export const OrganizationFilterSchema = z.object({
  search: z.string().optional(),
  syncStatus: z.enum(['idle', 'syncing', 'completed', 'failed']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

/**
 * Notes Schemas
 */
export const CreateNoteSchema = z.object({
  repoId: z.string().min(1, 'Repository ID required'),
  repoName: z.string().min(1, 'Repository name required'),
  note: z.string().min(1, 'Note text required').max(5000, 'Note too long'),
  status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
});

export const UpdateNoteSchema = CreateNoteSchema.partial();

export const NotesFilterSchema = z.object({
  status: z.enum(['todo', 'in-progress', 'done']).optional(),
  repoId: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

/**
 * Dependency Schemas
 */
export const CreateDependencySchema = z.object({
  repoId: z.number().int().positive('Valid repository ID required'),
  name: z.string().min(1, 'Dependency name required'),
  version: z.string().min(1, 'Version required'),
  ecosystem: z.enum(['npm', 'pip', 'gradle', 'maven', 'nuget', 'cargo']).default('npm'),
  isDev: z.boolean().default(false),
  vulnerabilityCount: z.number().int().default(0),
});

/**
 * Pagination Helper
 */
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export type CreateRepository = z.infer<typeof CreateRepositorySchema>;
export type UpdateRepository = z.infer<typeof UpdateRepositorySchema>;
export type RepositoryFilter = z.infer<typeof RepositoryFilterSchema>;

export type CreateOrganization = z.infer<typeof CreateOrganizationSchema>;
export type SyncOrganization = z.infer<typeof SyncOrganizationSchema>;
export type OrganizationFilter = z.infer<typeof OrganizationFilterSchema>;

export type CreateNote = z.infer<typeof CreateNoteSchema>;
export type UpdateNote = z.infer<typeof UpdateNoteSchema>;
export type NotesFilter = z.infer<typeof NotesFilterSchema>;

export type CreateDependency = z.infer<typeof CreateDependencySchema>;

export type Pagination = z.infer<typeof PaginationSchema>;
