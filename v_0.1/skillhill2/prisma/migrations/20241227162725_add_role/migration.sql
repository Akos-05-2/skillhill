/*
  Warnings:

  - You are about to drop the `Roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `Users` ADD COLUMN `role` ENUM('ADMIN', 'TEACHER', 'USER', 'GUEST') NOT NULL DEFAULT 'GUEST';

-- DropTable
DROP TABLE `Roles`;
