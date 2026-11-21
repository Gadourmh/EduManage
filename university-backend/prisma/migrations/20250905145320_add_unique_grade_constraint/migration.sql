/*
  Warnings:

  - A unique constraint covering the columns `[studentId,examId]` on the table `Grade` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `department` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `Grade_studentId_examId_key` ON `Grade`(`studentId`, `examId`);
