import express from "express";
import {
  createOrganization,
  deleteOrganization,
  getOrganizationById,
  getUserOrganizations,
  updateOrganization,
} from "../../controllers/organizationsController";
import { auth } from "../../middlewares/auth";

const router = express.Router();

/**
 * @swagger
 * /api/v1/organizations:
 *   get:
 *     tags:
 *       - Organizations
 *     summary: 取得主辦單位列表
 *     description: 取得當前使用者的主辦單位列表
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 取得成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 成功
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrganizationResponse'
 *       500:
 *         description: 取得失敗
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", auth, getUserOrganizations);

/**
 * @swagger
 * /api/v1/organizations/{organizationId}:
 *   get:
 *     tags:
 *       - Organizations
 *     summary: 取得主辦單位詳細資料
 *     description: 取得主辦單位詳細資料
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 主辦單位ID
 *     responses:
 *       200:
 *         description: 取得成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 取得主辦單位成功
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/OrganizationResponse'
 *       400:
 *         description: 請求錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 找不到主辦單位
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:organizationId", auth, getOrganizationById);

/**
 * @swagger
 * /api/v1/organizations:
 *   post:
 *     tags:
 *       - Organizations
 *     summary: 創建主辦單位
 *     description: 創建新的主辦單位
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrganizationRequest'
 *     responses:
 *       200:
 *         description: 創建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateOrganizationResponse'
 *       400:
 *         description: 請求錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", auth, createOrganization);

/**
 * @swagger
 * /api/v1/organizations:
 *   put:
 *     tags:
 *       - Organizations
 *     summary: 更新主辦單位
 *     description: 更新主辦單位資料
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrganizationRequest'
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateOrganizationResponse'
 *       400:
 *         description: 請求錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 找不到主辦單位
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/", auth, updateOrganization);

/**
 * @swagger
 * /api/v1/organizations:
 *   delete:
 *     tags:
 *       - Organizations
 *     summary: 刪除主辦單位
 *     description: 刪除主辦單位
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteOrganizationRequest'
 *     responses:
 *       200:
 *         description: 刪除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteOrganizationResponse'
 *       400:
 *         description: 請求錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: 找不到主辦單位
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/", auth, deleteOrganization);

export default router;
