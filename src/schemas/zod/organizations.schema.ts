import { z } from "zod";

// 建立主辦單位 Schema
export const createOrganizationSchema = z.object({
  name: z.string().min(1, "主辦單位名稱不能為空"),
  introduction: z.string().min(1, "介紹不能為空"),
  avatar: z.union([z.string().url("頭像連結格式不正確"), z.literal(""), z.null()]).optional(),
  cover: z.union([z.string().url("封面圖連結格式不正確"), z.literal(""), z.null()]).optional(),
  phoneNumber: z
    .string()
    .regex(/^09\d{8}$/, "手機號碼格式不正確")
    .min(1, "電話號碼不能為空"),
  countryCode: z.string().min(1, "國碼不能為空"),
  ext: z.union([z.string(), z.literal(""), z.null()]).optional(),
  email: z.string().email("電子郵件格式不正確"),
  officialSiteUrl: z
    .union([z.string().url("網站連結格式不正確"), z.literal(""), z.null()])
    .optional(),
});

// 更新主辦單位 Schema
export const updateOrganizationSchema = z.object({
  id: z.number().int().positive("主辦單位ID必須為正整數"),
  name: z.string().min(1, "主辦單位名稱不能為空"),
  introduction: z.string().min(1, "介紹不能為空"),
  avatar: z.union([z.string().url("頭像連結格式不正確"), z.literal(""), z.null()]).optional(),
  cover: z.union([z.string().url("封面圖連結格式不正確"), z.literal(""), z.null()]).optional(),
  phoneNumber: z
    .string()
    .regex(/^09\d{8}$/, "手機號碼格式不正確")
    .min(1, "電話號碼不能為空"),
  countryCode: z.string().min(1, "國碼不能為空"),
  ext: z.union([z.string(), z.literal(""), z.null()]).optional(),
  email: z.string().email("電子郵件格式不正確"),
  officialSiteUrl: z
    .union([z.string().url("網站連結格式不正確"), z.literal(""), z.null()])
    .optional(),
});

// 刪除主辦單位 Schema
export const deleteOrganizationSchema = z.object({
  id: z.number().int().positive("主辦單位ID必須為正整數"),
});

// 根據ID獲取主辦單位 Schema
export const getOrganizationByIdSchema = z.object({
  organizationId: z.string().transform((val) => Number.parseInt(val, 10)),
});

// 類型定義，用於接口請求和響應
export type CreateOrganizationRequest = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationRequest = z.infer<typeof updateOrganizationSchema>;
export type DeleteOrganizationRequest = z.infer<typeof deleteOrganizationSchema>;
