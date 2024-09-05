/*
  Warnings:

  - You are about to alter the column `currency` on the `Admission` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `Admission` MODIFY `currency` ENUM('CZK', 'USD', 'EUR', 'PLN', 'GBP', 'JPY', 'AUD') NOT NULL;
