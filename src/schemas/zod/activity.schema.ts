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
      .union([z.string().url("請提供有效的網址"), z.literal(null)])
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

// 新增活動 - 設定活動主題步驟
export const patchActivityCategoriesSchema = z.object({
  categoryIds: z
    .array(z.number({ invalid_type_error: "分類 ID 必須為數字" }))
    .min(1, "請至少選擇一個分類"),
});

// 新增活動 - 設定活動基本資料步驟
export const patchActivityBasicInfoSchema = z
  .object({
    cover: z.union([z.string().url("請提供有效的圖片網址"), z.literal(null)]).optional(),
    title: z.string().min(1, "活動名稱為必填欄位"),
    startTime: z.coerce.date({ invalid_type_error: "開始時間格式錯誤" }),
    endTime: z.coerce.date({ invalid_type_error: "結束時間格式錯誤" }),
    tags: z.array(z.string()).max(5, "最多只能填寫 5 個標籤").optional(),
    location: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const now = new Date();

    if (data.startTime < now) {
      ctx.addIssue({
        path: ["startTime"],
        code: z.ZodIssueCode.custom,
        message: "開始時間不得早於今天",
      });
    }

    if (data.endTime < data.startTime) {
      ctx.addIssue({
        path: ["endTime"],
        code: z.ZodIssueCode.custom,
        message: "結束時間不得早於開始時間",
      });
    }
  });

// 新增活動 - 設定活動詳細內容步驟
export const patchActivityContentSchema = z.object({
  summary: z
    .string({
      required_error: "請輸入50到250字",
    })
    .min(50, "最少輸入50字")
    .max(250, "最多輸入250字"),
  descriptionMd: z.string({
    required_error: "活動簡介為必填",
  }),
  notes: z.string().optional(),
});

// 編輯活動
export const editActivitySchema = z
  .object({
    cover: z.union([z.string().url("請提供有效的圖片網址"), z.literal(null)]).optional(),
    title: z.string().min(1, "活動名稱為必填"),
    location: z.string().optional(),
    startTime: z.coerce.date({ invalid_type_error: "開始時間格式錯誤" }),
    endTime: z.coerce.date({ invalid_type_error: "結束時間格式錯誤" }),
    isOnline: z.boolean(),
    livestreamUrl: z
      .union([z.string().url("請提供有效的網址"), z.literal(null)])
      .optional()
      .transform((val) => val ?? null),
    tags: z.array(z.string()).max(5, "最多只能填寫 5 個標籤").optional(),
    summary: z
      .string({
        required_error: "請輸入50到250字",
      })
      .min(50, "最少輸入50字")
      .max(250, "最多輸入250字"),
    descriptionMd: z.string({
      required_error: "活動簡介為必填",
    }),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const now = new Date();

    if (data.startTime < now) {
      ctx.addIssue({
        path: ["startTime"],
        code: z.ZodIssueCode.custom,
        message: "開始時間不得早於今天",
      });
    }

    if (data.endTime < data.startTime) {
      ctx.addIssue({
        path: ["endTime"],
        code: z.ZodIssueCode.custom,
        message: "結束時間不得早於開始時間",
      });
    }

    if (data.isOnline && !data.livestreamUrl) {
      ctx.addIssue({
        path: ["livestreamUrl"],
        code: z.ZodIssueCode.custom,
        message: "isOnline為true時, livestreamUrl為必填欄位",
      });
    }
  });

// 匯出型別
export type ActivityId = z.infer<typeof activityIdSchema>;
export type ActivityQueryParams = z.infer<typeof activityQuerySchema>;
export type CreateActivityBody = z.infer<typeof createActivitySchema>;
export type PatchActivityCategoriesBody = z.infer<typeof patchActivityCategoriesSchema>;
export type PatchActivityBasicInfoBody = z.infer<typeof patchActivityBasicInfoSchema>;
export type PatchActivityContentBody = z.infer<typeof patchActivityContentSchema>;
export type EditActivityBody = z.infer<typeof editActivitySchema>;
