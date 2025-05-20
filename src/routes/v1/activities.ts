import express from "express";
import * as activityController from "../../controllers/activityController";
import { auth, optionalAuth } from "../../middlewares/auth";
const router = express.Router();

// router.get("/popular", () => {}); // 取得熱門活動

/**
 * @swagger
 * /api/v1/activities:
 *   get:
 *     tags:
 *       - Activities
 *     summary: 獲取活動資料
 *     description: 獲取活動資料
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: 當前頁數（預設為 1）
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: 每頁資料筆數（預設為 8）
 *         required: false
 *         schema:
 *           type: integer
 *           example: 8
 *       - name: categoryId
 *         in: query
 *         description: 類別 ID
 *         required: false
 *         schema:
 *           type: integer
 *           example: 3
 *       - name: location
 *         in: query
 *         description: 地點關鍵字
 *         required: false
 *         schema:
 *           type: string
 *           example: 台北
 *       - name: startTime
 *         in: query
 *         description: 起始時間（格式：YYYY-MM-DD）
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-05-01
 *       - name: endTime
 *         in: query
 *         description: 結束時間（格式：YYYY-MM-DD）
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-06-30
 *       - name: keyword
 *         in: query
 *         description: 活動關鍵字（標題或內容）
 *         required: false
 *         schema:
 *           type: string
 *           example: 音樂
 *       - name: organizationId
 *         in: query
 *         description: 主辦單位 ID
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: 成功獲取活動資料
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ActivitiesResponse'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationResponse'
 *       400:
 *         description: 格式錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", activityController.getActivities); // 取得活動資料

/**
 * @swagger
 * /api/v1/activities/{activityId}/ticketTypes:
 *   get:
 *     tags:
 *       - Activities
 *     summary: 取得某一活動的所有票種資訊
 *     description: 當使用者要報名一個活動時，會先取得這一個活動的所有票種資訊，例如：一般票、早鳥票等等
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         description: 當前活動的 id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 該活動的所有票種資訊，為一個陣列
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TicketTypeResponse'
 *
 *       401:
 *         description: 未登入或無效 token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       404:
 *         description: 活動不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       500:
 *         description: 伺服器錯誤，請稍後再試
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:activityId/ticketTypes", activityController.getActivityTicketTypes);

// router.get("/:activityId/participants", () => {}); // 取得活動參加名單

/**
 * @swagger
 * /api/v1/activities/{activityId}:
 *   get:
 *     tags:
 *       - Activities
 *     summary: 獲取特定的活動資料
 *     description: 獲取特定活動資料
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: activityId
 *         in: path
 *         description: 活動 ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 成功獲取活動資料
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
 *                   $ref: '#/components/schemas/ActivityResponse'
 *       400:
 *         description: 格式錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:activityId", optionalAuth, activityController.getActivity); // 取得特定活動資料

/**
 * @swagger
 * /api/v1/activities:
 *   post:
 *     tags:
 *       - Activities
 *     summary: 新增一筆活動資料
 *     description: 在選擇活動形式為線上或線下後，即新增一筆活動資料到db中
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateActivityRequest'
 *     responses:
 *       201:
 *         description: 成功新增一筆活動資料
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
 *                   $ref: '#/components/schemas/CreateActivityResponse'
 *       400:
 *         description: 格式錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未登入
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: 無權限，非主辦單位成員
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", auth, activityController.createActivity); // 創建活動
// router.post("/:activityId/favorite", () => {}); // 收藏活動

// router.put("/:activityId", () => {}); // 編輯活動

/**
 * @swagger
 * /api/v1/activities/{activityId}/categories:
 *   patch:
 *     tags:
 *       - Activities
 *     summary: 新增活動時，設定指定活動ID的主題步驟
 *     description: 設定活動主題，至少要選擇一個主題
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: activityId
 *         in: path
 *         description: 活動 ID
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatchActivityCategoriesRequest'
 *     responses:
 *       200:
 *         description: 成功設定活動主題
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
 *                   $ref: '#/components/schemas/CreateActivityResponse'
 *       400:
 *         description: 格式錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未登入
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: 無權限，非主辦單位成員
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:activityId/categories", auth, activityController.patchActivityCategories); // 新增活動 - 活動主題步驟
// router.patch("/:activityId/basic", () => {}); // 新增活動 - 基本資料步驟
// router.patch("/:activityId/content", () => {}); // 新增活動 - 詳細內容步驟
// router.patch("/:activityId/publish", () => {}); // 新增活動 - 發布活動
// router.patch("/:activityId/cancel", () => {}); // 取消活動

// router.delete("/:activityId/favorite", () => {}); // 取消收藏

export default router;
