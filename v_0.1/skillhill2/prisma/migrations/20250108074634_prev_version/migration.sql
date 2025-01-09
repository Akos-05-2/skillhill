/*
  Warnings:

  - Added the required column `role_id` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Users` ADD COLUMN `role_id` INTEGER NOT NULL;
