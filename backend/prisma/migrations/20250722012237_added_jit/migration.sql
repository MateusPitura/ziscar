/*
  Warnings:

  - Made the column `chassiNumber` on table `VehicleBase` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "jit" TEXT;

-- AlterTable
ALTER TABLE "VehicleBase" ALTER COLUMN "chassiNumber" SET NOT NULL;
