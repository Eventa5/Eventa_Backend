import express from "express";

import { auth, optionalAuth } from "../../middlewares/auth";

import * as activityController from "../../controllers/activityController";
import * as ticketTypeController from "../../controllers/ticketTypeController";

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
 *       - name: organizerId
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

/**
 * @swagger
 * /api/v1/activities/{activityId}/ticketTypes:
 *   post:
 *     tags:
 *       - Activities
 *     summary: 新增特定活動票種
 *     description: 主辦方在創建活動時所用之新增票種功能
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         description: 活動 ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: 票種資料，可同時多張新增，最少要有一張
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/TicketTypeRequestSchema'
 *     responses:
 *       201:
 *         description: 新增票種成功，產生資料的筆數
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 票種新增成功
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   description: 成功新增票種的數量
 *                   example: 成功新增 2 筆資料
 *       400:
 *         description: 格式錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未提供授權令牌
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: 非主辦單位，無法新增票種
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 活動不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/:activityId/ticketTypes", auth, ticketTypeController.createTicketTypes);

/**
 * @swagger
 * /api/v1/activities/{activityId}/ticketTypes/{ticketTypeId}:
 *   put:
 *     tags:
 *       - Activities
 *     summary: 編輯特定活動之單一票種
 *     description: 主辦方編輯票種功能
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         description: 活動 ID
 *         schema:
 *           type: integer
 *       - in: path
 *         name: ticketTypeId
 *         required: true
 *         description: 需要修改的票種 id
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: 編輯單一票種資料
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketTypeRequestSchema'
 *     responses:
 *       200:
 *         description: 更新票種成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 編輯成功
 *                 status:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: 格式錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未提供授權令牌
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: 非主辦單位，無法編輯票種
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 活動不存在、該票種不存在、該票種不屬於此活動
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:activityId/ticketTypes/:ticketTypeId", auth, ticketTypeController.updateTicketType);

/**
 * @swagger
 * /api/v1/activities/{activityId}/ticketTypes/{ticketTypeId}:
 *   delete:
 *     tags:
 *       - Activities
 *     summary: 刪除特定活動之單一票種
 *     description: 主辦方刪除票種功能
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         description: 活動 ID
 *         schema:
 *           type: integer
 *       - in: path
 *         name: ticketTypeId
 *         required: true
 *         description: 需要刪除的票種 id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 刪除票種成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 刪除成功
 *                 status:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: 格式錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未提供授權令牌
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: 非主辦單位，無法刪除票種
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 活動不存在、該票種不存在、該票種不屬於此活動
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  "/:activityId/ticketTypes/:ticketTypeId",
  auth,
  ticketTypeController.deleteTicketType,
);

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

// router.post("/", () => {}); // 創建活動
// router.post("/:activityId/favorite", () => {}); // 收藏活動

// router.put("/:activityId", () => {}); // 編輯活動

// router.patch("/:activityId/cancel", () => {}); // 取消活動

// router.delete("/:activityId/favorite", () => {}); // 取消收藏

export default router;
