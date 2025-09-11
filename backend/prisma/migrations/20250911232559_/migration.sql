-- DropForeignKey
ALTER TABLE "VehicleSale" DROP CONSTRAINT "VehicleSale_accountPayableId_fkey";

-- AlterTable
ALTER TABLE "VehicleSale" ALTER COLUMN "accountPayableId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "VehicleSale" ADD CONSTRAINT "VehicleSale_accountPayableId_fkey" FOREIGN KEY ("accountPayableId") REFERENCES "AccountPayable"("id") ON DELETE SET NULL ON UPDATE CASCADE;
