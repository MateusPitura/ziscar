/*
  Warnings:

  - You are about to drop the column `vehicleBaseId` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the `VehicleBase` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[chassiNumber]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `brandId` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chassiNumber` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerSnapshot` to the `VehicleSale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleSnapshot` to the `VehicleSale` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_vehicleBaseId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleBase" DROP CONSTRAINT "VehicleBase_brandId_fkey";

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "vehicleBaseId",
ADD COLUMN     "brandId" INTEGER NOT NULL,
ADD COLUMN     "category" "VehicleCategory",
ADD COLUMN     "chassiNumber" VARCHAR(17) NOT NULL,
ADD COLUMN     "modelName" VARCHAR(127),
ADD COLUMN     "modelYear" INTEGER,
ADD COLUMN     "yearOfManufacture" INTEGER;

-- AlterTable
ALTER TABLE "VehicleSale" ADD COLUMN     "customerSnapshot" JSONB NOT NULL,
ADD COLUMN     "vehicleSnapshot" JSONB NOT NULL;

-- DropTable
DROP TABLE "VehicleBase";

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_chassiNumber_key" ON "Vehicle"("chassiNumber");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "VehicleBrand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
