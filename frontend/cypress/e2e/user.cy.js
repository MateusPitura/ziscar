import { faker } from "@faker-js/faker";

describe("User", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should disable user", () => {
    const fullName = faker.person.fullName();

    cy.intercept("DELETE", "http://localhost:3000/user/23", (req) => {
      expect(req.body).to.have.property("archivedAt");
      expect(req.body.archivedAt).to.be.a("string");
    }).as("disableUser");

    cy.visit("/users");

    cy.get('[data-cy="button-disable-user-23"]').click();

    cy.get('[data-cy="dialog-footer-button-primary"]').click();

    cy.get('[data-cy="snackbar-title"]').should("contain", "Usuário");
    cy.get('[data-cy="snackbar-title"]').should(
      "contain",
      "desativado com sucesso"
    );

    cy.wait("@disableUser");
  });

  it("should enable user", () => {
    const fullName = faker.person.fullName();

    cy.intercept("DELETE", "http://localhost:3000/user/23", (req) => {
      expect(req.body).to.deep.equal({
        archivedAt: null,
      });
    }).as("enableUser");

    cy.visit("/users");

    cy.get('[data-cy="button-table-filter"]').click();

    cy.get('[data-cy="form-radio-Inativo"]').check({ force: true });

    cy.get('[data-cy="side-sheet-primary-button"').click();

    cy.get('[data-cy="button-enable-user-23"]').click();

    cy.get('[data-cy="snackbar-title"]').should("contain", "Usuário");
    cy.get('[data-cy="snackbar-title"]').should(
      "contain",
      "ativado com sucesso"
    );

    cy.wait("@enableUser");
  });
});
