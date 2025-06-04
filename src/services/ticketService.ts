import { TicketStatus } from "@prisma/client";
import prisma from "../prisma/client";
import type { TicketId } from "../schemas/zod/ticket.schema";

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
