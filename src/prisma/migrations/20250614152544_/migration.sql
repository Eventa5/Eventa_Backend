-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "paidExpiredAt" SET DEFAULT now() + interval '10 minutes';
