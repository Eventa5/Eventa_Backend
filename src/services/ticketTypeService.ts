import prisma from "../prisma/client";

export const getTicketTypesByActivityId = async (activityId: number) => {
  return prisma.ticketType.findMany({
    where: {
      activityId,
    },
  });
};
