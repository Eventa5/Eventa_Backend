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
  RecentQuery,
  StatisticsPeriodQuery,
} from "../schemas/zod/activity.schema";
import { sendActivityCancelEmail } from "../utils/emailClient";
import * as paginator from "../utils/paginator";

export const getActivityById = async (activityId: number) => {
  return prisma.activity.findUnique({
    where: {
      id: activityId,
    },
    include: {
      ticketTypes: true,
      categories: true,
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
    where.OR = [
      { title: { contains: keyword } },
      { descriptionMd: { contains: keyword } },
      { tags: { contains: keyword } },
    ];
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
        select: {
          id: true,
          userId: true,
          avatar: true,
          email: true,
          name: true,
          officialSiteUrl: true,
        },
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
    organization: {
      id: organization.id,
      name: organization.name,
      avatar: organization.avatar,
      email: organization.email,
      officialSiteUrl: organization.officialSiteUrl,
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
  shouldUpdateStep: boolean,
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
      ...(shouldUpdateStep && {
        currentStep: ActivityStep.categories,
      }),
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
  shouldUpdateStep: boolean,
  data: PatchActivityBasicInfoBody,
) => {
  return prisma.activity.update({
    where: {
      id: activityId,
    },
    data: {
      ...data,
      tags: data.tags?.join(",") || "",
      ...(shouldUpdateStep && {
        currentStep: ActivityStep.basic,
      }),
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
  shouldUpdateStep: boolean,
  data: PatchActivityContentBody,
) => {
  return prisma.activity.update({
    where: {
      id: activityId,
    },
    data: {
      ...data,
      ...(shouldUpdateStep && {
        currentStep: ActivityStep.content,
      }),
    },
    select: {
      id: true,
      currentStep: true,
    },
  });
};

// 發布活動
export const patchActivityPublish = async (activityId: ActivityId, shouldUpdateStep: boolean) => {
  return prisma.activity.update({
    where: {
      id: activityId,
    },
    data: {
      status: ActivityStatus.published,
      ...(shouldUpdateStep && {
        currentStep: ActivityStep.published,
      }),
    },
    select: {
      id: true,
      status: true,
    },
  });
};

// 取消活動
export const cancelActivity = async (activityId: ActivityId) => {
  return prisma.$transaction(async (tx) => {
    // 改變活動狀態
    const activity = await tx.activity.update({
      where: {
        id: activityId,
      },
      data: { status: ActivityStatus.canceled },
      select: {
        id: true,
        status: true,
        title: true,
      },
    });

    // 找訂單ID
    const orders = await tx.order.findMany({
      where: {
        activityId,
        status: { in: [OrderStatus.pending, OrderStatus.paid, OrderStatus.processing] },
      },
      select: {
        id: true,
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    const orderIds = orders.map((order) => order.id);
    if (orderIds.length === 0) return activity;

    // 更新訂單狀態
    await tx.order.updateMany({
      where: { id: { in: orderIds } },
      data: { status: OrderStatus.canceled },
    });

    // 更新票券狀態
    await tx.ticket.updateMany({
      where: {
        orderId: { in: orderIds },
        status: { in: [TicketStatus.unassigned, TicketStatus.assigned] },
      },
      data: { status: TicketStatus.canceled },
    });

    // 票種庫存恢復
    await tx.$executeRaw`
      UPDATE "ticket_types"
      SET "remainingQuantity" = "totalQuantity"
      WHERE "activityId" = ${activityId}
    `;

    // 發送活動取消通知信
    for (const order of orders) {
      sendActivityCancelEmail(
        order.user.email,
        order.user.name || "",
        activity.title || `活動ID: ${activityId}`,
      );
    }

    return activity;
  });
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
export const getHotActivities = async (limit: LimitQuery, recent: RecentQuery) => {
  const now = dayjs();
  const activities = await prisma.activity.findMany({
    where: {
      status: ActivityStatus.published,
      ...(recent && {
        startTime: {
          gte: now.toDate(),
        },
      }),
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
    .map((activity) => {
      const baseScore = new Prisma.Decimal(
        activity.viewCount * 1 + activity._count.activityLike * 3 + activity._count.orders * 5,
      );

      // 日期權重，距離當天越近權重越高，最多 2 倍
      const D = (n: number | string) => new Prisma.Decimal(n);
      const daysToNow = new Prisma.Decimal(dayjs(activity.startTime).diff(now, "day"));
      const dateWeight = recent ? Prisma.Decimal.max(D(0.5), D(2).sub(daysToNow.mul(0.1))) : D(1);

      return {
        ...activity,
        score: baseScore.mul(dateWeight).toNumber(),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return sortedActivities;
};

// 取得參加者名單
export const getParticipants = async (activityId: ActivityId, params: PaginationQuery) => {
  const { page, limit } = params;
  const offset = paginator.getOffset(page, limit);

  const [data, totalItems] = await Promise.all([
    prisma.ticket.findMany({
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
    }),
    prisma.ticket.count({
      where: {
        activityId: activityId,
        status: { not: TicketStatus.canceled },
      },
    }),
  ]);

  const pagination = paginator.getPagination(totalItems, page, limit);
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

  const { totalIncome, totalRegisteredQuantity } = paidOrders.reduce(
    (total, order) => {
      if (order.payment) {
        total.totalIncome = total.totalIncome.add(new Prisma.Decimal(order.payment.paidAmount));
      }
      total.totalRegisteredQuantity = total.totalRegisteredQuantity.add(
        new Prisma.Decimal(order.tickets.length),
      );
      return total;
    },
    {
      totalIncome: new Prisma.Decimal(0),
      totalRegisteredQuantity: new Prisma.Decimal(0),
    },
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

// 取得報到人數
export const getCheckedInResult = async (activityId: ActivityId) => {
  const activity = await prisma.activity.findUnique({
    where: {
      id: activityId,
    },
    select: {
      isOnline: true,
      status: true,
      startTime: true,
      endTime: true,
      ticketTypes: {
        select: {
          name: true,
          totalQuantity: true,
        },
      },
    },
  });
  if (!activity) return null;

  // 計算票數
  const groupedTickets = await prisma.ticket.groupBy({
    by: ["status"],
    where: {
      activityId,
      status: { notIn: [TicketStatus.canceled, TicketStatus.overdue] },
    },
    _count: {
      status: true,
    },
  });
  const statusMap = Object.fromEntries(
    groupedTickets.map(({ status, _count }) => [status, _count.status]),
  );
  const checkedInCount = statusMap.used ?? 0;
  const soldCount = groupedTickets.reduce(
    (sum, groupedTicket) => sum.plus(groupedTicket._count.status),
    new Prisma.Decimal(0),
  );
  const totalTicketQuantity = activity.ticketTypes.reduce(
    (sum, type) => sum.plus(type.totalQuantity),
    new Prisma.Decimal(0),
  );

  const data = {
    isOnline: activity.isOnline,
    status: activity.status,
    startTime: activity.startTime,
    endTime: activity.endTime,
    checkedInCount: checkedInCount,
    soldCount: soldCount.toNumber(),
    totalTicketQuantity: totalTicketQuantity.toNumber(),
  };

  return data;
};

// 更新已過期活動狀態
export const updateExpiredActivities = async () => {
  try {
    const now = new Date();
    await prisma.$transaction(async (tx) => {
      const activities = await tx.activity.findMany({
        where: {
          endTime: {
            lte: now,
          },
          status: ActivityStatus.published, // 只更新已發布的活動
        },
        select: {
          id: true,
        },
      });

      const activityIds = activities.map((activity) => activity.id);
      if (activityIds.length === 0) return;

      await tx.activity.updateMany({
        where: { id: { in: activityIds } },
        data: { status: ActivityStatus.ended },
      });

      await tx.ticketType.updateMany({
        where: { activityId: { in: activityIds } },
        data: { isActive: false },
      });
    });
  } catch (err) {
    throw new Error(`更新已過期活狀態失敗：${err instanceof Error ? err.message : err}`);
  }
};
