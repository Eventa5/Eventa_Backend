import type { NextFunction, Request, Response } from "express";
import { loginSchema, signupSchema, updateProfileSchema } from "../schemas/zod/user.schema";
import * as userService from "../services/userService";
import { validateInput } from "../utils/validateInput";

// 回應輔助函數
const sendResponse = (
  res: Response,
  status: number,
  message: string,
  success: boolean,
  data?: any,
) => {
  return res.status(status).json({
    message,
    status: success,
    ...(data && { data }),
  });
};

// 使用者註冊
export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    try {
      const validatedData = validateInput(signupSchema, req.body);

      await userService.createUser({
        email: validatedData.email,
        password: validatedData.password,
      });
      sendResponse(res, 201, "註冊成功", true);
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, 400, error.message, false);
      } else {
        next(error);
      }
    }
  } catch (error) {
    next(error);
  }
};

// 使用者登入
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    try {
      const validatedData = validateInput(loginSchema, req.body);

      const { token } = await userService.authenticateUser({
        email: validatedData.email,
        password: validatedData.password,
      });
      sendResponse(res, 200, "登入成功", true, token);
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, 400, error.message, false);
      } else {
        next(error);
      }
    }
  } catch (error) {
    next(error);
  }
};

// 獲取使用者資料
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 401, "未授權", false);
      return;
    }

    try {
      const userData = await userService.getUserProfile(userId);
      sendResponse(res, 200, "success", true, userData);
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, 404, error.message, false);
      } else {
        next(error);
      }
    }
  } catch (error) {
    next(error);
  }
};

// 更新使用者資料
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 401, "未授權", false);
      return;
    }

    try {
      const validatedData = validateInput(updateProfileSchema, req.body);

      await userService.updateUserProfile(userId, validatedData);

      sendResponse(res, 200, "更新成功", true);
    } catch (error) {
      if (error instanceof Error) {
        sendResponse(res, 400, error.message, false);
      } else {
        next(error);
      }
    }
  } catch (error) {
    next(error);
  }
};
