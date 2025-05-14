import { get } from "node:http";
import prisma from "../prisma/client";
import type { ActivityQueryParams } from "../schemas/zod/activity.schema";
import * as paginator from "../utils/paginator";

// 取得活動資料
export const getActivities = async (params: ActivityQueryParams) => {
  const { page, limit, categoryId, location, startTime, endTime, keyword, organizerId } = params;

  const where: any = {};
  if (categoryId) where.categoryId = categoryId;
  if (location) where.location = { contains: location };
  if (startTime) where.startTime = { gte: startTime };
  if (endTime) where.endTime = { lte: endTime };
  if (organizerId) where.organizerId = organizerId;
  if (keyword) {
    where.OR = [{ title: { contains: keyword } }, { description: { contains: keyword } }];
  }

  const offset = paginator.getOffset(page, limit);
  const [data, totalItems] = await Promise.all([
    prisma.activity.findMany({
      where,
      skip: offset,
      take: limit,
      select: {
        id: true,
        title: true,
        location: true,
        cover: true,
        isOnline: true,
        startTime: true,
        endTime: true,
      },
      orderBy: {
        startTime: "asc",
      },
    }),
    prisma.activity.count({ where }),
  ]);

  const pagenation = paginator.getPagination(totalItems, page, limit);
  return { data, pagenation };
};
