describe("Account Payable", () => {
  beforeEach(() => {
    cy.intercept("**", (req) => {
      req.headers["cache-control"] = "no-cache";
      req.headers["if-none-match"] = undefined;
      req.headers["if-modified-since"] = undefined;
    });

    cy.login();
  });

  it("should navigate in accounts payable table", () => {
    cy.visit("/accounts-payable");

    cy.intercept(
      "GET",
      "http://localhost:3000/account-payable/search?page=1&overallStatus=PENDING&orderBy=description"
    ).as("getAccountsPayable1");

    cy.wait("@getAccountsPayable1");

    cy.get('[data-cy="table-navigate-before"]').should("be.disabled");

    cy.intercept(
      "GET",
      "http://localhost:3000/account-payable/search?page=2&overallStatus=PENDING&orderBy=description"
    ).as("getAccountsPayable2");

    cy.get('[data-cy="table-navigate-next"]').click();

    cy.wait("@getAccountsPayable2");

    cy.get('[data-cy="table-navigate-before"]').should("be.enabled");

    cy.get('[data-cy="table-navigate-before"]').click();

    cy.get('[data-cy="table-navigate-before"]').should("be.disabled");
  });

  it("should generate account payable report", () => {
    cy.visit("/accounts-payable");

    cy.intercept(
      "GET",
      "http://localhost:3000/account-payable/search?page=1&overallStatus=PENDING&orderBy=description"
    ).as("getAccountsPayable1");

    cy.intercept(
      "GET",
      "http://localhost:3000/account-payable/search?page=2&overallStatus=PENDING&orderBy=description"
    ).as("getAccountsPayable2");

    cy.wait("@getAccountsPayable1");

    cy.get('[data-cy="export-button"]').click();

    cy.get('[data-cy="snackbar-title"]').should(
      "contain",
      "O PDF está sendo gerado"
    );

    cy.wait("@getAccountsPayable2");

    cy.task("downloads:folder").then((downloadsFolder) => {
      cy.task("list:files", downloadsFolder).then((files: string[]) => {
        const pdfFile = files.find(
          (file) =>
            file.startsWith("Relatório Pagamentos") && file.endsWith(".pdf")
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

  it("should validate add payment method", () => {
    cy.visit("/accounts-payable");

    cy.intercept(
      "GET",
      "http://localhost:3000/account-payable/search?page=1&overallStatus=PENDING&orderBy=description"
    ).as("getAccountsPayable");

    cy.wait("@getAccountsPayable");

    cy.get('[data-cy^="button-edit-accountPayable-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const accountId = dataCy.split("-").pop();
        cy.wrap(accountId).as("accountId");
      });

    cy.get("@accountId").then((accountId) => {
      cy.intercept(
        "GET",
        `http://localhost:3000/account-payable/${accountId}`
      ).as("getAccountDetails");

      cy.intercept(
        "GET",
        `http://localhost:3000/account-payable-installments/by-account-payable/${accountId}`
      ).as("getAccountInstallments");

      cy.getDataCy(`button-edit-accountPayable-${accountId}`).click();

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
    cy.visit("/accounts-payable");

    cy.intercept(
      "GET",
      "http://localhost:3000/account-payable/search?page=1&overallStatus=PENDING&orderBy=description"
    ).as("getAccountsPayable");

    cy.wait("@getAccountsPayable");

    cy.get('[data-cy^="button-edit-accountPayable-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const accountId = dataCy.split("-").pop();
        cy.wrap(accountId).as("accountId");
      });

    cy.get("@accountId").then((accountId) => {
      cy.intercept(
        "GET",
        `http://localhost:3000/account-payable/${accountId}`
      ).as("getAccountDetails");

      cy.intercept(
        "GET",
        `http://localhost:3000/account-payable-installments/by-account-payable/${accountId}`
      ).as("getAccountInstallments");

      cy.getDataCy(`button-edit-accountPayable-${accountId}`).click();

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
          `http://localhost:3000/account-payable-installments/payment-method/${installmentId}`,
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

        cy.getDataCy("back-accounts-payable-button").click();

        cy.wait("@getAccountsPayable");
      });
    });
  });
});
