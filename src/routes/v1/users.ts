import express from "express";
import { getProfile, login, signup, updateProfile } from "../../controllers/userController";
import { auth } from "../../middlewares/auth";

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
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - checkPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 用戶電子郵件，將作為登入帳號
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 用戶密碼
 *               checkPassword:
 *                 type: string
 *                 format: password
 *                 description: 確認密碼，必須與密碼一致
 *     responses:
 *       201:
 *         description: 註冊成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 註冊成功
 *                 status:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: 請求錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 所有欄位都是必填的 | 密碼和確認密碼不一致 | 該郵箱已被註冊
 *                 status:
 *                   type: boolean
 *                   example: false
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
 *             type: object
 *             required:
 *               - account
 *               - password
 *             properties:
 *               account:
 *                 type: string
 *                 description: 使用者電子郵件地址
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 使用者密碼
 *     responses:
 *       200:
 *         description: 登入成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 登入成功
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   description: JWT Token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: 請求錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 帳號和密碼都是必填的 | 帳號或密碼錯誤
 *                 status:
 *                   type: boolean
 *                   example: false
 */
router.post("/login", login);

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
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "1"
 *                     memberId:
 *                       type: string
 *                       example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *                     name:
 *                       type: string
 *                       nullable: true
 *                       example: "張小明"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     avatar:
 *                       type: string
 *                       nullable: true
 *                       example: "https://example.com/avatar.jpg"
 *                     displayName:
 *                       type: string
 *                       nullable: true
 *                       example: "小明"
 *                     birthday:
 *                       type: string
 *                       nullable: true
 *                       example: "1990/01/01"
 *                     gender:
 *                       type: string
 *                       nullable: true
 *                       example: "male"
 *                     phoneNumber:
 *                       type: string
 *                       nullable: true
 *                       example: "0912345678"
 *                     countryCode:
 *                       type: string
 *                       nullable: true
 *                       example: "+886"
 *                     region:
 *                       type: string
 *                       nullable: true
 *                       example: "台北市"
 *                     address:
 *                       type: string
 *                       nullable: true
 *                       example: "中正區重慶南路一段"
 *                     identity:
 *                       type: string
 *                       nullable: true
 *                       example: "一般用戶"
 *       401:
 *         description: 未授權
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 未授權
 *                 status:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: 用戶不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 使用者不存在
 *                 status:
 *                   type: boolean
 *                   example: false
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 用戶真實姓名
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 用戶電子郵件
 *               avatar:
 *                 type: string
 *                 description: 用戶頭像 URL
 *               displayName:
 *                 type: string
 *                 description: 用戶顯示名稱
 *               birthday:
 *                 type: string
 *                 description: "用戶生日 (格式: YYYY/MM/DD)"
 *               gender:
 *                 type: string
 *                 description: 性別
 *               phoneNumber:
 *                 type: string
 *                 description: 電話號碼
 *               countryCode:
 *                 type: string
 *                 description: 國家代碼
 *               region:
 *                 type: string
 *                 description: 地區
 *               address:
 *                 type: string
 *                 description: 地址
 *               identity:
 *                 type: string
 *                 description: 身分識別
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 更新成功
 *                 status:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: 請求錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 此電子郵件已被使用
 *                 status:
 *                   type: boolean
 *                   example: false
 *       401:
 *         description: 未授權
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 未授權
 *                 status:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: 用戶不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 使用者不存在
 *                 status:
 *                   type: boolean
 *                   example: false
 */
router.put("/profile", auth, updateProfile);

export default router;
