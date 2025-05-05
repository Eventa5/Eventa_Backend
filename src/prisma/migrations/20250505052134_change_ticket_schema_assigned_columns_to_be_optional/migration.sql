-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "paidExpiredAt" SET DEFAULT now() + interval '10 minutes';

-- AlterTable
ALTER TABLE "tickets" ALTER COLUMN "assignedEmail" DROP NOT NULL,
ALTER COLUMN "assignedName" DROP NOT NULL;
