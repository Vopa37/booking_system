-- DropForeignKey
ALTER TABLE `UsersToEvents` DROP FOREIGN KEY `UsersToEvents_admission_id_fkey`;

-- AlterTable
ALTER TABLE `UsersToEvents` MODIFY `admission_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `UsersToEvents` ADD CONSTRAINT `UsersToEvents_admission_id_fkey` FOREIGN KEY (`admission_id`) REFERENCES `Admission`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
