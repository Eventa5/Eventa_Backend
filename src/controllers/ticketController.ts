import type { NextFunction, Request, Response } from "express";
import * as ticketService from "../services/ticketService";

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
