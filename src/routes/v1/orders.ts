import express from "express";

import * as orderController from "../../controllers/orderController";
import { auth } from "../../middlewares/auth";
const router = express.Router();

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: 創建訂單
 *     description: 創建新的訂單
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/OrderRequest'
 *
 *     responses:
 *       200:
 *         description: 訂單創建成功
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
 *                   $ref: '#/components/schemas/OrderResponse'
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
router.post("/", auth, orderController.createOrder);

export default router;
