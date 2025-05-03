import type { z } from "zod";

// 驗證輸入並返回結果
export const validateInput = <T>(schema: z.ZodType<T>, data: unknown) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.log(result.error.errors);
    const errorMessage = result.error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");
    throw new Error(errorMessage);
  }
  return result.data;
};
