/**
 * @swagger
 * components:
 *   schemas:
 *     # -----------------------------------------------
 *     # 查詢訂單回傳結構
 *     # -----------------------------------------------
 *     OrderResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: 訂單 ID
 *           example: 00000001745575851770
 *         status:
 *           type: string
 *           description: 訂單狀態
 *           example: paid | pending | expired | canceled
 *         paidAt:
 *           type: string
 *           format: date
 *           description: 訂單支付時間，格式為 ISO 8601
 *           example: 2025-05-01T10:00:00Z
 *         paidExpiredAt:
 *           type: string
 *           format: date
 *           description: 訂單支付過期時間，格式為 ISO 8601
 *           example: 2025-05-01T10:10:00Z
 *         activity:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               description: 活動標題
 *               example: 藝術市集：創意手作與在地文創展覽
 *             location:
 *               type: string
 *               description: 活動地點
 *               example: 台北市
 *             startTime:
 *               type: string
 *               format: date
 *               description: 活動開始時間，格式為 ISO 8601
 *               example: 2025-05-01T10:00:00Z
 *             endTime:
 *               type: string
 *               format: date
 *               description: 活動結束時間，格式為 ISO 8601
 *               example: 2025-05-01T18:00:00Z
 *         payment:
 *           type: object
 *           properties:
 *             method:
 *               type: string
 *               description: 支付方式
 *               example: "信用卡"
 *     # -----------------------------------------------
 *     # 創建訂單回傳結構
 *     # -----------------------------------------------
 *     CreateOrderResponse:
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
 *           type: object
 *           description: 發票資訊
 *           properties:
 *             invoiceAddress:
 *               type: string
 *               description: 發票地址
 *               nullable: true
 *               example: 台北市信義區松山路100號
 *             invoiceReceiverName:
 *               type: string
 *               description: 發票收件者名稱
 *               nullable: true
 *               example: 六角股份有限公司
 *             invoiceReceiverPhoneNumber:
 *               type: string
 *               description: 發票收件者電話號碼
 *               nullable: true
 *               example: 0212346789
 *             invoiceReceiverEmail:
 *               type: string
 *               description: 發票收件者電子郵件
 *               nullable: true
 *               example: example@example.com
 *             invoiceTaxId:
 *               type: string
 *               description: 發票統一編號，長度需為 8 位數
 *               nullable: true
 *               example: 12345678
 *             invoiceTitle:
 *               type: string
 *               description: 發票抬頭
 *               nullable: true
 *               example: 六角股份有限公司
 *             invoiceCarrier:
 *               type: string
 *               description: 發票載具
 *               nullable: true
 *               example: /A2123DD
 *             invoiceType:
 *               type: string
 *               description: 發票類型
 *               example: b2b | b2c
 *     # -----------------------------------------------
 *     # 訂單建立結構
 *     # -----------------------------------------------
 *     CreateOrderRequest:
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
 *               id:
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
 *           type: object
 *           description: 發票資訊
 *           properties:
 *             invoiceAddress:
 *               type: string
 *               description: 常用發票發票地址
 *               nullable: true
 *               example: 台北市信義區松山路100號
 *             invoiceReceiverName:
 *               type: string
 *               description: 常用發票收件者名稱
 *               nullable: true
 *               example: 六角股份有限公司
 *             invoiceReceiverPhoneNumber:
 *               type: string
 *               description: 常用發票收件者電話號碼
 *               nullable: true
 *               example: 0212346789
 *             invoiceReceiverEmail:
 *               type: string
 *               description: 常用發票收件者電子郵件
 *               nullable: true
 *               example: example@example.com
 *             invoiceTaxId:
 *               type: string
 *               description: 常用發票統一編號，長度需為 8 位數
 *               nullable: true
 *               example: 12345678
 *             invoiceTitle:
 *               type: string
 *               description: 常用發票抬頭
 *               nullable: true
 *               example: 六角股份有限公司
 *             invoiceCarrier:
 *               type: string
 *               description: 常用發票載具
 *               nullable: true
 *               example: /A2123DD
 *             invoiceType:
 *               type: string
 *               description: 常用發票類型，b2b 為企業發票，b2c 為個人發票
 *               example: b2b | b2c
 *       required:
 *         - activityId
 *         - tickets
 *         - paidAmount
 */
