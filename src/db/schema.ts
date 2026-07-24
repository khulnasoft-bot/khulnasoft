import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const githubApps = pgTable('github_apps', {
  id: serial('id').primaryKey(),
  appId: text('app_id').notNull(),
  name: text('name').notNull(),
  slug: text('slug'),
  clientId: text('client_id'),
  clientSecret: text('client_secret'),
  privateKey: text('private_key'),
  webhookSecret: text('webhook_secret'),
  installationId: text('installation_id'),
  orgName: text('org_name').notNull(),
  status: text('status').default('active').notNull(),
  permissions: text('permissions'),
  events: text('events'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const githubOrganizations = pgTable('github_organizations', {
  id: serial('id').primaryKey(),
  githubId: text('github_id').notNull().unique(),
  name: text('name').notNull(),
  login: text('login').notNull(),
  avatarUrl: text('avatar_url'),
  installationId: text('installation_id'),
  repoCount: integer('repo_count').default(0).notNull(),
  memberCount: integer('member_count').default(0).notNull(),
  syncStatus: text('sync_status').default('idle').notNull(),
  lastSyncedAt: timestamp('last_synced_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const repositories = pgTable('repositories', {
  id: serial('id').primaryKey(),
  githubRepoId: text('github_repo_id').notNull().unique(),
  orgId: integer('org_id').references(() => githubOrganizations.id),
  name: text('name').notNull(),
  fullName: text('full_name').notNull(),
  description: text('description'),
  defaultBranch: text('default_branch').default('main').notNull(),
  isPrivate: boolean('is_private').default(false).notNull(),
  language: text('language').default('TypeScript').notNull(),
  frameworks: text('frameworks'),
  topics: text('topics'),
  stars: integer('stars').default(0).notNull(),
  forks: integer('forks').default(0).notNull(),
  openIssues: integer('open_issues').default(0).notNull(),
  license: text('license'),
  branchProtectionEnabled: boolean('branch_protection_enabled').default(true).notNull(),
  healthScore: integer('health_score').default(90).notNull(),
  astMetadata: text('ast_metadata'),
  architecture: text('architecture').default('Microservice').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const organizationSyncJobs = pgTable('organization_sync_jobs', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').references(() => githubOrganizations.id),
  syncType: text('sync_type').default('full').notNull(),
  status: text('status').default('pending').notNull(),
  reposDiscovered: integer('repos_discovered').default(0).notNull(),
  reposSynced: integer('repos_synced').default(0).notNull(),
  errorMessage: text('error_message'),
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

export const organizationMembers = pgTable('organization_members', {
  id: serial('id').primaryKey(),
  orgId: integer('org_id').references(() => githubOrganizations.id),
  githubUserId: text('github_user_id').notNull(),
  login: text('login').notNull(),
  avatarUrl: text('avatar_url'),
  role: text('role').default('member').notNull(),
  permissions: text('permissions'),
  syncedAt: timestamp('synced_at').defaultNow(),
});

export const repositoryDependencies = pgTable('repository_dependencies', {
  id: serial('id').primaryKey(),
  repoId: integer('repo_id').references(() => repositories.id),
  name: text('name').notNull(),
  version: text('version').notNull(),
  ecosystem: text('ecosystem').default('npm').notNull(),
  isDev: boolean('is_dev').default(false).notNull(),
  vulnerabilityCount: integer('vulnerability_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const repositoryNotes = pgTable('repository_notes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  repoId: text('repo_id').notNull(),
  repoName: text('repo_name').notNull(),
  note: text('note').notNull(),
  status: text('status').default('todo').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  notes: many(repositoryNotes),
}));

export const githubOrganizationsRelations = relations(githubOrganizations, ({ many }) => ({
  repositories: many(repositories),
  syncJobs: many(organizationSyncJobs),
  members: many(organizationMembers),
}));

export const repositoriesRelations = relations(repositories, ({ one, many }) => ({
  organization: one(githubOrganizations, {
    fields: [repositories.orgId],
    references: [githubOrganizations.id],
  }),
  dependencies: many(repositoryDependencies),
}));

export const organizationSyncJobsRelations = relations(organizationSyncJobs, ({ one }) => ({
  organization: one(githubOrganizations, {
    fields: [organizationSyncJobs.orgId],
    references: [githubOrganizations.id],
  }),
}));

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
  organization: one(githubOrganizations, {
    fields: [organizationMembers.orgId],
    references: [githubOrganizations.id],
  }),
}));

export const repositoryDependenciesRelations = relations(repositoryDependencies, ({ one }) => ({
  repository: one(repositories, {
    fields: [repositoryDependencies.repoId],
    references: [repositories.id],
  }),
}));

export const repositoryNotesRelations = relations(repositoryNotes, ({ one }) => ({
  author: one(users, {
    fields: [repositoryNotes.userId],
    references: [users.id],
  }),
}));

