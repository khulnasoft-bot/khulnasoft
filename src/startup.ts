import { checkDatabaseHealth } from './db';
import { checkRedisHealth } from './queue';

export async function runStartupChecks() {
  console.log('Running startup checks...\n');

  const checks = [
    { name: 'Database', fn: checkDatabaseHealth },
    { name: 'Redis', fn: checkRedisHealth },
  ];

  let allHealthy = true;

  for (const check of checks) {
    try {
      const result = await check.fn();
      if (!result) {
        allHealthy = false;
      }
    } catch (error: any) {
      console.error(`${check.name}: ${error.message}`);
      allHealthy = false;
    }
  }

  if (!allHealthy) {
    console.error('\nSome services are not healthy. Continuing anyway...\n');
  } else {
    console.log('\nAll startup checks passed!\n');
  }

  return allHealthy;
}
