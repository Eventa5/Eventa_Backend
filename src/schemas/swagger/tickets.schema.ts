/**
 * @swagger
 * components:
 *   schemas:
 *     # -----------------------------------------------
 *     # 查詢票券詳情回傳結構
 *     # -----------------------------------------------
 *     TicketDetailResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: 票券 ID
 *           example: T25053115453487373
 *         status:
 *           type: string
 *           description: 票券狀態
 *           example: used | assigned | unassigned | canceled | overdue
 *         assignedUser:
 *           type: object
 *           description: 被指派的使用者
 *           nullable: true
 *           properties:
 *             id:
 *               type: string
 *               description: 使用者 ID
 *               example: U123456789
 *             name:
 *               type: string
 *               description: 使用者名稱
 *               example: 小明
 *             email:
 *               type: string
 *               description: 使用者電子郵件
 *               example: example@example.com
 *         assignedName:
 *           type: string
 *           description: 被指派的使用者名稱
 *           nullable: true
 *           example: 小王
 *         assignedEmail:
 *           type: string
 *           description: 被指派的使用者電子郵件
 *           nullable: true
 *           example: example@example.com
 *         refundDeadline:
 *           type: string
 *           description: 退款截止時間，格式為 ISO 8601
 *           format: date
 *           example: 2025-05-01T10:10:00Z
 *         qrCodeToken:
 *           type: string
 *           description: QR Code 令牌，目前只有在為 線上活動時，才會有，並且其值為 livestream url
 *           example: "1234567890abcdef"
 *         name:
 *           type: string
 *           description: 票券名稱
 *           example: 一般票
 *         price:
 *           type: number
 *           description: 票券價格
 *           example: 1000
 *         startTime:
 *           type: string
 *           format: date
 *           description: 票券有效起始時間，格式為 ISO 8601
 *           example: 2025-05-01T10:00:00Z
 *         endTime:
 *           type: string
 *           format: date
 *           description: 票券有效結束時間，格式為 ISO 8601
 *           example: 2025-05-01T18:00:00Z
 *         order:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: 對應的訂單 id
 *               example: O25053115453487373
 *             status:
 *               type: string
 *               description: 訂單狀態
 *               example: paid | pending | expired | canceled
 *             paidAt:
 *               type: string
 *               description: 訂單支付時間，格式為 ISO 8601
 *               format: date
 *               example: 2025-05-01T10:00:00Z
 *             paymentMethod:
 *               type: string
 *               description: 支付方式
 *               example: "信用卡"
 *               nullable: true
 *         activity:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               description: 活動 ID
 *               example: 1
 *             title:
 *               type: string
 *               description: 活動標題
 *               example: 藝術市集：創意手作與在地文創展覽
 *             summary:
 *               type: string
 *               description: 活動摘要
 *               example: 全台最盛大的戶外音樂祭！結合親子、野餐、星空與搖滾，讓你在仲夏夜盡情狂歡！
 *               nullable: true
 *             notes:
 *               type: string
 *               description: 活動注意事項
 *               example: 請攜帶身分證件以便入場
 *               nullable: true
 *             descriptionMd:
 *               type: string
 *               description: 活動詳細描述，使用 Markdown 格式
 *               nullable: true
 *             location:
 *               type: string
 *               description: 活動地點
 *               nullable: true
 *               example: 大安森林公園
 *             livestreamUrl:
 *               type: string
 *               description: 活動直播連結
 *               nullable: true
 *               example: https://example.com/livestream
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
 *         organizer:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               description: 主辦者 ID
 *               example: 1
 *             name:
 *               type: string
 *               description: 主辦者名稱
 *               example: 台北市文化局
 *             email:
 *               type: string
 *               description: 主辦者電子郵件
 *               example: example@example.com
 *             phoneNumber:
 *               type: string
 *               description: 主辦者電話號碼
 *               nullable: true
 *               example: 07-3123444
 *             countryCode:
 *               type: string
 *               description: 主辦者國家代碼
 *               nullable: true
 *               example: +886
 *             ext:
 *               type: string
 *               description: 主辦者電話分機號碼
 *               nullable: true
 *               example: 123
 *             officialSiteUrl:
 *               type: string
 *               description: 主辦者官方網站 URL
 *               nullable: true
 *               example: https://example.com
 */
