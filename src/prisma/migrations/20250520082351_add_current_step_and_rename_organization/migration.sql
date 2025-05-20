/*
  Warnings:

  - You are about to drop the column `organizerId` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the `organizers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `organizationId` to the `activities` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActivityStep" AS ENUM ('activityType', 'categories', 'basic', 'content', 'ticketTypes');

-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_organizerId_fkey";

-- DropForeignKey
ALTER TABLE "organizers" DROP CONSTRAINT "organizers_currencyId_fkey";

-- DropForeignKey
ALTER TABLE "organizers" DROP CONSTRAINT "organizers_localeId_fkey";

-- DropForeignKey
ALTER TABLE "organizers" DROP CONSTRAINT "organizers_userId_fkey";

-- AlterTable
ALTER TABLE "activities" DROP COLUMN "organizerId",
ADD COLUMN     "currentStep" "ActivityStep" NOT NULL DEFAULT 'activityType',
ADD COLUMN     "organizationId" INTEGER NOT NULL,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "startTime" DROP NOT NULL,
ALTER COLUMN "endTime" DROP NOT NULL;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "paidExpiredAt" SET DEFAULT now() + interval '10 minutes';

-- DropTable
DROP TABLE "organizers";

-- CreateTable
CREATE TABLE "organizations" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "cover" TEXT,
    "introduction" TEXT,
    "phoneNumber" TEXT,
    "countryCode" TEXT,
    "ext" TEXT,
    "officialSiteUrl" TEXT,
    "localeId" INTEGER,
    "currencyId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_email_key" ON "organizations"("email");

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_localeId_fkey" FOREIGN KEY ("localeId") REFERENCES "locales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
