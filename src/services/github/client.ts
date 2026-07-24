import crypto from 'crypto';

type Repo = {
    id: number;
    name: string;
    full_name: string;
    private: boolean;
    description?: string;
    language?: string;
};

export class GitHubClient {
    private appId: string | undefined;
    private webhookSecret: string | undefined;

    constructor(opts?: { appId?: string; webhookSecret?: string }) {
        this.appId = opts?.appId || process.env.GITHUB_APP_ID;
        this.webhookSecret = opts?.webhookSecret || process.env.GITHUB_WEBHOOK_SECRET;
    }

    // Basic HMAC verification helper for webhook payloads
    verifyWebhookSignature(rawBody: Buffer, signatureHeader?: string | null) {
        if (!this.webhookSecret) return false;
        if (!signatureHeader) return false;

        const expected = 'sha256=' + crypto.createHmac('sha256', this.webhookSecret).update(rawBody).digest('hex');
        // Use constant-time comparison
        return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
    }

    // List repositories for an organization using GitHub REST API v3.
    // If GITHUB_TOKEN is present in env, it will be used; otherwise the function returns an empty array.
    async listOrgRepos(org: string): Promise<Repo[]> {
        const token = process.env.GITHUB_TOKEN;
        if (!token) {
            // Fallback: return empty list so other parts of the app can use a discovery cache
            return [];
        }

        const repos: Repo[] = [];
        let page = 1;
        const perPage = 100;

        while (true) {
            const url = `https://api.github.com/orgs/${encodeURIComponent(org)}/repos?per_page=${perPage}&page=${page}`;
            const resp = await fetch(url, {
                headers: {
                    Authorization: `token ${token}`,
                    Accept: 'application/vnd.github+json',
                    'User-Agent': 'khulnasoft-repo-inventory',
                },
            });

            if (!resp.ok) break;

            const batch = (await resp.json()) as Repo[];
            if (!batch || batch.length === 0) break;

            repos.push(...batch);
            if (batch.length < perPage) break;
            page += 1;
        }

        return repos;
    }
}

export default GitHubClient;
