/*
  Warnings:

  - You are about to drop the column `subsribed` on the `Users` table. All the data in the column will be lost.
  - Made the column `email` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Users` DROP COLUMN `subsribed`,
    MODIFY `email` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `courses` ADD COLUMN `image` VARCHAR(191) NULL;
