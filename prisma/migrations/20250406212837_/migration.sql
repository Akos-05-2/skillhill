-- CreateTable
CREATE TABLE `module_resources` (
    `resource_id` INTEGER NOT NULL AUTO_INCREMENT,
    `module_id` INTEGER NOT NULL,
    `file_id` INTEGER NOT NULL,

    PRIMARY KEY (`resource_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `module_resources` ADD CONSTRAINT `module_resources_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `course_modules`(`module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `module_resources` ADD CONSTRAINT `module_resources_file_id_fkey` FOREIGN KEY (`file_id`) REFERENCES `files`(`file_id`) ON DELETE CASCADE ON UPDATE CASCADE;
