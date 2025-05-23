import type { NextFunction, Request, Response } from "express";
import { InputValidationError } from "../errors/InputValidationError";
import {
  createOrganizationSchema,
  deleteOrganizationSchema,
  getOrganizationByIdSchema,
  updateOrganizationSchema,
} from "../schemas/zod/organizations.schema";
import * as organizationsService from "../services/organizations.service";
import { sendResponse } from "../utils/sendResponse";
import { validateInput } from "../utils/validateInput";

/**
 * 獲取當前用戶的主辦單位列表
 */
export const getUserOrganizations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 401, "未授權", false);
      return;
    }

    const organizations = await organizationsService.getUserOrganizations(userId);

    sendResponse(res, 200, "成功", true, organizations);
  } catch (error: any) {
    next(error);
  }
};

/**
 * 根據ID獲取主辦單位詳細資訊
 */
export const getOrganizationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { organizationId } = validateInput(getOrganizationByIdSchema, {
      organizationId: req.params.organizationId,
    });

    const organization = await organizationsService.getOrganizationById(organizationId);

    if (!organization) {
      sendResponse(res, 404, "找不到指定的主辦單位", false);
      return;
    }

    sendResponse(res, 200, "取得主辦單位成功", true, organization);
  } catch (error: any) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

/**
 * 創建新主辦單位
 */
export const createOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = validateInput(createOrganizationSchema, req.body);

    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 401, "未授權", false);
      return;
    }

    const organizationId = await organizationsService.createOrganization(data, userId);

    sendResponse(res, 200, "主辦單位建立成功", true, organizationId);
  } catch (error: any) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

/**
 * 更新主辦單位資料
 */
export const updateOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = validateInput(updateOrganizationSchema, req.body);

    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 401, "未授權", false);
      return;
    }

    const success = await organizationsService.updateOrganization(data, userId);

    if (!success) {
      sendResponse(res, 404, "找不到指定的主辦單位", false);
      return;
    }

    sendResponse(res, 200, "更新主辦單位成功", true);
  } catch (error: any) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};

/**
 * 刪除主辦單位
 */
export const deleteOrganization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = validateInput(deleteOrganizationSchema, req.body);

    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, 401, "未授權", false);
      return;
    }

    const success = await organizationsService.deleteOrganization(data, userId);

    if (!success) {
      sendResponse(res, 404, "找不到指定的主辦單位", false);
      return;
    }

    sendResponse(res, 200, "主辦單位刪除成功", true);
  } catch (error: any) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};
