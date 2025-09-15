import { faker } from "@faker-js/faker";

describe("Vehicle Expense", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should add vehicle expense with minimal fields", () => {
    cy.visit("/vehicles");

    cy.get('[data-cy^="button-vehicle-expense-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const userId = dataCy.split("-").pop();
        cy.wrap(userId).as("vehicleId");
      });

    cy.get("@vehicleId").then((vehicleId) => {
      cy.intercept("POST", "http://localhost:3000/vehicle-expense", (req) => {
        expect(req.body).to.deep.include({
          vehicleId,
          category: "MAINTENANCE",
          observations: null,
          competencyDate: "2025-01-01",
          paidTo: "Manutenção",
          installments: [
            {
              installmentSequence: 1,
              dueDate: "2025-01-01",
              value: "10000",
              isUpfront: false,
              paymentMethods: null,
            },
          ],
        });

        expect(req.body.description).to.include("Gasto Veículo");
      }).as("createVehicleExpense");

      cy.intercept(
        "GET",
        `http://localhost:3000/vehicle-expense/${vehicleId}`
      ).as("getVehicleExpenses");

      cy.intercept("GET", `http://localhost:3000/vehicles/${vehicleId}`).as(
        "getVehicle"
      );

      cy.getDataCy(`button-vehicle-expense-${vehicleId}`).click();

      cy.wait("@getVehicle");

      cy.url().should("include", `/vehicles/expense/${vehicleId}`);

      cy.getDataCy("new-vehicle-expense-button").click();

      cy.get('button[type="submit"]').should("be.disabled");

      cy.fillInputByName("payment.competencyDate", "2025-01-01");

      cy.get('button[type="submit"]').should("be.enabled");

      cy.fillInputByName("payment.installment.value", "10000");

      cy.fillInputByName("payment.installment.dueDate", "2025-01-01");

      cy.getDataCy("data-field-Valor total").should("have.text", "R$ 100,00");

      cy.get('button[type="submit"]').click();

      cy.getDataCy("snackbar-title").should(
        "have.text",
        "Gasto criado com sucesso"
      );

      cy.wait("@createVehicleExpense");
      cy.wait("@getVehicleExpenses");
    });
  });

  it("should add vehicle expense with full fields", () => {
    cy.visit("/vehicles");

    cy.get('[data-cy^="button-vehicle-expense-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const userId = dataCy.split("-").pop();
        cy.wrap(userId).as("vehicleId");
      });

    cy.get("@vehicleId").then((vehicleId) => {
      cy.intercept("POST", "http://localhost:3000/vehicle-expense", (req) => {
        expect(req.body).to.deep.include({
          vehicleId,
          category: "IPVA",
          observations: "Descrição do gasto",
          competencyDate: "2025-01-01",
          paidTo: "IPVA",
          installments: [
            {
              installmentSequence: 1,
              dueDate: null,
              value: "10000",
              isUpfront: false,
              paymentMethods: [
                {
                  type: "CREDIT_CARD",
                  value: "10000",
                  paymentDate: "2025-01-01",
                },
              ],
            },
            {
              installmentSequence: 0,
              dueDate: "2025-01-01",
              value: "10000",
              isUpfront: true,
              paymentMethods: null,
            },
          ],
        });

        expect(req.body.description).to.include("Gasto Veículo");
      }).as("createVehicleExpense");

      cy.intercept(
        "GET",
        `http://localhost:3000/vehicle-expense/${vehicleId}`
      ).as("getVehicleExpenses");

      cy.getDataCy(`button-vehicle-expense-${vehicleId}`).click();

      cy.url().should("include", `/vehicles/expense/${vehicleId}`);

      cy.getDataCy("new-vehicle-expense-button").click();

      cy.get('button[type="submit"]').should("be.disabled");

      cy.getDataCy("select-payment.category").click();
      cy.getDataCy("select-option-IPVA").click();

      cy.get('button[type="submit"]').should("be.enabled");

      cy.fillInputByName("payment.competencyDate", "2025-01-01");

      cy.fillInputByName("payment.observations", "Descrição do gasto");

      cy.getDataCy("button-append-payment.upfront").click();
      cy.fillInputByName("payment.upfront.0.value", "10000");
      cy.fillInputByName("payment.upfront.0.dueDate", "2025-01-01");

      cy.fillInputByName("payment.installment.value", "10000");
      cy.getDataCy("select-payment.installment.status").click();
      cy.getDataCy("select-option-PAID").click();
      cy.fillInputByName("payment.installment.paymentDate", "2025-01-01");

      cy.getDataCy("data-field-Valor total").should("have.text", "R$ 200,00");

      cy.get('button[type="submit"]').click();

      cy.getDataCy("snackbar-title").should(
        "have.text",
        "Gasto criado com sucesso"
      );

      cy.wait("@createVehicleExpense");
      cy.wait("@getVehicleExpenses");
    });
  });

  it("should validate fields", () => {
    cy.visit("/vehicles");

    cy.get('[data-cy^="button-vehicle-expense-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const userId = dataCy.split("-").pop();
        cy.wrap(userId).as("vehicleId");
      });

    cy.get("@vehicleId").then((vehicleId) => {
      cy.getDataCy(`button-vehicle-expense-${vehicleId}`).click();

      cy.url().should("include", `/vehicles/expense/${vehicleId}`);

      cy.getDataCy("new-vehicle-expense-button").click();

      cy.get('button[type="submit"]').should("be.disabled");

      cy.getDataCy("select-payment.category").click();
      cy.getDataCy("select-option-MAINTENANCE").click();

      cy.get('button[type="submit"]').should("be.enabled");

      cy.getDataCy("button-append-payment.upfront").click();
      cy.getDataCy("select-payment.upfront.0.status").click();
      cy.getDataCy("select-option-PENDING").click();
      cy.fillInputByName("payment.upfront.0.dueDate", "1800-01-01");

      cy.getDataCy("select-payment.installment.status").click();
      cy.getDataCy("select-option-PAID").click();
      cy.fillInputByName("payment.installment.paymentDate", "2030-01-01");
      cy.getDataCy("select-payment.installment.paymentMethod").click();
      cy.getDataCy("select-option-CREDIT_CARD").click();

      cy.getDataCy("data-field-Valor total").should("have.text", "R$ 0,00");

      cy.get('button[type="submit"]').click();

      cy.getDataCy("input-error-payment.category").should(
        "have.text",
        "Opção inválida"
      );
      cy.getDataCy("input-error-payment.competencyDate").should(
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
      cy.getDataCy("input-error-payment.upfront.0.dueDate").should(
        "have.text",
        "Data de vencimento inválida"
      );
      cy.getDataCy("input-error-payment.installment.paymentDate").should(
        "have.text",
        "Data de pagamento inválida"
      );
    });
  });

  it("should disable vehicle expense", () => {
    cy.visit("/vehicles");

    cy.get('[data-cy^="button-vehicle-expense-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const userId = dataCy.split("-").pop();
        cy.wrap(userId).as("vehicleId");
      });

    cy.get("@vehicleId").then((vehicleId) => {
      cy.intercept(
        "GET",
        `http://localhost:3000/vehicle-expense/${vehicleId}`
      ).as("getVehicleExpenses");

      cy.getDataCy(`button-vehicle-expense-${vehicleId}`).click();

      cy.url().should("include", `/vehicles/expense/${vehicleId}`);

      cy.get('[data-cy^="button-disable-vehicle-expense-"]')
        .first()
        .invoke("attr", "data-cy")
        .then((dataCy) => {
          const userId = dataCy.split("-").pop();
          cy.wrap(userId).as("expenseId");
        });

      cy.get("@expenseId").then((expenseId) => {
        cy.intercept(
          "PATCH",
          `http://localhost:3000/vehicle-expense/${expenseId}/archive`
        ).as("disableExpense");

        cy.getDataCy(`button-disable-vehicle-expense-${expenseId}`).click();

        cy.getDataCy("dialog-footer-button-primary").click();

        cy.getDataCy("snackbar-title").should(
          "contain",
          "Gasto desativado com sucesso"
        );

        cy.wait("@disableExpense");
        cy.wait("@getVehicleExpenses");
      });
    });
  });

  it("should sum total value without disabled expenses", () => {
    cy.visit("/vehicles");

    cy.get('[data-cy^="button-vehicle-expense-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const userId = dataCy.split("-").pop();
        cy.wrap(userId).as("vehicleId");
      });

    cy.get("@vehicleId").then((vehicleId) => {
      cy.intercept({
        method: "GET",
        url: `http://localhost:3000/vehicle-expense/${vehicleId}`,
      }).as("getVehicleExpenses");

      cy.getDataCy(`button-vehicle-expense-${vehicleId}`).click();

      cy.url().should("include", `/vehicles/expense/${vehicleId}`);

      cy.get('[data-cy^="Valor-"]').then(($elements) => {
        let total = 0;

        $elements.each((_, el) => {
          const dataCy = el.getAttribute("data-cy");
          const parts = dataCy.split("-");
          const expenseId = parts.pop();

          cy.get("body").then(($body) => {
            const buttonSelector = `[data-cy="button-disable-vehicle-expense-${expenseId}"]`;
            if ($body.find(buttonSelector).length > 0) {
              let text = el.innerText || "";

              text = text.replace(/\D/g, "");

              const value = Number(text) || 0;
              total += value;
            }
          });
        });

        cy.getDataCy("data-field-Total de gastos").then(($element) => {
          const displayedText = $element.text();

          const displayedValue = displayedText.replace(/\D/g, "");

          expect(Number(displayedValue)).to.equal(total);
        });
      });
    });
  });

  it("should enable user", () => {
    cy.visit("/vehicles");

    cy.get('[data-cy^="button-vehicle-expense-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const userId = dataCy.split("-").pop();
        cy.wrap(userId).as("vehicleId");
      });

    cy.get("@vehicleId").then((vehicleId) => {
      cy.intercept(
        "GET",
        `http://localhost:3000/vehicle-expense/${vehicleId}`
      ).as("getVehicleExpenses");

      cy.getDataCy(`button-vehicle-expense-${vehicleId}`).click();

      cy.url().should("include", `/vehicles/expense/${vehicleId}`);

      cy.get('[data-cy^="button-enable-vehicle-expense-"]')
        .first()
        .invoke("attr", "data-cy")
        .then((dataCy) => {
          const userId = dataCy.split("-").pop();
          cy.wrap(userId).as("expenseId");
        });

      cy.get("@expenseId").then((expenseId) => {
        cy.intercept(
          "PATCH",
          `http://localhost:3000/vehicle-expense/${expenseId}/unarchive`
        ).as("enableExpense");

        cy.getDataCy(`button-enable-vehicle-expense-${expenseId}`).click();

        cy.getDataCy("snackbar-title").should("contain", "Gasto de");
        cy.getDataCy("snackbar-title").should("contain", "ativado com sucesso");

        cy.wait("@enableExpense");
        cy.wait("@getVehicleExpenses");
      });
    });
  });

  it("should edit one field in vehicle expense", () => {
    cy.visit("/vehicles");

    cy.get('[data-cy^="button-vehicle-expense-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const userId = dataCy.split("-").pop();
        cy.wrap(userId).as("vehicleId");
      });

    const observations = faker.lorem.words(3);

    cy.get("@vehicleId").then((vehicleId) => {
      cy.intercept(
        "GET",
        `http://localhost:3000/vehicle-expense/${vehicleId}`
      ).as("getVehicleExpenses");

      cy.getDataCy(`button-vehicle-expense-${vehicleId}`).click();

      cy.url().should("include", `/vehicles/expense/${vehicleId}`);

      cy.get('[data-cy^="button-edit-vehicle-expense-"]')
        .first()
        .invoke("attr", "data-cy")
        .then((dataCy) => {
          const userId = dataCy.split("-").pop();
          cy.wrap(userId).as("expenseId");
        });

      cy.get("@expenseId").then((expenseId) => {
        cy.intercept(
          "PATCH",
          `http://localhost:3000/vehicle-expense/${expenseId}`,
          (req) => {
            expect(req.body.observations).to.include(observations);
          }
        ).as("editVehicleExpense");

        cy.intercept(
          "GET",
          `http://localhost:3000/vehicle-expense/detail/${expenseId}`
        ).as("getVehicleExpense");

        cy.getDataCy(`button-edit-vehicle-expense-${expenseId}`).click();

        cy.wait("@getVehicleExpense");

        cy.get('button[type="submit"]').should("be.disabled");

        cy.get('input[name="payment.observations"]').clear().type(observations);

        cy.get('button[type="submit"]').should("be.enabled");

        cy.get('button[type="submit"]').click();

        cy.getDataCy("snackbar-title").should("contain", "Gasto de");
        cy.getDataCy("snackbar-title").should(
          "contain",
          "atualizado com sucesso"
        );

        cy.wait("@editVehicleExpense");
        cy.wait("@getVehicleExpenses");
      });
    });
  });

  it("should edit all fields in vehicle expense", () => {
    cy.visit("/vehicles");

    cy.get('[data-cy^="button-vehicle-expense-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const userId = dataCy.split("-").pop();
        cy.wrap(userId).as("vehicleId");
      });

    const observations = faker.lorem.words(3);

    cy.get("@vehicleId").then((vehicleId) => {
      cy.intercept(
        "GET",
        `http://localhost:3000/vehicle-expense/${vehicleId}`
      ).as("getVehicleExpenses");

      cy.getDataCy(`button-vehicle-expense-${vehicleId}`).click();

      cy.url().should("include", `/vehicles/expense/${vehicleId}`);

      cy.get('[data-cy^="button-edit-vehicle-expense-"]')
        .first()
        .invoke("attr", "data-cy")
        .then((dataCy) => {
          const userId = dataCy.split("-").pop();
          cy.wrap(userId).as("expenseId");
        });

      cy.get("@expenseId").then((expenseId) => {
        cy.intercept(
          "PATCH",
          `http://localhost:3000/vehicle-expense/${expenseId}`,
          (req) => {
            expect(req.body.observations).to.include(observations);
            expect(req.body.category).to.be.oneOf(["MAINTENANCE", "IPVA"]);
            expect(req.body.competencyDate).to.be.oneOf([
              "2025-01-01",
              "2025-02-02",
            ]);
          }
        ).as("editVehicleExpense");

        cy.intercept(
          "GET",
          `http://localhost:3000/vehicle-expense/detail/${expenseId}`
        ).as("getVehicleExpense");

        cy.getDataCy(`button-edit-vehicle-expense-${expenseId}`).click();

        cy.wait("@getVehicleExpense");

        cy.get('button[type="submit"]').should("be.disabled");

        cy.get('input[name="payment.observations"]').clear().type(observations);

        cy.get('button[type="submit"]').should("be.enabled");

        cy.get('input[name="payment.competencyDate"]').then(($input) => {
          const currentDate = $input.val();

          if (currentDate === "2025-01-01") {
            cy.get('input[name="payment.competencyDate"]')
              .clear()
              .type("2025-02-02");
          } else {
            cy.get('input[name="payment.competencyDate"]')
              .clear()
              .type("2025-01-01");
          }
        });

        cy.get("body").then(($body) => {
          const buttonSelector = `[data-cy="button-label-Manutenção"]`;
          cy.getDataCy("select-payment.category").click();
          if ($body.find(buttonSelector).length > 0) {
            cy.getDataCy("select-option-IPVA").click();
          } else {
            cy.getDataCy("select-option-MAINTENANCE").click();
          }
        });

        cy.get('button[type="submit"]').click();

        cy.getDataCy("snackbar-title").should("contain", "Gasto de");
        cy.getDataCy("snackbar-title").should(
          "contain",
          "atualizado com sucesso"
        );

        cy.wait("@editVehicleExpense");
        cy.wait("@getVehicleExpenses");
      });
    });
  });

  it("should on edit validate fields in vehicle expense", () => {
    cy.visit("/vehicles");

    cy.get('[data-cy^="button-vehicle-expense-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const userId = dataCy.split("-").pop();
        cy.wrap(userId).as("vehicleId");
      });

    cy.get("@vehicleId").then((vehicleId) => {
      cy.intercept(
        "GET",
        `http://localhost:3000/vehicle-expense/${vehicleId}`
      ).as("getVehicleExpenses");

      cy.getDataCy(`button-vehicle-expense-${vehicleId}`).click();

      cy.url().should("include", `/vehicles/expense/${vehicleId}`);

      cy.get('[data-cy^="button-edit-vehicle-expense-"]')
        .first()
        .invoke("attr", "data-cy")
        .then((dataCy) => {
          const userId = dataCy.split("-").pop();
          cy.wrap(userId).as("expenseId");
        });

      cy.get("@expenseId").then((expenseId) => {
        cy.intercept(
          "GET",
          `http://localhost:3000/vehicle-expense/detail/${expenseId}`
        ).as("getVehicleExpense");

        cy.getDataCy(`button-edit-vehicle-expense-${expenseId}`).click();

        cy.wait("@getVehicleExpense");

        cy.get('button[type="submit"]').should("be.disabled");

        cy.get('input[name="payment.competencyDate"]').clear();
        cy.getDataCy("select-payment.category").click();
        cy.getDataCy("icon-Check").click();

        cy.get('button[type="submit"]').should("be.enabled");

        cy.get('button[type="submit"]').click();

        cy.getDataCy("input-error-payment.category").should(
          "have.text",
          "Opção inválida"
        );
        cy.getDataCy("input-error-payment.competencyDate").should(
          "have.text",
          "Data inválida"
        );
      });
    });
  });
});
