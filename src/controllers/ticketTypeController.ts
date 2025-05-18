import type { NextFunction, Request, Response } from "express";

import { InputValidationError } from "../errors/InputValidationError";
import { ticketTypesSchema } from "../schemas/zod/ticketType.schema";
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
    const validatedData = validateInput(ticketTypesSchema, req.body);
    const activityIdSet = new Set(validatedData.map((item) => item.activityId));

    if (activityIdSet.size > 1) {
      throw new InputValidationError("票種資料的活動 ID 必須相同");
    }

    const activityId = Array.from(activityIdSet)[0];
    const activity = await activityService.getActivityById(activityId);

    if (!activity) {
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
