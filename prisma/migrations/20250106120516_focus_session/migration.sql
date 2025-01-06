/*
  Warnings:

  - You are about to drop the column `elapsedTime` on the `FocusSession` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `FocusSession` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `FocusSession` table. All the data in the column will be lost.
  - You are about to drop the `FocusMetric` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FocusMetric" DROP CONSTRAINT "FocusMetric_userId_fkey";

-- AlterTable
ALTER TABLE "FocusSession" DROP COLUMN "elapsedTime",
DROP COLUMN "endTime",
DROP COLUMN "startTime";

-- DropTable
DROP TABLE "FocusMetric";
