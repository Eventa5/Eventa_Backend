import { ActivityStatus, OrderStatus, Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";

import { InputValidationError } from "../errors/InputValidationError";
import {
  type OrderForGenerateCheckoutHtml,
  createOrderSchema,
  getOrdersSchema,
} from "../schemas/zod/order.schema";
import { validateInput } from "../utils/validateInput";

import * as activityService from "../services/activityService";
import * as orderService from "../services/orderService";
import * as ticketTypeService from "../services/ticketTypeService";

const { published } = ActivityStatus;
const { pending } = OrderStatus;

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

  const userId = req.user.id;

  try {
    const order = await orderService.getOrderDetail(userId, req.params.orderId);
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

export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next({
      message: "未提供授權令牌",
      statusCode: 401,
    });
  }

  const userId = req.user.id;

  try {
    const order = await orderService.getOrder(userId, req.params.orderId);
    if (!order) {
      return next({
        message: "訂單不存在",
        statusCode: 404,
      });
    }

    if (order.status !== pending) {
      return next({
        message: "只能取消未付款的訂單",
        statusCode: 409,
      });
    }

    await orderService.cancelOrder(order.id);

    res.status(200).json({
      message: "取消成功",
      status: true,
    });
  } catch (error) {
    next(error);
  }
};

export const checkoutOrder = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next({
      message: "未提供授權令牌",
      statusCode: 401,
    });
  }

  const userId = req.user.id;

  try {
    const order = (await orderService.getOrder(
      userId,
      req.params.orderId,
    )) as OrderForGenerateCheckoutHtml;
    if (!order) {
      return next({
        message: "訂單不存在",
        statusCode: 404,
      });
    }

    if (order.status !== pending) {
      return next({
        message: "只能結帳未付款的訂單",
        statusCode: 409,
      });
    }

    const html = orderService.generateCheckoutHtml(order);

    res.status(200).send(html);
  } catch (error) {
    next(error);
  }
};
