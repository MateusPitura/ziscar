import { faker } from "@faker-js/faker";
import { generateChassi } from "../../../shared/src/test/generateChassi";
import { generatePlateNumber } from "../../../shared/src/test/generatePlateNumber";

describe("vehicle", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should disable vehicle", () => {
    cy.visit("/vehicles");

    cy.get('[data-cy^="button-disable-vehicle-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const vehicleId = dataCy.split("-").pop();
        cy.wrap(vehicleId).as("vehicleId");
      });

    cy.get("@vehicleId").then((vehicleId) => {
      cy.intercept(
        "PATCH",
        `http://localhost:3000/vehicles/${vehicleId}/archive`
      ).as("disableUser");

      cy.get(`[data-cy="button-disable-vehicle-${vehicleId}"]`).click();

      cy.get('[data-cy="dialog-footer-button-primary"]').click();

      cy.get('[data-cy="snackbar-title"]').should("contain", "Veículo");
      cy.get('[data-cy="snackbar-title"]').should(
        "contain",
        "desativado com sucesso"
      );

      cy.wait("@disableUser");
    });
  });

  it("should enable vehicle", () => {
    cy.visit("/vehicles");

    cy.get('[data-cy="button-table-filter"]').click();

    cy.getDataCy("select-status").click();
    cy.getDataCy("select-option-INACTIVE").click();

    cy.get('[data-cy="side-sheet-primary-button"').click();

    cy.get('[data-cy^="button-enable-vehicle-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const vehicleId = dataCy.split("-").pop();
        cy.wrap(vehicleId).as("vehicleId");
      });

    cy.get("@vehicleId").then((vehicleId) => {
      cy.intercept(
        "PATCH",
        `http://localhost:3000/vehicles/${vehicleId}/unarchive`
      ).as("enableVehicle");

      cy.get(`[data-cy="button-enable-vehicle-${vehicleId}"]`).click();

      cy.get('[data-cy="snackbar-title"]').should("contain", "Veículo");
      cy.get('[data-cy="snackbar-title"]').should(
        "contain",
        "ativado com sucesso"
      );

      cy.wait("@enableVehicle");
    });
  });

  it("should navigate in vehicle table", () => {
    cy.visit("/vehicles");

    cy.intercept("GET", "http://localhost:3000/vehicles?page=1&limit=20").as(
      "getVehiclesPage1"
    );

    cy.wait("@getVehiclesPage1");

    cy.get('[data-cy="table-navigate-before"]').should("be.disabled");

    cy.intercept("GET", "http://localhost:3000/vehicles?page=2&limit=20").as(
      "getVehiclesPage2"
    );

    cy.get('[data-cy="table-navigate-next"]').click();

    cy.wait("@getVehiclesPage2");

    cy.get('[data-cy="table-navigate-before"]').should("be.enabled");

    cy.get('[data-cy="table-navigate-before"]').click();

    cy.get('[data-cy="table-navigate-before"]').should("be.disabled");
  });

  it("should generate vehicle report", () => {
    cy.visit("/vehicles");

    cy.intercept("GET", "http://localhost:3000/vehicles?page=1&limit=20").as(
      "getVehiclesPage1"
    );

    cy.intercept("GET", "http://localhost:3000/vehicles?page=2&limit=20").as(
      "getVehiclesPage2"
    );

    cy.wait("@getVehiclesPage1");

    cy.get('[data-cy="export-button"]').click();

    cy.get('[data-cy="snackbar-title"]').should(
      "contain",
      "O PDF está sendo gerado"
    );

    cy.wait("@getVehiclesPage2");

    cy.task("downloads:folder").then((downloadsFolder) => {
      cy.task("list:files", downloadsFolder).then((files: string[]) => {
        const pdfFile = files.find(
          (file) =>
            file.startsWith("Relatório Veículos") && file.endsWith(".pdf")
        );
        if (!pdfFile) {
          throw new Error("PDF file not found");
        }
      });
    });

    cy.contains('[data-cy="snackbar-title"]', "O PDF está sendo gerado").should(
      "not.exist"
    );
  });

  it("should create vehicle with minimal fields", () => {
    const plateNumber = generatePlateNumber();
    const chassiNumber = generateChassi();

    cy.intercept("POST", "http://localhost:3000/vehicles", (req) => {
      expect(req.body).to.deep.include({
        plateNumber,
        chassiNumber,
        announcedPrice: "9000000",
        minimumPrice: "9000000",
        commissionValue: "50000",
        kilometers: "0",
        modelName: null,
        color: null,
        modelYear: null,
        yearOfManufacture: null,
        fuelType: "FLEX",
        status: "PURCHASED",
        category: "CAR",
        characteristics: [],
        payment: {
          purchaseDate: "2025-01-01",
          paidTo: null,
          installments: [
            {
              installmentSequence: 1,
              dueDate: "2025-01-01",
              value: "8000000",
              isUpfront: false,
              paymentMethods: null,
            },
          ],
        },
      });

      expect(req.body.storeId).to.match(/^\d+$/);
      expect(req.body.brandId).to.match(/^\d+$/);
    }).as("createVehicle");

    cy.intercept("GET", "http://localhost:3000/vehicles?page=1&limit=20").as(
      "getVehiclesPage"
    );

    cy.visit("/vehicles");

    cy.getDataCy("new-vehicle-button").click();

    cy.get('button[type="submit"]').should("be.disabled");

    cy.fillInputByName("payment.purchaseDate", "2025-01-01");

    cy.get('button[type="submit"]').should("be.enabled");

    cy.fillInputByName("payment.installment.value", "8000000");
    cy.fillInputByName("payment.installment.dueDate", "2025-01-01");
    cy.getDataCy("data-field-Valor total").should("have.text", "R$ 80.000,00");

    cy.getDataCy("tab-Veículo").click();

    cy.fillInputByName("vehicle.plateNumber", plateNumber);
    cy.fillInputByName("vehicle.chassiNumber", chassiNumber);

    cy.getDataCy("select-vehicle.storeId").click();
    cy.get('[data-cy^="select-option-"]').first().click();

    cy.fillInputByName("vehicle.minimumPrice", "9000000");
    cy.fillInputByName("vehicle.announcedPrice", "9000000");
    cy.fillInputByName("vehicle.commissionValue", "50000");

    cy.getDataCy("select-vehicle.brandId").click();
    cy.get('[data-cy^="select-option-"]').first().click();

    cy.get('button[type="submit"]').click();

    cy.wait("@createVehicle");
    cy.wait("@getVehiclesPage");

    cy.get('[data-cy="snackbar-title"]').should(
      "contain",
      "Veículo criado com sucesso"
    );
  });

  it("should create vehicle with all fields", () => {
    const plateNumber = generatePlateNumber();
    const chassiNumber = generateChassi();
    const characteristic = faker.lorem.word();

    cy.intercept("POST", "http://localhost:3000/vehicles", (req) => {
      expect(req.body).to.deep.include({
        plateNumber,
        chassiNumber,
        announcedPrice: "10000000",
        minimumPrice: "10000000",
        commissionValue: "000",
        kilometers: "10000",
        modelName: "Corsa",
        color: null,
        modelYear: "2026",
        yearOfManufacture: "2025",
        fuelType: "GASOLINE",
        status: "IN_STOCK",
        category: "TRUCK",
        characteristics: ["Air bag", characteristic],
        payment: {
          purchaseDate: "2025-01-01",
          paidTo: "Leilão",
          installments: [
            {
              installmentSequence: 1,
              dueDate: "2025-01-01",
              value: "8000000",
              isUpfront: false,
              paymentMethods: null,
            },
            {
              installmentSequence: 0,
              dueDate: "2025-01-01",
              value: "1000000",
              isUpfront: true,
              paymentMethods: null,
            },
          ],
        },
      });

      expect(req.body.storeId).to.match(/^\d+$/);
      expect(req.body.brandId).to.match(/^\d+$/);
    }).as("createVehicle");

    cy.intercept("GET", "http://localhost:3000/vehicles?page=1&limit=20").as(
      "getVehiclesPage"
    );

    cy.visit("/vehicles");

    cy.getDataCy("new-vehicle-button").click();

    cy.get('button[type="submit"]').should("be.disabled");

    cy.fillInputByName("payment.purchaseDate", "2025-01-01");

    cy.get('button[type="submit"]').should("be.enabled");

    cy.fillInputByName("payment.paidTo", "Leilão");

    cy.getDataCy("button-append-payment.upfront").click();
    cy.fillInputByName("payment.upfront.0.value", "1000000");
    cy.fillInputByName("payment.upfront.0.dueDate", "2025-01-01");

    cy.fillInputByName("payment.installment.value", "8000000");
    cy.fillInputByName("payment.installment.dueDate", "2025-01-01");
    cy.getDataCy("data-field-Valor total").should("have.text", "R$ 90.000,00");

    cy.getDataCy("tab-Veículo").click();

    cy.fillInputByName("vehicle.plateNumber", plateNumber);
    cy.fillInputByName("vehicle.chassiNumber", chassiNumber);

    cy.getDataCy("select-vehicle.storeId").click();
    cy.get('[data-cy^="select-option-"]').first().click();

    cy.fillInputByName("vehicle.minimumPrice", "10000000");
    cy.fillInputByName("vehicle.announcedPrice", "10000000");
    cy.fillInputByName("vehicle.commissionValue", "0");

    cy.getDataCy("select-vehicle.status").click();
    cy.getDataCy("select-option-IN_STOCK").click();

    cy.getDataCy("select-vehicle.brandId").click();
    cy.get('[data-cy^="select-option-"]').first().click();

    cy.fillInputByName("vehicle.modelName", "Corsa");

    cy.fillInputByName("vehicle.kilometers", "10000");

    cy.getDataCy("select-vehicle.category").click();
    cy.getDataCy("select-option-TRUCK").click();

    cy.getDataCy("select-vehicle.yearOfManufacture").click();
    cy.getDataCy("select-option-2025").click();

    cy.getDataCy("select-vehicle.fuelType").click();
    cy.getDataCy("select-option-GASOLINE").click();

    cy.getDataCy("tab-Características").click();

    cy.get('input[name="characteristics.commonCharacteristics"]')
      .first()
      .click();

    cy.getDataCy("button-append-characteristics.newCharacteristics").click();

    cy.fillInputByName(
      "characteristics.newCharacteristics.0.description",
      characteristic
    );

    cy.get('button[type="submit"]').click();

    cy.wait("@createVehicle");
    cy.wait("@getVehiclesPage");

    cy.get('[data-cy="snackbar-title"]').should(
      "contain",
      "Veículo criado com sucesso"
    );
  });

  it("should validate fields", () => {
    cy.visit("/vehicles");

    cy.get('[data-cy^="button-vehicle-expense-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const vehicleId = dataCy.split("-").pop();
        cy.wrap(vehicleId).as("vehicleId");
      });

    cy.get("@vehicleId").then(() => {
      cy.visit("/vehicles");

      cy.getDataCy("new-vehicle-button").click();

      cy.fillInputByName("payment.purchaseDate", "2030-01-01");

      cy.get('button[type="submit"]').should("be.enabled");

      cy.getDataCy("button-append-payment.upfront").click();
      cy.getDataCy("select-payment.upfront.0.status").click();
      cy.getDataCy("select-option-PENDING").click();

      cy.wait(500);

      cy.getDataCy("select-payment.installment.status").click();
      cy.getDataCy("select-option-PENDING").click();

      cy.getDataCy("data-field-Valor total").should("have.text", "R$ 0,00");

      cy.getDataCy("tab-Veículo").click();

      cy.getDataCy("select-vehicle.status").click();
      cy.getDataCy("select-option-PURCHASED").click();

      cy.get("input[name='vehicle.kilometers']").clear();

      cy.getDataCy("select-vehicle.category").click();
      cy.getDataCy("select-option-CAR").click();

      cy.getDataCy("select-vehicle.yearOfManufacture").click();
      cy.getDataCy("select-option-2025").click();

      cy.getDataCy("select-vehicle.fuelType").click();
      cy.getDataCy("select-option-GASOLINE").click();

      cy.getDataCy("tab-Características").click();

      cy.getDataCy("button-append-characteristics.newCharacteristics").click();

      cy.get('button[type="submit"]').click();

      cy.getDataCy(
        "input-error-characteristics.newCharacteristics.0.description"
      ).should("have.text", "Campo obrigatório");

      cy.getDataCy("tab-Veículo").click();

      cy.getDataCy("input-error-vehicle.plateNumber").should(
        "have.text",
        "Campo obrigatório"
      );
      cy.getDataCy("input-error-vehicle.chassiNumber").should(
        "have.text",
        "Campo obrigatório"
      );
      cy.getDataCy("input-error-vehicle.storeId").should(
        "have.text",
        "Campo obrigatório"
      );
      cy.getDataCy("input-error-vehicle.storeId").should(
        "have.text",
        "Campo obrigatório"
      );
      cy.getDataCy("input-error-vehicle.minimumPrice").should(
        "have.text",
        "Deve ser maior ou igual a R$ 0,01"
      );
      cy.getDataCy("input-error-vehicle.announcedPrice").should(
        "have.text",
        "Deve ser maior ou igual a R$ 0,01"
      );
      cy.getDataCy("input-error-vehicle.status").should(
        "have.text",
        "Opção inválida"
      );
      cy.getDataCy("input-error-vehicle.brandId").should(
        "have.text",
        "Campo obrigatório"
      );
      cy.getDataCy("input-error-vehicle.kilometers").should(
        "have.text",
        "Deve ser maior ou igual a 0"
      );

      cy.getDataCy("tab-Compra").click();

      cy.getDataCy("input-error-payment.purchaseDate").should(
        "have.text",
        "Data de pagamento inválida"
      );

      cy.getDataCy("input-error-payment.upfront.0.value").should(
        "have.text",
        "Deve ser maior ou igual a R$ 0,01"
      );
      cy.getDataCy("input-error-payment.upfront.0.status").should(
        "have.text",
        "Opção inválida"
      );

      cy.getDataCy("input-error-payment.installment.value").should(
        "have.text",
        "Deve ser maior ou igual a R$ 0,01"
      );
      cy.getDataCy("input-error-payment.installment.status").should(
        "have.text",
        "Opção inválida"
      );
    });
  });

  it("should create vehicle with paid installment and upfront", () => {
    const plateNumber = generatePlateNumber();
    const chassiNumber = generateChassi();
    const characteristic = faker.lorem.word();

    cy.intercept("POST", "http://localhost:3000/vehicles", (req) => {
      expect(req.body).to.deep.include({
        plateNumber,
        chassiNumber,
        announcedPrice: "10000000",
        minimumPrice: "10000000",
        commissionValue: "000",
        kilometers: "10000",
        modelName: "Corsa",
        color: null,
        modelYear: "2026",
        yearOfManufacture: "2025",
        fuelType: "GASOLINE",
        status: "IN_STOCK",
        category: "TRUCK",
        characteristics: ["Air bag", characteristic],
        payment: {
          purchaseDate: "2025-01-01",
          paidTo: "Leilão",
          installments: [
            {
              installmentSequence: 1,
              dueDate: null,
              value: "8000000",
              isUpfront: false,
              paymentMethods: [
                {
                  type: "CREDIT_CARD",
                  value: "8000000",
                  paymentDate: "2025-01-01",
                },
              ],
            },
            {
              installmentSequence: 0,
              dueDate: null,
              value: "1000000",
              isUpfront: true,
              paymentMethods: [
                {
                  type: "CREDIT_CARD",
                  value: "1000000",
                  paymentDate: "2025-01-01",
                },
              ],
            },
          ],
        },
      });

      expect(req.body.storeId).to.match(/^\d+$/);
      expect(req.body.brandId).to.match(/^\d+$/);
    }).as("createVehicle");

    cy.intercept("GET", "http://localhost:3000/vehicles?page=1&limit=20").as(
      "getVehiclesPage"
    );

    cy.visit("/vehicles");

    cy.getDataCy("new-vehicle-button").click();

    cy.get('button[type="submit"]').should("be.disabled");

    cy.fillInputByName("payment.purchaseDate", "2025-01-01");

    cy.get('button[type="submit"]').should("be.enabled");

    cy.fillInputByName("payment.paidTo", "Leilão");

    cy.getDataCy("button-append-payment.upfront").click();
    cy.fillInputByName("payment.upfront.0.value", "1000000");
    cy.getDataCy("select-payment.upfront.0.status").click();
    cy.get('[data-cy^="select-option-PAID"]').click();
    cy.fillInputByName("payment.upfront.0.paymentDate", "2025-01-01");

    cy.getDataCy("select-payment.installment.status").click();
    cy.get('[data-cy^="select-option-PAID"]').click();
    cy.fillInputByName("payment.installment.value", "8000000");
    cy.fillInputByName("payment.installment.paymentDate", "2025-01-01");

    cy.getDataCy("data-field-Valor total").should("have.text", "R$ 90.000,00");

    cy.getDataCy("tab-Veículo").click();

    cy.fillInputByName("vehicle.plateNumber", plateNumber);
    cy.fillInputByName("vehicle.chassiNumber", chassiNumber);

    cy.getDataCy("select-vehicle.storeId").click();
    cy.get('[data-cy^="select-option-"]').first().click();

    cy.fillInputByName("vehicle.minimumPrice", "10000000");
    cy.fillInputByName("vehicle.announcedPrice", "10000000");
    cy.fillInputByName("vehicle.commissionValue", "0");

    cy.getDataCy("select-vehicle.status").click();
    cy.getDataCy("select-option-IN_STOCK").click();

    cy.getDataCy("select-vehicle.brandId").click();
    cy.get('[data-cy^="select-option-"]').first().click();

    cy.fillInputByName("vehicle.modelName", "Corsa");

    cy.fillInputByName("vehicle.kilometers", "10000");

    cy.getDataCy("select-vehicle.category").click();
    cy.getDataCy("select-option-TRUCK").click();

    cy.getDataCy("select-vehicle.yearOfManufacture").click();
    cy.getDataCy("select-option-2025").click();

    cy.getDataCy("select-vehicle.fuelType").click();
    cy.getDataCy("select-option-GASOLINE").click();

    cy.getDataCy("tab-Características").click();

    cy.get('input[name="characteristics.commonCharacteristics"]')
      .first()
      .click();

    cy.getDataCy("button-append-characteristics.newCharacteristics").click();

    cy.fillInputByName(
      "characteristics.newCharacteristics.0.description",
      characteristic
    );

    cy.get('button[type="submit"]').click();

    cy.wait("@createVehicle");
    cy.wait("@getVehiclesPage");

    cy.get('[data-cy="snackbar-title"]').should(
      "contain",
      "Veículo criado com sucesso"
    );
  });

  it("should edit one field in vehicle", () => {
    cy.visit("/vehicles");

    cy.intercept("GET", "http://localhost:3000/vehicles?page=1&limit=20").as(
      "getVehiclesPage"
    );

    cy.get('[data-cy^="button-edit-vehicle-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const vehicleId = dataCy.split("-").pop();
        cy.wrap(vehicleId).as("vehicleId");
      });

    const companyName = faker.company.name();

    cy.get("@vehicleId").then((vehicleId) => {
      cy.intercept("GET", `http://localhost:3000/vehicles/${vehicleId}`).as(
        "getVehicle"
      );

      cy.intercept(
        "PATCH",
        `http://localhost:3000/vehicles/${vehicleId}`,
        (req) => {
          expect(req.body.payment.paidTo).to.equal(companyName);
        }
      ).as("editVehicle");

      cy.getDataCy(`button-edit-vehicle-${vehicleId}`).click();

      cy.wait("@getVehicle");

      cy.url().should("include", `/vehicles/edit/${vehicleId}`);

      cy.get('button[type="submit"]').should("be.disabled");

      cy.fillInputByName("payment.paidTo", companyName);

      cy.get('button[type="submit"]').should("be.enabled");

      cy.get('button[type="submit"]').click();

      cy.getDataCy("snackbar-title").should("contain", "Veículo");
      cy.getDataCy("snackbar-title").should(
        "contain",
        "atualizado com sucesso"
      );

      cy.wait("@editVehicle");
      cy.wait("@getVehiclesPage");
    });
  });

  it("should edit all fields in vehicle", () => {
    cy.visit("/vehicles");

    cy.intercept("GET", "http://localhost:3000/vehicles?page=1&limit=20").as(
      "getVehiclesPage"
    );

    cy.get('[data-cy^="button-edit-vehicle-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const vehicleId = dataCy.split("-").pop();
        cy.wrap(vehicleId).as("vehicleId");
      });

    const companyName = faker.company.name();

    cy.get("@vehicleId").then((vehicleId) => {
      const plateNumber = generatePlateNumber();
      const chassiNumber = generateChassi();

      cy.intercept("GET", `http://localhost:3000/vehicles/${vehicleId}`).as(
        "getVehicle"
      );

      cy.intercept(
        "PATCH",
        `http://localhost:3000/vehicles/${vehicleId}`,
        (req) => {
          expect(req.body.payment.paidTo).to.equal(companyName);
          expect(req.body.payment.purchaseDate).to.equal("2025-01-01");
          expect(req.body.plateNumber).to.equal(plateNumber);
          expect(req.body.chassiNumber).to.equal(chassiNumber);
          expect(req.body.commissionValue).to.equal("000");
          expect(req.body.modelName).to.equal("Corsa");
          expect(req.body.kilometers).to.equal("10000");
          expect(req.body.characteristics[0]).to.equal("Janelas elétricas");
        }
      ).as("editVehicle");

      cy.getDataCy(`button-edit-vehicle-${vehicleId}`).click();

      cy.wait("@getVehicle");

      cy.url().should("include", `/vehicles/edit/${vehicleId}`);

      cy.get('button[type="submit"]').should("be.disabled");

      cy.fillInputByName("payment.paidTo", companyName);

      cy.get('button[type="submit"]').should("be.enabled");

      cy.fillInputByName("payment.purchaseDate", "2025-01-01");

      cy.getDataCy("data-field-Valor de compra")
        .invoke("text")
        .then((text) => {
          expect(text).to.include("R$");

          const numericValue = Number(text.replace(/\D/g, ""));

          expect(numericValue).to.be.greaterThan(0);
        });

      cy.getDataCy("tab-Veículo").click();

      cy.fillInputByName("vehicle.plateNumber", plateNumber);
      cy.fillInputByName("vehicle.chassiNumber", chassiNumber);

      cy.fillInputByName("vehicle.commissionValue", "0");

      cy.fillInputByName("vehicle.modelName", "Corsa");

      cy.fillInputByName("vehicle.kilometers", "10000");

      cy.getDataCy("tab-Características").click();

      cy.get('input[name="characteristics.commonCharacteristics"]')
        .last()
        .click();

      cy.get('button[type="submit"]').click();

      cy.getDataCy("snackbar-title").should("contain", "Veículo");
      cy.getDataCy("snackbar-title").should(
        "contain",
        "atualizado com sucesso"
      );

      cy.wait("@editVehicle");
      cy.wait("@getVehiclesPage");
    });
  });

  it("should validate fields on edit vehicle", () => {
    cy.visit("/vehicles");

    cy.intercept("GET", "http://localhost:3000/vehicles?page=1&limit=20").as(
      "getVehiclesPage"
    );

    cy.get('[data-cy^="button-edit-vehicle-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const vehicleId = dataCy.split("-").pop();
        cy.wrap(vehicleId).as("vehicleId");
      });

    cy.get("@vehicleId").then((vehicleId) => {
      cy.intercept("GET", `http://localhost:3000/vehicles/${vehicleId}`).as(
        "getVehicle"
      );

      cy.getDataCy(`button-edit-vehicle-${vehicleId}`).click();

      cy.wait("@getVehicle");

      cy.url().should("include", `/vehicles/edit/${vehicleId}`);

      cy.get('button[type="submit"]').should("be.disabled");

      cy.get('input[name="payment.purchaseDate"]').clear();

      cy.get('button[type="submit"]').should("be.enabled");

      cy.getDataCy("tab-Veículo").click();

      cy.get('input[name="vehicle.plateNumber"]').clear();
      cy.get('input[name="vehicle.chassiNumber"]').clear();
      cy.get('input[name="vehicle.minimumPrice"]').clear();
      cy.get('input[name="vehicle.announcedPrice"]').clear();
      cy.get('input[name="vehicle.commissionValue"]').clear();
      cy.get('input[name="vehicle.kilometers"]').clear();

      cy.getDataCy("select-vehicle.storeId").click();
      cy.getDataCy("icon-Check").click();

      cy.getDataCy("select-vehicle.status").click();
      cy.getDataCy("icon-Check").click();

      cy.getDataCy("select-vehicle.brandId").click();
      cy.getDataCy("icon-Check").click();

      cy.get('button[type="submit"]').click();

      cy.getDataCy("input-error-vehicle.plateNumber").should(
        "have.text",
        "Campo obrigatório"
      );
      cy.getDataCy("input-error-vehicle.chassiNumber").should(
        "have.text",
        "Campo obrigatório"
      );
      cy.getDataCy("input-error-vehicle.storeId").should(
        "have.text",
        "Campo obrigatório"
      );
      cy.getDataCy("input-error-vehicle.storeId").should(
        "have.text",
        "Campo obrigatório"
      );
      cy.getDataCy("input-error-vehicle.minimumPrice").should(
        "have.text",
        "Deve ser maior ou igual a R$ 0,01"
      );
      cy.getDataCy("input-error-vehicle.announcedPrice").should(
        "have.text",
        "Deve ser maior ou igual a R$ 0,01"
      );
      cy.getDataCy("input-error-vehicle.status").should(
        "have.text",
        "Opção inválida"
      );
      cy.getDataCy("input-error-vehicle.brandId").should(
        "have.text",
        "Campo obrigatório"
      );
      cy.getDataCy("input-error-vehicle.kilometers").should(
        "have.text",
        "Deve ser maior ou igual a 0"
      );

      cy.getDataCy("tab-Compra").click();

      cy.getDataCy("input-error-payment.purchaseDate").should(
        "have.text",
        "Data inválida"
      );
    });
  });
});
