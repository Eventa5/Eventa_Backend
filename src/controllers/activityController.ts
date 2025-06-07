import type { NextFunction, Request, Response } from "express";
import { InputValidationError } from "../errors/InputValidationError";
import {
  activityIdSchema,
  activityQuerySchema,
  createActivitySchema,
  editActivitySchema,
  limitSchema,
  paginationQuerySchema,
  patchActivityBasicInfoSchema,
  patchActivityCategoriesSchema,
  patchActivityContentSchema,
  statisticsPeriodSchema,
} from "../schemas/zod/activity.schema";
import * as activityService from "../services/activityService";
import { getTicketTypesByActivityId } from "../services/ticketTypeService";
import { uploadToCloudinary } from "../utils/cloudinary";
import { sendResponse } from "../utils/sendResponse";
import { validateInput } from "../utils/validateInput";

// 取得特定活動的票種資料
export const getActivityTicketTypes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activityId = validateInput(activityIdSchema, req.params.activityId);

    const activity = await activityService.getActivityById(activityId);
    if (!activity) {
      return next({
        message: "活動不存在",
        statusCode: 404,
      });
    }

    const ticketTypes = await getTicketTypesByActivityId(activityId);

    res.status(200).json({
      message: "請求成功",
      status: true,
      data: ticketTypes,
    });
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

// 取得活動資料列表
export const getActivities = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const validatedData = validateInput(activityQuerySchema, req.query);
    const { data, pagination } = await activityService.getActivities(validatedData);

    sendResponse(res, 200, "請求成功", true, data, pagination);
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

// 取得特定活動資料
export const getActivity = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const activityId = validateInput(activityIdSchema, req.params.activityId);
    const userId = req.user?.id || 0;
    const activity = await activityService.getActivityDetails(activityId, userId);
    if (!activity) {
      sendResponse(res, 404, "活動不存在", false);
    } else {
      sendResponse(res, 200, "請求成功", true, activity);
    }
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

// 新增活動 - 設定活動形式
export const createActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.organizationIds.includes(Number(req.body.organizationId))) {
      sendResponse(res, 403, "無權限，非主辦單位成員", false);
      return;
    }
    const data = validateInput(createActivitySchema, req.body);
    const activity = await activityService.createActivity(data);
    sendResponse(res, 201, "活動建立成功", true, activity);
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

// 新增活動 - 設定活動主題步驟
export const patchActivityCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activityId = validateInput(activityIdSchema, req.params.activityId);
    const activity = await activityService.getActivityById(activityId);
    if (!activity) {
      sendResponse(res, 404, "活動不存在", false);
      return;
    }

    const isOrganization = req.user?.organizationIds.includes(activity.organizationId);
    if (!isOrganization) {
      sendResponse(res, 403, "無權限，非主辦單位成員", false);
      return;
    }

    const data = validateInput(patchActivityCategoriesSchema, {
      ...req.body,
    });
    const result = await activityService.patchActivityCategories(activityId, data);
    sendResponse(res, 200, "活動主題設定成功", true, result);
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

// 新增活動 - 活動基本資訊步驟
export const patchActivityBasicInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activityId = validateInput(activityIdSchema, req.params.activityId);
    const activity = await activityService.getActivityById(activityId);
    if (!activity) {
      sendResponse(res, 404, "活動不存在", false);
      return;
    }

    const isOrganization = req.user?.organizationIds.includes(activity.organizationId);
    if (!isOrganization) {
      sendResponse(res, 403, "無權限，非主辦單位成員", false);
      return;
    }

    const data = validateInput(patchActivityBasicInfoSchema, {
      ...req.body,
      isOnline: activity.isOnline,
    });
    const result = await activityService.patchActivityBasicInfo(activityId, data);
    sendResponse(res, 200, "活動基本資訊設定成功", true, result);
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

// 新增活動 - 活動詳細內容步驟
export const patchActivityContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activityId = validateInput(activityIdSchema, req.params.activityId);
    const activity = await activityService.getActivityById(activityId);
    if (!activity) {
      sendResponse(res, 404, "活動不存在", false);
      return;
    }

    const isOrganization = req.user?.organizationIds.includes(activity.organizationId);
    if (!isOrganization) {
      sendResponse(res, 403, "無權限，非主辦單位成員", false);
      return;
    }

    const data = validateInput(patchActivityContentSchema, {
      ...req.body,
    });
    const result = await activityService.patchActivityContent(activityId, data);
    sendResponse(res, 200, "活動詳細內容設定成功", true, result);
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

// 新增活動 - 發布活動步驟
export const patchActivityPublish = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activityId = validateInput(activityIdSchema, req.params.activityId);
    const activity = await activityService.getActivityById(activityId);
    if (!activity) {
      sendResponse(res, 404, "活動不存在", false);
      return;
    }

    const isOrganization = req.user?.organizationIds.includes(activity.organizationId);
    if (!isOrganization) {
      sendResponse(res, 403, "無權限，非主辦單位成員", false);
      return;
    }

    const result = await activityService.patchActivityPublish(activityId);
    sendResponse(res, 200, "活動發布成功", true, result);
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

