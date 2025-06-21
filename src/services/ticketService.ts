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
          startTime: true,
          endTime: true,
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

export const getTicketDetailsByTicketId = async (ticketId: string) => {
  return prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
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
      qrCodeToken: true,
      ticketType: {
        select: {
          name: true,
          price: true,
          startTime: true,
          endTime: true,
        },
      },
      order: {
        select: {
          id: true,
          status: true,
          paidAt: true,
          payment: {
            select: {
              method: true,
            },
          },
        },
      },
      activity: {
        select: {
          id: true,
          title: true,
          summary: true,
          notes: true,
          descriptionMd: true,
          location: true,
          livestreamUrl: true,
          startTime: true,
          endTime: true,
          organization: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
              countryCode: true,
              ext: true,
              officialSiteUrl: true,
            },
          },
        },
      },
    },
  });
};

export const updateExpiredTicket = async () => {
  try {
    const now = new Date();
    await prisma.ticket.updateMany({
      where: {
        status: {
          notIn: [TicketStatus.canceled, TicketStatus.used, TicketStatus.overdue],
        },
        ticketType: {
          is: {
            endTime: { lte: now },
          },
        },
      },
      data: { status: TicketStatus.overdue },
    });
  } catch (err) {
    throw new Error(`更新已過票券狀態失敗：${err instanceof Error ? err.message : err}`);
  }
};
