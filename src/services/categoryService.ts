import prisma from "../prisma/client";
import type { CategoryId } from "../schemas/zod/category.schema";
// 取得所有類別
export const getCategoriesData = async () => {
  return await prisma.category.findMany();
};

// 取得單一類別
export const getCategory = async (id: number) => {
  return await prisma.category.findUnique({ where: { id } });
};

export const updateCategoryImg = async (categoryId: CategoryId, image: string) => {
  return await prisma.category.update({
    where: { id: categoryId },
    data: { image },
  });
};
