import type { NextFunction, Request, Response } from "express";

interface AppError extends Error {
  status?: number;
  code?: string;
}

export function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction) {
  console.error(`[Error] ${req.method} ${req.path} - ${err.message}`);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    status: false,
    message: err.message || "Internal Server Error",
    // code: err.code || "INTERNAL_ERROR",
  });
}
