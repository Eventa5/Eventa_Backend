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
 *.      404:
 *         description: 活動不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", auth, ticketTypeController.createTicketTypes);

export default router;
