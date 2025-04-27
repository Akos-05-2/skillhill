-- AlterTable
ALTER TABLE `course_materials` ADD COLUMN `moduleId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `course_materials` ADD CONSTRAINT `course_materials_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `course_modules`(`module_id`) ON DELETE SET NULL ON UPDATE CASCADE;
