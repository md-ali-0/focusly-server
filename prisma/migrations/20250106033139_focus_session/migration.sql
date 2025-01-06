/*
  Warnings:

  - Added the required column `criteria` to the `Badge` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Badge" ADD COLUMN     "criteria" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FocusSession" ADD COLUMN     "elapsedTime" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "endTime" DROP NOT NULL,
ALTER COLUMN "duration" DROP NOT NULL;
