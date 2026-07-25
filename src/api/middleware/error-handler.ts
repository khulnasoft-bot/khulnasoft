import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  details?: any;
}

export class NotFoundError extends Error implements ApiError {
  statusCode = 404;
  constructor(message: string = 'Not found') {
    super(message);
  }
}

export class ValidationError extends Error implements ApiError {
  statusCode = 400;
  constructor(message: string, public details: any) {
    super(message);
  }
}

export class UnauthorizedError extends Error implements ApiError {
  statusCode = 401;
  constructor(message: string = 'Unauthorized') {
    super(message);
  }
}

export function createErrorHandler() {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    const isDevelopment = process.env.NODE_ENV === 'development';

    console.error('[API Error]', {
      path: req.path,
      method: req.method,
      error: err.message,
      statusCode: err.statusCode || 500,
      ...(isDevelopment && { stack: err.stack }),
    });

    const statusCode = err.statusCode || 500;
    const response = {
      success: false,
      error: err.message || 'Internal Server Error',
      ...(isDevelopment && err.details && { details: err.details }),
      ...(isDevelopment && { stack: err.stack }),
    };

    res.status(statusCode).json(response);
  };
}

export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
