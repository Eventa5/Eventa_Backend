import type { NextFunction, Request, Response } from "express";

import { activityIdSchema } from "../schemas/zod/activity.schema";
import { getActivity } from "../services/activityService";
import { getTicketTypesByActivityId } from "../services/ticketTypeService";
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

    const activity = await getActivity(activityId);
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
