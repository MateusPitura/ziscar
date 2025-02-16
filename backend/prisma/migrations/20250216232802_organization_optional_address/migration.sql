-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_addressId_fkey";

-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "addressId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
