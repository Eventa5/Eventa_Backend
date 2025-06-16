import express from "express";
import * as categoryController from "../../controllers/categoryController";
import { auth } from "../../middlewares/auth";
import { upload } from "../../middlewares/multer";
const router = express.Router();

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: 獲取活動類別資料
 *     description: 獲取活動類別資料
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 請求成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CategoriesResponse'
 *       500:
 *         description: 系統錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", categoryController.getCategories); // 取得所有類別

/**
 * @swagger
 * /api/v1/categories/{categoryId}/image:
 *   post:
 *     tags:
 *       - Categories
 *     summary: 編輯主題圖片
 *     description: 照片大小限制4MB內
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         description: 主題 ID
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: 使用者上傳的圖片檔案，僅接受 image/*
 *     responses:
 *       200:
 *         description: 上傳成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadCoverResponse'
 *       400:
 *         description: 錯誤的請求，例如沒有圖片、圖片上傳失敗等
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 主題不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/:categoryId/image",
  auth,
  upload.single("image"),
  categoryController.uploadCategoryImage,
);

export default router;
