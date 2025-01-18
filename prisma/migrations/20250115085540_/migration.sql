/*
  Warnings:

  - The primary key for the `Enrollments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `enrollment_id` on the `Enrollments` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Enrollments` DROP PRIMARY KEY,
    MODIFY `enrollment_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`enrollment_id`);
