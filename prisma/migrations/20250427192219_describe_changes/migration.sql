-- AlterTable
ALTER TABLE `event` ADD COLUMN `imageUrl` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('pending', 'approved') NOT NULL DEFAULT 'pending';
