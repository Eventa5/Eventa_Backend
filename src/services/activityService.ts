import { ActivityStatus, ActivityStep, OrderStatus, Prisma, TicketStatus } from "@prisma/client";
import dayjs from "dayjs";
import { InputValidationError } from "../errors/InputValidationError";
import prisma from "../prisma/client";
import type {
  ActivityId,
  ActivityQueryParams,
  CreateActivityBody,
  EditActivityBody,
  LimitQuery,
  PaginationQuery,
  PatchActivityBasicInfoBody,
  PatchActivityCategoriesBody,
  PatchActivityContentBody,
  StatisticsPeriodQuery,
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
  const { page, limit, categoryId, location, startTime, endTime, keyword, organizationId, status } =
    params;

  const where: any = {
    status: status ? status : { in: [ActivityStatus.published, ActivityStatus.ended] }, // 預設查已發布+已結束
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
        status: true,
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
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
    },
    include: {
      organization: {
        select: { userId: true },
      },
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

  // 判斷是否為主辦身分
  const isOrganizer = activityRaw.organization.userId === userId;

  // 非主辦身分, 只回已發布的活動
  if (!isOrganizer && activityRaw.status !== ActivityStatus.published) return null;

  // 一般使用者瀏覽則更新瀏覽次數
  if (!isOrganizer) {
    await prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }

  const { _count, activityLike, orders, organization, ...activity } = activityRaw;

  return {
    ...activity,
    tags: activity.tags?.split(",") || [],
    likeCount: _count.activityLike,
    userStatus: {
      isFavorite: activityLike.length > 0,
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
      tags: data.tags?.join(",") || "",
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
  // 更新活動狀態
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
  // 更新訂單狀態 => status: OrderStatus.canceled
  // 更新票券狀態 => status: TicketStatus.canceled
};

// 編輯活動
export const editActivity = async (activityId: ActivityId, data: EditActivityBody) => {
  // 檢查categoryId存在
  const { categoryIds, ...rest } = data;
  const existingCategories = await prisma.category.findMany({
    where: {
      id: { in: categoryIds },
    },
    select: {
      id: true,
    },
  });

  const existingCategoryIds = existingCategories.map((category) => category.id);
  const invalidCategoryIds = categoryIds.filter((id) => !existingCategoryIds.includes(id));
  if (invalidCategoryIds.length > 0) {
    throw new InputValidationError(`無效的Category ID: ${invalidCategoryIds.join(", ")}`);
  }

  return prisma.activity.update({
    where: {
      id: activityId,
    },
    data: {
      ...rest,
      categories: {
        set: [],
        connect: categoryIds.map((id) => ({ id })),
      },
      tags: data.tags?.join(",") || "",
    },
    select: {
      id: true,
    },
  });
};

// 收藏活動
export const favoriteActivity = async (activityId: ActivityId, userId: number) => {
  // 檢查是否收藏過
  const isFavorite = await prisma.activityLike.findUnique({
    where: {
      activityLikeId: {
        activityId,
        userId,
      },
    },
  });

  if (isFavorite) {
    const error = new Error("已收藏過此活動") as Error & { statusCode: number };
    error.statusCode = 409;
    throw error;
  }

  return prisma.activityLike.create({
    data: {
      activityId,
      userId,
    },
  });
};

// 取消收藏活動
export const unfavoriteActivity = async (activityId: ActivityId, userId: number) => {
  // 檢查是否收藏過
  const isFavorite = await prisma.activityLike.findUnique({
    where: {
      activityLikeId: {
        activityId,
        userId,
      },
    },
  });

  if (!isFavorite) {
    const error = new Error("尚未收藏此活動") as Error & { statusCode: number };
    error.statusCode = 409;
    throw error;
  }

  return prisma.activityLike.delete({
    where: {
      activityLikeId: {
        activityId,
        userId,
      },
    },
  });
};

// 取得熱門活動
export const getHotActivities = async (limit: LimitQuery) => {
  const activities = await prisma.activity.findMany({
    where: {
      status: ActivityStatus.published,
    },
    orderBy: {
      viewCount: "desc",
    },
    take: limit * 4,
    select: {
      id: true,
      title: true,
      location: true,
      cover: true,
      isOnline: true,
      startTime: true,
      endTime: true,
      status: true,
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
      viewCount: true,
      _count: {
        select: {
          activityLike: true,
          orders: true,
        },
      },
    },
  });

  // 加權比重=> viewCount * 1 + activityLike * 3 + orders * 5
  const sortedActivities = activities
    .map((activity) => ({
      ...activity,
      score: activity.viewCount * 1 + activity._count.activityLike * 3 + activity._count.orders * 5,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return sortedActivities;
};

// 取得參加者名單
export const getParticipants = async (activityId: ActivityId, params: PaginationQuery) => {
  const { page, limit } = params;
  const offset = paginator.getOffset(page, limit);

  const data = await prisma.ticket.findMany({
    where: {
      activityId: activityId,
    },
    skip: offset,
    take: limit,
    select: {
      id: true,
      orderId: true,
      status: true,
      assignedName: true,
      assignedEmail: true,
      createdAt: true,
      ticketType: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const pagination = paginator.getPagination(data.length, page, limit);
  return { data, pagination };
};

// 編輯活動主圖
export const uploadActivityCover = async (activityId: ActivityId, cover: string) => {
  return await prisma.activity.update({
    where: { id: activityId },
    data: { cover },
  });
};

export const getIncome = async (activityId: ActivityId, data: StatisticsPeriodQuery) => {
  // 取得活動票種
  const ticketTypesRaw = await prisma.ticketType.findMany({
    where: { activityId },
    select: {
      id: true,
      name: true,
      price: true,
      totalQuantity: true,
      remainingQuantity: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  const totalRemainingQuantity = ticketTypesRaw.reduce(
    (total, type) => total.add(new Prisma.Decimal(type.remainingQuantity)),
    new Prisma.Decimal(0),
  );

  const paidOrders = await prisma.order.findMany({
    where: {
      activityId,
      status: OrderStatus.paid,
    },
    select: {
      createdAt: true,
      payment: {
        select: {
          paidAmount: true,
        },
      },
      tickets: {
        select: {
          ticketTypeId: true,
        },
      },
    },
  });

  const totalIncome = paidOrders.reduce((total, order) => {
    return order.payment ? total.add(new Prisma.Decimal(order.payment.paidAmount)) : total;
  }, new Prisma.Decimal(0));
  const totalRegisteredQuantity = paidOrders.reduce(
    (total, order) => total.add(new Prisma.Decimal(order.tickets.length)),
    new Prisma.Decimal(0),
  );

  // 計算票種小計
  const ticketTypes = ticketTypesRaw.map((type) => {
    let subtotalIncome = new Prisma.Decimal(0);
    let soldCount = new Prisma.Decimal(0);
    for (const order of paidOrders) {
      for (const ticket of order.tickets) {
        if (ticket.ticketTypeId === type.id) {
          subtotalIncome = subtotalIncome.add(new Prisma.Decimal(type.price));
          soldCount = soldCount.add(new Prisma.Decimal(1));
        }
      }
    }

    return {
      ...type,
      subtotalIncome: subtotalIncome.toNumber(),
      soldCount: soldCount.toNumber(),
    };
  });

  // 初始化近五天或五週的日期 key
  const incomeMap: Record<string, Prisma.Decimal> = {};
  const now = dayjs();

  for (let i = 0; i < 5; i++) {
    const key =
      data.statisticsPeriod === "w"
        ? now.subtract(i, "week").startOf("week").format("YYYY-MM-DD")
        : now.subtract(i, "day").format("YYYY-MM-DD");
    incomeMap[key] = new Prisma.Decimal(0);
  }

  // 加總付款收入
  for (const order of paidOrders) {
    if (!order.payment) continue;

    const orderDateKey =
      data.statisticsPeriod === "w"
        ? dayjs(order.createdAt).startOf("week").format("YYYY-MM-DD")
        : dayjs(order.createdAt).format("YYYY-MM-DD");

    if (orderDateKey in incomeMap) {
      incomeMap[orderDateKey] = incomeMap[orderDateKey].add(
        new Prisma.Decimal(order.payment.paidAmount),
      );
    }
  }

  const incomes = Object.entries(incomeMap)
    .sort((a, b) => (dayjs(b[0]).isAfter(dayjs(a[0])) ? -1 : 1))
    .map(([date, amount]) => ({ date, amount: amount.toNumber() }));

  return {
    ticketTypes,
    totalRemainingQuantity: totalRemainingQuantity.toNumber(),
    totalIncome: totalIncome.toNumber(),
    totalRegisteredQuantity: totalRegisteredQuantity.toNumber(),
    incomes,
  };
};

export const patchActivityType = async (activityId: number, data: CreateActivityBody) => {
  return await prisma.activity.update({
    where: { id: activityId },
    data: { isOnline: data.isOnline, livestreamUrl: data.livestreamUrl },
    select: {
      id: true,
      currentStep: true,
    },
  });
};
