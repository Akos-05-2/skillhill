/*
  Warnings:

  - You are about to drop the column `role_id` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `Roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Roles` DROP FOREIGN KEY `Roles_user_id_fkey`;

-- AlterTable
ALTER TABLE `Users` DROP COLUMN `role_id`,
    ADD COLUMN `role` ENUM('ADMIN', 'TEACHER', 'USER', 'GUEST') NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE `Roles`;
