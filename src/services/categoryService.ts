import prisma from "../prisma/client";

// 取得所有類別
export const getCategoriesData = async () => {
  return await prisma.category.findMany();
};
