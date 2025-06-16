import { z } from "zod";

// id 驗證
export const categoryIdSchema = z.coerce
  .number({
    invalid_type_error: "id 格式錯誤",
    required_error: "id 為必要欄位",
  })
  .min(1, "id 必須大於 0");

export type CategoryId = z.infer<typeof categoryIdSchema>;
