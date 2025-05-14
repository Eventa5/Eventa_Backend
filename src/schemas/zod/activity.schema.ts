import { z } from "zod";

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
