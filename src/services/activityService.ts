import { ActivityStatus, ActivityStep } from "@prisma/client";
import { InputValidationError } from "../errors/InputValidationError";
import prisma from "../prisma/client";
import type {
  ActivityId,
  ActivityQueryParams,
  CreateActivityBody,
  EditActivityBody,
  PatchActivityBasicInfoBody,
  PatchActivityCategoriesBody,
  PatchActivityContentBody,
} from "../schemas/zod/activity.schema";
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
  const { page, limit, categoryId, location, startTime, endTime, keyword, organizationId } = params;

  const where: any = {
    status: { not: ActivityStatus.draft }, // 排除未發布活動
  };
  if (categoryId) where.categories = { some: { id: categoryId } };
  if (location) where.location = { contains: location };
  if (startTime) where.startTime = { gte: startTime };
  if (endTime) where.endTime = { lte: endTime };
  if (organizationId) where.organizationId = organizationId;
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
    tags: activity.tags?.split(",") || [],
    likeCount: _count.activityLike,
    userStatus: {
      isFavorited: activityLike.length > 0,
      isRegistered: orders.length > 0,
    },
  };
};

// 新增活動
export const createActivity = async (data: CreateActivityBody) => {
  return prisma.activity.create({
    data,
    select: {
      id: true,
      currentStep: true,
    },
  });
};

// 設定活動主題
export const patchActivityCategories = async (
  activityId: ActivityId,
  data: PatchActivityCategoriesBody,
) => {
  // 檢查categoryId存在
  const existingCategories = await prisma.category.findMany({
    where: {
      id: { in: data.categoryIds },
    },
    select: {
      id: true,
    },
  });

  const existingCategoryIds = existingCategories.map((category) => category.id);
  const invalidCategoryIds = data.categoryIds.filter((id) => !existingCategoryIds.includes(id));
  if (invalidCategoryIds.length > 0) {
    throw new InputValidationError(`無效的Category ID: ${invalidCategoryIds.join(", ")}`);
  }

  return prisma.activity.update({
    where: {
      id: activityId,
    },
    data: {
      categories: {
        set: [],
        connect: data.categoryIds.map((id) => ({ id })),
      },
      currentStep: ActivityStep.categories,
    },
    select: {
      id: true,
      currentStep: true,
    },
  });
};

// 設定活動基本資料
export const patchActivityBasicInfo = async (
  activityId: ActivityId,
  data: PatchActivityBasicInfoBody,
) => {
  return prisma.activity.update({
    where: {
      id: activityId,
    },
    data: {
      ...data,
      tags: data.tags?.join(", ") || "",
      currentStep: ActivityStep.basic,
    },
    select: {
      id: true,
      currentStep: true,
    },
  });
};

// 設定活動詳細內容
export const patchActivityContent = async (
  activityId: ActivityId,
  data: PatchActivityContentBody,
) => {
  return prisma.activity.update({
    where: {
      id: activityId,
    },
    data: {
      ...data,
      currentStep: ActivityStep.content,
    },
    select: {
      id: true,
      currentStep: true,
    },
  });
};

// 發布活動
export const patchActivityPublish = async (activityId: ActivityId) => {
  return prisma.activity.update({
    where: {
      id: activityId,
    },
    data: {
      status: ActivityStatus.published,
    },
    select: {
      id: true,
      status: true,
    },
  });
};

// 取消活動
export const cancelActivity = async (activityId: ActivityId) => {
  return prisma.activity.update({
    where: {
      id: activityId,
    },
    data: {
      status: ActivityStatus.canceled,
    },
    select: {
      id: true,
      status: true,
    },
  });
};

// 編輯活動
export const editActivity = async (activityId: ActivityId, data: EditActivityBody) => {
  return prisma.activity.update({
    where: {
      id: activityId,
    },
    data: {
      ...data,
      tags: data.tags?.join(", ") || "",
    },
    select: {
      id: true,
    },
  });
};
