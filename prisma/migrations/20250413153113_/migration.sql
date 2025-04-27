/*
  Warnings:

  - You are about to drop the `module_resources` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `module_resources` DROP FOREIGN KEY `module_resources_file_id_fkey`;

-- DropForeignKey
ALTER TABLE `module_resources` DROP FOREIGN KEY `module_resources_module_id_fkey`;

-- DropTable
DROP TABLE `module_resources`;

-- CreateTable
CREATE TABLE `ModuleResource` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `moduleId` INTEGER NOT NULL,
    `resourceId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ModuleResource_moduleId_resourceId_key`(`moduleId`, `resourceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resource` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ModuleResource` ADD CONSTRAINT `ModuleResource_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `course_modules`(`module_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ModuleResource` ADD CONSTRAINT `ModuleResource_resourceId_fkey` FOREIGN KEY (`resourceId`) REFERENCES `Resource`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
