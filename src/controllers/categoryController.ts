import type { NextFunction, Request, Response } from "express";
import { categoryIdSchema } from "../schemas/zod/category.schema";
import { getCategoriesData, getCategory, updateCategoryImg } from "../services/categoryService";
import { uploadToCloudinary } from "../utils/cloudinary";
import { sendResponse } from "../utils/sendResponse";
import { validateInput } from "../utils/validateInput";

// 取得所有類別
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await getCategoriesData();
    sendResponse(res, 200, "請求成功", true, categories);
  } catch (err) {
    next(err);
  }
};

export const uploadCategoryImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAdmin = req.user?.email === process.env.ADMIN_EMAIL;
    if (!isAdmin) {
      sendResponse(res, 403, "帳號無管理員權限，無權編輯", false);
      return;
    }

    const image = req.file;
    const categoryId = validateInput(categoryIdSchema, req.params.categoryId);
    const category = await getCategory(categoryId);
    if (!category) {
      sendResponse(res, 404, "類別不存在", false);
      return;
    }

    if (!image) {
      sendResponse(res, 400, "未上傳檔案", false);
      return;
    }

    const imageUrl = await uploadToCloudinary(image.buffer, image.originalname, "categories");
    await updateCategoryImg(Number(req.params.categoryId), imageUrl);

    // 清除buffer
    if (req.file) {
      (req.file.buffer as unknown as Buffer | null) = null;
    }

    sendResponse(res, 200, "上傳成功", true, imageUrl);
  } catch (err) {
    next(err);
  }
};
