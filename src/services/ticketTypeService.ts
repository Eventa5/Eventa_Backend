import { ActivityStep } from "@prisma/client";
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
    include: {
      tickets: {
        select: {
          status: true,
        },
      },
    },
  });
};

export const createTicketTypes = async (
  activityId: number,
  ticketTypes: TicketTypeParams[],
  shouldUpdateStep: boolean,
) => {
  const data = ticketTypes.map((ticketType) => ({
    ...ticketType,
    activityId,
  }));

  const result = await prisma.ticketType.createMany({ data });

  if (shouldUpdateStep) {
    await prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        currentStep: ActivityStep.ticketTypes,
      },
    });
  }

  return result;
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

export const deactivateTicketTypeStatus = async () => {
  try {
    const now = new Date();

    await prisma.ticketType.updateMany({
      where: {
        endTime: {
          lte: now,
        },
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });
  } catch (err) {
    throw new Error(`更新票種關閉狀態失敗：${err instanceof Error ? err.message : err}`);
  }
};

export const activateTicketTypeStatusToTrue = async () => {
  try {
    const now = new Date();

    await prisma.ticketType.updateMany({
      where: {
        startTime: {
          lte: now,
        },
        endTime: {
          gt: now,
        },
        isActive: false,
      },
      data: {
        isActive: true,
      },
    });
  } catch (err) {
    throw new Error(`更新票種啟用狀態失敗：${err instanceof Error ? err.message : err}`);
  }
};
