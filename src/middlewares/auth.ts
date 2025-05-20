import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import prisma from "../prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// 擴展 Request 型別以包含 user 屬性
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        organizerIds: { id: number }[];
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

    // 查詢用戶的主辦者ID
    const organizerIds = await prisma.organizer.findMany({
      where: { userId: decoded.id },
      select: { id: true },
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
      organizerIds,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        message: "無效的令牌",
        status: false,
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        message: "令牌已過期",
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
    const organizerIds = await prisma.organizer.findMany({
      where: { userId: decoded.id },
      select: { id: true },
    });

    if (!user) {
      res.status(401).json({
        message: "無效的令牌，用戶不存在",
        status: false,
      });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      organizerIds,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        message: "無效的令牌",
        status: false,
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        message: "令牌已過期",
        status: false,
      });
      return;
    }

    next(error);
  }
};
