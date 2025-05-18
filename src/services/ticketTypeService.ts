import prisma from "../prisma/client";

import type { ActivityIdParams } from "../schemas/zod/activity.schema";
import type { TicketTypesParams } from "../schemas/zod/ticketType.schema";

export const getTicketTypesByActivityId = async (activityId: ActivityIdParams) => {
  return prisma.ticketType.findMany({
    where: {
      activityId,
    },
  });
};

export const createTicketTypes = async (ticketTypes: TicketTypesParams) => {
  return prisma.ticketType.createMany({
    data: ticketTypes,
  });
};
