/*
  Warnings:

  - The primary key for the `Roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role_id` on the `Roles` table. All the data in the column will be lost.
  - You are about to alter the column `image` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `_RolesToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id` to the `Roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_RolesToUser` DROP FOREIGN KEY `_RolesToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_RolesToUser` DROP FOREIGN KEY `_RolesToUser_B_fkey`;

-- AlterTable
ALTER TABLE `Roles` DROP PRIMARY KEY,
    DROP COLUMN `role_id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Users` ADD COLUMN `role_id` INTEGER NOT NULL,
    MODIFY `image` INTEGER NULL;

-- DropTable
DROP TABLE `_RolesToUser`;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
