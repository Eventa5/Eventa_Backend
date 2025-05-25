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
 *       - name: organizationId
 *         in: query
 *         description: 主辦單位 ID
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: status
 *         in: query
 *         description: 活動狀態 draft | published | ended | canceled
 *         required: false
 *         schema:
 *           type: string
 *           example: published
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
 *               $ref: '#/components/schemas/CreateActivityResponse'
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

/**
 * @swagger
 * /api/v1/activities/{activityId}:
 *   put:
 *     tags:
 *       - Activities
 *     summary: 更新活動資料
 *     description: 更新活動資料
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
 *             $ref: '#/components/schemas/EditActivityRequest'
 *     responses:
 *       200:
 *         description: 成功更新活動資料
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
 *       404:
 *         description: 活動不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:activityId", auth, activityController.editActivity); // 編輯活動

/**
 * @swagger
 * /api/v1/activities/{activityId}/categories:
 *   patch:
 *     tags:
 *       - Activities
 *     summary: 新增活動時，設定活動主題步驟
 *     description: 設定活動主題，至少要選擇一個主題，最多兩個，帶入主題ID array
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
 *               $ref: '#/components/schemas/PatchActivityResponse'
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

/**
 * @swagger
 * /api/v1/activities/{activityId}/basic:
 *   patch:
 *     tags:
 *       - Activities
 *     summary: 新增活動時，設定基本資料步驟
 *     description: 新增活動時的基本資料步驟，包含活動名稱、活動起迄時間、活動地點
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
 *             $ref: '#/components/schemas/PatchActivityBasicRequest'
 *     responses:
 *       200:
 *         description: 成功設定活動基本資料
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PatchActivityResponse'
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
router.patch("/:activityId/basic", auth, activityController.patchActivityBasicInfo); // 新增活動 - 基本資料步驟

/**
 * @swagger
 * /api/v1/activities/{activityId}/content:
 *   patch:
 *     tags:
 *       - Activities
 *     summary: 新增活動時，設定詳細內容步驟
 *     description: 新增活動時的詳細內容步驟，包含活動簡介、活動詳細內容
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
 *             $ref: '#/components/schemas/PatchActivityContentRequest'
 *     responses:
 *       200:
 *         description: 成功設定詳細內容
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PatchActivityResponse'
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
router.patch("/:activityId/content", auth, activityController.patchActivityContent); // 新增活動 - 詳細內容步驟

/**
 * @swagger
 * /api/v1/activities/{activityId}/publish:
 *   patch:
 *     tags:
 *       - Activities
 *     summary: 新增活動時最後一步驟，發布活動
 *     description: 前置步驟都設定完成後的最後一步，發布活動，所有使用者皆可看到此活動
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
 *         description: 成功發布活動
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PatchActivityStatusResponse'
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
router.patch("/:activityId/publish", auth, activityController.patchActivityPublish); // 新增活動 - 發布活動

/**
 * @swagger
 * /api/v1/activities/{activityId}/cancel:
 *   patch:
 *     tags:
 *       - Activities
 *     summary: 取消活動
 *     description: 將活動狀態改為canceled
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
 *         description: 成功取消活動
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PatchActivityStatusResponse'
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
router.patch("/:activityId/cancel", auth, activityController.cancelActivity); // 取消活動

// router.delete("/:activityId/favorite", () => {}); // 取消收藏

export default router;
