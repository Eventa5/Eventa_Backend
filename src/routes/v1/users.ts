import express from "express";
import {
  forget,
  getProfile,
  googleCallback,
  googleLogin,
  login,
  resetPassword,
  signup,
  updateProfile,
  uploadAvatar,
} from "../../controllers/userController";
import { auth } from "../../middlewares/auth";
import { upload } from "../../middlewares/multer";

const router = express.Router();

/**
 * @swagger
 * /api/v1/users/signup:
 *   post:
 *     tags:
 *       - Users
 *     summary: 用戶註冊
 *     description: 創建新用戶帳號
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: 註冊成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SignupResponse'
 *       400:
 *         description: 請求錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/signup", signup);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: 用戶登入
 *     description: 用戶登入系統並獲取 JWT 認證 Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: 登入成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: 請求錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/login", login);

/**
 * @swagger
 * /api/v1/users/google/login:
 *   get:
 *     tags:
 *       - Users
 *     summary: Google OAuth 登入
 *     description: 開始 Google OAuth 認證流程，重定向至 Google 登入頁面
 *     responses:
 *       302:
 *         description: 重定向至 Google 登入頁面
 */
router.get("/google/login", googleLogin);

/**
 * @swagger
 * /api/v1/users/google/callback:
 *   get:
 *     tags:
 *       - Users
 *     summary: Google OAuth 回調
 *     description: Google 認證完成後的回調處理
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Google 授權碼
 *     responses:
 *       200:
 *         description: 認證成功，返回HTML頁面自動傳送結果給前端並關閉窗口
 */
router.get("/google/callback", googleCallback);

/**
 * @swagger
 * /api/v1/users/forget:
 *   put:
 *     tags:
 *       - Users
 *     summary: 請求密碼重設
 *     description: 發送重設密碼郵件至指定信箱
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgetRequestSchema'
 *     responses:
 *       200:
 *         description: 發送成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResetPasswordResponse'
 *       400:
 *         description: 請求錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/forget", forget);

/**
 * @swagger
 * /api/v1/users/resetPassword:
 *   put:
 *     tags:
 *       - Users
 *     summary: 確認密碼重設
 *     description: 使用重設令牌和新密碼完成密碼重設
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequestSchema'
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResetPasswordResponse'
 *       400:
 *         description: 請求錯誤，可能是令牌過期或無效
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/resetPassword", resetPassword);

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     tags:
 *       - Users
 *     summary: 獲取用戶資料
 *     description: 獲取當前登入用戶的資料
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功獲取用戶資料
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: 未授權
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 用戶不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/profile", auth, getProfile);

/**
 * @swagger
 * /api/v1/users/profile:
 *   put:
 *     tags:
 *       - Users
 *     summary: 更新用戶資料
 *     description: 更新當前登入用戶的資料
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateProfileResponse'
 *       400:
 *         description: 請求錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未授權
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 用戶不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/profile", auth, updateProfile);

/**
 * @swagger
 * /api/v1/users/profile/avatar:
 *   post:
 *     tags:
 *       - Users
 *     summary: 上傳用戶頭像
 *     description: 上傳一張圖片作為當前登入用戶的大頭貼，圖片將會上傳至 Imgur 並儲存其 URL 至 DB
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UploadAvatarRequest'
 *     responses:
 *       200:
 *         description: 上傳成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadAvatarResponse'
 *       400:
 *         description: 錯誤的請求，例如沒有圖片、圖片上傳失敗等
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未授權
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/profile/avatar", auth, upload.single("avatar"), uploadAvatar);

export default router;
