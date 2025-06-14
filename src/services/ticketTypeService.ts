import prisma from "../prisma/client";

import type { TicketTypeParams } from "../schemas/zod/ticketType.schema";

export const getTicketTypesByActivityId = async (activityId: number) => {
  return prisma.ticketType.findMany({
    where: {
      activityId,
    },
  });
};

export const getTicketTypeById = async (ticketTypeId: number) => {
  return prisma.ticketType.findUnique({
    where: {
      id: ticketTypeId,
    },
  });
};

export const createTicketTypes = async (activityId: number, ticketTypes: TicketTypeParams[]) => {
  const data = ticketTypes.map((ticketType) => ({
    ...ticketType,
    activityId,
  }));

  return prisma.ticketType.createMany({
    data,
  });
};

export const updateTicketType = async (ticketTypeId: number, data: TicketTypeParams) => {
  return prisma.ticketType.update({
    where: {
      id: ticketTypeId,
    },
    data,
  });
};

export const deleteTicketType = async (ticketTypeId: number) => {
  return prisma.ticketType.delete({
    where: {
      id: ticketTypeId,
    },
  });
};

export const updateTicketTypeStatus = async () => {
  try {
    const now = new Date();
    await prisma.ticketType.updateMany({
      where: {
        saleEndAt: {
          lte: now,
        },
      },
      data: {
        isActive: false,
      },
    });
  } catch (err) {
    throw new Error(`更新已過票種啟用狀態失敗：${err instanceof Error ? err.message : err}`);
  }
};
