import type { Response } from "express";

// 回應輔助函數
export const sendResponse = <D = any, P = any>(
  res: Response,
  statusCode: number,
  message: string,
  success: boolean,
  data?: D,
  pagination?: P,
): Response<{
  message: string;
  status: boolean;
  data?: D;
  pagination?: P;
}> => {
  return res.status(statusCode).json({
    message,
    status: success,
    ...(data !== undefined && { data }),
    ...(pagination !== undefined && { pagination }),
  });
};
