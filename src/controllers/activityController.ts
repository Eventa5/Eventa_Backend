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
    const { data, pagination } = await activityService.getActivities(validatedData);

    sendResponse(res, 200, "請求成功", true, data, pagination);
  } catch (error) {
    if (error instanceof Error) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

export const getActivity = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const activityId = Number(req.params.activityId);
  const userId = req.user?.id || 0;
  try {
    const activity = await activityService.getActivity(activityId, userId);
    if (!activity) {
      sendResponse(res, 404, "活動不存在", false);
    } else {
      sendResponse(res, 200, "請求成功", true, activity);
    }
  } catch (error) {
    if (error instanceof Error) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};
