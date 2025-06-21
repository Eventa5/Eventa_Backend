import { z } from "zod";

// 用戶註冊驗證結構
export const signupSchema = z
  .object({
    email: z.string().email("請提供有效的電子郵件地址"),
    password: z.string().min(8, "密碼必須至少有8個字符").max(100),
    checkPassword: z.string(),
  })
  .refine((data) => data.password === data.checkPassword, {
    message: "密碼和確認密碼必須相同",
    path: ["checkPassword"],
  });

// 用戶登入驗證結構
export const loginSchema = z.object({
  email: z.string().email("請提供有效的電子郵件地址"),
  password: z.string().min(1, "請提供密碼"),
});

// 重設密碼請求驗證結構
export const forgetSchema = z.object({
  email: z.string().email("請提供有效的電子郵件地址"),
});

// 重設密碼確認驗證結構
export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "密碼必須至少有8個字符").max(100),
    confirmNewPassword: z.string().min(8, "請確認您的新密碼"),
    resetToken: z.string().min(1, "重設令牌不能為空"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "新密碼和確認新密碼必須相同",
    path: ["confirmNewPassword"],
  });

export const birthdaySchema = z
  .preprocess((val: unknown): Date | null => {
    if (val === null || val === "") return null;

    if (typeof val !== "string") throw new Error("生日格式錯誤，請使用 YYYY/MM/DD");

    const match = val.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
    if (!match) throw new Error("生日格式錯誤，請使用 YYYY/MM/DD");

    const [, y, m, d] = match;
    const date = new Date(Date.UTC(+y, +m - 1, +d));

    if (date.getUTCFullYear() !== +y || date.getUTCMonth() !== +m - 1 || date.getUTCDate() !== +d) {
      throw new Error("生日日期不正確");
    }

    return date;
  }, z.date())
  .nullable();

// 用戶資料更新驗證結構
export const updateProfileSchema = z.object({
  name: z.string().max(255, "姓名不能超過255個字符").nullable(),
  email: z.string().email("請提供有效的電子郵件地址"),
  avatar: z
    .string()
    .nullable()
    .refine((val) => val === null || val === "" || z.string().url().safeParse(val).success, {
      message: "頭像必須是有效的 URL、空字串或 null",
    }),
  displayName: z.string().max(255, "顯示名稱不能超過255個字符").nullable(),
  birthday: birthdaySchema,
  gender: z.string().nullable(),
  phoneNumber: z
    .string()
    .regex(/^09\d{8}$/, "手機號碼格式不正確")
    .nullable(),
  countryCode: z.string().nullable(),
  region: z.string().max(255, "地區不能超過255個字符").nullable(),
  address: z.string().max(255, "地址不能超過255個字符").nullable(),
  identity: z.string().max(255, "身份不能超過255個字符").nullable(),
});
