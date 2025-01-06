/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `FocusSession` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FocusSession_userId_key" ON "FocusSession"("userId");
