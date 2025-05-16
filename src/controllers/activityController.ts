import type { NextFunction, Request, Response } from "express";
import { activityIdSchema, activityQuerySchema } from "../schemas/zod/activity.schema";
import * as activityService from "../services/activityService";
import { getTicketTypesByActivityId } from "../services/ticketTypeService";

import { sendResponse } from "../utils/sendResponse";
import { validateInput } from "../utils/validateInput";

export const getActivityTicketTypes = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next({
      message: "未登入或無效 token",
      statusCode: 401,
    });
  }

  try {
    const { activityId } = validateInput(activityIdSchema, req.params);

    const activity = await activityService.getActivityById(activityId);
    if (!activity) {
      return next({
        message: "活動不存在",
        statusCode: 404,
      });
    }

    const ticketTypes = await getTicketTypesByActivityId(activityId);

    res.status(200).json({
      message: "請求成功",
      status: true,
      data: ticketTypes,
    });
  } catch (error) {
    if (error instanceof Error) {
      return next({
        message: error.message,
        statusCode: 400,
      });
    }

    return next(error);
  }
};

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
  const { activityId } = validateInput(activityIdSchema, req.params);
  const userId = req.user?.id || 0;
  try {
    const activity = await activityService.getActivityDetails(activityId, userId);
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
