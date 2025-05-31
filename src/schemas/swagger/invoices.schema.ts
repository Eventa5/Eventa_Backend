/**
 * @swagger
 * components:
 *   schemas:
 *     # -----------------------------------------------
 *     # 發票結構
 *     # -----------------------------------------------
 *     InvoiceResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: 發票 ID
 *           example: 1
 *         invoiceName:
 *           type: string
 *           description: 發票名稱
 *           example: 三聯式發票  - 六角股份有限公司
 *         invoiceAddress:
 *           type: string
 *           description: 發票收件者地址
 *           nullable: true
 *           example: 台北市信義區松山路100號
 *         invoiceReceiverName:
 *           type: string
 *           description: 發票收件者名稱
 *           nullable: true
 *           example: 六角股份有限公司
 *         invoiceReceiverPhoneNumber:
 *           type: string
 *           description: 發票收件者電話號碼
 *           nullable: true
 *           example: 0212346789
 *         invoiceTaxId:
 *           type: string
 *           description: 統一編號
 *           nullable: true
 *           example: 12345678
 *         invoiceTitle:
 *           type: string
 *           description: 抬頭
 *           nullable: true
 *           example: 六角股份有限公司
 *         invoiceCarrier:
 *           type: string
 *           description: 發票載具
 *           nullable: true
 *           example: /A2123DD
 *         invoiceType:
 *           type: string
 *           description: 發票類型，b2b 為企業發票，b2c 為個人發票
 *           example: b2b | b2c
 *
 *     # -----------------------------------------------
 *     # 常用發票建立結構
 *     # -----------------------------------------------
 *     InvoiceRequest:
 *       type: object
 *       properties:
 *         invoiceName:
 *           type: string
 *           description: 常用發票發票名稱
 *           example: 三聯式發票 - 六角股份有限公司
 *         invoiceAddress:
 *           type: string
 *           description: 常用發票發票地址
 *           nullable: true
 *           example: 台北市信義區松山路100號
 *         invoiceReceiverName:
 *           type: string
 *           description: 常用發票收件者名稱
 *           nullable: true
 *           example: 六角股份有限公司
 *         invoiceReceiverPhoneNumber:
 *           type: string
 *           description: 常用發票收件者電話號碼
 *           nullable: true
 *           example: 0212346789
 *         invoiceTaxId:
 *           type: string
 *           description: 常用發票統一編號，長度需為 8 位數
 *           nullable: true
 *           example: 12345678
 *         invoiceTitle:
 *           type: string
 *           description: 常用發票抬頭
 *           nullable: true
 *           example: 六角股份有限公司
 *         invoiceCarrier:
 *           type: string
 *           description: 常用發票載具
 *           nullable: true
 *           example: /A2123DD
 *         invoiceType:
 *           type: string
 *           description: 常用發票類型，b2b 為企業發票，b2c 為個人發票
 *           example: b2b | b2c
 *       required:
 *         - invoiceName
 *         - invoiceType
 */
