/*
  Warnings:

  - Added the required column `competencyDate` to the `VehicleExpense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VehicleExpense" ADD COLUMN     "competencyDate" DATE NOT NULL;
