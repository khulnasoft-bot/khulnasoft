import { discoverOrgRepos } from '../github/discovery';
import { upsertRepositoryRecord, upsertOrganizationRecord, createSyncJobRecord, completeSyncJobRecord } from '../../../db/github';

export async function runOrgSync(orgLogin: string) {
    const org = orgLogin.toLowerCase();

    const orgRecord = await upsertOrganizationRecord({
        githubId: `org-${org}-auto`,
        name: `${org} (synced)`,
        login: org,
        repoCount: 0,
        memberCount: 0,
        syncStatus: 'syncing',
    });

    const syncJob = await createSyncJobRecord(orgRecord.id, 'full');

    const repos = await discoverOrgRepos(org);

    for (const r of repos) {
        await upsertRepositoryRecord({
            githubRepoId: r.githubRepoId,
            orgId: orgRecord.id,
            name: r.name,
            fullName: r.fullName,
            description: r.description,
            language: r.language,
            isPrivate: r.isPrivate,
        });
    }

    await completeSyncJobRecord(syncJob.id, repos.length, repos.length);

    await upsertOrganizationRecord({
        githubId: orgRecord.githubId,
        name: orgRecord.name,
        login: org,
        repoCount: repos.length,
        memberCount: 0,
        syncStatus: 'completed',
        lastSyncedAt: new Date(),
    } as any);

    return { org: orgRecord, reposSynced: repos.length, syncJobId: syncJob.id };
}

export default { runOrgSync };
