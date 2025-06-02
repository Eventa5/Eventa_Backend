/**
 * @swagger
 * components:
 *   schemas:
 *     # 使用者資料結構
 *     # -----------------------------------------------
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "1"
 *         memberId:
 *           type: string
 *           example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         name:
 *           type: string
 *           nullable: true
 *           example: "張小明"
 *         avatar:
 *           type: string
 *           nullable: true
 *           example: "https://example.com/avatar.jpg"
 *         displayName:
 *           type: string
 *           nullable: true
 *           example: "小明"
 *         birthday:
 *           type: string
 *           nullable: true
 *           example: "1990/01/01"
 *         gender:
 *           type: string
 *           nullable: true
 *           example: "male"
 *         phoneNumber:
 *           type: string
 *           nullable: true
 *           example: "0912345678"
 *         countryCode:
 *           type: string
 *           nullable: true
 *           example: "+886"
 *         region:
 *           type: string
 *           nullable: true
 *           example: "台北市"
 *         address:
 *           type: string
 *           nullable: true
 *           example: "中正區重慶南路一段"
 *         identity:
 *           type: string
 *           nullable: true
 *           example: "一般用戶"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-01T00:00:00Z"
 *
 *     # 登入相關結構
 *     # -----------------------------------------------
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: 使用者電子郵件地址
 *         password:
 *           type: string
 *           format: password
 *           description: 使用者密碼
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 登入成功
 *         status:
 *           type: boolean
 *           example: true
 *         data:
 *           type: string
 *           description: JWT Token
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *     # 密碼重設相關結構
 *     # -----------------------------------------------
 *     ForgetRequestSchema:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: 用戶電子郵件地址
 *           example: "example@gmail.com"
 *
 *     ResetPasswordRequestSchema:
 *       type: object
 *       required:
 *         - newPassword
 *         - confirmNewPassword
 *         - resetToken
 *       properties:
 *         newPassword:
 *           type: string
 *           format: password
 *           description: 新的密碼
 *           example: "newPassword123"
 *         confirmNewPassword:
 *           type: string
 *           format: password
 *           description: 確認新密碼
 *           example: "newPassword123"
 *         resetToken:
 *           type: string
 *           description: 重設密碼令牌
 *           example: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
 *
 *     ResetPasswordResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 發送成功
 *         status:
 *           type: boolean
 *           example: true
 *
 *     # Google OAuth 登入相關結構
 *     # -----------------------------------------------
 *     GoogleOAuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 登入成功
 *         status:
 *           type: boolean
 *           example: true
 *         data:
 *           type: string
 *           description: JWT Token
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *     # 註冊相關結構
 *     # -----------------------------------------------
 *     SignupRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - checkPassword
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: 用戶電子郵件，將作為登入帳號
 *         password:
 *           type: string
 *           format: password
 *           description: 用戶密碼
 *         checkPassword:
 *           type: string
 *           format: password
 *           description: 確認密碼，必須與密碼一致
 *
 *     SignupResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 註冊成功
 *         status:
 *           type: boolean
 *           example: true
 *
 *     # 更新使用者資料相關結構
 *     # -----------------------------------------------
 *     UpdateProfileRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: 用戶真實姓名
 *         email:
 *           type: string
 *           format: email
 *           description: 用戶電子郵件
 *         avatar:
 *           type: string
 *           description: 用戶頭像 URL
 *         displayName:
 *           type: string
 *           description: 用戶顯示名稱
 *         birthday:
 *           type: string
 *           description: "用戶生日 (格式: YYYY/MM/DD)"
 *         gender:
 *           type: string
 *           description: 性別
 *         phoneNumber:
 *           type: string
 *           description: 電話號碼
 *         countryCode:
 *           type: string
 *           description: 國家代碼
 *         region:
 *           type: string
 *           description: 地區
 *         address:
 *           type: string
 *           description: 地址
 *         identity:
 *           type: string
 *           description: 身分識別
 *
 *     UpdateProfileResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 更新成功
 *         status:
 *           type: boolean
 *           example: true
 *
 *   # 更新使用者大頭貼結構
 *     # -----------------------------------------------
 *     UploadAvatarRequest:
 *       type: object
 *       properties:
 *         avatar:
 *           type: string
 *           format: binary
 *           description: 使用者上傳的圖片檔案，僅接受 image/*
 *
 *     UploadAvatarResponse:
 *      type: object
 *      properties:
 *        status:
 *          type: boolean
 *        message:
 *          type: string
 *        data:
 *          type: string
 *          example: http://example.com/avatar.jpg
 */
