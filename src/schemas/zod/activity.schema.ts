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
