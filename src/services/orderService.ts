import { TicketStatus } from "@prisma/client";
import dayjs from "dayjs";
import prisma from "../prisma/client";

import type { CreateOrderSchema, OrderQuerySchema } from "../schemas/zod/order.schema";
import { generateId } from "../utils/idGenerator";
import * as paginator from "../utils/paginator";

export const createOrder = async (userId: number, data: CreateOrderSchema) => {
  const { activityId, tickets, paidAmount, invoice = {} } = data;
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

export const getOrdersByUserId = async (userId: number, queries: OrderQuerySchema) => {
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
