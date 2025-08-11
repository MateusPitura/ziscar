/*
  Warnings:

  - Added the required column `enterpriseId` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Made the column `cpf` on table `Customer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "enterpriseId" INTEGER NOT NULL,
ALTER COLUMN "cpf" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
