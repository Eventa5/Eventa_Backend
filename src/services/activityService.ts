import { ActivityStatus } from "@prisma/client";
import prisma from "../prisma/client";
import type { ActivityQueryParams } from "../schemas/zod/activity.schema";
import * as paginator from "../utils/paginator";

//
export const getActivityById = async (activityId: number) => {
  return prisma.activity.findUnique({
    where: {
      id: activityId,
    },
  });
};

// 取得活動資料
export const getActivities = async (params: ActivityQueryParams) => {
  const { page, limit, categoryId, location, startTime, endTime, keyword, organizerId } = params;

  const where: any = {
    status: { not: ActivityStatus.draft }, // 排除未發布活動
  };
  if (categoryId) where.categories = { some: { id: categoryId } };
  if (location) where.location = { contains: location };
  if (startTime) where.startTime = { gte: startTime };
  if (endTime) where.endTime = { lte: endTime };
  if (organizerId) where.organizerId = organizerId;
  if (keyword) {
    where.OR = [{ title: { contains: keyword } }, { descriptionMd: { contains: keyword } }];
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

  const pagination = paginator.getPagination(totalItems, page, limit);
  return { data, pagination };
};

// 取得單一活動資料
export const getActivityDetails = async (activityId: number, userId: number) => {
  const activityRaw = await prisma.activity.findFirst({
    where: {
      id: activityId,
      status: { not: ActivityStatus.draft }, // 排除草稿
    },
    include: {
      _count: {
        select: {
          activityLike: true,
        },
      },
      activityLike: {
        where: { userId },
        select: { userId: true },
      },
      orders: {
        where: { userId },
        select: { id: true },
      },
      categories: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!activityRaw) return null;
  const { _count, activityLike, orders, ...activity } = activityRaw;

  return {
    ...activity,
    likeCount: _count.activityLike,
    userStatus: {
      isFavorited: activityLike.length > 0,
      isRegistered: orders.length > 0,
    },
  };
};
