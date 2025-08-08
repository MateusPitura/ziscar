import { faker } from "@faker-js/faker";

describe("User", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should disable and user", () => {
    cy.visit("/users");

    cy.get('[data-cy^="button-disable-user-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const userId = dataCy.split("-").pop();
        cy.wrap(userId).as("userId");
      });

    cy.get("@userId").then((userId) => {
      cy.intercept("DELETE", `http://localhost:3000/user/${userId}`, (req) => {
        expect(req.body).to.have.property("archivedAt");
        expect(req.body.archivedAt).to.be.a("string");
      }).as("disableUser");

      cy.get(`[data-cy="button-disable-user-${userId}"]`).click();

      cy.get('[data-cy="dialog-footer-button-primary"]').click();

      cy.get('[data-cy="snackbar-title"]').should("contain", "Usuário");
      cy.get('[data-cy="snackbar-title"]').should(
        "contain",
        "desativado com sucesso"
      );

      cy.wait("@disableUser");
    });
  });

  it("should enable user", () => {
    cy.visit("/users");

    cy.get('[data-cy="button-table-filter"]').click();

    cy.get('[data-cy="form-radio-Inativo"]').check({ force: true });

    cy.get('[data-cy="side-sheet-primary-button"').click();

    cy.get('[data-cy^="button-enable-user-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const userId = dataCy.split("-").pop();
        cy.wrap(userId).as("userId");
      });

    cy.get("@userId").then((userId) => {
      cy.intercept("DELETE", `http://localhost:3000/user/${userId}`, (req) => {
        expect(req.body).to.deep.equal({
          archivedAt: null,
        });
      }).as("enableUser");

      cy.get(`[data-cy="button-enable-user-${userId}"]`).click();

      cy.get('[data-cy="snackbar-title"]').should("contain", "Usuário");
      cy.get('[data-cy="snackbar-title"]').should(
        "contain",
        "ativado com sucesso"
      );

      cy.wait("@enableUser");
    });
  });

  it("should create user without address", () => {
    const fullName = faker.person.fullName();
    const email = faker.internet.email();

    cy.intercept("POST", "http://localhost:3000/user", (req) => {
      expect(req.body).to.deep.equal({
        fullName,
        email,
        phone: null,
        cpf: null,
        roleId: "1",
        address: null,
      });
    }).as("createUser");

    cy.visit("/users");

    cy.get('[data-cy="new-user-button"]').click();

    cy.get('button[type="submit"]').should("be.disabled");

    cy.get('input[name="fullName"]').type(fullName);
    cy.get('input[name="email"]').type(email);

    cy.get('button[type="submit"]').should("be.enabled");

    cy.get('button[type="submit"]').click();

    cy.get('[data-cy="snackbar-title"]').should(
      "have.text",
      "Um email será enviado"
    );
    cy.get('[data-cy="snackbar-description"]').should(
      "have.text",
      "Confira também a caixa de spam"
    );

    cy.wait("@createUser");
  });

  it("should create user without address", () => {
    const fullName = faker.person.fullName();
    const email = faker.internet.email();
    const cep = "65043420";
    const number = "123";

    cy.intercept("POST", "http://localhost:3000/user", (req) => {
      expect(req.body).to.deep.equal({
        fullName,
        email,
        phone: null,
        cpf: null,
        roleId: "1",
        address: {
          cep,
          number,
          street: "Rua Sete",
          neighborhood: "COHEB do Sacavém",
          cityIbgeCode: "2111300",
        },
      });
    }).as("createUser");

    cy.intercept("GET", "https://viacep.com.br/ws/65043-420/json/").as(
      "cepApi"
    );
    cy.intercept(
      "GET",
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados/MA/municipios"
    ).as("citiesAPi");

    cy.visit("/users");

    cy.get('[data-cy="new-user-button"]').click();

    cy.get('button[type="submit"]').should("be.disabled");

    cy.get('input[name="fullName"]').type(fullName);
    cy.get('input[name="email"]').type(email);

    cy.get('[data-cy="button-append-address"]').click();

    cy.get('input[name="address.0.cep"]').type(cep);
    cy.get('input[name="address.0.number"]').type(number);

    cy.get('button[type="submit"]').should("be.enabled");

    cy.wait("@cepApi");
    cy.wait("@citiesAPi");
    cy.get('button[type="submit"]').click();

    cy.get('[data-cy="snackbar-title"]').should(
      "have.text",
      "Um email será enviado"
    );
    cy.get('[data-cy="snackbar-description"]').should(
      "have.text",
      "Confira também a caixa de spam"
    );

    cy.wait("@createUser");
  });

  it("should navigate in user table", () => {
    cy.visit("/users");

    cy.intercept(
      "GET",
      "http://localhost:3000/user?page=1&orderBy=fullName&status=active"
    ).as("getUsersPage1");

    cy.wait("@getUsersPage1");

    cy.get('[data-cy="table-navigate-before"]').should("be.disabled");

    cy.intercept(
      "GET",
      "http://localhost:3000/user?page=2&orderBy=fullName&status=active"
    ).as("getUsersPage2");

    cy.get('[data-cy="table-navigate-next"]').click();

    cy.wait("@getUsersPage2");

    cy.get('[data-cy="table-navigate-before"]').should("be.enabled");

    cy.get('[data-cy="table-navigate-before"]').click();

    cy.get('[data-cy="table-navigate-before"]').should("be.disabled");
  });
});
