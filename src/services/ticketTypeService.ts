import prisma from "../prisma/client";

export const getTicketTypesByActivityId = async (activityId: number) => {
  return await prisma.ticketType.findMany({
    where: {
      activityId,
    },
  });
};
