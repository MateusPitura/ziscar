import { faker } from "@faker-js/faker";
import { generateCpf } from "../../../shared/src/test/generateCpf";

describe("vehicle", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should sale vehicle with minimal fields", () => {
    cy.visit("/vehicles");

    cy.intercept("GET", "http://localhost:3000/vehicles?page=1&limit=20").as(
      "getVehiclesPage"
    );

    cy.get('[data-cy^="button-vehicleSale-"]')
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

      cy.intercept("POST", `http://localhost:3000/vehicles/sale`, (req) => {
        expect(req.body).to.deep.include({
          vehicleId,
          date: new Date().toISOString().split("T")[0],
          installments: [
            {
              installmentSequence: 1,
              dueDate: "2025-01-01",
              value: "80000000",
              isUpfront: false,
              paymentMethods: null,
            },
          ],
        });

        expect(req.body.accountReceivable.description).to.include(
          "Venda Veículo"
        );
        expect(
          req.body.accountReceivable.receivedFrom.length
        ).to.be.greaterThan(1);
        expect(req.body.commissionValue.length).to.be.greaterThan(1);
        expect(req.body.customerId.length).to.be.greaterThan(0);
      }).as("saleVehicle");

      cy.getDataCy(`button-vehicleSale-${vehicleId}`).click();

      cy.wait("@getVehicle");

      cy.url().should("include", `/vehicle-sale/new/${vehicleId}`);

      cy.getDataCy("data-field-Número da placa")
        .invoke("text")
        .should((text) => {
          expect(text.length).to.be.oneOf([7, 8]);
        });

      cy.getDataCy("tab-Cliente").click();

      cy.get('button[type="submit"]').should("be.disabled");

      cy.getDataCy("select-customer.id").click();
      cy.get("[cmdk-input]").type("1");
      cy.get('[data-cy^="select-option-"]').first().click();

      cy.get('button[type="submit"]').should("be.enabled");

      cy.getDataCy("data-field-Nome")
        .invoke("text")
        .should((text) => {
          expect(text.length).to.be.greaterThan(1);
        });

      cy.getDataCy("tab-Pagamento").click();

      cy.fillInputByName("payment.installment.value", "80000000");
      cy.fillInputByName("payment.installment.dueDate", "2025-01-01");
      cy.getDataCy("data-field-Valor total").should(
        "have.text",
        "R$ 800.000,00"
      );

      cy.get('button[type="submit"]').click();

      cy.getDataCy("snackbar-title").should(
        "contain",
        "Venda realizada com sucesso"
      );

      cy.wait("@saleVehicle");
      cy.wait("@getVehiclesPage");
    });
  });

  it("should sale vehicle with all fields", () => {
    cy.visit("/vehicles");

    cy.intercept("GET", "http://localhost:3000/vehicles?page=1&limit=20").as(
      "getVehiclesPage"
    );

    cy.get('[data-cy^="button-vehicleSale-"]')
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

      cy.intercept("POST", `http://localhost:3000/vehicles/sale`, (req) => {
        expect(req.body).to.deep.include({
          vehicleId,
          date: new Date().toISOString().split("T")[0],
          installments: [
            {
              installmentSequence: 1,
              dueDate: "2025-01-01",
              value: "80000000",
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
        });

        expect(req.body.accountReceivable.description).to.include(
          "Venda Veículo"
        );
        expect(
          req.body.accountReceivable.receivedFrom.length
        ).to.be.greaterThan(1);
        expect(req.body.commissionValue.length).to.be.greaterThan(1);
        expect(req.body.customerId.length).to.be.greaterThan(0);
      }).as("saleVehicle");

      cy.getDataCy(`button-vehicleSale-${vehicleId}`).click();

      cy.wait("@getVehicle");

      cy.url().should("include", `/vehicle-sale/new/${vehicleId}`);

      cy.getDataCy("data-field-Número da placa")
        .invoke("text")
        .should((text) => {
          expect(text.length).to.be.oneOf([7, 8]);
        });

      cy.getDataCy("tab-Cliente").click();

      cy.get('button[type="submit"]').should("be.disabled");

      cy.getDataCy("select-customer.id").click();
      cy.get("[cmdk-input]").type("1");
      cy.get('[data-cy^="select-option-"]').first().click();

      cy.get('button[type="submit"]').should("be.enabled");

      cy.getDataCy("data-field-Nome")
        .invoke("text")
        .should((text) => {
          expect(text.length).to.be.greaterThan(1);
        });

      cy.getDataCy("tab-Pagamento").click();

      cy.fillInputByName("payment.commissionValue", "0");

      cy.getDataCy("button-append-payment.upfront").click();
      cy.fillInputByName("payment.upfront.0.value", "1000000");
      cy.fillInputByName("payment.upfront.0.dueDate", "2025-01-01");

      cy.fillInputByName("payment.installment.value", "80000000");
      cy.fillInputByName("payment.installment.dueDate", "2025-01-01");
      cy.getDataCy("data-field-Valor total").should(
        "have.text",
        "R$ 810.000,00"
      );

      cy.get('button[type="submit"]').click();

      cy.getDataCy("snackbar-title").should(
        "contain",
        "Venda realizada com sucesso"
      );

      cy.wait("@saleVehicle");
      cy.wait("@getVehiclesPage");
    });
  });

  it("should create customer on sale and sale with paid status", () => {
    cy.visit("/vehicles");

    cy.intercept("GET", "http://localhost:3000/vehicles?page=1&limit=20").as(
      "getVehiclesPage"
    );

    cy.get('[data-cy^="button-vehicleSale-"]')
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

      cy.intercept("POST", `http://localhost:3000/customer`).as(
        "createCustomer"
      );

      const customerCpf = generateCpf();
      const customerFullName = faker.person.fullName();

      cy.intercept("POST", `http://localhost:3000/vehicles/sale`, (req) => {
        expect(req.body).to.deep.include({
          vehicleId,
          date: new Date().toISOString().split("T")[0],
          installments: [
            {
              installmentSequence: 1,
              dueDate: null,
              value: "80000000",
              isUpfront: false,
              paymentMethods: [
                {
                  type: "CREDIT_CARD",
                  value: "80000000",
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
        });

        expect(req.body.accountReceivable.description).to.include(
          "Venda Veículo"
        );
        expect(
          req.body.accountReceivable.receivedFrom.length
        ).to.be.greaterThan(1);
        expect(req.body.commissionValue.length).to.be.greaterThan(1);
        expect(req.body.customerId.length).to.be.greaterThan(0);
      }).as("saleVehicle");

      cy.getDataCy(`button-vehicleSale-${vehicleId}`).click();

      cy.wait("@getVehicle");

      cy.url().should("include", `/vehicle-sale/new/${vehicleId}`);

      cy.getDataCy("data-field-Número da placa")
        .invoke("text")
        .should((text) => {
          expect(text.length).to.be.oneOf([7, 8]);
        });

      cy.getDataCy("tab-Cliente").click();

      cy.get('button[type="submit"]').should("be.disabled");

      cy.getDataCy("select-customer.id").click();
      cy.get("[cmdk-input]").type(customerCpf);
      cy.get("[data-cy^='button-label-Cadastrar']").first().click();

      cy.fillInputByName("fullName", customerFullName);

      cy.get('[data-cy="dialog-footer-button-primary"]').click();

      cy.getDataCy("snackbar-title").should(
        "contain",
        "Cliente criado com sucesso"
      );

      cy.wait("@createCustomer");

      cy.get('button[type="submit"]').should("be.enabled");

      cy.getDataCy("data-field-Nome").should("have.text", customerFullName);

      cy.getDataCy("tab-Pagamento").click();

      cy.fillInputByName("payment.commissionValue", "0");

      cy.getDataCy("button-append-payment.upfront").click();
      cy.fillInputByName("payment.upfront.0.value", "1000000");
      cy.getDataCy("select-payment.upfront.0.status").click();
      cy.get('[data-cy^="select-option-PAID"]').click();
      cy.fillInputByName("payment.upfront.0.paymentDate", "2025-01-01");

      cy.getDataCy("select-payment.installment.status").click();
      cy.get('[data-cy^="select-option-PAID"]').click();
      cy.fillInputByName("payment.installment.value", "80000000");
      cy.fillInputByName("payment.installment.paymentDate", "2025-01-01");

      cy.getDataCy("data-field-Valor total").should(
        "have.text",
        "R$ 810.000,00"
      );

      cy.get('button[type="submit"]').click();

      cy.getDataCy("snackbar-title").should(
        "contain",
        "Venda realizada com sucesso"
      );

      cy.wait("@saleVehicle");
      cy.wait("@getVehiclesPage");
    });
  });

  it("should validate fields on sale", () => {
    cy.visit("/vehicles");

    cy.intercept("GET", "http://localhost:3000/vehicles?page=1&limit=20").as(
      "getVehiclesPage"
    );

    cy.get('[data-cy^="button-vehicleSale-"]')
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

      cy.getDataCy(`button-vehicleSale-${vehicleId}`).click();

      cy.wait("@getVehicle");

      cy.url().should("include", `/vehicle-sale/new/${vehicleId}`);

      cy.getDataCy("data-field-Número da placa")
        .invoke("text")
        .should((text) => {
          expect(text.length).to.be.oneOf([7, 8]);
        });

      cy.getDataCy("tab-Pagamento").click();

      cy.get('button[type="submit"]').should("be.disabled");

      cy.get("input[name='payment.saleDate']").clear();

      cy.get('button[type="submit"]').should("be.enabled");

      cy.getDataCy("button-append-payment.upfront").click();
      cy.getDataCy("select-payment.upfront.0.status").click();
      cy.get('[data-cy^="select-option-PENDING"]').click();

      cy.wait(500)

      cy.getDataCy("select-payment.installment.status").click();
      cy.get('[data-cy^="select-option-PENDING"]').click();
      cy.fillInputByName("payment.installment.value", "0");

      cy.getDataCy("data-field-Valor total").should("have.text", "R$ 0,00");

      cy.get('button[type="submit"]').click();

      cy.getDataCy("input-error-payment.saleDate").should(
        "have.text",
        "Data inválida"
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

      cy.getDataCy("tab-Cliente").click();

      cy.getDataCy("input-error-customer.id").should(
        "have.text",
        "Campo obrigatório"
      );
    });
  });
});
