import type { NextFunction, Request, Response } from "express";
import { activityQuerySchema } from "../schemas/zod/activity.schema";
import * as activityService from "../services/activityService";
import { sendResponse } from "../utils/sendResponse";
import { validateInput } from "../utils/validateInput";

// 取得活動資料
export const getActivities = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const validatedData = validateInput(activityQuerySchema, req.query);
    const activities = await activityService.getActivities(validatedData);
    sendResponse(res, 200, "請求成功", true, activities);
  } catch (error) {
    if (error instanceof Error) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};
