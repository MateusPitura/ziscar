/*
  Warnings:

  - You are about to drop the column `value` on the `VehicleCharacteristicValue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AccountPayable" ADD COLUMN     "paidTo" VARCHAR(127);

-- AlterTable
ALTER TABLE "AccountReceivable" ADD COLUMN     "receivedFrom" VARCHAR(127);

-- AlterTable
ALTER TABLE "VehicleCharacteristicValue" DROP COLUMN "value";
