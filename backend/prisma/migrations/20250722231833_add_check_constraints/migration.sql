ALTER TABLE "User" ADD CONSTRAINT check_user_cpf_length 
    CHECK (cpf IS NULL OR LENGTH(cpf) = 11);

ALTER TABLE "Customer" ADD CONSTRAINT check_customer_cpf_length 
    CHECK (cpf IS NULL OR LENGTH(cpf) = 11);

ALTER TABLE "Store" ADD CONSTRAINT check_store_cnpj_length 
    CHECK (cnpj IS NULL OR LENGTH(cnpj) = 14);

ALTER TABLE "Address" ADD CONSTRAINT check_address_cep_format 
    CHECK (cep IS NULL OR (LENGTH(cep) = 8 AND cep ~ '^[0-9]{8}$'));

ALTER TABLE "VehicleBase" ADD CONSTRAINT check_vehiclebase_chassi_length 
    CHECK ("chassiNumber" IS NULL OR LENGTH("chassiNumber") = 17);

ALTER TABLE "VehicleBase" ADD CONSTRAINT check_vehiclebase_model_year 
    CHECK ("modelYear" IS NULL OR ("modelYear" >= 1900 AND "modelYear" <= EXTRACT(YEAR FROM CURRENT_DATE) + 1));

ALTER TABLE "VehicleBase" ADD CONSTRAINT check_vehiclebase_manufacture_year 
    CHECK ("yearOfManufacture" IS NULL OR ("yearOfManufacture" >= 1900 AND "yearOfManufacture" <= EXTRACT(YEAR FROM CURRENT_DATE)));

ALTER TABLE "VehicleBase" ADD CONSTRAINT check_vehiclebase_year_logic 
    CHECK ("yearOfManufacture" IS NULL OR "modelYear" IS NULL OR "yearOfManufacture" <= "modelYear");

ALTER TABLE "Vehicle" ADD CONSTRAINT check_vehicle_kilometers 
    CHECK (kilometers IS NULL OR kilometers >= 0);

ALTER TABLE "Vehicle" ADD CONSTRAINT check_vehicle_announced_price 
    CHECK ("announcedPrice" IS NULL OR "announcedPrice" >= 0);

ALTER TABLE "Vehicle" ADD CONSTRAINT check_vehicle_minimum_price 
    CHECK ("minimumPrice" IS NULL OR "minimumPrice" >= 0);

ALTER TABLE "Vehicle" ADD CONSTRAINT check_vehicle_commission_value 
    CHECK ("commissionValue" >= 0);

ALTER TABLE "Vehicle" ADD CONSTRAINT check_vehicle_price_logic 
    CHECK ("minimumPrice" IS NULL OR "announcedPrice" IS NULL OR "minimumPrice" <= "announcedPrice");

ALTER TABLE "Vehicle" ADD CONSTRAINT check_vehicle_plate_format 
    CHECK ("plateNumber" ~ '^[A-Z]{3}[0-9]{4}$' OR "plateNumber" ~ '^[A-Z]{3}[0-9][A-Z][0-9]{2}$');

ALTER TABLE "VehiclePurchase" ADD CONSTRAINT check_vehiclepurchase_date 
    CHECK (date <= CURRENT_DATE);

ALTER TABLE "VehicleSale" ADD CONSTRAINT check_vehiclesale_date 
    CHECK (date <= CURRENT_DATE);

ALTER TABLE "AccountPayableInstallment" ADD CONSTRAINT check_accountpayable_installment_sequence 
    CHECK ("installmentSequence" >= 0);

ALTER TABLE "AccountPayableInstallment" ADD CONSTRAINT check_accountpayable_value 
    CHECK (value > 0);

ALTER TABLE "AccountReceivableInstallment" ADD CONSTRAINT check_accountreceivable_installment_sequence 
    CHECK ("installmentSequence" >= 0);

ALTER TABLE "AccountReceivableInstallment" ADD CONSTRAINT check_accountreceivable_value 
    CHECK (value > 0);

ALTER TABLE "PaymentMethodPayable" ADD CONSTRAINT check_paymentmethodpayable_value 
    CHECK (value > 0);

ALTER TABLE "PaymentMethodPayable" ADD CONSTRAINT check_paymentmethodpayable_date 
    CHECK ("paymentDate" IS NULL OR "paymentDate" <= CURRENT_DATE);

ALTER TABLE "PaymentMethodReceivable" ADD CONSTRAINT check_paymentmethodreceivable_value 
    CHECK (value > 0);

ALTER TABLE "PaymentMethodReceivable" ADD CONSTRAINT check_paymentmethodreceivable_date 
    CHECK ("paymentDate" IS NULL OR "paymentDate" <= CURRENT_DATE);