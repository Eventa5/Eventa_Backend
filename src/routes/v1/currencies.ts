import express from "express";
import * as currencyController from "../../controllers/currencyController";

const router = express.Router();

/**
 * @swagger
 * /api/v1/currencies:
 *   get:
 *     summary: 取得所有幣別清單
 *     tags:
 *       - Currencies
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
 *                     $ref: '#/components/schemas/CurrencyResponse'
 *       400:
 *         description: 格式錯誤
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: 新增幣別
 *     tags:
 *       - Currencies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            $ref: '#/components/schemas/CreateCurrencyRequest'
 *     responses:
 *       201:
 *         description: 建立成功
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
 *                   $ref: '#/components/schemas/CurrencyResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/").get(currencyController.getCurrencies).post(currencyController.createCurrency);

export default router;
