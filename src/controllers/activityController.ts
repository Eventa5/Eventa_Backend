import type { NextFunction, Request, Response } from "express";
import { activityIdSchema } from "../schemas/zod/activity.schema";
import { getActivity } from "../services/activityService";
import { getTicketTypesByActivityId } from "../services/ticketTypeService";

export const getActivityTicketTypes = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next({
      message: "未登入或無效 token",
      statusCode: 401,
    });
  }

  const { success, data, error } = activityIdSchema.safeParse(req.params);
  if (!success) {
    return next({
      message: error.issues[0].message,
      statusCode: 404,
    });
  }

  const { activityId } = data;

  try {
    const activity = await getActivity(activityId);
    if (!activity) {
      return next({
        message: "活動不存在",
        statusCode: 404,
      });
    }

    const ticketTypes = await getTicketTypesByActivityId(activityId);
    if (ticketTypes.length === 0) {
      return next({
        message: "該活動沒有票種",
        statusCode: 404,
      });
    }

    res.status(200).json({
      message: "test",
      status: true,
      data: ticketTypes,
    });
  } catch (error) {
    return next(error);
  }
};
