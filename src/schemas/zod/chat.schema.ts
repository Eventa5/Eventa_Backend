import { z } from "zod";

export const chatRequestSchema = z.object({
  message: z
    .string({
      required_error: "訊息欄位為必填",
      invalid_type_error: "訊息必須是字串格式",
    })
    .min(1, "訊息不能為空")
    .max(1000, "訊息長度不能超過1000字符"),
});

export const chatHistorySchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.string().datetime(),
});

export const chatResponseSchema = z.object({
  message: z.string(),
  timestamp: z.string().datetime(),
  sources: z.array(z.string()).optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatHistory = z.infer<typeof chatHistorySchema>;
export type ChatResponse = z.infer<typeof chatResponseSchema>;
