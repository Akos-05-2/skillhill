/*
  Warnings:

  - Added the required column `role_id` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Courses` DROP FOREIGN KEY `Courses_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Enrollments` DROP FOREIGN KEY `Enrollments_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Submissions` DROP FOREIGN KEY `Submissions_user_id_fkey`;

-- AlterTable
ALTER TABLE `Users` ADD COLUMN `role_id` INTEGER NOT NULL;
