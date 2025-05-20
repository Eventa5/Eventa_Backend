import type { NextFunction, Request, Response } from "express";

import { InputValidationError } from "../errors/InputValidationError";
import { activityIdSchema } from "../schemas/zod/activity.schema";
import {
  createTicketTypesSchema,
  ticketTypeIdSchema,
  ticketTypeSchema,
} from "../schemas/zod/ticketType.schema";
import { validateInput } from "../utils/validateInput";

import * as activityService from "../services/activityService";
import * as ticketTypeService from "../services/ticketTypeService";

export const createTicketTypes = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next({
      message: "未提供授權令牌",
      statusCode: 401,
    });
  }

  try {
    const activityId = validateInput(activityIdSchema, req.params.activityId);
    const validatedData = validateInput(createTicketTypesSchema, req.body);

    const retrievedActivity = await activityService.getActivityById(activityId);
    if (!retrievedActivity) {
      return next({
        message: "活動不存在",
        statusCode: 404,
      });
    }

    if (!req.user.organizerIds.includes(retrievedActivity.organizerId)) {
      return next({
        message: "非主辦單位，無法新增票種",
        statusCode: 403,
      });
    }

    const { count } = await ticketTypeService.createTicketTypes(activityId, validatedData);

    res.status(201).json({
      message: "票種新增成功",
      status: true,
      data: `成功新增 ${count} 筆資料`,
    });
  } catch (error) {
    if (error instanceof InputValidationError) {
      next({
        message: error.message,
        statusCode: 400,
      });
    } else {
      next(error);
    }
  }
};

export const updateTicketType = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next({
      message: "未提供授權令牌",
      statusCode: 401,
    });
  }

  try {
    const activityId = validateInput(activityIdSchema, req.params.activityId);
    const ticketTypeId = validateInput(ticketTypeIdSchema, req.params.ticketTypeId);
    const validatedData = validateInput(ticketTypeSchema, req.body);

    const retrievedActivity = await activityService.getActivityById(activityId);
    if (!retrievedActivity) {
      return next({
        message: "活動不存在",
        statusCode: 404,
      });
    }

    if (!req.user.organizerIds.includes(retrievedActivity.organizerId)) {
      return next({
        message: "非主辦單位，無法編輯票種",
        statusCode: 403,
      });
    }

    const retrievedTicketType = await ticketTypeService.getTicketTypeById(ticketTypeId);
    if (!retrievedTicketType) {
      return next({
        message: "該票種不存在",
        statusCode: 404,
      });
    }

    if (retrievedTicketType.activityId !== activityId) {
      return next({
        message: "該票種不屬於此活動",
        statusCode: 404,
      });
    }

    await ticketTypeService.updateTicketType(ticketTypeId, validatedData);

    res.status(200).json({
      message: "編輯成功",
      status: true,
    });
  } catch (error) {
    if (error instanceof InputValidationError) {
      next({
        message: error.message,
        statusCode: 400,
      });
    } else {
      next(error);
    }
  }
};

export const deleteTicketType = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next({
      message: "未提供授權令牌",
      statusCode: 401,
    });
  }

  try {
    const activityId = validateInput(activityIdSchema, req.params.activityId);
    const ticketTypeId = validateInput(ticketTypeIdSchema, req.params.ticketTypeId);

    const retrievedActivity = await activityService.getActivityById(activityId);
    if (!retrievedActivity) {
      return next({
        message: "活動不存在",
        statusCode: 404,
      });
    }

    if (!req.user.organizerIds.includes(retrievedActivity.organizerId)) {
      return next({
        message: "非主辦單位，無法刪除票種",
        statusCode: 403,
      });
    }

    const retrievedTicketType = await ticketTypeService.getTicketTypeById(ticketTypeId);
    if (!retrievedTicketType) {
      return next({
        message: "該票種不存在",
        statusCode: 404,
      });
    }

    if (retrievedTicketType.activityId !== activityId) {
      return next({
        message: "該票種不屬於此活動",
        statusCode: 404,
      });
    }

    await ticketTypeService.deleteTicketType(ticketTypeId);

    res.status(200).json({
      message: "刪除成功",
      status: true,
    });
  } catch (error) {
    if (error instanceof InputValidationError) {
      next({
        message: error.message,
        statusCode: 400,
      });
    } else {
      next(error);
    }
  }
};
