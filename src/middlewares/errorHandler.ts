import type { NextFunction, Request, Response } from "express";
import multer from "multer";

interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction) {
  console.error(`[Error] ${req.method} ${req.path} - ${err.message}`);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "伺服器錯誤，請稍後再試",
    status: false,
  });
}

// 處理 multer 錯誤回應
export function multerErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof multer.MulterError) {
    // 檔案大小超過4MB拋錯
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        status: false,
        message: "圖片大小超過4MB",
      });
      return;
    }

    res.status(400).json({
      status: false,
      message: `圖片上傳失敗: ${err.message}`,
    });
    return;
  }
  // 其他錯誤拋給下一個handler
  next(err);
}
