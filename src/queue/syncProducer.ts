import { syncQueue } from './index';

export async function enqueueOrgSync(org: string, opts?: { priority?: number }) {
    const job = await syncQueue.add('sync-org', { org }, { attempts: 3, backoff: { type: 'exponential', delay: 5000 }, priority: opts?.priority || 1 });
    return job.id;
}

export default { enqueueOrgSync };
