import type { NextFunction, Request, Response } from "express";
import { getCategoriesData } from "../services/categoryService";
import { sendResponse } from "../utils/sendResponse";

// 取得所有類別
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await getCategoriesData();
    sendResponse(res, 200, "請求成功", true, categories);
  } catch (err) {
    next(err);
  }
};
