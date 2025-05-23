import type { NextFunction, Request, Response } from "express";
import { InputValidationError } from "../errors/InputValidationError";
import { activityIdSchema, activityQuerySchema } from "../schemas/zod/activity.schema";
import * as activityService from "../services/activityService";
import { getTicketTypesByActivityId } from "../services/ticketTypeService";
import { sendResponse } from "../utils/sendResponse";
import { validateInput } from "../utils/validateInput";

// 取得特定活動的票種資料
export const getActivityTicketTypes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activityId = validateInput(activityIdSchema, req.params.activityId);

    const retrievedActivity = await activityService.getActivityById(activityId);
    if (!retrievedActivity) {
      return next({
        message: "活動不存在",
        statusCode: 404,
      });
    }

    const retrievedTicketTypes = await getTicketTypesByActivityId(activityId);

    res.status(200).json({
      message: "請求成功",
      status: true,
      data: retrievedTicketTypes,
    });
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

// 取得活動資料列表
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
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

// 取得特定活動資料
export const getActivity = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const activityId = validateInput(activityIdSchema, req.params.activityId);
    const userId = req.user?.id || 0;
    const activity = await activityService.getActivityDetails(activityId, userId);
    if (!activity) {
      sendResponse(res, 404, "活動不存在", false);
    } else {
      sendResponse(res, 200, "請求成功", true, activity);
    }
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};
