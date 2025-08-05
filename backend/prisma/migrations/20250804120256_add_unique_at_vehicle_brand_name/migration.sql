/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `VehicleBrand` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "VehicleBrand_name_key" ON "VehicleBrand"("name");
