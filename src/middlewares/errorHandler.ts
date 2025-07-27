import { NextFunction, Request, Response } from 'express';
// import { env } from '../env';
import ErrorResponse from '../interfaces/error-response';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    data: null,
    message: err.message,
    // stack: env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
}