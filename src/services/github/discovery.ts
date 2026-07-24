import GitHubClient from './client';

const client = new GitHubClient();

export type NormalizedRepo = {
    githubRepoId: string;
    name: string;
    fullName: string;
    description?: string;
    language?: string;
    isPrivate?: boolean;
};

export async function discoverOrgRepos(org: string): Promise<NormalizedRepo[]> {
    const raw = await client.listOrgRepos(org);

    return raw.map((r) => ({
        githubRepoId: `repo-${r.id}`,
        name: r.name,
        fullName: r.full_name,
        description: r.description,
        language: r.language,
        isPrivate: !!r.private,
    }));
}

export default { discoverOrgRepos };
