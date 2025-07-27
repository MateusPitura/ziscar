-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('ADMIN', 'SELLER');

-- CreateEnum
CREATE TYPE "Resources" AS ENUM ('USERS', 'VEHICLES', 'STORES', 'VEHICLE_PURCHASE', 'VEHICLE_EXPENSE', 'VEHICLE_SALE', 'ACCOUNTS_PAYABLE', 'ACCOUNTS_RECEIVABLE', 'CUSTOMERS');

-- CreateEnum
CREATE TYPE "Actions" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "VehicleCategory" AS ENUM ('CAR', 'MOTORCYCLE', 'TRUCK', 'VAN', 'BUS');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('GASOLINE', 'ETHANOL', 'FLEX', 'ELECTRIC', 'GNV', 'HYBRID');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('PURCHASED', 'IN_STOCK', 'MAINTENANCE', 'SOLD', 'DELIVERED');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('IPVA', 'MAINTENANCE', 'FUEL', 'FINE', 'LICENSING', 'INSURANCE', 'AGENCY_FEES', 'LOGISTICS', 'OTHER');

-- CreateEnum
CREATE TYPE "InstallmentStatus" AS ENUM ('PAID', 'PENDING');

-- CreateEnum
CREATE TYPE "PaymentMethodReceivableType" AS ENUM ('TRANSFER', 'PIX', 'BANK_SLIP', 'CREDIT_CARD', 'DEBIT_CARD', 'TED', 'DOC', 'CASH');

-- CreateEnum
CREATE TYPE "PaymentMethodPayableType" AS ENUM ('PIX', 'BANK_SLIP', 'CREDIT_CARD', 'DEBIT_CARD', 'TED', 'DOC', 'CASH');

-- CreateEnum
CREATE TYPE "BrazilianState" AS ENUM ('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO');

