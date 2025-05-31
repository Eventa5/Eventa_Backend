/**
 * 共用的 Swagger Schema 定義
 * 此檔案包含在多個 API 路由中重複使用的 schema 定義
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     # 錯誤回應結構
 *     # -----------------------------------------------
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 錯誤訊息
 *         status:
 *           type: boolean
 *           example: false
 *     # pagination結構
 *     # -----------------------------------------------
 *     PaginationResponse:
 *       type: object
 *       properties:
 *         currentPage:
 *           type: number
 *           example: 1
 *         totalItems:
 *           type: number
 *           example: 10
 *         totalPages:
 *           type: number
 *           example: 2
 *         hasNextPage:
 *           type: boolean
 *           example: true
 *         hasPrevPage:
 *           type: boolean
 *           example: false
 */
