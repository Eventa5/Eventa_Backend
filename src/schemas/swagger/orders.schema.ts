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
 *         createdAt:
 *           type: string
 *           format: date
 *           description: 訂單創建時間，格式為 ISO 8601
 *           example: 2025-05-01T10:00:00Z
 *         activity:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: 活動 ID
 *               example: 1
 *             title:
 *               type: string
 *               description: 活動標題
 *               example: 藝術市集：創意手作與在地文創展覽
 *             location:
 *               type: string
 *               description: 活動地點
 *               nullable: true
 *               example: 台北市
 *             isOnline:
 *               type: boolean
 *               description: 是否為線上活動
 *               example: false
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
 *     # 查詢訂單詳情回傳結構
 *     # -----------------------------------------------
 *     OrderDetailResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: 訂單 ID
 *           example: 00000001745575851770
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
 *         status:
 *           type: string
 *           description: 訂單狀態
 *           example: paid | pending | expired | canceled
 *         invoiceAddress:
 *           type: string
 *           description: 發票地址
 *           nullable: true
 *           example: 台北市信義區松山路100號
 *         invoiceReceiverName:
 *           type: string
 *           description: 發票收件者名稱
 *           nullable: true
 *           example: 六角股份有限公司
 *         invoiceReceiverEmail:
 *           type: string
 *           description: 發票收件者電子郵件
 *           nullable: true
 *           example: example@example.com
 *         invoiceReceiverPhoneNumber:
 *           type: string
 *           description: 發票收件者電話號碼
 *           nullable: true
 *           example: 0212346789
 *         invoiceTitle:
 *           type: string
 *           description: 發票抬頭
 *           nullable: true
 *           example: 六角股份有限公司
 *         invoiceTaxId:
 *           type: string
 *           description: 發票統一編號，長度需為 8 位數
 *           nullable: true
 *           example: 12345678
 *         invoiceCarrier:
 *           type: string
 *           description: 發票載具
 *           nullable: true
 *           example: /A2123DD
 *         invoiceType:
 *           type: string
 *           description: 發票類型
 *           example: b2b | b2c
 *         createdAt:
 *           type: string
 *           format: date
 *           description: 訂單創建時間，格式為 ISO 8601
 *           example: 2025-05-01T10:00:00Z
 *         user:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: 使用者名稱
 *               nullable: true
 *               example: 小明
 *             displayName:
 *               type: string
 *               description: 使用者顯示名稱
 *               nullable: true
 *               example: 小明
 *             email:
 *               type: string
 *               description: 使用者電子郵件
 *               nullable: true
 *               example: example@example.com
 *             phoneNumber:
 *               type: string
 *               description: 使用者電話號碼
 *               nullable: true
 *               example: 0912345678
 *             gender:
 *               type: string
 *               description: 使用者性別
 *               nullable: true
 *               example: male | female | other
 *         activity:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               description: 活動標題
 *               example: 藝術市集：創意手作與在地文創展覽
 *             tags:
 *               type: string
 *               description: 活動標籤
 *               nullable: true
 *               example: 螢火蟲,生態導覽,賞螢,親子活動
 *             categories:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: 活動類別 ID
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: 活動類別名稱
 *                     example: 音樂
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
 *             paidAmount:
 *               type: integer
 *               description: 實際支付金額
 *               example: 3900
 *         tickets:
 *           type: array
 *           description: 訂單中的票券列表
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: 票券 ID
 *                 example: T25060120101319526
 *               status:
 *                 type: string
 *                 description: 票券狀態
 *                 example: assigned | unassigned | used | canceled | overdue
 *               refundDeadline:
 *                 type: string
 *                 description: 退款截止時間，格式為 ISO 8601
 *                 example: 2025-05-01T18:00:00Z
 *               assignedUserId:
 *                 type: number
 *                 description: 指派的使用者 ID
 *                 nullable: true
 *                 example: 1
 *               assignedName:
 *                 type: string
 *                 description: 指派的使用者名稱
 *                 nullable: true
 *                 example: 小明
 *               assignedEmail:
 *                 type: string
 *                 description: 指派的使用者電子郵件
 *                 nullable: true
 *                 example: example@example.com
 *               ticketType:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: 票種 ID
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: 票種名稱
 *                     example: 成人票
 *                   price:
 *                     type: integer
 *                     description: 票種價格
 *                     example: 1950
 *                   startTime:
 *                     type: string
 *                     format: date
 *                     description: 票種開始時間，格式為 ISO 8601
 *                     example: 2025-05-01T10:00:00Z
 *                   endTime:
 *                     type: string
 *                     format: date
 *                     description: 票種結束時間，格式為 ISO 8601
 *                     example: 2025-05-01T18:00:00Z
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