-- CreateTable
CREATE TABLE "Store" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(127) NOT NULL,
    "email" VARCHAR(127),
    "phone" VARCHAR(11),
    "cnpj" VARCHAR(14),
    "enterpriseId" INTEGER NOT NULL,
    "addressId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleCharacteristicValue" (
    "id" SERIAL NOT NULL,
    "characteristic" VARCHAR(127) NOT NULL,
    "value" VARCHAR(127) NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "VehicleCharacteristicValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleBase" (
    "id" SERIAL NOT NULL,
    "chassiNumber" VARCHAR(17) NOT NULL,
    "modelYear" INTEGER,
    "yearOfManufacture" INTEGER,
    "modelName" VARCHAR(127),
    "brandId" INTEGER NOT NULL,
    "category" "VehicleCategory",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "VehicleBase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleBrand" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(127) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "VehicleBrand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "kilometers" INTEGER,
    "plateNumber" VARCHAR(7) NOT NULL,
    "announcedPrice" INTEGER,
    "minimumPrice" INTEGER,
    "commissionValue" INTEGER NOT NULL,
    "color" VARCHAR(6),
    "fuelType" "FuelType",
    "status" "VehicleStatus" NOT NULL,
    "vehicleBaseId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehiclePurchase" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "userId" INTEGER NOT NULL,
    "accountPayableId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "VehiclePurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleExpense" (
    "id" SERIAL NOT NULL,
    "observations" TEXT,
    "category" "ExpenseCategory" NOT NULL,
    "accountPayableId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "VehicleExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleSale" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "customerId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "accountReceivableId" INTEGER NOT NULL,
    "accountPayableId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "VehicleSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountPayable" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(127),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "AccountPayable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountPayableInstallment" (
    "id" SERIAL NOT NULL,
    "installmentSequence" INTEGER NOT NULL,
    "dueDate" DATE NOT NULL,
    "value" INTEGER NOT NULL,
    "status" "InstallmentStatus" NOT NULL DEFAULT 'PENDING',
    "isRefund" BOOLEAN NOT NULL DEFAULT false,
    "isUpfront" BOOLEAN NOT NULL DEFAULT false,
    "accountPayableId" INTEGER NOT NULL,
    "refundAccountPayableInstallmentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "AccountPayableInstallment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethodReceivable" (
    "id" SERIAL NOT NULL,
    "type" "PaymentMethodReceivableType" NOT NULL,
    "paymentDate" DATE,
    "value" INTEGER NOT NULL,
    "accountReceivableInstallmentId" INTEGER,
    "userId" INTEGER NOT NULL,
    "vehicleId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "PaymentMethodReceivable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethodPayable" (
    "id" SERIAL NOT NULL,
    "type" "PaymentMethodPayableType" NOT NULL,
    "value" INTEGER NOT NULL,
    "paymentDate" DATE,
    "accountPayableInstallmentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "PaymentMethodPayable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "fullName" VARCHAR(127) NOT NULL,
    "phone" VARCHAR(11),
    "email" VARCHAR(127),
    "cpf" VARCHAR(11),
    "addressId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountReceivable" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(127),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "AccountReceivable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "ibgeCode" INTEGER NOT NULL,
    "name" VARCHAR(127) NOT NULL,
    "state" "BrazilianState" NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("ibgeCode")
);

-- CreateTable
CREATE TABLE "AccountReceivableInstallment" (
    "id" SERIAL NOT NULL,
    "installmentSequence" INTEGER NOT NULL,
    "dueDate" DATE NOT NULL,
    "value" INTEGER NOT NULL,
    "status" "InstallmentStatus" NOT NULL DEFAULT 'PENDING',
    "isRefund" BOOLEAN NOT NULL DEFAULT false,
    "isUpfront" BOOLEAN NOT NULL DEFAULT false,
    "accountReceivableId" INTEGER NOT NULL,
    "refundAccountReceivableInstallmentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "AccountReceivableInstallment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enterprise" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Enterprise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "cep" VARCHAR(8) NOT NULL,
    "street" VARCHAR(127) NOT NULL,
    "number" VARCHAR(127) NOT NULL,
    "neighborhood" VARCHAR(127),
    "cityIbgeCode" INTEGER,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullName" VARCHAR(127) NOT NULL,
    "phone" VARCHAR(11),
    "email" VARCHAR(127),
    "password" VARCHAR(256) NOT NULL,
    "cpf" VARCHAR(11),
    "enterpriseId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "addressId" INTEGER,
    "jit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "resource" "Resources" NOT NULL,
    "action" "Actions" NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" "RoleType" NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Store_cnpj_key" ON "Store"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleBase_chassiNumber_key" ON "VehicleBase"("chassiNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_cpf_key" ON "Customer"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleCharacteristicValue" ADD CONSTRAINT "VehicleCharacteristicValue_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleBase" ADD CONSTRAINT "VehicleBase_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "VehicleBrand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_vehicleBaseId_fkey" FOREIGN KEY ("vehicleBaseId") REFERENCES "VehicleBase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehiclePurchase" ADD CONSTRAINT "VehiclePurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehiclePurchase" ADD CONSTRAINT "VehiclePurchase_accountPayableId_fkey" FOREIGN KEY ("accountPayableId") REFERENCES "AccountPayable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehiclePurchase" ADD CONSTRAINT "VehiclePurchase_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleExpense" ADD CONSTRAINT "VehicleExpense_accountPayableId_fkey" FOREIGN KEY ("accountPayableId") REFERENCES "AccountPayable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleExpense" ADD CONSTRAINT "VehicleExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleExpense" ADD CONSTRAINT "VehicleExpense_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleSale" ADD CONSTRAINT "VehicleSale_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleSale" ADD CONSTRAINT "VehicleSale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleSale" ADD CONSTRAINT "VehicleSale_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleSale" ADD CONSTRAINT "VehicleSale_accountReceivableId_fkey" FOREIGN KEY ("accountReceivableId") REFERENCES "AccountReceivable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleSale" ADD CONSTRAINT "VehicleSale_accountPayableId_fkey" FOREIGN KEY ("accountPayableId") REFERENCES "AccountPayable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountPayableInstallment" ADD CONSTRAINT "AccountPayableInstallment_accountPayableId_fkey" FOREIGN KEY ("accountPayableId") REFERENCES "AccountPayable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountPayableInstallment" ADD CONSTRAINT "AccountPayableInstallment_refundAccountPayableInstallmentI_fkey" FOREIGN KEY ("refundAccountPayableInstallmentId") REFERENCES "AccountPayableInstallment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethodReceivable" ADD CONSTRAINT "PaymentMethodReceivable_accountReceivableInstallmentId_fkey" FOREIGN KEY ("accountReceivableInstallmentId") REFERENCES "AccountReceivableInstallment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethodReceivable" ADD CONSTRAINT "PaymentMethodReceivable_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethodReceivable" ADD CONSTRAINT "PaymentMethodReceivable_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethodPayable" ADD CONSTRAINT "PaymentMethodPayable_accountPayableInstallmentId_fkey" FOREIGN KEY ("accountPayableInstallmentId") REFERENCES "AccountPayableInstallment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethodPayable" ADD CONSTRAINT "PaymentMethodPayable_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountReceivableInstallment" ADD CONSTRAINT "AccountReceivableInstallment_accountReceivableId_fkey" FOREIGN KEY ("accountReceivableId") REFERENCES "AccountReceivable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountReceivableInstallment" ADD CONSTRAINT "AccountReceivableInstallment_refundAccountReceivableInstal_fkey" FOREIGN KEY ("refundAccountReceivableInstallmentId") REFERENCES "AccountReceivableInstallment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_cityIbgeCode_fkey" FOREIGN KEY ("cityIbgeCode") REFERENCES "City"("ibgeCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
