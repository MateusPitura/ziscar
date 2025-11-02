describe("Account Receivable", () => {
  const formattedDate = new Date().toISOString().split("T")[0];

  beforeEach(() => {
    cy.intercept("**", (req) => {
      req.headers["cache-control"] = "no-cache";
      req.headers["if-none-match"] = undefined;
      req.headers["if-modified-since"] = undefined;
    });

    cy.login();
  });

  it("should navigate in accounts receivable table", () => {
    cy.visit("/accounts-receivable");

    cy.intercept(
      "GET",
      `http://localhost:3000/account-receivable/search?page=1&startDate=${formattedDate}&endDate=${formattedDate}&overallStatus=PENDING&orderBy=description`
    ).as("getAccountsReceivable1");

    cy.wait("@getAccountsReceivable1");

    cy.get('[data-cy="table-navigate-before"]').should("be.disabled");

    cy.intercept(
      "GET",
      `http://localhost:3000/account-receivable/search?page=2&startDate=${formattedDate}&endDate=${formattedDate}&overallStatus=PENDING&orderBy=description`
    ).as("getAccountsReceivable2");

    cy.get('[data-cy="table-navigate-next"]').click();

    cy.wait("@getAccountsReceivable2");

    cy.get('[data-cy="table-navigate-before"]').should("be.enabled");

    cy.get('[data-cy="table-navigate-before"]').click();

    cy.get('[data-cy="table-navigate-before"]').should("be.disabled");
  });

  it("should generate account receivable report", () => {
    cy.visit("/accounts-receivable");

    cy.intercept(
      "GET",
      `http://localhost:3000/account-receivable/search?page=1&startDate=${formattedDate}&endDate=${formattedDate}&overallStatus=PENDING&orderBy=description`
    ).as("getAccountsReceivable1");

    cy.intercept(
      "GET",
      `http://localhost:3000/account-receivable/search?page=2&startDate=${formattedDate}&endDate=${formattedDate}&overallStatus=PENDING&orderBy=description`
    ).as("getAccountsReceivable2");

    cy.wait("@getAccountsReceivable1");

    cy.get('[data-cy="export-button"]').click();

    cy.get('[data-cy="snackbar-title"]').should(
      "contain",
      "O PDF está sendo gerado"
    );

    cy.wait("@getAccountsReceivable2");

    cy.wait(1000)

    cy.task("downloads:folder").then((downloadsFolder) => {
      cy.task("list:files", downloadsFolder).then((files: string[]) => {
        const pdfFile = files.find(
          (file) => file.startsWith("Relatório Vendas") && file.endsWith(".pdf")
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

  it("should view sale details from account receivable", () => {
    cy.visit("/accounts-receivable");

    cy.get('[data-cy^="button-view-vehicleSale-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const vehicleSaleId = dataCy.split("-").pop();
        cy.wrap(vehicleSaleId).as("vehicleSaleId");
      });

    cy.get("@vehicleSaleId").then((vehicleSaleId) => {
      cy.intercept(
        "GET",
        `http://localhost:3000/vehicles/sale/${vehicleSaleId}`
      ).as("getVehicleSale");

      cy.getDataCy(`button-view-vehicleSale-${vehicleSaleId}`).click();

      cy.wait("@getVehicleSale");

      cy.getDataCy("data-field-Placa")
        .invoke("text")
        .should((text) => {
          expect(text.length).to.be.oneOf([7, 8]);
        });

      cy.getDataCy("tab-Cliente").click();

      cy.getDataCy("data-field-Nome")
        .invoke("text")
        .should((text) => {
          expect(text.trim()).to.not.equal("");
        });
    });
  });

  it("should validate add payment method", () => {
    cy.visit("/accounts-receivable");

    cy.intercept(
      "GET",
      `http://localhost:3000/account-receivable/search?page=1&startDate=${formattedDate}&endDate=${formattedDate}&overallStatus=PENDING&orderBy=description`
    ).as("getAccountsReceivable");

    cy.wait("@getAccountsReceivable");

    cy.get('[data-cy^="button-edit-accountReceivable-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const accountId = dataCy.split("-").pop();
        cy.wrap(accountId).as("accountId");
      });

    cy.get("@accountId").then((accountId) => {
      cy.intercept(
        "GET",
        `http://localhost:3000/account-receivable/${accountId}`
      ).as("getAccountDetails");

      cy.intercept(
        "GET",
        `http://localhost:3000/account-receivable-installments/by-account/${accountId}`
      ).as("getAccountInstallments");

      cy.getDataCy(`button-edit-accountReceivable-${accountId}`).click();

      cy.wait("@getAccountDetails");
      cy.wait("@getAccountInstallments");

      cy.get('[data-cy^="button-edit-addPaymentMethod-"]')
        .first()
        .invoke("attr", "data-cy")
        .then((dataCy) => {
          const installmentId = dataCy.split("-").pop();
          cy.wrap(installmentId).as("installmentId");
        });

      cy.get("@installmentId").then((installmentId) => {
        cy.getDataCy(`button-edit-addPaymentMethod-${installmentId}`).click();

        cy.get('input[name="paymentDate"]').clear();

        cy.getDataCy("dialog-footer-button-primary").click();

        cy.getDataCy("input-error-paymentDate").should(
          "have.text",
          "Data inválida"
        );
      });
    });
  });

  it("should view installments and add payment method", () => {
    cy.visit("/accounts-receivable");

    cy.intercept(
      "GET",
      `http://localhost:3000/account-receivable/search?page=1&startDate=${formattedDate}&endDate=${formattedDate}&overallStatus=PENDING&orderBy=description`
    ).as("getAccountsReceivable");

    cy.wait("@getAccountsReceivable");

    cy.get('[data-cy^="button-edit-accountReceivable-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const accountId = dataCy.split("-").pop();
        cy.wrap(accountId).as("accountId");
      });

    cy.get("@accountId").then((accountId) => {
      cy.intercept(
        "GET",
        `http://localhost:3000/account-receivable/${accountId}`
      ).as("getAccountDetails");

      cy.intercept(
        "GET",
        `http://localhost:3000/account-receivable-installments/by-account/${accountId}`
      ).as("getAccountInstallments");

      cy.getDataCy(`button-edit-accountReceivable-${accountId}`).click();

      cy.wait("@getAccountDetails");
      cy.wait("@getAccountInstallments");

      cy.get('[data-cy^="button-edit-addPaymentMethod-"]')
        .first()
        .invoke("attr", "data-cy")
        .then((dataCy) => {
          const installmentId = dataCy.split("-").pop();
          cy.wrap(installmentId).as("installmentId");
        });

      cy.get("@installmentId").then((installmentId) => {
        cy.getDataCy(`button-edit-addPaymentMethod-${installmentId}`).click();

        cy.intercept(
          "POST",
          `http://localhost:3000/account-receivable-installments/payment-method/${installmentId}`,
          (req) => {
            expect(req.body).to.deep.equal({
              paymentDate: new Date().toISOString().split("T")[0],
              type: "CREDIT_CARD",
            });
          }
        ).as("addPaymentMethod");

        cy.getDataCy("dialog-footer-button-primary").click();

        cy.wait("@addPaymentMethod");
        cy.wait("@getAccountInstallments");

        cy.get('[data-cy="snackbar-title"]').should(
          "contain",
          "Método de pagamento adicionado"
        );

        cy.getDataCy("back-accounts-receivable-button").click();

        cy.wait("@getAccountsReceivable");
      });
    });
  });
});
