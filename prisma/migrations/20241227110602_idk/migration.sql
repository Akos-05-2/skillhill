/*
  Warnings:

  - You are about to drop the column `role_id` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `subscribed` on the `Users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Courses_user_id_fkey` ON `Courses`;

-- DropIndex
DROP INDEX `Enrollments_user_id_fkey` ON `Enrollments`;

-- DropIndex
DROP INDEX `Submissions_user_id_fkey` ON `Submissions`;

-- AlterTable
ALTER TABLE `Users` DROP COLUMN `role_id`,
    DROP COLUMN `subscribed`;
