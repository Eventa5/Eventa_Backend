/**
 * @swagger
 * components:
 *   schemas:
 *     # 主辦單位資料結構
 *     # -----------------------------------------------
 *     OrganizationResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "未來創新科技股份有限公司"
 *         avatar:
 *           type: string
 *           example: "https://cdn.example.com/org/1.png"
 *         cover:
 *           type: string
 *           example: "https://cdn.example.com/org/1-cover.jpg"
 *         introduction:
 *           type: string
 *           example: "我們致力於打造未來科技的活動與展會。"
 *         phoneNumber:
 *           type: string
 *           example: "0223456789"
 *         countryCode:
 *           type: string
 *           example: "TW"
 *         ext:
 *           type: string
 *           example: "1234"
 *         officialSiteUrl:
 *           type: string
 *           example: "https://organization.com"
 *         email:
 *           type: string
 *           example: "example@gmail.com"
 *         currency:
 *           type: string
 *           example: "TWD"
 *
 *     # 創建主辦單位請求
 *     # -----------------------------------------------
 *     CreateOrganizationRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           description: 主辦單位名稱
 *         introduction:
 *           type: string
 *           description: 主辦單位介紹
 *         avatar:
 *           type: string
 *           description: 主辦單位頭像連結
 *         cover:
 *           type: string
 *           description: 主辦單位封面圖連結
 *         phoneNumber:
 *           type: string
 *           description: 電話號碼
 *         countryCode:
 *           type: string
 *           description: 國家代碼
 *         ext:
 *           type: string
 *           description: 分機號碼
 *         email:
 *           type: string
 *           description: 主辦單位電子郵件
 *         officialSiteUrl:
 *           type: string
 *           description: 官方網站網址
 *
 *     CreateOrganizationResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 主辦單位建立成功
 *         status:
 *           type: boolean
 *           example: true
 *         data:
 *           type: integer
 *           description: 創建的主辦單位ID
 *           example: 1
 *
 *     # 更新主辦單位請求
 *     # -----------------------------------------------
 *     UpdateOrganizationRequest:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: 主辦單位ID
 *           example: 1
 *         name:
 *           type: string
 *           description: 主辦單位名稱
 *         introduction:
 *           type: string
 *           description: 主辦單位介紹
 *         avatar:
 *           type: string
 *           description: 主辦單位頭像連結
 *         cover:
 *           type: string
 *           description: 主辦單位封面圖連結
 *         phoneNumber:
 *           type: string
 *           description: 電話號碼
 *         countryCode:
 *           type: string
 *           description: 國家代碼
 *         ext:
 *           type: string
 *           description: 分機號碼
 *         email:
 *           type: string
 *           description: 主辦單位電子郵件
 *         officialSiteUrl:
 *           type: string
 *           description: 官方網站網址
 *
 *     UpdateOrganizationResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 更新主辦單位成功
 *         status:
 *           type: boolean
 *           example: true
 *
 *     # 刪除主辦單位請求
 *     # -----------------------------------------------
 *     DeleteOrganizationRequest:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: 主辦單位ID
 *           example: 1
 *
 *     DeleteOrganizationResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 主辦單位刪除成功
 *         status:
 *           type: boolean
 *           example: true
 *     # 編輯主辦單位圖片
 *     # -----------------------------------------------
 *     UploadOrganizationImageRequest:
 *       type: object
 *       properties:
 *         avatar:
 *           type: string
 *           format: binary
 *           description: 主辦單位主圖，僅接受 image/*
 *         cover:
 *           type: string
 *           format: binary
 *           description: 主辦單位封面照片，僅接受 image/*
 *     UploadOrganizationImageResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             avatar:
 *               type: string
 *               example: http://example.com/avatar.jpg
 *             cover:
 *               type: string
 *               example: http://example.com/cover.jpg

*/
