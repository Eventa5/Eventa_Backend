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
 *     # 新增一筆活動資料結構
 *     # -----------------------------------------------
 *     CreateActivityRequest:
 *       type: object
 *       required:
 *         - organizationId
 *         - isOnline
 *       properties:
 *         organizationId:
 *           type: number
 *           example: 1
 *         isOnline:
 *           type: boolean
 *           example: true
 *         livestreamUrl:
 *           type: string
 *           example: https://activity.com/livestream
 *
 *     CreateActivityResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 活動建立成功
 *         status:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               example: 1
 *             currentStep:
 *               type: string
 *               example: activityType | categories | basic | content
 *     # 新增活動步驟 - 設定主題資料結構
 *     # -----------------------------------------------
 *     PatchActivityCategoriesRequest:
 *       type: object
 *       required:
 *         - categoryIds
 *       properties:
 *         categoryIds:
 *           type: array
 *           items:
 *             type: number
 *             example: 1
 *     # 新增活動步驟 - 設定基本資料結構
 *     # -----------------------------------------------
 *     PatchActivityBasicRequest:
 *       type: object
 *       required:
 *         - categoryIds
 *       properties:
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
 *         tags:
 *           type: string
 *           example: 文青最愛, 聽團仔
 *     # 新增活動步驟 - 設定詳細內容資料結構
 *     # -----------------------------------------------
 *     PatchActivityContentRequest:
 *       type: object
 *       required:
 *         - categoryIds
 *       properties:
 *         summary:
 *           type: string
 *           example: 活動通集結論壇、展覽、講座、免費體驗及各式有趣活動資訊；無論您想要找活動或者辦活動，方便的線上售票及活動報名功能都是您事半功倍的好幫手！
 *         descriptionMd:
 *           type: string
 *           example: "#活動描述\n\n這是一個很棒的活動，你可以參加！"
 *         notes:
 *           type: string
 *           example: 活動完全免費
 *     # 新增活動所有步驟共用回應
 *     # -----------------------------------------------
 *     PatchActivityResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 活動資料設定成功
 *         status:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               example: 1
 *             currentStep:
 *               type: string
 *               example: activityType | categories | basic | content
 *     # 發布活動回應資料結構
 *     # -----------------------------------------------
 *     PublishActivityResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 活動發布成功
 *         status:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               example: 1
 *             status:
 *               type: string
 *               example: published
 *
 */
