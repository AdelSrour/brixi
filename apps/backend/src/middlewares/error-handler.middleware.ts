import { Request, Response, NextFunction } from 'express';

export function errorHandlerMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const status = err?.status || err?.statusCode || 500;
  res.status(status).json({
    success: false,
    statusCode: status,
    message: err?.message || 'Internal server error',
    error: err?.name || 'Error',
  });
}
