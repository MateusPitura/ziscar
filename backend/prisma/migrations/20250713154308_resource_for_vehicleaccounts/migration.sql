/*
  Warnings:

  - The values [VEHICLE_SALE] on the enum `Resources` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Resources_new" AS ENUM ('USERS', 'VEHICLES', 'STORES', 'VEHICLE_ACCOUNTS', 'ACCOUNTS_PAYABLE', 'ACCOUNTS_RECEIVABLE', 'CUSTOMERS');
ALTER TABLE "Permission" ALTER COLUMN "resource" TYPE "Resources_new" USING ("resource"::text::"Resources_new");
ALTER TYPE "Resources" RENAME TO "Resources_old";
ALTER TYPE "Resources_new" RENAME TO "Resources";
DROP TYPE "Resources_old";
COMMIT;
