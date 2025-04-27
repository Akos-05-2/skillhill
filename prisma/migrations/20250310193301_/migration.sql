/*
  Warnings:

  - You are about to drop the column `due_date` on the `Assignments` table. All the data in the column will be lost.
  - You are about to alter the column `course_id` on the `Assignments` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the column `course_id` on the `Course_materials` table. All the data in the column will be lost.
  - You are about to drop the column `document_id` on the `Course_materials` table. All the data in the column will be lost.
  - You are about to drop the column `document_id` on the `Courses` table. All the data in the column will be lost.
  - The primary key for the `Enrollments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `Enrollments` table. All the data in the column will be lost.
  - You are about to alter the column `enrollment_id` on the `Enrollments` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the column `document_id` on the `Submissions` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `Document_files` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Documents` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[course_id,email]` on the table `Enrollments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `Course_materials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Enrollments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Enrollments` DROP FOREIGN KEY `Enrollments_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Users` DROP FOREIGN KEY `Users_role_id_fkey`;

-- DropIndex
DROP INDEX `Enrollments_user_id_fkey` ON `Enrollments`;

-- DropIndex
DROP INDEX `Users_role_id_fkey` ON `Users`;

-- AlterTable
ALTER TABLE `Assignments` DROP COLUMN `due_date`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    MODIFY `course_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Course_materials` DROP COLUMN `course_id`,
    DROP COLUMN `document_id`,
    ADD COLUMN `courseId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Courses` DROP COLUMN `document_id`;

-- AlterTable
ALTER TABLE `Enrollments` DROP PRIMARY KEY,
    DROP COLUMN `user_id`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    MODIFY `enrollment_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`enrollment_id`);

-- AlterTable
ALTER TABLE `Submissions` DROP COLUMN `document_id`;

-- AlterTable
ALTER TABLE `Users` DROP COLUMN `role_id`,
    ADD COLUMN `roleId` INTEGER NOT NULL DEFAULT 2,
    ADD COLUMN `subsribed` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `Document_files`;

-- DropTable
DROP TABLE `Documents`;

-- CreateTable
CREATE TABLE `Files` (
    `file_id` VARCHAR(191) NOT NULL,
    `file_name` VARCHAR(191) NOT NULL,
    `mimetype` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `submissionId` VARCHAR(191) NOT NULL,
    `assignmentId` VARCHAR(191) NOT NULL,
    `coursematerialId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`file_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Enrollments_course_id_email_key` ON `Enrollments`(`course_id`, `email`);

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Course_materials` ADD CONSTRAINT `Course_materials_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Courses`(`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignments` ADD CONSTRAINT `Assignments_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `Courses`(`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollments` ADD CONSTRAINT `Enrollments_email_fkey` FOREIGN KEY (`email`) REFERENCES `Users`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Files` ADD CONSTRAINT `Files_submissionId_fkey` FOREIGN KEY (`submissionId`) REFERENCES `Submissions`(`submission_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Files` ADD CONSTRAINT `Files_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `Assignments`(`assingment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Files` ADD CONSTRAINT `Files_coursematerialId_fkey` FOREIGN KEY (`coursematerialId`) REFERENCES `Course_materials`(`material_id`) ON DELETE CASCADE ON UPDATE CASCADE;
