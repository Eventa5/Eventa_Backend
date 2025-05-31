import { TicketStatus } from "@prisma/client";
import dayjs from "dayjs";
import prisma from "../prisma/client";

import type { CreateOrderSchema, OrderQuerySchema } from "../schemas/zod/order.schema";
import { generateId } from "../utils/idGenerator";
import * as paginator from "../utils/paginator";

export const createOrder = async (userId: number, data: CreateOrderSchema) => {
  const { activityId, tickets, invoice = {} } = data;
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
        ...invoice,
      },
    });

    await Promise.all(
      tickets.map(({ id, quantity }) =>
        prisma.ticketType.update({
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
  const { page, limit, status, name, from, to } = queries;

  const offset = paginator.getOffset(page, limit);

  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    skip: offset,
    take: limit,
  });

  return orders;
};
