/*
  Warnings:

  - You are about to drop the `Accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Assignments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Course_materials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Courses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Enrollments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Files` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Submissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationTokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Accounts` DROP FOREIGN KEY `Accounts_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Assignments` DROP FOREIGN KEY `Assignments_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `Course_materials` DROP FOREIGN KEY `Course_materials_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `Enrollments` DROP FOREIGN KEY `Enrollments_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `Enrollments` DROP FOREIGN KEY `Enrollments_email_fkey`;

-- DropForeignKey
ALTER TABLE `Files` DROP FOREIGN KEY `Files_assignmentId_fkey`;

-- DropForeignKey
ALTER TABLE `Files` DROP FOREIGN KEY `Files_coursematerialId_fkey`;

-- DropForeignKey
ALTER TABLE `Files` DROP FOREIGN KEY `Files_submissionId_fkey`;

-- DropForeignKey
ALTER TABLE `Sessions` DROP FOREIGN KEY `Sessions_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Submissions` DROP FOREIGN KEY `Submissions_user_id_fkey`;

-- DropTable
DROP TABLE `Accounts`;

-- DropTable
DROP TABLE `Assignments`;

-- DropTable
DROP TABLE `Course_materials`;

-- DropTable
DROP TABLE `Courses`;

-- DropTable
DROP TABLE `Enrollments`;

-- DropTable
DROP TABLE `Files`;

-- DropTable
DROP TABLE `Sessions`;

-- DropTable
DROP TABLE `Submissions`;

-- DropTable
DROP TABLE `VerificationTokens`;

-- CreateTable
CREATE TABLE `courses` (
    `course_id` INTEGER NOT NULL AUTO_INCREMENT,
    `course_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `category_id` INTEGER NOT NULL,

    PRIMARY KEY (`course_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `category_id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course_materials` (
    `material_id` INTEGER NOT NULL AUTO_INCREMENT,
    `courseId` INTEGER NOT NULL,

    PRIMARY KEY (`material_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `files` (
    `file_id` INTEGER NOT NULL AUTO_INCREMENT,
    `file_name` VARCHAR(191) NOT NULL,
    `coursematerialId` INTEGER NULL,
    `submissionId` VARCHAR(191) NULL,
    `assignmentId` VARCHAR(191) NULL,

    PRIMARY KEY (`file_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enrollment` (
    `enrollment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `enrolment_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `course_id` INTEGER NOT NULL,

    PRIMARY KEY (`enrollment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assignments` (
    `assignment_id` VARCHAR(191) NOT NULL,
    `course_id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`assignment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `submissions` (
    `submission_id` VARCHAR(191) NOT NULL,
    `course_id` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `submission_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`submission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_materials` ADD CONSTRAINT `course_materials_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses`(`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_coursematerialId_fkey` FOREIGN KEY (`coursematerialId`) REFERENCES `course_materials`(`material_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_submissionId_fkey` FOREIGN KEY (`submissionId`) REFERENCES `submissions`(`submission_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `assignments`(`assignment_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enrollment` ADD CONSTRAINT `enrollment_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enrollment` ADD CONSTRAINT `enrollment_email_fkey` FOREIGN KEY (`email`) REFERENCES `Users`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignments` ADD CONSTRAINT `assignments_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `submissions` ADD CONSTRAINT `submissions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `submissions` ADD CONSTRAINT `submissions_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
