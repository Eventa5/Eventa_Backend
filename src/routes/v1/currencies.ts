import express from "express";
import * as currencyController from "../../controllers/currencyController";

const router = express.Router();

/**
 * @swagger
 * /api/v1/currencies:
 *   get:
 *     summary: Get all currencies
 *     tags: [Currencies]
 *     responses:
 *       200:
 *         description: A list of currencies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                $ref: '#/components/schemas/CurrencyResponse'
 *
 *   post:
 *     summary: Create a new currency
 *     tags: [Currencies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            $ref: '#/components/schemas/CreateCurrencyRequest'
 *     responses:
 *       201:
 *         description: The created currency
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/CurrencyResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/").get(currencyController.getCurrencies).post(currencyController.createCurrency);

export default router;
