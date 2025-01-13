/*
  Warnings:

  - You are about to drop the `Courses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Enrollments` DROP FOREIGN KEY `Enrollments_course_id_fkey`;

-- DropIndex
DROP INDEX `Enrollments_course_id_fkey` ON `Enrollments`;

-- DropTable
DROP TABLE `Courses`;
