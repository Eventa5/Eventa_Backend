-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('paid', 'pending', 'expired', 'canceled');

-- CreateEnum
CREATE TYPE "InvoiceType" AS ENUM ('b2c', 'b2b');

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "paidExpiredAt" TIMESTAMP(3) NOT NULL DEFAULT now() + interval '10 minutes',
    "paidAt" TIMESTAMP(3),
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "activityId" INTEGER NOT NULL,
    "invoiceAddress" TEXT,
    "invoiceTitle" TEXT,
    "invoiceTaxId" TEXT,
    "invoiceReceiverName" TEXT,
    "invoiceReceiverPhoneNumber" TEXT,
    "invoiceReceiverEmail" TEXT,
    "invoiceCarrier" TEXT,
    "invoiceType" "InvoiceType" NOT NULL DEFAULT 'b2c',

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
