import { TicketStatus } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { InputValidationError } from "../errors/InputValidationError";
import { ticketIdSchema } from "../schemas/zod/ticket.schema";
import * as ticketService from "../services/ticketService";
import { sendResponse } from "../utils/sendResponse";
import { validateInput } from "../utils/validateInput";

export const patchTicketUsed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = validateInput(ticketIdSchema, req.params.ticketId);
    const ticket = await ticketService.getTicketById(data);
    if (!ticket) {
      sendResponse(res, 404, "票券不存在", false);
      return;
    }

    if (ticket.status !== TicketStatus.assigned) {
      sendResponse(res, 409, "票券狀態錯誤，無法報到", false);
      return;
    }

    // 需為主辦單位才可驗票
    if (!req.user?.organizationIds.includes(ticket.activity.organizationId)) {
      sendResponse(res, 403, "非主辦單位，無權限報到", false);
      return;
    }

    const result = await ticketService.patchTicketUsed(data);
    sendResponse(res, 200, "報到成功", true, result);
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

export const getTicketDetails = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next({
      message: "未提供授權令牌",
      statusCode: 401,
    });
  }

  try {
    const ticketDetails = await ticketService.getTicketDetailsByTicketId(req.params.ticketId);
    if (!ticketDetails) {
      return next({
        message: "票券不存在",
        statusCode: 404,
      });
    }

    const {
      ticketType,
      order: { payment, ...restOrderData },
      activity: { organization, ...restActivityData },
      ...restData
    } = ticketDetails;

    const data = {
      ...restData,
      ...ticketType,
      order: {
        ...restOrderData,
        paymentMethod: payment?.method,
      },
      activity: restActivityData,
      organization,
    };

    res.status(200).json({
      message: "請求成功",
      status: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
