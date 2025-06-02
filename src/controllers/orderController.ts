import { ActivityStatus, OrderStatus, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import type { NextFunction, Request, Response } from "express";

import { InputValidationError } from "../errors/InputValidationError";
import {
  createOrderSchema,
  getOrdersSchema,
  updateOrderStatusSchema,
} from "../schemas/zod/order.schema";
import { validateInput } from "../utils/validateInput";

import * as activityService from "../services/activityService";
import * as orderService from "../services/orderService";
import * as ticketTypeService from "../services/ticketTypeService";

const { published } = ActivityStatus;
const { pending, expired } = OrderStatus;

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next({
      message: "未提供授權令牌",
      statusCode: 401,
    });
  }

  try {
    const validatedData = validateInput(createOrderSchema, req.body);
    const { activityId, tickets, paidAmount } = validatedData;
    const activity = await activityService.getActivityById(activityId);
    if (!activity || activity.status !== published) {
      return next({
        message: "活動不存在",
        statusCode: 404,
      });
    }

    const ticketTypes = await ticketTypeService.getTicketTypesByActivityId(activityId);
    if (!ticketTypes.length) {
      return next({
        message: "活動沒有可用的票種",
        statusCode: 404,
      });
    }

    let totalAmount = new Prisma.Decimal(0);
    const ticketTypeMap = new Map(ticketTypes.map((type) => [type.id, type]));
    const seenTicketIds = new Set();

    for (const ticket of tickets) {
      if (seenTicketIds.has(ticket.id)) {
        return next({
          message: `票種 ID ${ticket.id} 重複`,
          statusCode: 400,
        });
      }
      seenTicketIds.add(ticket.id);

      const ticketType = ticketTypeMap.get(ticket.id);
      if (!ticketType) {
        return next({
          message: `票種 ID ${ticket.id} 不存在`,
          statusCode: 404,
        });
      }

      if (ticket.quantity > ticketType.remainingQuantity) {
        return next({
          message: `票種 ID ${ticket.id} 的數量超過庫存，不可購買`,
          statusCode: 400,
        });
      }

      ticket.refundDeadline = ticketType.saleEndAt || ticketType.endTime;
      const ticketPrice = new Prisma.Decimal(ticketType.price).times(ticket.quantity);
      totalAmount = totalAmount.plus(ticketPrice);
    }

    if (!totalAmount.equals(paidAmount)) {
      return next({
        message: "訂單金額與支付金額不相同，無法創建訂單",
        statusCode: 400,
      });
    }

    const {
      id,
      paidExpiredAt,
      createdAt,
      invoiceAddress,
      invoiceTitle,
      invoiceTaxId,
      invoiceReceiverName,
      invoiceReceiverPhoneNumber,
      invoiceReceiverEmail,
      invoiceCarrier,
      invoiceType,
    } = await orderService.createOrder(req.user.id, validatedData);

    res.status(201).json({
      message: "訂單創建成功",
      status: true,
      data: {
        id,
        activityId,
        paidExpiredAt,
        paidAmount,
        createdAt,
        invoice: {
          invoiceAddress,
          invoiceTitle,
          invoiceTaxId,
          invoiceReceiverName,
          invoiceReceiverPhoneNumber,
          invoiceReceiverEmail,
          invoiceCarrier,
          invoiceType,
        },
      },
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

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next({
      message: "未提供授權令牌",
      statusCode: 401,
    });
  }
  const userId = req.user.id;

  try {
    const validatedQuery = validateInput(getOrdersSchema, req.query);
    const { orders, pagination } = await orderService.getOrders(userId, validatedQuery);

    res.status(200).json({
      message: "請求成功",
      status: true,
      data: orders,
      pagination,
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

export const getOrderDetail = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next({
      message: "未提供授權令牌",
      statusCode: 401,
    });
  }

  const { id: userId } = req.user;
  const { orderId } = req.params;
  if (!orderId) {
    return next({
      message: "缺少訂單 ID",
      statusCode: 400,
    });
  }

  try {
    const order = await orderService.getOrderDetail(userId, orderId);
    if (!order) {
      return next({
        message: "訂單不存在",
        statusCode: 404,
      });
    }

    const tickets = order.tickets.map(
      ({ assignedUser, assignedName, assignedEmail, ticketType, ...restData }) => {
        if (!assignedUser) {
          return {
            ...restData,
            assignedUserId: null,
            assignedName,
            assignedEmail,
            ticketType,
          };
        }

        return {
          ...restData,
          assignedUserId: assignedUser.id,
          assignedName: assignedUser.name,
          assignedEmail: assignedUser.email,
          ticketType,
        };
      },
    );

    res.status(200).json({
      message: "請求成功",
      status: true,
      data: {
        ...order,
        tickets,
      },
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

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next({
      message: "未提供授權令牌",
      statusCode: 401,
    });
  }

  const { id: userId } = req.user;
  const { orderId } = req.params;
  if (!orderId) {
    return next({
      message: "缺少訂單 id",
      statusCode: 400,
    });
  }

  try {
    const { status } = validateInput(updateOrderStatusSchema, req.body);
    const order = await orderService.getOrder(userId, orderId);
    if (!order) {
      return next({
        message: "訂單不存在",
        statusCode: 404,
      });
    }

    if (order.status !== pending) {
      return next({
        message: "只能更新未付款的訂單",
        statusCode: 403,
      });
    }

    const now = dayjs();
    if (status === expired && dayjs(order.paidExpiredAt).isAfter(now)) {
      return next({
        message: "訂單過期時間未到，無法更新為過期狀態",
        statusCode: 403,
      });
    }

    await orderService.updateOrderStatus(order, status);

    res.status(200).json({
      message: "更新成功",
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
