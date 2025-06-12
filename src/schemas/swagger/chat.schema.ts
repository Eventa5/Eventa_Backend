/**
 * @swagger
 * components:
 *   schemas:
 *     ChatRequest:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           description: 用戶輸入的問題
 *           example: "有哪些活動正在進行中？"
 *           minLength: 1
 *           maxLength: 1000
 *
 *     ChatResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: AI 回覆的訊息
 *           example: "目前有以下活動正在進行中：..."
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: 回覆時間
 *         sources:
 *           type: array
 *           items:
 *             type: string
 *           description: 資料來源
 *           example: ["activities", "users"]
 */

export {};
