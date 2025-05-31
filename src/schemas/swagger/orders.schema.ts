/**
 * @swagger
 * components:
 *   schemas:
 *     # -----------------------------------------------
 *     # 訂單結構
 *     # -----------------------------------------------
 *     OrderResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: 訂單 ID
 *           example: 00000001745575851770
 *         activityId:
 *           type: integer
 *           description: 活動 ID
 *           example: 1
 *         paidExpiredAt:
 *           type: date
 *           description: 訂單支付過期時間，格式為 ISO 8601
 *           example: 2025-05-01T10:10:00Z
 *         paidAmount:
 *           type: integer
 *           description: 實際支付金額
 *           example: 3900
 *         status:
 *           type: string
 *           description: 訂單狀態
 *           example: paid | pending | expired | canceled
 *         createdAt:
 *           type: date
 *           description: 訂單創建時間，格式為 ISO 8601
 *           example: 2025-05-01T10:00:00Z
 *         invoice:
 *           $ref: '#/components/schemas/InvoiceResponse'
 *
 *     # -----------------------------------------------
 *     # 訂單建立結構
 *     # -----------------------------------------------
 *     OrderRequest:
 *       type: object
 *       properties:
 *         activityId:
 *           type: integer
 *           description: 活動 ID
 *           example: 1
 *         tickets:
 *           type: array
 *           description: 欲購買的票券
 *           items:
 *             type: object
 *             properties:
 *               ticketTypeId:
 *                 type: integer
 *                 description: 欲購買的其中或唯一票券的票種 ID
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 description: 欲購買的其中或唯一票券的數量
 *                 example: 2
 *         paidAmount:
 *           type: integer
 *           description: 實際需支付金額
 *           example: 3900
 *         commonlyUsedInvoicesId:
 *           type: integer
 *           description: 常用發票 ID
 *           nullable: true
 *           example: 1
 *         invoice:
 *           $ref: '#/components/schemas/InvoiceRequest'
 *       required:
 *         - activityId
 *         - tickets
 *         - paidAmount
 */
