import { faker } from "@faker-js/faker";

describe("Should update address successfully", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should delete address", () => {
    cy.intercept("PATCH", "http://localhost:3000/profile", (req) => {
      expect(req.body).to.deep.equal({
        address: {
          remove: true,
        },
      });
    }).as("removeAddress");

    cy.visit("/profile/edit");

    cy.get('button[type="submit"]').should("be.disabled");

    cy.get('[data-cy="button-remove-address"]').click();

    cy.get('button[type="submit"]').should("be.enabled");

    cy.get('button[type="submit"]').click();

    cy.get('[data-cy="snackbar-title"]').should(
      "have.text",
      "Perfil atualizado com sucesso"
    );

    cy.wait("@removeAddress");
  });

  it("should append address, validate CEP and number on submit, remove address and update only full name", () => {
    const fullName = faker.person.fullName();

    cy.intercept("PATCH", "http://localhost:3000/profile", (req) => {
      expect(req.body).to.deep.equal({
        fullName,
      });
    }).as("updateFullName");

    cy.visit("/profile/edit");

    cy.get('button[type="submit"]').should("be.disabled");

    cy.get('[data-cy="button-append-address"]').click();

    cy.get('button[type="submit"]').click();

    cy.get('[data-cy="input-error-address.0.cep"]').should(
      "have.text",
      "Campo obrigatório"
    );
    cy.get('[data-cy="input-error-address.0.cep"]').should(
      "have.text",
      "Campo obrigatório"
    );

    cy.get('[data-cy="button-remove-address"]').click();

    cy.get('button[type="submit"]').should("be.disabled");

    cy.get('input[name="fullName"]').clear().type(fullName);

    cy.get('button[type="submit"]').should("be.enabled");

    cy.get('button[type="submit"]').click();

    cy.get('[data-cy="snackbar-title"]').should(
      "have.text",
      "Perfil atualizado com sucesso"
    );

    cy.wait("@updateFullName");
  });

  it("should create address", () => {
    cy.intercept("PATCH", "http://localhost:3000/profile", (req) => {
      expect(req.body).to.deep.equal({
        address: {
          add: {
            cep: "65043420",
            number: "123",
            street: null,
            neighborhood: null,
            city: null,
            state: null,
            complement: null,
          },
        },
      });
    }).as("createAddress");

    cy.visit("/profile/edit");

    cy.get('button[type="submit"]').should("be.disabled");

    cy.get('[data-cy="button-append-address"]').click();

    cy.get('button[type="submit"]').should("be.enabled");

    cy.get('input[name="address.0.cep"]').type("65043420");
    cy.get('input[name="address.0.number"]').type("123");

    cy.get('button[type="submit"]').click();

    cy.get('[data-cy="snackbar-title"]').should(
      "have.text",
      "Perfil atualizado com sucesso"
    );

    cy.wait("@createAddress");
  });

  it("should update address", () => {
    const number = faker.string.numeric(3);

    cy.intercept("PATCH", "http://localhost:3000/profile", (req) => {
      expect(req.body).to.deep.equal({
        address: {
          update: {
            cep: "65043420",
            number,
            street: null,
            neighborhood: null,
            city: null,
            state: null,
            complement: null,
          },
        },
      });
    }).as("updateAddress");

    cy.visit("/profile/edit");

    cy.get('button[type="submit"]').should("be.disabled");

    cy.get('input[name="address.0.number"]').clear().type(number);

    cy.get('button[type="submit"]').should("be.enabled");

    cy.get('button[type="submit"]').click();

    cy.get('[data-cy="snackbar-title"]').should(
      "have.text",
      "Perfil atualizado com sucesso"
    );

    cy.wait("@updateAddress");
  });
});
