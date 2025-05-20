/**
 * @swagger
 * components:
 *   schemas:
 *     # 多筆活動資料結構
 *     # -----------------------------------------------
 *     ActivitiesResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 1
 *         title:
 *           type: string
 *           example: 活動標題
 *         location:
 *           type: string
 *           example: 活動地點
 *         cover:
 *           type: string
 *           example: http://example.com/cover.jpg
 *         isOnline:
 *           type: boolean
 *           example: true
 *         startTime:
 *           type: string
 *           format: date
 *           example: 2025-05-01T10:00:00Z
 *         endTime:
 *           type: string
 *           format: date
 *           example: 2025-05-15T10:00:00Z
 *     # 單一活動資料結構
 *     # -----------------------------------------------
 *     ActivityResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 1
 *         organizationId:
 *           type: number
 *           example: 1
 *         cover:
 *           type: string
 *           example: http://example.com/cover.jpg
 *         title:
 *           type: string
 *           example: 活動標題
 *         location:
 *           type: string
 *           example: 活動地點
 *         startTime:
 *           type: string
 *           format: date
 *           example: 2025-05-01T10:00:00Z
 *         endTime:
 *           type: string
 *           format: date
 *           example: 2025-05-15T10:00:00Z
 *         isOnline:
 *           type: boolean
 *           example: true
 *         tags:
 *           type: string
 *           example: 音樂,活動
 *         status:
 *           type: string
 *           example: published
 *         descriptionMd:
 *           type: string
 *           example: # 活動描述\n\n這是一個很棒的活動，你可以參加！
 *         viewCount:
 *           type: number
 *           example: 10
 *         summary:
 *           type: string
 *           example: 這是一個很棒的活動，你可以參加！
 *         notes:
 *           type: string
 *           example: 活動完全免費
 *         livestreamUrl:
 *           type: string
 *           example: https://activity.com/livestream
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-01T00:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-01T00:00:00Z"
 *         categories:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: 音樂
 *         likeCount:
 *           type: number
 *           example: 10
 *         userStatus:
 *           type: object
 *           properties:
 *             isFavorited:
 *               type: boolean
 *               example: true
 *             isRegistered:
 *               type: boolean
 *               example: true
 *
 */
