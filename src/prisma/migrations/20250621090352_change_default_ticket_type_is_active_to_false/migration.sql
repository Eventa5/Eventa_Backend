-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "paidExpiredAt" SET DEFAULT now() + interval '10 minutes';

-- AlterTable
ALTER TABLE "ticket_types" ALTER COLUMN "isActive" SET DEFAULT false;
