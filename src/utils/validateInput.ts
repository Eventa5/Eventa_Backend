import type { ZodTypeAny, z } from "zod";

// 驗證輸入並返回結果
export const validateInput = <Schema extends ZodTypeAny>(
  schema: Schema,
  data: unknown,
): z.infer<Schema> => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errorMessage = result.error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");
    throw new Error(errorMessage);
  }
  return result.data;
};
