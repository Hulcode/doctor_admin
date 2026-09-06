/*
  Warnings:

  - You are about to drop the column `patientId` on the `PushSubscription` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PushSubscription" DROP CONSTRAINT "PushSubscription_patientId_fkey";

-- AlterTable
ALTER TABLE "PushSubscription" DROP COLUMN "patientId";
