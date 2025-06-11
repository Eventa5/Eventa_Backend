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
 *           type: number
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
 *         status:
 *           type: string
 *           example: draft | published | ended | canceled
 *     # 單一活動資料結構
 *     # -----------------------------------------------
 *     ActivityResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: number
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
 *           type: array
 *           items:
 *             type: string
 *           example: ["文青最愛", "聽團仔"]
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
 *         currentStep:
 *           type: string
 *           description: 活動設置目前的狀態
 *           example: activityType | categories | basic | content
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
 *             isFavorite:
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
 *     PatchActivityTypeResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 活動形式編輯成功
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
 *           example: 2026-05-01T10:00
 *         endTime:
 *           type: string
 *           format: date
 *           example: 2026-05-15T10:00
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["文青最愛", "聽團仔"]
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
 *     PatchActivityStatusResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 活動發布成功 | 活動取消成功
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
 *               example: published | canceled
 *     # 編輯活動資料結構
 *     # -----------------------------------------------
 *     EditActivityRequest:
 *       type: object
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
 *           example: 2026-05-01T10:00
 *         endTime:
 *           type: string
 *           format: date
 *           example: 2026-05-15T10:00
 *         isOnline:
 *           type: boolean
 *           example: true
 *         livestreamUrl:
 *           type: string
 *           example: https://activity.com/livestream
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["文青最愛", "聽團仔"]
 *         summary:
 *           type: string
 *           example: 活動通集結論壇、展覽、講座、免費體驗及各式有趣活動資訊；無論您想要找活動或者辦活動，方便的線上售票及活動報名功能都是您事半功倍的好幫手！
 *         descriptionMd:
 *           type: string
 *           example: "#活動描述\n\n這是一個很棒的活動，你可以參加！"
 *         notes:
 *           type: string
 *           example: 活動完全免費
 *         categoryIds:
 *           type: array
 *           items:
 *             type: number
 *           example: [1, 2]
 *     # 收藏活動回應資料結構
 *     # -----------------------------------------------
 *     favoriteActivityResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 活動已加入收藏 | 活動已取消收藏
 *         status:
 *           type: boolean
 *           example: true
 *     # 參加者名單回應
 *     # -----------------------------------------------
 *     getParticipantResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: T25052814531482592
 *         orderId:
 *           type: string
 *           example: O25052814531487937
 *         status:
 *           type: string
 *           example: paid
 *         assignedName:
 *           type: string
 *           example: 小明
 *         assignedEmail:
 *           type: string
 *           example: 7lMlA@example.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-05-01T10:00:00Z
 *         ticketType:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               example: 1
 *             name:
 *               type: string
 *               example: 普通票
 *             price:
 *               type: number
 *               example: 100
 *     UploadCoverRequest:
 *       type: object
 *       properties:
 *         cover:
 *           type: string
 *           format: binary
 *           description: 使用者上傳的圖片檔案，僅接受 image/*
 *
 *     UploadCoverResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: string
 *           example: http://example.com/cover.jpg
 *     # 活動收入資料結構
 *     # -----------------------------------------------
 *     getIncomeResponse:
 *       type: object
 *       properties:
 *         ticketTypes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: 普通票
 *               price:
 *                 type: number
 *                 example: 100
 *               totalQuantity:
 *                 type: number
 *                 example: 50
 *               remainingQuantity:
 *                 type: number
 *                 example: 50
 *               subtotalIncome:
 *                 type: number
 *                 example: 500
 *               soldCount:
 *                 type: number
 *                 example: 10
 *         totalRemainingQuantity:
 *           type: number
 *           example: 40
 *         totalIncome:
 *           type: number
 *           example: 500
 *         totalRegisteredQuantity:
 *           type: number
 *           example: 10
 *         incomes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 example: 2025-05-01
 *                 format: date
 *               amount:
 *                 type: number
 *                 example: 500
 *     # 活動詳細報到資料結構
 *     # -----------------------------------------------
 *     getCheckedInResponse:
 *       type: object
 *       properties:
 *         isOnline:
 *           type: boolean
 *           description: 是否為線上活動
 *           example: true
 *         status:
 *           type: string
 *           description: 活動當前狀態
 *           example: published
 *         startTime:
 *           type: string
 *           description: 活動開始時間
 *           example: 2025-05-01T10:00:00Z
 *           format: date
 *         endTime:
 *           type: string
 *           description: 活動結束時間
 *           example: 2025-05-01T18:00:00Z
 *           format: date
 *         checkedInCount:
 *           type: number
 *           description: 已報到人數
 *           example: 5
 *         soldCount:
 *           type: number
 *           description: 已售票張數
 *           example: 10
 *         totalTicketQuantity:
 *           type: number
 *           description: 總票數
 *           example: 15
 */
