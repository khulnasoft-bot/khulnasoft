import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
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

export const repositoryNotesRelations = relations(repositoryNotes, ({ one }) => ({
  author: one(users, {
    fields: [repositoryNotes.userId],
    references: [users.id],
  }),
}));
