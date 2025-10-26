/*
  Warnings:

  - Made the column `enterpriseId` on table `AccountPayable` required. This step will fail if there are existing NULL values in that column.
  - Made the column `enterpriseId` on table `AccountReceivable` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "VehicleCategory" ADD VALUE 'PICKUP';

-- AlterTable
ALTER TABLE "AccountPayable" ALTER COLUMN "enterpriseId" SET NOT NULL;

-- AlterTable
ALTER TABLE "AccountReceivable" ALTER COLUMN "enterpriseId" SET NOT NULL;
