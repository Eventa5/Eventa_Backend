import express from "express";

import * as ticketTypeController from "../../controllers/ticketTypeController";
import { auth } from "../../middlewares/auth";

const router = express.Router();

/**
 * @swagger
 * /api/v1/ticketTypes:
 *   post:
 *     tags:
 *       - TicketTypes
 *     summary: 新增票種
 *     description: 主辦方在創建活動時所用之新增票種功能
 *     requestBody:
 *       description: 票種資料，可同時多張新增，最少要有一張
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               allOf:
 *                 - $ref: '#/components/schemas/TicketTypeRequestActivityIdSchema'
 *                 - $ref: '#/components/schemas/TicketTypeRequestSchema'
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
 *       404:
 *         description: 活動不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", auth, ticketTypeController.createTicketTypes);

/**
 * @swagger
 * /api/v1/ticketTypes/{ticketTypeId}:
 *   put:
 *     tags:
 *       - TicketTypes
 *     summary: 編輯票種
 *     description: 主辦方編輯票種功能
 *     parameters:
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
 *       404:
 *         description: 票種不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:ticketTypeId", auth, ticketTypeController.updateTicketType);

/**
 * @swagger
 * /api/v1/ticketTypes/{ticketTypeId}:
 *   delete:
 *     tags:
 *       - TicketTypes
 *     summary: 刪除票種
 *     description: 主辦方刪除票種功能
 *     parameters:
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
 *       404:
 *         description: 票種不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:ticketTypeId", auth, ticketTypeController.deleteTicketType);

export default router;
