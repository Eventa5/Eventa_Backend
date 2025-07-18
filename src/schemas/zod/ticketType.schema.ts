import dayjs from "dayjs";
import { z } from "zod";

export const ticketTypeIdSchema = z.coerce
  .number({
    invalid_type_error: "票種 id 格式錯誤",
    required_error: "票種 id 為必要欄位",
  })
  .min(1, "票種 id 必須大於 0");

export const ticketTypeSchema = z
  .object({
    name: z
      .string({
        required_error: "請填寫 票種名稱",
      })
      .trim()
      .min(1, { message: "票種名稱 不能為空" })
      .max(255, { message: "票種名稱 過長" }),
    price: z.coerce
      .number({
        required_error: "請填寫 票種價格",
        invalid_type_error: "票種價格 格式錯誤",
      })
      .nonnegative({ message: "票種價格 必須大於或等於0" }),
    totalQuantity: z.coerce
      .number({
        required_error: "票種總數量 為必填欄位",
        invalid_type_error: "票種總數量 格式錯誤",
      })
      .positive({ message: "票種總數量 必須大於 0" }),
    remainingQuantity: z.coerce
      .number({
        required_error: "票種剩餘數量 為必填欄位",
        invalid_type_error: "票種剩餘數量 格式錯誤",
      })
      .nonnegative({ message: "票種剩餘數量 必須大於或等於 0" }),
    description: z.string().trim().max(255, { message: "票種描述不能超過255個字符" }).optional(),
    startTime: z.coerce.date({
      required_error: "開賣時間 為必填欄位",
      invalid_type_error: "開賣時間 格式錯誤",
    }),
    endTime: z.coerce.date({
      required_error: "開賣結束時間 為必填欄位",
      invalid_type_error: "開賣結束時間 格式錯誤",
    }),
    isActive: z
      .boolean({
        required_error: "是否為啟動中 為必填欄位",
        invalid_type_error: "是否為活動中 格式錯誤",
      })
      .default(false),
  })
  .superRefine((val, ctx) => {
    const now = dayjs().tz("Asia/Taipei");
    const start = dayjs.tz(val.startTime, "Asia/Taipei");
    const end = dayjs.tz(val.endTime, "Asia/Taipei");

    if (val.remainingQuantity > val.totalQuantity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "票種剩餘數量 必須小於或等於 票種總數量",
        path: ["remainingQuantity"],
      });
    }

    if (start.isBefore(now, "day")) {
      ctx.addIssue({
        path: ["startTime"],
        code: z.ZodIssueCode.custom,
        message: "開賣時間不得早於當日",
      });
    }

    if (end.isBefore(start)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "開賣時間 不可晚於 開賣結束時間，或 開賣結束時間 不可早於 開賣時間",
        path: ["startTime"],
      });
    }

    return z.NEVER;
  });

export const createTicketTypesSchema = ticketTypeSchema.array().nonempty({
  message: "票種資料 為必填",
});

// 匯出型別
export type TicketTypeParams = z.infer<typeof ticketTypeSchema>;
