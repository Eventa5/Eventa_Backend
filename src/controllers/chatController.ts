import type { NextFunction, Request, Response } from "express";
import { InputValidationError } from "../errors/InputValidationError";
import { chatRequestSchema } from "../schemas/zod/chat.schema";
import { processMessage } from "../services/chatService";
import { sendResponse } from "../utils/sendResponse";
import { validateInput } from "../utils/validateInput";

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 驗證輸入
    const validatedData = validateInput(chatRequestSchema, req.body);

    // 處理聊天訊息
    const response = await processMessage(validatedData);

    sendResponse(res, 200, "處理成功", true, response);
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};
