import prisma from "../prisma/client";

import type { ActivityIdParams } from "../schemas/zod/activity.schema";
import type { TicketTypeIdParams, TicketTypeParams } from "../schemas/zod/ticketType.schema";

export const getTicketTypesByActivityId = async (activityId: ActivityIdParams) => {
  return prisma.ticketType.findMany({
    where: {
      activityId,
    },
  });
};

export const createTicketTypes = async (ticketTypes: TicketTypeParams[]) => {
  return prisma.ticketType.createMany({
    data: ticketTypes,
  });
};

export const getTicketTypeById = async (ticketTypeId: TicketTypeIdParams) => {
  return prisma.ticketType.findUnique({
    where: {
      id: ticketTypeId,
    },
  });
};

export const updateTicketType = async (
  ticketTypeId: TicketTypeIdParams,
  data: Partial<TicketTypeParams>,
) => {
  return prisma.ticketType.update({
    where: {
      id: ticketTypeId,
    },
    data,
  });
};
