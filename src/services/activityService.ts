import prisma from "../prisma/client";

export const getActivity = async (activityId: number) => {
  return await prisma.activity.findUnique({
    where: {
      id: activityId,
    },
  });
};
