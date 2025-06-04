import type { NextFunction, Request, Response } from "express";
import { InputValidationError } from "../errors/InputValidationError";
import { ticketIdSchema } from "../schemas/zod/ticket.schema";
import * as ticketService from "../services/ticketService";
import { sendResponse } from "../utils/sendResponse";
import { validateInput } from "../utils/validateInput";

export const patchTicketUsed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = validateInput(ticketIdSchema, req.params.ticketId);
    const ticket = await ticketService.patchTicketUsed(data);
    if (!ticket) {
      sendResponse(res, 404, "票券不存在", false);
      return;
    }

    sendResponse(res, 200, "報到成功", true, ticket);
  } catch (error) {
    if (error instanceof InputValidationError) {
      sendResponse(res, 400, error.message, false);
    } else {
      next(error);
    }
  }
};
