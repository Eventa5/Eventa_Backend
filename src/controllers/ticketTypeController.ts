import { ActivityStep } from "@prisma/client";
import dayjs from "dayjs";
import type { NextFunction, Request, Response } from "express";
import { InputValidationError } from "../errors/InputValidationError";
import { activityIdSchema } from "../schemas/zod/activity.schema";
import {
  createTicketTypesSchema,
  ticketTypeIdSchema,
  ticketTypeSchema,
} from "../schemas/zod/ticketType.schema";
import * as activityService from "../services/activityService";
import * as ticketTypeService from "../services/ticketTypeService";
import { isSkipStep, shouldUpdateStep } from "../utils/activityStep";
import { validateInput } from "../utils/validateInput";

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

    if (!req.user.organizationIds.includes(retrievedActivity.organizationId)) {
      return next({
        message: "非主辦單位，無法新增票種",
        statusCode: 403,
      });
    }

    if (isSkipStep(retrievedActivity.currentStep, ActivityStep.ticketTypes)) {
      return next({
        message: "請依序完成活動步驟，不能跳過未完成的步驟",
        statusCode: 400,
      });
    }

    const retrievedActivityTicketTypeNameSet = new Set(
      retrievedActivity.ticketTypes.map((type) => type.name),
    );
    const creatingTicketTypesNameSet = new Set(validatedData.map((type) => type.name));

    if (creatingTicketTypesNameSet.size !== validatedData.length) {
      return next({
        message: "新增票種的名稱不能重複",
        statusCode: 400,
      });
    }

    for (let i = 1; i <= validatedData.length; i++) {
      const creatingTicketType = validatedData[i - 1];

      if (retrievedActivityTicketTypeNameSet.has(creatingTicketType.name)) {
        return next({
          message: `第 ${i} 個新增票種的名稱已存在，請使用其他名稱`,
          statusCode: 400,
        });
      }

      const creatingTicketTypeStartTime = creatingTicketType.saleStartAt
        ? dayjs(creatingTicketType.saleStartAt).utc()
        : dayjs(creatingTicketType.startTime).utc();
      const creatingTicketTypeEndTime = creatingTicketType.saleEndAt
        ? dayjs(creatingTicketType.saleEndAt).utc()
        : dayjs(creatingTicketType.endTime).utc();
      const activityEndTime = dayjs(retrievedActivity.endTime).utc();

      if (creatingTicketTypeStartTime.isAfter(activityEndTime)) {
        return next({
          message: `第 ${i} 個新增票種的銷售開始時間不可晚於活動結束時間`,
          statusCode: 400,
        });
      }

      if (creatingTicketTypeEndTime.isAfter(activityEndTime)) {
        return next({
          message: `第 ${i} 個新增票種的銷售結束時間不可晚於活動結束時間`,
          statusCode: 400,
        });
      }
    }

    const { count } = await ticketTypeService.createTicketTypes(
      activityId,
      validatedData,
      shouldUpdateStep(retrievedActivity.currentStep, ActivityStep.ticketTypes),
    );

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

    if (!req.user.organizationIds.includes(retrievedActivity.organizationId)) {
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

    const retrievedActivityTicketTypeNameSet = new Set(
      retrievedActivity.ticketTypes
        .filter((type) => type.id !== ticketTypeId)
        .map((type) => type.name),
    );

    if (retrievedActivityTicketTypeNameSet.has(validatedData.name)) {
      return next({
        message: "票種名稱已存在，請使用其他名稱",
        statusCode: 400,
      });
    }

    const updatingTicketTypeStartTime = validatedData.saleStartAt
      ? dayjs(validatedData.saleStartAt).utc()
      : dayjs(validatedData.startTime).utc();
    const updatingTicketTypeEndTime = validatedData.saleEndAt
      ? dayjs(validatedData.saleEndAt).utc()
      : dayjs(validatedData.endTime).utc();
    const activityEndTime = dayjs(retrievedActivity.endTime).utc();

    if (updatingTicketTypeStartTime.isAfter(activityEndTime)) {
      return next({
        message: "票種的銷售開始時間不可晚於活動結束時間",
        statusCode: 400,
      });
    }

    if (updatingTicketTypeEndTime.isAfter(activityEndTime)) {
      return next({
        message: "票種的銷售結束時間不可晚於活動結束時間",
        statusCode: 400,
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

    if (!req.user.organizationIds.includes(retrievedActivity.organizationId)) {
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
