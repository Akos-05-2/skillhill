/*
  Warnings:

  - Added the required column `email` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `courses` DROP FOREIGN KEY `courses_category_id_fkey`;

-- DropIndex
DROP INDEX `courses_category_id_fkey` ON `courses`;

-- AlterTable
ALTER TABLE `courses` ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_email_fkey` FOREIGN KEY (`email`) REFERENCES `Users`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;
