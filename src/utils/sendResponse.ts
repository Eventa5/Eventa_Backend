import type { Response } from "express";

// 回應輔助函數
export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  success: boolean,
  data?: any,
) => {
  return res.status(statusCode).json({
    message,
    status: success,
    ...(data !== undefined && { data }),
  });
};
