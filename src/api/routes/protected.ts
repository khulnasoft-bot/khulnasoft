import { Router, Request, Response, NextFunction } from 'express';
import { AuthRequest, requireAuth } from '../../middleware/auth';
import { validateRequest } from '../../api/middleware/validation';
import * as queries from '../../db/queries';
import {
  CreateRepositorySchema,
  UpdateRepositorySchema,
  RepositoryFilterSchema,
  CreateNoteSchema,
  UpdateNoteSchema,
  NotesFilterSchema,
  SyncOrganizationSchema,
  CreateOrganizationSchema,
} from '../../schemas/api';

const router = Router();

/**
 * Apply auth middleware to all routes in this module
 */
router.use(requireAuth);

/**
 * REPOSITORY ROUTES (Protected)
 */

/**
 * GET /api/v1/repositories
 * List repositories with filtering and pagination
 */
router.get('/repositories', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filters = RepositoryFilterSchema.parse(req.query);
    const repos = await queries.searchRepositories(filters);
    
    res.json({
      success: true,
      count: repos.length,
      data: repos,
      filters,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid filters',
        details: error.errors,
      });
    }
    next(error);
  }
});

/**
 * GET /api/v1/repositories/:id
 * Get single repository with relations
 */
router.get('/repositories/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid repository ID',
      });
    }

    const repo = await queries.getRepository(id);
    if (!repo) {
      return res.status(404).json({
        success: false,
        error: 'Repository not found',
      });
    }

    res.json({
      success: true,
      data: repo,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/repositories
 * Create a new repository (requires auth)
 */
router.post(
  '/repositories',
  validateRequest(CreateRepositorySchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = CreateRepositorySchema.parse(req.body);
      
      // Check if repository already exists
      const existing = await queries.getRepositoryByGithubId(data.githubRepoId);
      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'Repository already exists',
        });
      }

      const repo = await queries.createRepository(data);
      
      res.status(201).json({
        success: true,
        data: repo[0],
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid repository data',
          details: error.errors,
        });
      }
      next(error);
    }
  }
);

/**
 * PUT /api/v1/repositories/:id
 * Update a repository
 */
router.put(
  '/repositories/:id',
  validateRequest(UpdateRepositorySchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid repository ID',
        });
      }

      const data = UpdateRepositorySchema.parse(req.body);
      
      // Check if repository exists
      const existing = await queries.getRepository(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Repository not found',
        });
      }

      const repo = await queries.updateRepository(id, data);
      
      res.json({
        success: true,
        data: repo[0],
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid repository data',
          details: error.errors,
        });
      }
      next(error);
    }
  }
);

/**
 * DELETE /api/v1/repositories/:id
 * Delete a repository
 */
router.delete('/repositories/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid repository ID',
      });
    }

    // Check if repository exists
    const existing = await queries.getRepository(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Repository not found',
      });
    }

    await queries.deleteRepository(id);
    
    res.json({
      success: true,
      message: 'Repository deleted',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * NOTES ROUTES (Protected)
 */

/**
 * GET /api/v1/notes
 * Get user's notes with filtering
 */
router.get('/notes', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    const filters = NotesFilterSchema.parse(req.query);
    const notes = await queries.getUserNotes(parseInt(req.user.id), filters);
    
    res.json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid filters',
        details: error.errors,
      });
    }
    next(error);
  }
});

/**
 * POST /api/v1/notes
 * Create a note
 */
router.post(
  '/notes',
  validateRequest(CreateNoteSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      const data = CreateNoteSchema.parse(req.body);
      const note = await queries.createNote(parseInt(req.user.id), data);
      
      res.status(201).json({
        success: true,
        data: note[0],
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid note data',
          details: error.errors,
        });
      }
      next(error);
    }
  }
);

/**
 * PUT /api/v1/notes/:id
 * Update a note
 */
router.put(
  '/notes/:id',
  validateRequest(UpdateNoteSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid note ID',
        });
      }

      const data = UpdateNoteSchema.parse(req.body);
      
      // Verify note belongs to user
      const note = await queries.getNote(id);
      if (!note || note.userId !== parseInt(req.user.id)) {
        return res.status(403).json({
          success: false,
          error: 'You do not have permission to update this note',
        });
      }

      const updated = await queries.updateNote(id, data);
      
      res.json({
        success: true,
        data: updated[0],
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid note data',
          details: error.errors,
        });
      }
      next(error);
    }
  }
);

/**
 * DELETE /api/v1/notes/:id
 * Delete a note
 */
router.delete('/notes/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid note ID',
      });
    }

    // Verify note belongs to user
    const note = await queries.getNote(id);
    if (!note || note.userId !== parseInt(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this note',
      });
    }

    await queries.deleteNote(id);
    
    res.json({
      success: true,
      message: 'Note deleted',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
