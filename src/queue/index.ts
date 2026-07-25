import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { runOrgSync } from '../services/ingest/syncWorker';

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = Number(process.env.REDIS_PORT || 6379);

export const connection = new IORedis({ host: redisHost, port: redisPort, maxRetriesPerRequest: null });

export const syncQueue = new Queue('org-sync', { connection });

// Worker processing sync jobs
export const syncWorker = new Worker(
    'org-sync',
    async (job) => {
        const org = job.data.org as string;
        console.log(`Processing org-sync job for org=${org}`);
        const result = await runOrgSync(org);
        return result;
    },
    { connection }
);

syncWorker.on('completed', (job, returnvalue) => {
    console.log(`Org sync job ${job.id} completed`, returnvalue);
});

syncWorker.on('failed', (job, err) => {
    console.error(`Org sync job ${job?.id} failed:`, err?.message || err);
});

export async function checkRedisHealth() {
  try {
    await connection.ping();
    console.log('Redis connection healthy');
    return true;
  } catch (error) {
    console.error('Redis connection failed:', error);
    return false;
  }
}

export default { syncQueue, syncWorker };
