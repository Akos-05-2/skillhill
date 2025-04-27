/*
  Warnings:

  - The primary key for the `Courses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `Courses` table. All the data in the column will be lost.
  - You are about to alter the column `course_id` on the `Courses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `document_id` on the `Courses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the column `enrolmment_date` on the `Enrollments` table. All the data in the column will be lost.
  - You are about to alter the column `course_id` on the `Enrollments` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `Courses` DROP FOREIGN KEY `Courses_user_id_fkey`;

-- DropIndex
DROP INDEX `Courses_user_id_fkey` ON `Courses`;

-- AlterTable
ALTER TABLE `Courses` DROP PRIMARY KEY,
    DROP COLUMN `user_id`,
    MODIFY `course_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `document_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`course_id`);

-- AlterTable
ALTER TABLE `Enrollments` DROP COLUMN `enrolmment_date`,
    ADD COLUMN `enrolment_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `course_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Enrollments` ADD CONSTRAINT `Enrollments_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `Courses`(`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;
