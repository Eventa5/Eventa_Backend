import type { NextFunction, Request, Response } from "express";

import { InputValidationError } from "../errors/InputValidationError";
import {
  createTicketTypesSchema,
  ticketTypeIdSchema,
  updateTicketTypeSchema,
} from "../schemas/zod/ticketType.schema";
import * as activityService from "../services/activityService";
import * as ticketTypeService from "../services/ticketTypeService";
import { validateInput } from "../utils/validateInput";

export const createTicketTypes = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next({
      message: "未提供授權令牌",
      statusCode: 401,
    });
  }

  try {
    if (req.body.length === 0) {
      throw new InputValidationError("需提供至少一筆票種資料");
    }

    const validatedData = validateInput(createTicketTypesSchema, req.body);
    const activityIdSet = new Set(validatedData.map((item) => item.activityId));

    if (activityIdSet.size > 1) {
      throw new InputValidationError("票種資料的活動 ID 必須相同");
    }

    const activityId = Array.from(activityIdSet)[0];
    const retrievedActivity = await activityService.getActivityById(activityId);

    if (!retrievedActivity) {
      return next({
        message: "活動不存在",
        statusCode: 404,
      });
    }

    const { count } = await ticketTypeService.createTicketTypes(validatedData);

    res.status(201).json({
      message: "票種資料創建成功",
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
    const ticketTypeId = validateInput(ticketTypeIdSchema, req.params.ticketTypeId);
    const retrievedTicketType = await ticketTypeService.getTicketTypeById(ticketTypeId);
    if (!retrievedTicketType) {
      return next({
        message: "該票種不存在",
        statusCode: 404,
      });
    }

    const validatedData = validateInput(updateTicketTypeSchema, req.body);
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
    }
    next(error);
  }
};
