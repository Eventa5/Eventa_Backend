import { TicketStatus } from "@prisma/client";
import dayjs from "dayjs";
import prisma from "../prisma/client";

import type { CreateOrderSchema } from "../schemas/zod/order.schema";
import { generateId } from "../utils/idGenerator";

export const createOrder = async (userId: number, data: CreateOrderSchema) => {
  const { activityId, tickets, invoice = {} } = data;
  const orderId = generateId("O");

  const order = await prisma.order.create({
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
      ...invoice,
    },
  });

  await prisma.$transaction(
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
};
