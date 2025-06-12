import { SAFE_SELECT_CONFIGS } from "../config/chat";
import prisma from "../prisma/client";
import type {
  ActivityQueryParams,
  CategoryQueryParams,
  FunctionExecutions,
  OrganizationQueryParams,
  SearchQueryParams,
  TicketQueryParams,
  ToolFunction,
} from "../types/chat";

// AI 工具定義
export const chatTools: ToolFunction[] = [
  {
    type: "function" as const,
    function: {
      name: "getActiveActivities",
      description: "獲取活動列表，支援模糊查詢和多種篩選條件，預設顯示進行中活動但可查詢所有活動",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "限制返回的活動數量（預設為 10）",
          },
          offset: {
            type: "number",
            description: "跳過的活動數量，用於分頁（預設為 0）",
          },
          sortBy: {
            type: "string",
            enum: ["startTime", "endTime", "createdAt", "title"],
            description: "排序依據（預設為 startTime）",
          },
          sortOrder: {
            type: "string",
            enum: ["asc", "desc"],
            description: "排序方向（預設為 asc）",
          },
          location: { type: "string", description: "活動地點篩選（模糊搜尋）" },
          titleKeyword: {
            type: "string",
            description: "活動標題關鍵字（模糊搜尋）",
          },
          organizationName: {
            type: "string",
            description: "主辦方名稱（模糊搜尋）",
          },
          minPrice: { type: "number", description: "最低票價篩選" },
          maxPrice: { type: "number", description: "最高票價篩選" },
          startDateFrom: {
            type: "string",
            description: "活動開始時間篩選（從什麼時候開始，格式：YYYY-MM-DD）",
          },
          startDateTo: {
            type: "string",
            description: "活動開始時間篩選（到什麼時候結束，格式：YYYY-MM-DD）",
          },
          includeEnded: {
            type: "boolean",
            description: "是否包含已結束的活動（預設為 false，只顯示進行中或未來的活動）",
          },
          includeDraft: {
            type: "boolean",
            description: "是否包含草稿狀態的活動（預設為 false，只顯示已發布的活動）",
          },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "getActivityById",
      description: "根據 ID 獲取特定活動的詳細信息，包含所有相關資料",
      parameters: {
        type: "object",
        properties: {
          activityId: { type: "number", description: "活動 ID（必填）" },
          includeTickets: {
            type: "boolean",
            description: "是否包含票種信息（預設為 true）",
          },
          includeOrganization: {
            type: "boolean",
            description: "是否包含主辦方信息（預設為 true）",
          },
          includeCategories: {
            type: "boolean",
            description: "是否包含分類信息（預設為 true）",
          },
        },
        required: ["activityId"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "getActivitiesByCategory",
      description: "根據分類獲取活動，支援分類名稱模糊查詢和多種篩選條件",
      parameters: {
        type: "object",
        properties: {
          categoryId: {
            type: "number",
            description: "分類 ID（與 categoryName 二選一）",
          },
          categoryName: {
            type: "string",
            description: "分類名稱（模糊搜尋，與 categoryId 二選一）",
          },
          limit: {
            type: "number",
            description: "限制返回的活動數量（預設為 10）",
          },
          offset: {
            type: "number",
            description: "跳過的活動數量，用於分頁（預設為 0）",
          },
          sortBy: {
            type: "string",
            enum: ["startTime", "endTime", "createdAt", "title"],
            description: "排序依據（預設為 startTime）",
          },
          sortOrder: {
            type: "string",
            enum: ["asc", "desc"],
            description: "排序方向（預設為 asc）",
          },
          onlyAvailable: {
            type: "boolean",
            description: "是否只顯示仍有票券可購買的活動（預設為 false）",
          },
          includeEnded: {
            type: "boolean",
            description: "是否包含已結束的活動（預設為 false）",
          },
          includeDraft: {
            type: "boolean",
            description: "是否包含草稿狀態的活動（預設為 false）",
          },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "getCategories",
      description: "獲取活動分類，支援名稱模糊搜尋和篩選條件",
      parameters: {
        type: "object",
        properties: {
          searchName: {
            type: "string",
            description: "分類名稱搜尋（模糊搜尋）",
          },
          includeCount: {
            type: "boolean",
            description: "是否包含每個分類下的活動數量（預設為 false）",
          },
          onlyWithActivities: {
            type: "boolean",
            description: "是否只顯示有活動的分類（預設為 false）",
          },
          sortBy: {
            type: "string",
            enum: ["name", "id"],
            description: "排序依據（預設為 name）",
          },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "getOrganizations",
      description: "獲取組織機構信息，支援名稱模糊搜尋和篩選條件",
      parameters: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "限制返回的組織數量（預設為 10）",
          },
          offset: {
            type: "number",
            description: "跳過的組織數量，用於分頁（預設為 0）",
          },
          includeActivityCount: {
            type: "boolean",
            description: "是否包含每個組織舉辦的活動數量（預設為 false）",
          },
          onlyWithActiveActivities: {
            type: "boolean",
            description: "是否只顯示有進行中活動的組織（預設為 false）",
          },
          searchName: {
            type: "string",
            description: "組織名稱搜尋（模糊搜尋）",
          },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "getTicketTypesByActivity",
      description:
        "根據活動 ID 或活動名稱獲取詳細的票種信息，包括：票價、總張數、剩餘張數、售罄狀況、販售時間等",
      parameters: {
        type: "object",
        properties: {
          activityId: {
            type: "number",
            description: "活動 ID（與 activityName 二選一）",
          },
          activityName: {
            type: "string",
            description: "活動名稱（模糊搜尋，與 activityId 二選一）",
          },
          onlyAvailable: {
            type: "boolean",
            description: "是否只顯示仍有庫存（剩餘張數大於0）的票種（預設為 false）",
          },
          sortBy: {
            type: "string",
            enum: ["price", "name", "startTime", "endTime", "remainingQuantity"],
            description: "排序依據：價格、名稱、開始時間、結束時間、剩餘數量（預設為 price）",
          },
          sortOrder: {
            type: "string",
            enum: ["asc", "desc"],
            description: "排序方向（預設為 asc）",
          },
          includeDescription: {
            type: "boolean",
            description: "是否包含票種詳細描述（預設為 true）",
          },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "checkTicketAvailability",
      description: "快速查詢活動的票券庫存狀況，回答「還有票嗎」、「賣完了嗎」、「剩幾張」等問題",
      parameters: {
        type: "object",
        properties: {
          activityId: {
            type: "number",
            description: "活動 ID（與 activityName 二選一）",
          },
          activityName: {
            type: "string",
            description: "活動名稱（模糊搜尋，與 activityId 二選一）",
          },
          ticketTypeName: {
            type: "string",
            description: "特定票種名稱（可選，用於查詢特定票種的庫存）",
          },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "searchActivities",
      description: "全文搜索活動，支援多種模糊搜尋條件和篩選器",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "搜索關鍵字（在標題和描述中搜尋，必填）",
          },
          categoryIds: {
            type: "array",
            items: { type: "number" },
            description: "篩選特定分類的活動（分類 ID 陣列）",
          },
          categoryNames: {
            type: "array",
            items: { type: "string" },
            description: "篩選特定分類的活動（分類名稱陣列，模糊搜尋）",
          },
          organizationIds: {
            type: "array",
            items: { type: "number" },
            description: "篩選特定主辦方的活動（組織 ID 陣列）",
          },
          organizationNames: {
            type: "array",
            items: { type: "string" },
            description: "篩選特定主辦方的活動（組織名稱陣列，模糊搜尋）",
          },
          location: { type: "string", description: "地點篩選（模糊搜尋）" },
          minPrice: { type: "number", description: "最低票價篩選" },
          maxPrice: { type: "number", description: "最高票價篩選" },
          startDateFrom: {
            type: "string",
            description: "活動開始時間篩選（從什麼時候開始，格式：YYYY-MM-DD）",
          },
          startDateTo: {
            type: "string",
            description: "活動開始時間篩選（到什麼時候結束，格式：YYYY-MM-DD）",
          },
          limit: {
            type: "number",
            description: "限制返回的活動數量（預設為 10）",
          },
          offset: {
            type: "number",
            description: "跳過的活動數量，用於分頁（預設為 0）",
          },
          sortBy: {
            type: "string",
            enum: ["relevance", "startTime", "endTime", "createdAt", "title"],
            description: "排序依據（預設為 relevance）",
          },
          sortOrder: {
            type: "string",
            enum: ["asc", "desc"],
            description: "排序方向（預設為 desc）",
          },
          onlyAvailable: {
            type: "boolean",
            description: "是否只顯示仍有票券可購買的活動（預設為 false）",
          },
          includeEnded: {
            type: "boolean",
            description: "是否包含已結束的活動（預設為 false）",
          },
          includeDraft: {
            type: "boolean",
            description: "是否包含草稿狀態的活動（預設為 false）",
          },
        },
        required: ["query"],
      },
    },
  },
];

// 查詢函數實現
export const chatQueries: FunctionExecutions = {
  getActiveActivities: async (args: ActivityQueryParams = {}) => {
    const {
      limit = 10,
      offset = 0,
      sortBy = "startTime",
      sortOrder = "asc",
      location,
      titleKeyword,
      organizationName,
      minPrice,
      maxPrice,
      startDateFrom,
      startDateTo,
      includeEnded = false,
      includeDraft = false,
    } = args;

    const where: any = {};

    if (!includeDraft) where.status = "published";
    if (!includeEnded) where.endTime = { gte: new Date() };
    if (location) where.location = { contains: location, mode: "insensitive" };
    if (titleKeyword) where.title = { contains: titleKeyword, mode: "insensitive" };
    if (organizationName)
      where.organization = {
        name: { contains: organizationName, mode: "insensitive" },
      };

    if (startDateFrom || startDateTo) {
      where.startTime = {};
      if (startDateFrom) where.startTime.gte = new Date(startDateFrom);
      if (startDateTo) where.startTime.lte = new Date(`${startDateTo}T23:59:59.999Z`);
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.ticketTypes = {
        some: {
          ...(minPrice !== undefined && { price: { gte: minPrice } }),
          ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
        },
      };
    }

    return await prisma.activity.findMany({
      where,
      select: {
        ...SAFE_SELECT_CONFIGS.activity,
        organization: { select: SAFE_SELECT_CONFIGS.organization },
        categories: { select: SAFE_SELECT_CONFIGS.category },
      },
      orderBy: { [sortBy]: sortOrder },
      take: limit,
      skip: offset,
    });
  },

  getActivityById: async (args: {
    activityId: number;
    includeTickets?: boolean;
    includeOrganization?: boolean;
    includeCategories?: boolean;
  }) => {
    const {
      activityId,
      includeTickets = true,
      includeOrganization = true,
      includeCategories = true,
    } = args;

    const select: any = { ...SAFE_SELECT_CONFIGS.activity };
    if (includeOrganization) select.organization = { select: SAFE_SELECT_CONFIGS.organization };
    if (includeCategories) select.categories = { select: SAFE_SELECT_CONFIGS.category };
    if (includeTickets) select.ticketTypes = { select: SAFE_SELECT_CONFIGS.ticketType };

    return await prisma.activity.findUnique({
      where: { id: activityId },
      select,
    });
  },

  getActivitiesByCategory: async (args: {
    categoryId?: number;
    categoryName?: string;
    limit?: number;
    offset?: number;
    sortBy?: "startTime" | "endTime" | "createdAt" | "title";
    sortOrder?: "asc" | "desc";
    onlyAvailable?: boolean;
    includeEnded?: boolean;
    includeDraft?: boolean;
  }) => {
    const {
      categoryId,
      categoryName,
      limit = 10,
      offset = 0,
      sortBy = "startTime",
      sortOrder = "asc",
      onlyAvailable = false,
      includeEnded = false,
      includeDraft = false,
    } = args;

    const where: any = {};
    if (!includeDraft) where.status = "published";
    if (!includeEnded) where.endTime = { gte: new Date() };

    if (categoryId) {
      where.categories = { some: { id: categoryId } };
    } else if (categoryName) {
      where.categories = {
        some: { name: { contains: categoryName, mode: "insensitive" } },
      };
    }

    if (onlyAvailable) {
      where.ticketTypes = {
        some: { remainingQuantity: { gt: 0 }, endTime: { gte: new Date() } },
      };
    }

    return await prisma.activity.findMany({
      where,
      select: {
        ...SAFE_SELECT_CONFIGS.activity,
        organization: { select: SAFE_SELECT_CONFIGS.organization },
        categories: { select: SAFE_SELECT_CONFIGS.category },
      },
      orderBy: { [sortBy]: sortOrder },
      take: limit,
      skip: offset,
    });
  },

  getCategories: async (args: CategoryQueryParams = {}) => {
    const { searchName, includeCount = false, onlyWithActivities = false, sortBy = "name" } = args;

    const where: any = {};
    if (searchName) where.name = { contains: searchName, mode: "insensitive" };
    if (onlyWithActivities) where.activities = { some: { status: "published" } };

    const select: any = { ...SAFE_SELECT_CONFIGS.category };
    if (includeCount) {
      select._count = {
        select: { activities: { where: { status: "published" } } },
      };
    }

    return await prisma.category.findMany({
      where,
      select,
      orderBy: { [sortBy]: "asc" },
    });
  },

  getOrganizations: async (args: OrganizationQueryParams = {}) => {
    const {
      limit = 10,
      offset = 0,
      includeActivityCount = false,
      onlyWithActiveActivities = false,
      searchName,
    } = args;

    const where: any = {};
    if (searchName) where.name = { contains: searchName, mode: "insensitive" };
    if (onlyWithActiveActivities) {
      where.activities = {
        some: { status: "published", endTime: { gte: new Date() } },
      };
    }

    const select: any = { ...SAFE_SELECT_CONFIGS.organization };
    if (includeActivityCount) {
      select._count = {
        select: { activities: { where: { status: "published" } } },
      };
    }

    return await prisma.organization.findMany({
      where,
      select,
      take: limit,
      skip: offset,
      orderBy: { name: "asc" },
    });
  },

  getTicketTypesByActivity: async (args: TicketQueryParams) => {
    const {
      activityId,
      activityName,
      onlyAvailable = false,
      sortBy = "price",
      sortOrder = "asc",
      includeDescription = true,
    } = args;

    let targetActivityId = activityId;

    if (!targetActivityId && activityName) {
      const activity = await prisma.activity.findFirst({
        where: {
          title: { contains: activityName, mode: "insensitive" },
          status: "published",
        },
        select: { id: true, title: true },
      });

      if (!activity) {
        return {
          error: `找不到名稱包含「${activityName}」的活動`,
          suggestion: "請檢查活動名稱是否正確，或嘗試使用其他關鍵字搜尋",
        };
      }
      targetActivityId = activity.id;
    }

    if (!targetActivityId) return { error: "請提供活動 ID 或活動名稱" };

    const where: any = { activityId: targetActivityId };
    if (onlyAvailable) {
      where.remainingQuantity = { gt: 0 };
      where.endTime = { gte: new Date() };
    }

    let select: any = { ...SAFE_SELECT_CONFIGS.ticketType };
    if (!includeDescription) {
      const { description, ...selectWithoutDescription } = SAFE_SELECT_CONFIGS.ticketType;
      select = selectWithoutDescription;
    }

    const ticketTypes = await prisma.ticketType.findMany({
      where,
      select,
      orderBy: { [sortBy]: sortOrder },
    });

    if (activityName && !activityId) {
      const activityInfo = await prisma.activity.findUnique({
        where: { id: targetActivityId },
        select: {
          id: true,
          title: true,
          startTime: true,
          endTime: true,
          location: true,
        },
      });
      return { activity: activityInfo, ticketTypes };
    }

    return ticketTypes;
  },

  checkTicketAvailability: async (args: TicketQueryParams) => {
    const { activityId, activityName, ticketTypeName } = args;

    let targetActivityId = activityId;

    if (!targetActivityId && activityName) {
      const activity = await prisma.activity.findFirst({
        where: {
          title: { contains: activityName, mode: "insensitive" },
          status: "published",
        },
        select: { id: true, title: true },
      });

      if (!activity) {
        return {
          error: `找不到名稱包含「${activityName}」的活動`,
          suggestion: "請檢查活動名稱是否正確，或嘗試使用其他關鍵字搜尋",
        };
      }
      targetActivityId = activity.id;
    }

    if (!targetActivityId) return { error: "請提供活動 ID 或活動名稱" };

    const where: any = { activityId: targetActivityId };
    if (ticketTypeName) where.name = { contains: ticketTypeName, mode: "insensitive" };

    const ticketTypes = await prisma.ticketType.findMany({
      where,
      select: {
        id: true,
        name: true,
        price: true,
        totalQuantity: true,
        remainingQuantity: true,
        startTime: true,
        endTime: true,
        saleStartAt: true,
        saleEndAt: true,
      },
      orderBy: { price: "asc" },
    });

    if (ticketTypes.length === 0) {
      return {
        error: ticketTypeName
          ? `該活動沒有名稱包含「${ticketTypeName}」的票種`
          : "該活動目前沒有可用的票種",
        suggestion: "請檢查票種名稱或聯絡主辦方確認售票資訊",
      };
    }

    const now = new Date();
    const availableTickets = ticketTypes.filter(
      (ticket) =>
        ticket.remainingQuantity > 0 &&
        ticket.endTime > now &&
        (!ticket.saleEndAt || ticket.saleEndAt > now),
    );

    const totalRemaining = ticketTypes.reduce((sum, ticket) => sum + ticket.remainingQuantity, 0);
    const totalQuantity = ticketTypes.reduce((sum, ticket) => sum + ticket.totalQuantity, 0);

    const activityInfo = await prisma.activity.findUnique({
      where: { id: targetActivityId },
      select: {
        id: true,
        title: true,
        startTime: true,
        endTime: true,
        location: true,
      },
    });

    return {
      activity: activityInfo,
      summary: {
        totalTicketTypes: ticketTypes.length,
        availableTicketTypes: availableTickets.length,
        totalQuantity,
        totalRemaining,
        soldOut: totalRemaining === 0,
        hasAvailableTickets: availableTickets.length > 0,
      },
      ticketTypes: ticketTypes.map((ticket) => ({
        ...ticket,
        soldOut: ticket.remainingQuantity === 0,
        onSale:
          ticket.remainingQuantity > 0 &&
          ticket.endTime > now &&
          (!ticket.saleEndAt || ticket.saleEndAt > now),
        soldPercentage:
          ticket.totalQuantity > 0
            ? Math.round(
                ((ticket.totalQuantity - ticket.remainingQuantity) / ticket.totalQuantity) * 100,
              )
            : 0,
      })),
    };
  },

  searchActivities: async (args: SearchQueryParams) => {
    const {
      query,
      categoryIds,
      categoryNames,
      organizationIds,
      organizationNames,
      location,
      minPrice,
      maxPrice,
      startDateFrom,
      startDateTo,
      limit = 10,
      offset = 0,
      sortBy = "relevance",
      sortOrder = "desc",
      onlyAvailable = false,
      includeEnded = false,
      includeDraft = false,
    } = args;

    const where: any = {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { descriptionMd: { contains: query, mode: "insensitive" } },
      ],
    };

    if (!includeDraft) where.status = "published";
    if (!includeEnded) where.endTime = { gte: new Date() };

    if ((categoryIds && categoryIds.length > 0) || (categoryNames && categoryNames.length > 0)) {
      const categoryConditions: any[] = [];
      if (categoryIds && categoryIds.length > 0)
        categoryConditions.push({ id: { in: categoryIds } });
      if (categoryNames && categoryNames.length > 0) {
        for (const name of categoryNames) {
          categoryConditions.push({
            name: { contains: name, mode: "insensitive" },
          });
        }
      }
      where.categories = { some: { OR: categoryConditions } };
    }

    if (
      (organizationIds && organizationIds.length > 0) ||
      (organizationNames && organizationNames.length > 0)
    ) {
      if (organizationIds && organizationIds.length > 0)
        where.organizationId = { in: organizationIds };
      if (organizationNames && organizationNames.length > 0) {
        if (where.organizationId) {
          where.OR = [
            ...(where.OR || []),
            { organizationId: where.organizationId },
            {
              organization: {
                OR: organizationNames.map((name) => ({
                  name: { contains: name, mode: "insensitive" },
                })),
              },
            },
          ];
          where.organizationId = undefined;
        } else {
          where.organization = {
            OR: organizationNames.map((name) => ({
              name: { contains: name, mode: "insensitive" },
            })),
          };
        }
      }
    }

    if (location) where.location = { contains: location, mode: "insensitive" };

    if (startDateFrom || startDateTo) {
      where.startTime = {};
      if (startDateFrom) where.startTime.gte = new Date(startDateFrom);
      if (startDateTo) where.startTime.lte = new Date(`${startDateTo}T23:59:59.999Z`);
    }

    if (minPrice !== undefined || maxPrice !== undefined || onlyAvailable) {
      where.ticketTypes = {
        some: {
          ...(minPrice !== undefined && { price: { gte: minPrice } }),
          ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
          ...(onlyAvailable && {
            remainingQuantity: { gt: 0 },
            endTime: { gte: new Date() },
          }),
        },
      };
    }

    const orderBy: any = sortBy === "relevance" ? { createdAt: "desc" } : { [sortBy]: sortOrder };

    return await prisma.activity.findMany({
      where,
      select: {
        ...SAFE_SELECT_CONFIGS.activity,
        organization: { select: SAFE_SELECT_CONFIGS.organization },
        categories: { select: SAFE_SELECT_CONFIGS.category },
      },
      orderBy,
      take: limit,
      skip: offset,
    });
  },
};
