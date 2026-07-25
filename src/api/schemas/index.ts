import { z } from 'zod';

export const repositoryFilterSchema = z.object({
  q: z.string().optional(),
  language: z.string().optional(),
  framework: z.string().optional(),
  projectType: z.string().optional(),
  maturity: z.string().optional(),
  visibility: z.enum(['public', 'private', 'all']).optional(),
});

export const syncRequestSchema = z.object({
  orgName: z.string().min(1, 'Organization name required'),
  syncType: z.enum(['full', 'incremental']).optional().default('full'),
});

export const createGitHubAppSchema = z.object({
  name: z.string().min(1),
  appId: z.string().optional(),
  orgName: z.string().min(1),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  webhookSecret: z.string().optional(),
  permissions: z.any().optional(),
});

export const analysisRequestSchema = z.object({
  repoId: z.string().min(1, 'Repository ID required'),
  depth: z.enum(['shallow', 'medium', 'deep']).default('medium'),
});
