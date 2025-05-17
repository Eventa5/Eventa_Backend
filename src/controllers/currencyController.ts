import type { NextFunction, Request, Response } from "express";
import * as currencyService from "../services/currencyService";
import { sendResponse } from "../utils/sendResponse";

export const getCurrencies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currencies = await currencyService.getAllCurrencies();
    sendResponse(res, 200, "請求成功", true, currencies);
  } catch (error) {
    next(error);
  }
};

export const createCurrency = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, code } = req.body;
    await currencyService.createCurrency({ name, code });
    sendResponse(res, 200, "新增成功", true);
  } catch (error) {
    next(error);
  }
};
