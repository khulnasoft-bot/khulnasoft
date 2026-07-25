import { Router, Response } from 'express';
import * as queries from '../../db/queries';
import { config } from '../../config';

const router = Router();

/**
 * GET /api/health
 * Basic health check endpoint (no auth required)
 */
router.get('/health', (req, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.environment,
    version: '1.0.0',
  });
});

/**
 * GET /api/health/db
 * Database connectivity check
 */
router.get('/health/db', async (req, res: Response) => {
  try {
    const result = await queries.healthCheckDb();
    res.json({
      status: 'healthy',
      service: 'database',
      ...result,
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'unhealthy',
      service: 'database',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/status
 * Comprehensive system status
 */
router.get('/status', async (req, res: Response) => {
  const status: any = {
    timestamp: new Date().toISOString(),
    environment: config.environment,
    services: {
      database: 'unknown',
    },
  };

  // Check database
  try {
    await queries.healthCheckDb();
    status.services.database = 'operational';
  } catch (error) {
    status.services.database = 'degraded';
    res.statusCode = 503;
  }

  res.json(status);
});

/**
 * GET /api/version
 * Get API version information
 */
router.get('/version', (req, res: Response) => {
  res.json({
    api: '1.0.0',
    node: process.version,
    environment: config.environment,
    deployment: {
      timestamp: new Date().toISOString(),
      commitHash: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
      branch: process.env.VERCEL_GIT_COMMIT_REF || 'unknown',
    },
  });
});

export default router;
