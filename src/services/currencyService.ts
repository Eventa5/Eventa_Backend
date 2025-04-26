import prisma from "../prisma/client";

export const getAllCurrencies = async () => {
  return await prisma.currency.findMany();
};

export const createCurrency = async ({ name, code }: { name: string; code: string }) => {
  return await prisma.currency.create({
    data: {
      name,
      code,
    },
  });
};
