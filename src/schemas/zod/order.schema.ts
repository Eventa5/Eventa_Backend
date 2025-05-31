import { z } from "zod";

import { InvoiceType, OrderStatus } from "@prisma/client";

const { b2b, b2c } = InvoiceType;
const { paid, pending, expired, canceled } = OrderStatus;

export const createOrderSchema = z.object({
  activityId: z.coerce
    .number({
      required_error: "活動 ID 為必要欄位",
      invalid_type_error: "活動 ID 必須為數字",
    })
    .min(1, "活動 ID 必須大於 0"),
  tickets: z
    .array(
      z.object({
        id: z.coerce
          .number({
            required_error: "票種 ID 為必要欄位",
            invalid_type_error: "票種 ID 必須為數字",
          })
          .min(1, "票種 ID 必須大於 0"),
        quantity: z.coerce
          .number({
            required_error: "購買數量 為必要欄位",
            invalid_type_error: "購買數量 必須為數字",
          })
          .min(0, "購買數量不可小於 0"),
        refundDeadline: z.coerce
          .date({
            invalid_type_error: "退款截止時間 必須為日期",
          })
          .nullish(),
      }),
    )
    .min(1, "欲建立訂單，至少購買一張票券"),
  paidAmount: z.coerce.number({
    required_error: "實際需支付金額 為必要欄位",
    invalid_type_error: "實際需支付金額 必須為數字",
  }),
  commonlyUsedInvoicesId: z.coerce
    .number({
      invalid_type_error: "常用發票 ID 必須為數字",
    })
    .nullish(),
  invoice: z
    .object({
      invoiceName: z
        .string({
          required_error: "發票名稱 為必要欄位",
          invalid_type_error: "發票名稱 必須為字串",
        })
        .trim(),
      invoiceAddress: z.string().trim().nullish(),
      invoiceReceiverName: z.string().trim().nullish(),
      invoiceReceiverPhoneNumber: z.string().trim().nullish(),
      invoiceTaxId: z
        .string()
        .trim()
        .regex(/^\d{8}$/, "發票統一編號格式不正確")
        .nullish(),
      invoiceTitle: z.string().trim().nullish(),
      invoiceCarrier: z
        .string()
        .trim()
        .regex(/^\/[0-9A-Z.+-]{7}$/, "手機載具格式不正確")
        .nullish(),
      invoiceType: z.enum([b2b, b2c], {
        required_error: "發票類型 為必要欄位",
        invalid_type_error: `發票類型 必須為 ${b2b} 或 ${b2c}`,
      }),
    })
    .nullish(),
});

export const getOrdersSchema = z
  .object({
    page: z.coerce
      .number({
        invalid_type_error: "頁碼 必須為數字",
      })
      .min(1, "頁碼 必須大於 0")
      .default(1),
    limit: z.coerce
      .number({
        invalid_type_error: "每頁顯示數量 必須為數字",
      })
      .min(1, "每頁顯示數量 必須大於 0")
      .max(100, "每頁顯示數量 不能超過 100")
      .default(8),
    status: z.enum([paid, pending, expired, canceled]).nullish(),
    title: z.coerce.string().trim().nullish(),
    from: z.coerce.date().nullish(),
    to: z.coerce.date().nullish(),
  })
  .superRefine((val, ctx) => {
    if (val.from && !val.to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "如果提供了 from，則 to 也必須提供",
      });
    }

    if (!val.from && val.to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "如果提供了 to，則 from 也必須提供",
      });
    }

    if (val.from && val.to && val.from >= val.to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "from 必須小於 to",
      });
    }
  });

// 匯出型別
export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
export type OrderQuerySchema = z.infer<typeof getOrdersSchema>;
