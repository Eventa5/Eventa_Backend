import { OrderStatus, TicketStatus } from "@prisma/client";
import dayjs from "dayjs";
import prisma from "../prisma/client";

import type { CreateOrderSchema, OrderQuerySchema } from "../schemas/zod/order.schema";
import { generateId } from "../utils/idGenerator";
import * as paginator from "../utils/paginator";

const { pending, expired, canceled } = OrderStatus;

export const createOrder = async (userId: number, data: CreateOrderSchema) => {
  const { activityId, tickets, paidAmount, invoice } = data;
  const orderId = generateId("O");

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        id: orderId,
        createdAt: dayjs().toDate(),
        paidExpiredAt: dayjs().add(10, "minutes").toDate(),
        user: {
          connect: {
            id: userId,
          },
        },
        activity: {
          connect: {
            id: activityId,
          },
        },
        tickets: {
          create: tickets.map(({ id, refundDeadline }) => {
            const ticketId = generateId("T");

            return {
              id: ticketId,
              qrCodeToken: `${ticketId}-${TicketStatus.unassigned}`,
              refundDeadline: refundDeadline || dayjs().add(7, "day").toDate(),
              ticketType: {
                connect: {
                  id,
                },
              },
              activity: {
                connect: {
                  id: activityId,
                },
              },
            };
          }),
        },
        orderItems: {
          create: tickets.map(({ id, quantity }) => ({
            ticketType: {
              connect: {
                id,
              },
            },
            quantity,
          })),
        },
        payment: {
          create: {
            paidAmount,
          },
        },
        ...invoice,
      },
    });

    await Promise.all(
      tickets.map(({ id, quantity }) =>
        tx.ticketType.update({
          where: { id },
          data: {
            remainingQuantity: {
              decrement: quantity,
            },
          },
        }),
      ),
    );

    return order;
  });
};

export const getOrders = async (userId: number, queries: OrderQuerySchema) => {
  const { page, limit, status, title, from, to } = queries;
  const offset = paginator.getOffset(page, limit);
  const where: Record<string, any> = {
    userId,
  };

  if (status) {
    where.status = status;
  }

  if (title) {
    where.activity = {
      title: {
        contains: title,
        mode: "insensitive",
      },
    };
  }

  if (from && to) {
    where.createdAt = {
      gte: dayjs(from).toDate(),
      lte: dayjs(to).toDate(),
    };
  }

  const [orders, totalItems] = await Promise.all([
    prisma.order.findMany({
      where,
      select: {
        id: true,
        status: true,
        paidAt: true,
        paidExpiredAt: true,
        createdAt: true,
        activity: {
          select: {
            id: true,
            title: true,
            cover: true,
            isOnline: true,
          },
        },
        payment: {
          select: {
            method: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  const pagination = paginator.getPagination(totalItems, page, limit);

  return {
    orders,
    pagination,
  };
};

export const getOrderDetail = async (userId: number, orderId: string) => {
  return prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    select: {
      id: true,
      paidAt: true,
      paidExpiredAt: true,
      status: true,
      invoiceAddress: true,
      invoiceReceiverName: true,
      invoiceReceiverEmail: true,
      invoiceReceiverPhoneNumber: true,
      invoiceTitle: true,
      invoiceTaxId: true,
      invoiceCarrier: true,
      invoiceType: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          displayName: true,
          email: true,
          phoneNumber: true,
          gender: true,
        },
      },
      activity: {
        select: {
          title: true,
          tags: true,
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
          endTime: true,
        },
      },
      payment: {
        select: {
          method: true,
          paidAmount: true,
        },
      },
      tickets: {
        select: {
          id: true,
          status: true,
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          assignedName: true,
          assignedEmail: true,
          refundDeadline: true,
          ticketType: {
            select: {
              id: true,
              name: true,
              price: true,
              startTime: true,
              endTime: true,
            },
          },
        },
      },
    },
  });
};

export const getOrder = async (userId: number, orderId: string) => {
  return prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    select: {
      id: true,
      status: true,
    },
  });
};

export const updateOrderStatus = async (
  order: { id: string; status: OrderStatus },
  status: OrderStatus,
) => {
  if (order.status !== pending) {
    throw new Error("只能更新未付款的訂單");
  }

  if (status === canceled || status === expired) {
    return prisma.$transaction(async (tx) => {
      await tx.ticket.updateMany({
        where: { orderId: order.id },
        data: {
          status: TicketStatus.canceled,
          assignedUserId: null,
          assignedName: null,
          assignedEmail: null,
        },
      });

      const orderItem = await tx.orderItem.findMany({
        where: { orderId: order.id },
        select: {
          ticketTypeId: true,
          quantity: true,
        },
      });

      await Promise.all(
        orderItem.map(({ ticketTypeId, quantity }) =>
          tx.ticketType.update({
            where: { id: ticketTypeId },
            data: {
              remainingQuantity: {
                increment: quantity,
              },
            },
          }),
        ),
      );

      await tx.order.update({
        where: { id: order.id },
        data: { status },
      });
    });
  }

  return prisma.order.update({
    where: { id: order.id },
    data: { status },
  });
};
