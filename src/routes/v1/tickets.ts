import express from "express";
import * as ticketController from "../../controllers/ticketController";
import { auth } from "../../middlewares/auth";
const router = express.Router();

/**
 * @swagger
 * /api/v1/tickets/{ticketId}:
 *   get:
 *     tags:
 *       - Tickets
 *     summary: 查看單一票券
 *     description: 查看單一票券的詳細資訊
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *           example: T25053115453487373
 *     responses:
 *       200:
 *         description: 成功獲取票券詳細資訊
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
 *                   $ref: '#/components/schemas/TicketDetailResponse'
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
 *       404:
 *         description: 票券不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:ticketId", auth, ticketController.getTicketDetails);

/**
 * @swagger
 * /api/v1/tickets/{ticketId}/used:
 *   patch:
 *     tags:
 *       - Tickets
 *     summary: 票券報到
 *     description: 參加活動時點選報到，票券狀態改為used
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: ticketId
 *         in: path
 *         description: 票券 ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 報到成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 報到成功
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: T25060120101319526
 *                     status:
 *                       type: string
 *                       example: used
 *       400:
 *         description: 格式錯誤、活動尚未開始，無法報到、活動已結束，無法報到
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
 *         description: 非主辦單位，無權限報到
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 票券不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: 票券狀態非assigned，無法報到
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:ticketId/used", auth, ticketController.patchTicketUsed);

export default router;
