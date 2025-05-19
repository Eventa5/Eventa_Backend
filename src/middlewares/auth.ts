import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { InputValidationError } from "../errors/InputValidationError";
import prisma from "../prisma/client";
import { activityIdSchema } from "../schemas/zod/activity.schema";
import { validateInput } from "../utils/validateInput";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// 擴展 Request 型別以包含 user 屬性
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        organizerId?: number; // 可選屬性，主辦者身份驗證為真時使用
      };
    }
  }
}

// 強制登入middleware
export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 從請求標頭獲取並驗證 Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({
        message: "未提供授權令牌",
        status: false,
      });
      return;
    }

    // 提取並驗證 token
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({
        message: "無效的令牌格式",
        status: false,
      });
      return;
    }

    // 驗證 token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
    };

    // 查詢用戶是否存在
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      res.status(401).json({
        message: "無效的令牌，用戶不存在",
        status: false,
      });
      return;
    }

    // 將用戶資訊附加到請求對象
    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    // 處理 jwt.verify 可能拋出的錯誤
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        message: "無效的令牌",
        status: false,
      });
      return;
    }
    next(error);
  }
};

// 可選登入middleware
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return next(); // 沒token就直接跳過
    }

    const token = authHeader.split(" ")[1];
    if (!token) return next();

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
      };
    }
    return next();
  } catch (error) {
    // 略過token解析錯誤
    return next(error);
  }
};

// 活動主辦者身份驗證middleware
export const activityOrganizerAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "未登入或無效 token",
        status: false,
      });
      return;
    }

    const activityId = validateInput(activityIdSchema, req.params.activityId);
    const retrievedActivity = await prisma.activity.findUnique({
      where: {
        id: activityId,
      },
    });
    if (!retrievedActivity) {
      res.status(404).json({
        message: "活動不存在",
        status: false,
      });
      return;
    }

    const { id: userId } = req.user;
    const { organizerId } = retrievedActivity;

    // 查詢用戶是否為主辦者
    const organizer = await prisma.organizer.findFirst({
      where: {
        id: organizerId,
        userId,
      },
    });
    if (!organizer) {
      res.status(403).json({
        message: "無權限訪問，您不是主辦者",
        status: false,
      });
      return;
    }

    req.user = {
      ...req.user,
      organizerId: organizer.id, // 將主辦者ID附加到請求對象
    };

    next();
  } catch (error) {
    if (error instanceof InputValidationError) {
      res.status(400).json({
        message: error.message,
        status: false,
      });
    } else {
      next(error);
    }
  }
};
