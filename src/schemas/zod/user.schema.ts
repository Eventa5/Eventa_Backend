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
  account: z.string().email("請提供有效的電子郵件地址"),
  password: z.string().min(1, "請提供密碼"),
});

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
  birthday: z
    .string()
    .regex(/^\d{4}\/\d{2}\/\d{2}$/, "生日格式必須為 YYYY/MM/DD")
    .nullable(),
  gender: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  countryCode: z.string().nullable(),
  region: z.string().max(255, "地區不能超過255個字符").nullable(),
  address: z.string().max(255, "地址不能超過255個字符").nullable(),
  identity: z.string().max(255, "身份不能超過255個字符").nullable(),
});
