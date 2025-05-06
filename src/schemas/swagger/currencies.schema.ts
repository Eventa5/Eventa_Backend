/**
 * @swagger
 * components:
 *   schemas:
 *     # 貨幣資料結構
 *     # -----------------------------------------------
 *     CurrencyResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         code:
 *           type: string
 *         name:
 *           type: string
 *     CreateCurrencyRequest:
 *       type: object
 *       required:
 *         - code
 *         - name
 *       properties:
 *         code:
 *           type: string
 *         name:
 *           type: string
 */
