import { TicketStatus } from "@prisma/client";
import prisma from "../prisma/client";
import type { TicketId } from "../schemas/zod/ticket.schema";

export const getTicketById = async (ticketId: TicketId) => {
  return await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: {
      id: true,
      status: true,
      activity: {
        select: {
          organizationId: true,
        },
      },
    },
  });
};

export const patchTicketUsed = async (ticketId: TicketId) => {
  return await prisma.ticket.update({
    where: { id: ticketId },
    data: { status: TicketStatus.used },
    select: {
      id: true,
      status: true,
    },
  });
};
