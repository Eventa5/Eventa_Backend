/**
 * @swagger
 * components:
 *   schemas:
 *     # -----------------------------------------------
 *     # 票種資料結構
 *     # -----------------------------------------------
 *     TicketTypeResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 票種 id
 *           example: 1
 *         activityId:
 *           type: integer
 *           description: 對應活動 id，應與傳入的一致
 *           example: 1
 *         name:
 *           type: string
 *           description: 票種名稱
 *           example: 一般票、早鳥票
 *         price:
 *           type: integer
 *           description: 票種價格
 *           example: 1000
 *         totalQuantity:
 *           type: integer
 *           description: 票種總數量
 *           example: 10
 *         remainingQuantity:
 *           type: integer
 *           description: 票種剩餘數量
 *           example: 5
 *         description:
 *           type: string
 *           description: 票種描述，可為 null
 *           nullable: true
 *           example: 早鳥票，限量 100 張，售完為止
 *         startTime:
 *           type: string
 *           format: date
 *           description: 開賣時間，格式為 ISO 8601
 *           example: "2023-10-01T00:00:00Z"
 *         endTime:
 *           type: string
 *           format: date
 *           description: 開賣結束時間，格式為 ISO 8601
 *           example: "2023-10-31T23:59:59Z"
 *         saleStartAt:
 *           type: string
 *           format: date
 *           description: 開賣時間，格式為 ISO 8601
 *           nullable: true
 *           example: "2023-10-01T00:00:00Z"
 *         saleEndAt:
 *           type: string
 *           format: date
 *           description: 開賣結束時間，格式為 ISO 8601
 *           nullable: true
 *           example: "2023-10-31T23:59:59Z"
 *         isActive:
 *           type: boolean
 *           description: 是否為活動中
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date
 *           description: 創建時間，格式為 ISO 8601
 *           example: "2023-10-01T00:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: 更新時間，格式為 ISO 8601
 *           example: "2023-10-01T00:00:00Z"
 */
