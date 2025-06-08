import express from "express";

import { auth } from "../../middlewares/auth";

import * as ticketController from "../../controllers/ticketController";

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

export default router;
