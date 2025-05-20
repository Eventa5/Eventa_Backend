import { z } from "zod";

// 活動 id 驗證
export const activityIdSchema = z.coerce
  .number({
    invalid_type_error: "活動 id 格式錯誤",
    required_error: "活動 id 為必要欄位",
  })
  .min(1, "活動 id 必須大於 0");

// 取得活動資料Query
export const activityQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().default(8),
  categoryId: z.coerce
    .number()
    .refine((val) => !Number.isNaN(val), {
      message: "無效的類別 ID，請輸入Number",
    })
    .optional(),
  location: z.string().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  keyword: z.string().optional(),
  organizationId: z.coerce
    .number()
    .refine((val) => !Number.isNaN(val), {
      message: "無效的類別 ID，請輸入Number",
    })
    .optional(),
});

// 新增活動 Schema
export const createActivitySchema = z
  .object({
    organizationId: z.number({
      invalid_type_error: "主辦單位 id 格式錯誤",
      required_error: "主辦單位 id 為必要欄位",
    }),
    isOnline: z.boolean({
      invalid_type_error: "isOnline請填boolean值",
      required_error: "isOnline 為必要欄位",
    }),
    livestreamUrl: z
      .string()
      .url("請提供有效的網址")
      .optional()
      .transform((val) => val ?? null),
  })
  .superRefine((data, ctx) => {
    if (data.isOnline && !data.livestreamUrl) {
      ctx.addIssue({
        path: ["livestreamUrl"],
        code: z.ZodIssueCode.custom,
        message: "isOnline為true時, livestreamUrl為必填欄位",
      });
    }
  });

// 匯出型別
export type ActivityQueryParams = z.infer<typeof activityQuerySchema>;
