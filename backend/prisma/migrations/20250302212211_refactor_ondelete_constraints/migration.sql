/*
  Warnings:

  - A unique constraint covering the columns `[addressId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_clientId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_clientId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Organization_addressId_key" ON "Organization"("addressId");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
