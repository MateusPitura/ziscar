import { faker } from "@faker-js/faker";

describe("Profile", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should append address, validate CEP and number on submit, remove address and update only full name", () => {
    const fullName = faker.person.fullName();

    cy.intercept("PATCH", "http://localhost:3000/profile", (req) => {
      expect(req.body).to.deep.equal({
        fullName,
      });
    }).as("updateFullName");

    cy.visit("/profile");

    cy.get('button[type="submit"]').should("be.disabled");

    cy.get('[data-cy="button-append-address"]').click();

    cy.get('button[type="submit"]').click();

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
    const cep = "65043420";
    const number = "123";

    cy.intercept("PATCH", "http://localhost:3000/profile", (req) => {
      expect(req.body).to.deep.equal({
        address: {
          add: {
            cep,
            number,
            street: "Rua Sete",
            neighborhood: "COHEB do Sacavém",
            cityIbgeCode: "2111300",
          },
        },
      });
    }).as("createAddress");

    cy.intercept("GET", "https://viacep.com.br/ws/65043-420/json/").as(
      "cepApi"
    );
    cy.intercept(
      "GET",
      "http://localhost:3000/city/MA"
    ).as("citiesAPi");

    cy.visit("/profile");

    cy.get('button[type="submit"]').should("be.disabled");

    cy.get('[data-cy="button-append-address"]').click();

    cy.get('button[type="submit"]').should("be.enabled");

    cy.get('input[name="address.0.cep"]').type(cep);
    cy.get('input[name="address.0.number"]').type(number);

    cy.wait("@cepApi");
    cy.wait("@citiesAPi");
    cy.get('button[type="submit"]').click();

    cy.get('[data-cy="snackbar-title"]').should(
      "have.text",
      "Perfil atualizado com sucesso"
    );

    cy.wait("@createAddress");
  });

  it("should update address", () => {
    const cep = "65043420";
    const number = faker.string.numeric(3);

    cy.intercept("PATCH", "http://localhost:3000/profile", (req) => {
      expect(req.body).to.deep.equal({
        address: {
          update: {
            cep,
            number,
            street: "Rua Sete",
            neighborhood: "COHEB do Sacavém",
            cityIbgeCode: "2111300",
          },
        },
      });
    }).as("updateAddress");

    cy.intercept("GET", "https://viacep.com.br/ws/65043-420/json/").as(
      "cepApi"
    );
    cy.intercept(
      "GET",
      "http://localhost:3000/city/MA"
    ).as("citiesAPi");

    cy.visit("/profile");

    cy.get('button[type="submit"]').should("be.disabled");

    cy.get('input[name="address.0.number"]').clear().type(number);

    cy.get('button[type="submit"]').should("be.enabled");

    cy.wait("@cepApi");
    cy.wait("@citiesAPi");
    cy.get('button[type="submit"]').click();

    cy.wait("@updateAddress");

    cy.get('[data-cy="snackbar-title"]').should(
      "have.text",
      "Perfil atualizado com sucesso"
    );
  });

  it("should delete address", () => {
    cy.intercept("PATCH", "http://localhost:3000/profile", (req) => {
      expect(req.body).to.deep.equal({
        address: {
          remove: true,
        },
      });
    }).as("removeAddress");

    cy.intercept("GET", "https://viacep.com.br/ws/65043-420/json/").as(
      "cepApi"
    );
    cy.intercept(
      "GET",
      "http://localhost:3000/city/MA"
    ).as("citiesAPi");

    cy.visit("/profile");

    cy.wait("@cepApi");
    cy.wait("@citiesAPi");

    cy.get('button[type="submit"]').should("be.disabled");

    cy.get('[data-cy="button-remove-address"]').click();

    cy.get('button[type="submit"]').should("be.enabled");

    cy.get('button[type="submit"]').click();

    cy.wait("@removeAddress");

    cy.get('[data-cy="snackbar-title"]').should(
      "have.text",
      "Perfil atualizado com sucesso"
    );
  });

  it("should open request change password modal", () => {
    cy.intercept(
      "POST",
      "http://localhost:3000/auth/request-change-password"
    ).as("requestChangePassword");

    cy.visit("/profile");

    cy.get('[data-cy="request-change-password-button"]').click();

    cy.get('button[type="submit"]').eq(1).click();

    cy.get('[data-cy="snackbar-title"]').should(
      "have.text",
      "Um email será enviado"
    );
    cy.get('[data-cy="snackbar-description"]').should(
      "have.text",
      "Confira também a caixa de spam"
    );

    cy.wait("@requestChangePassword");
  });
});
