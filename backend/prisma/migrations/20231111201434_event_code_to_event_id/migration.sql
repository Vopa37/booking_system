/*
  Warnings:

  - You are about to drop the column `event_code` on the `Admission` table. All the data in the column will be lost.
  - The primary key for the `CategoriesToEvents` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `event_code` on the `CategoriesToEvents` table. All the data in the column will be lost.
  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `event_code` on the `Event` table. All the data in the column will be lost.
  - The primary key for the `UsersToEvents` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `event_code` on the `UsersToEvents` table. All the data in the column will be lost.
  - Added the required column `event_id` to the `Admission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_id` to the `CategoriesToEvents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_id` to the `UsersToEvents` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Admission` DROP FOREIGN KEY `Admission_event_code_fkey`;

-- DropForeignKey
ALTER TABLE `CategoriesToEvents` DROP FOREIGN KEY `CategoriesToEvents_event_code_fkey`;

-- DropForeignKey
ALTER TABLE `UsersToEvents` DROP FOREIGN KEY `UsersToEvents_event_code_fkey`;

-- AlterTable
ALTER TABLE `Admission` DROP COLUMN `event_code`,
    ADD COLUMN `event_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `CategoriesToEvents` DROP PRIMARY KEY,
    DROP COLUMN `event_code`,
    ADD COLUMN `event_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`event_id`, `category_id`);

-- AlterTable
ALTER TABLE `Event` DROP PRIMARY KEY,
    DROP COLUMN `event_code`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `UsersToEvents` DROP PRIMARY KEY,
    DROP COLUMN `event_code`,
    ADD COLUMN `event_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`event_id`, `user_id`);

-- AddForeignKey
ALTER TABLE `CategoriesToEvents` ADD CONSTRAINT `CategoriesToEvents_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsersToEvents` ADD CONSTRAINT `UsersToEvents_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admission` ADD CONSTRAINT `Admission_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
