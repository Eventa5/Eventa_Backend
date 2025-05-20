import prisma from "../prisma/client";
import type {
  CreateOrganizationRequest,
  DeleteOrganizationRequest,
  UpdateOrganizationRequest,
} from "../schemas/zod/organizations.schema";

/**
 * 獲取當前用戶的主辦單位列表
 */
export const getUserOrganizations = async (userId: number) => {
  const organizers = await prisma.organizer.findMany({
    where: {
      userId: userId,
      deletedAt: null,
    },
    include: {
      currency: true,
    },
  });

  return organizers.map((org) => ({
    id: org.id,
    name: org.name || "",
    avatar: org.avatar || "",
    currency: org.currency?.code || "TWD",
  }));
};

/**
 * 根據ID獲取主辦單位詳細資訊
 */
export const getOrganizationById = async (organizationId: number) => {
  const organizer = await prisma.organizer.findUnique({
    where: {
      id: organizationId,
      deletedAt: null,
    },
    include: {
      currency: true,
    },
  });

  if (!organizer) {
    return null;
  }

  return {
    id: organizer.id,
    name: organizer.name || "",
    avatar: organizer.avatar || "",
    cover: organizer.cover || "",
    introduction: organizer.introduction || "",
    phoneNumber: organizer.phoneNumber || "",
    countryCode: organizer.countryCode || "",
    ext: organizer.ext || "",
    officialSiteUrl: organizer.officialSiteUrl || "",
    email: organizer.email,
    currency: organizer.currency?.code || "TWD",
  };
};

/**
 * 創建新主辦單位
 */
export const createOrganization = async (data: CreateOrganizationRequest, userId: number) => {
  // 檢查 email 是否已被使用
  if (data.email) {
    const existingOrganizer = await prisma.organizer.findFirst({
      where: {
        email: data.email,
        deletedAt: null,
      },
    });

    if (existingOrganizer) {
      throw new Error("此電子郵件已被使用");
    }
  }

  const organizer = await prisma.organizer.create({
    data: {
      name: data.name,
      avatar: data.avatar,
      cover: data.cover,
      introduction: data.introduction,
      phoneNumber: data.phoneNumber,
      countryCode: data.countryCode,
      ext: data.ext,
      officialSiteUrl: data.officialSiteUrl,
      email: data.email,
      user: {
        connect: { id: userId },
      },
      currency: {
        connect: { id: 1 },
      },
    },
  });

  return organizer.id;
};

/**
 * 更新主辦單位資料
 */
export const updateOrganization = async (data: UpdateOrganizationRequest, userId: number) => {
  // 檢查主辦單位是否存在且用戶有權限修改
  const existingOrganizer = await prisma.organizer.findFirst({
    where: {
      id: data.id,
      userId: userId,
      deletedAt: null,
    },
  });

  if (!existingOrganizer) {
    throw new Error("主辦單位不存在或無權限修改");
  }

  // 檢查 email 是否已被其他主辦單位使用
  if (data.email && data.email !== existingOrganizer.email) {
    const duplicateEmail = await prisma.organizer.findFirst({
      where: {
        email: data.email,
        id: { not: data.id },
        deletedAt: null,
      },
    });

    if (duplicateEmail) {
      throw new Error("此電子郵件已被使用");
    }
  }

  // 更新主辦單位資料
  await prisma.organizer.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
      avatar: data.avatar,
      cover: data.cover,
      introduction: data.introduction,
      phoneNumber: data.phoneNumber,
      countryCode: data.countryCode,
      ext: data.ext,
      officialSiteUrl: data.officialSiteUrl,
      email: data.email,
    },
  });

  return true;
};

/**
 * 刪除主辦單位
 */
export const deleteOrganization = async (data: DeleteOrganizationRequest, userId: number) => {
  // 檢查主辦單位是否存在且用戶有權限修改
  const existingOrganizer = await prisma.organizer.findFirst({
    where: {
      id: data.id,
      userId: userId,
      deletedAt: null,
    },
  });

  if (!existingOrganizer) {
    return false;
  }

  // 檢查是否有進行中或未來的活動
  const activeActivities = await prisma.activity.findMany({
    where: {
      organizerId: data.id,
      OR: [
        // 已發布且尚未結束的活動
        {
          status: "published",
          endTime: { gt: new Date() },
        },
        // 進行中的活動
        {
          status: "published",
          startTime: { lte: new Date() },
          endTime: { gt: new Date() },
        },
      ],
    },
  });

  if (activeActivities.length > 0) {
    return false;
  }

  // 檢查是否有已付款的訂單
  const orders = await prisma.order.findMany({
    where: {
      activity: {
        organizerId: data.id,
      },
      status: "paid",
    },
  });

  if (orders.length > 0) {
    return false;
  }

  // 執行軟刪除
  await prisma.organizer.update({
    where: { id: data.id },
    data: { deletedAt: new Date() },
  });

  return true;
};
