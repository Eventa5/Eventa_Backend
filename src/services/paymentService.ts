import prisma from "../prisma/client";

export const getCheckoutResult = async (orderId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { orderId },
    select: {
      rawData: true,
    },
  });

  return payment;
};
