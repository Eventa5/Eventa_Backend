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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201:
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
 *                   $ref: '#/components/schemas/CreateOrderResponse'
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

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: 查看所有訂單
 *     description: 查看單一使用者的訂單
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 8，最小為 1，最多為 100
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           example: paid | pending | expired | canceled
 *           description: 如果沒有提供，則返回所有狀態的訂單
 *       - in: query
 *         name: title
 *         required: false
 *         schema:
 *           type: string
 *           example: 活動名稱
 *         description: 活動名稱關鍵字搜尋
 *       - in: query
 *         name: from
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-06-30
 *         description: 從何時（格式：YYYY-MM-DD）
 *       - in: query
 *         name: to
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-07-30
 *         description: 到何時（格式：YYYY-MM-DD）
 *     responses:
 *       200:
 *         description: 請求成功
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
 *                     $ref: '#/components/schemas/OrderResponse'
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
 */
router.get("/", auth, orderController.getOrders);

/**
 * @swagger
 * /api/v1/orders/return:
 *   post:
 *     tags:
 *       - Orders
 *     summary: 後端來接受 ECPay 回傳的訂單資訊
 */
router.post("/return", orderController.returnECPay);

/**
 * @swagger
 * /api/v1/orders/{orderId}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: 查看單一訂單
 *     description: 查看單一訂單的詳細資訊
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *           example: "O25053115453487373"
 *     responses:
 *       200:
 *         description: 成功獲取訂單詳細資訊
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
 *                   $ref: '#/components/schemas/OrderDetailResponse'
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
 *         description: 訂單不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:orderId", auth, orderController.getOrderDetail);

/**
 * @swagger
 * /api/v1/orders/{orderId}/cancel:
 *   patch:
 *     tags:
 *       - Orders
 *     summary: 取消訂單
 *     description: 用來手動取消訂單
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *           example: "O25053115453487373"
 *     responses:
 *       200:
 *         description: 取消成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 取消成功
 *                 status:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: 缺少訂單 id
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
 *       409:
 *         description: 只能取消未付款的訂單
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 訂單不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:orderId/cancel", auth, orderController.cancelOrder);

/**
 * @swagger
 * /api/v1/orders/{orderId}/checkout:
 *   post:
 *     tags:
 *       - Orders
 *     summary: 結帳訂單
 *     description: 用來結帳訂單
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *           example: "O25053115453487373"
 *     responses:
 *       200:
 *         description: 回傳 html 的 form 表單，前端需要在原頁開啟來提交
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<form>...</form>"
 *       401:
 *         description: 未提供授權令牌
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 訂單不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: 只能結帳未付款的訂單
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/:orderId/checkout", auth, orderController.checkoutOrder);

export default router;
