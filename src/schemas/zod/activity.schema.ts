import { z } from "zod";

// 活動 id 驗證
export const activityIdSchema = z.object({
  activityId: z.string().transform((val, ctx) => {
    const parsed = Number(val);

    if (Number.isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "活動 id 格式錯誤",
      });

      return z.NEVER;
    }

    if (parsed <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "活動 id 必須大於 0",
      });

      return z.NEVER;
    }

    return parsed;
  }),
});

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
  organizerId: z.coerce
    .number()
    .refine((val) => !Number.isNaN(val), {
      message: "無效的類別 ID，請輸入Number",
    })
    .optional(),
});

// 匯出型別
export type ActivityQueryParams = z.infer<typeof activityQuerySchema>;