// 取消活動
export const cancelActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activityId = validateInput(activityIdSchema, req.params.activityId);
    const activity = await activityService.getActivityById(activityId);
    if (!activity) {
      sendResponse(res, 404, "活動不存在", false);
      return;
    }

    const isOrganization = req.user?.organizationIds.includes(activity.organizationId);
    if (!isOrganization) {
      sendResponse(res, 403, "無權限，非主辦單位成員", false);
      return;
    }

    const result = await activityService.cancelActivity(activityId);
    sendResponse(res, 200, "活動取消成功", true, result);
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

// 編輯活動
export const editActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activityId = validateInput(activityIdSchema, req.params.activityId);
    const activity = await activityService.getActivityById(activityId);
    if (!activity) {
      sendResponse(res, 404, "活動不存在", false);
      return;
    }

    const isOrganization = req.user?.organizationIds.includes(activity.organizationId);
    if (!isOrganization) {
      sendResponse(res, 403, "無權限，非主辦單位成員", false);
      return;
    }

    const data = validateInput(editActivitySchema, {
      ...req.body,
    });
    const result = await activityService.editActivity(activityId, data);
    sendResponse(res, 200, "活動編輯成功", true, result);
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

// 收藏活動
export const favoriteActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next({
        message: "未提供授權令牌",
        statusCode: 401,
      });
    }

    const activityId = validateInput(activityIdSchema, req.params.activityId);
    const activity = await activityService.getActivityById(activityId);
    if (!activity) {
      sendResponse(res, 404, "活動不存在", false);
      return;
    }

    await activityService.favoriteActivity(activityId, req.user.id);
    sendResponse(res, 201, "活動已加入收藏", true);
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

// 取消收藏活動
export const unfavoriteActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next({
        message: "未提供授權令牌",
        statusCode: 401,
      });
    }

    const activityId = validateInput(activityIdSchema, req.params.activityId);
    const activity = await activityService.getActivityById(activityId);
    if (!activity) {
      sendResponse(res, 404, "活動不存在", false);
      return;
    }

    await activityService.unfavoriteActivity(activityId, req.user.id);
    sendResponse(res, 200, "活動已取消收藏", true);
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

// 取得熱門活動
export const getPopular = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const limit = validateInput(limitSchema, req.query.limit);
    const result = await activityService.getHotActivities(limit);
    sendResponse(res, 200, "取得熱門活動成功", true, result);
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

// 取得參加者名單
export const getParticipants = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const activityId = validateInput(activityIdSchema, req.params.activityId);
    const activity = await activityService.getActivityById(activityId);
    if (!activity) {
      sendResponse(res, 404, "活動不存在", false);
      return;
    }

    const isOrganization = req.user?.organizationIds.includes(activity.organizationId);
    if (!isOrganization) {
      sendResponse(res, 403, "無權限，非主辦單位成員", false);
      return;
    }

    const validatedData = validateInput(paginationQuerySchema, req.query);
    const { data, pagination } = await activityService.getParticipants(activityId, validatedData);

    sendResponse(res, 200, "請求成功", true, data, pagination);
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

// 上傳活動封面
export const uploadCover = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const cover = req.file;
  const activityId = validateInput(activityIdSchema, req.params.activityId);
  const activity = await activityService.getActivityById(activityId);
  if (!activity) {
    sendResponse(res, 404, "活動不存在", false);
    return;
  }

  const isOrganization = req.user?.organizationIds.includes(activity.organizationId);
  if (!isOrganization) {
    sendResponse(res, 403, "無權限，非主辦單位成員", false);
    return;
  }

  if (!cover) {
    sendResponse(res, 400, "未上傳檔案", false);
    return;
  }

  try {
    const imageUrl = await uploadToCloudinary(cover.buffer, cover.originalname, "covers");
    await activityService.uploadActivityCover(activityId, imageUrl);

    // 清除buffer
    if (req.file) {
      (req.file.buffer as unknown as Buffer | null) = null;
    }

    sendResponse(res, 200, "上傳成功", true, imageUrl);
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

// 取得收入狀況
export const getIncome = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activityId = validateInput(activityIdSchema, req.params.activityId);
    const activity = await activityService.getActivityById(activityId);
    if (!activity) {
      sendResponse(res, 404, "活動不存在", false);
      return;
    }

    const isOrganization = req.user?.organizationIds.includes(activity.organizationId);
    if (!isOrganization) {
      sendResponse(res, 403, "無權限，非主辦單位成員", false);
      return;
    }
    const validatedData = validateInput(statisticsPeriodSchema, req.query);
    const result = await activityService.getIncome(activityId, validatedData);
    sendResponse(res, 200, "請求成功", true, result);
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

export const patchActivityType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activityId = validateInput(activityIdSchema, req.params.activityId);
    const activity = await activityService.getActivityById(activityId);
    if (!activity) {
      sendResponse(res, 404, "活動不存在", false);
      return;
    }

    const isOrganization = req.user?.organizationIds.includes(activity.organizationId);
    if (!isOrganization) {
      sendResponse(res, 403, "無權限，非主辦單位成員", false);
      return;
    }
    const raw = { ...req.body, organizationId: activity.organizationId };
    const data = validateInput(createActivitySchema, raw);
    const result = await activityService.patchActivityType(activityId, data);
    sendResponse(res, 200, "活動形式編輯成功", true, result);
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};
