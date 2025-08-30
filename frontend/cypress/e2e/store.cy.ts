import { faker } from "@faker-js/faker";
import { generateCnpj } from "../../../shared/src/test/generateCnpj";

function removeStoreAddress(storeId: string) {
  cy.visit(`/stores/edit/${storeId}`);

  cy.intercept("PATCH", `http://localhost:3000/store/${storeId}`, (req) => {
    if (!req.body.address.remove) return;

    expect(req.body).to.deep.equal({
      address: {
        remove: true,
      },
    });
  }).as("removeAddress");

  cy.wait("@getStore");
  cy.wait("@cepApi");
  cy.wait("@citiesAPi");

  cy.get('button[type="submit"]').should("be.disabled");

  cy.get('[data-cy="button-remove-address"]').click();

  cy.get('button[type="submit"]').should("be.enabled");

  cy.get('button[type="submit"]').click();

  cy.wait("@removeAddress");

  cy.get('[data-cy="snackbar-title"]').should("contain", "Loja");
  cy.get('[data-cy="snackbar-title"]').should(
    "contain",
    "atualizada com sucesso"
  );

  cy.wait("@getStoresPage");
}

describe("Store", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should disable store", () => {
    cy.visit("/stores");

    cy.get('[data-cy^="button-disable-store-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const storeId = dataCy.split("-").pop();
        cy.wrap(storeId).as("storeId");
      });

    cy.get("@storeId").then((storeId) => {
      cy.intercept(
        "DELETE",
        `http://localhost:3000/store/${storeId}`,
        (req) => {
          expect(req.body).to.have.property("archivedAt");
          expect(req.body.archivedAt).to.be.a("string");
        }
      ).as("disableStore");

      cy.get(`[data-cy="button-disable-store-${storeId}"]`).click();

      cy.get('[data-cy="dialog-footer-button-primary"]').click();

      cy.get('[data-cy="snackbar-title"]').should("contain", "Loja");
      cy.get('[data-cy="snackbar-title"]').should(
        "contain",
        "desativada com sucesso"
      );

      cy.wait("@disableStore");
    });
  });

  it("should enable store", () => {
    cy.visit("/stores");

    cy.get('[data-cy="button-table-filter"]').click();

    cy.get('[data-cy="form-radio-Inativo"]').check({ force: true });

    cy.get('[data-cy="side-sheet-primary-button"').click();

    cy.get('[data-cy^="button-enable-store-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const storeId = dataCy.split("-").pop();
        cy.wrap(storeId).as("storeId");
      });

    cy.get("@storeId").then((storeId) => {
      cy.intercept(
        "DELETE",
        `http://localhost:3000/store/${storeId}`,
        (req) => {
          expect(req.body).to.deep.equal({
            archivedAt: null,
          });
        }
      ).as("enableStore");

      cy.get(`[data-cy="button-enable-store-${storeId}"]`).click();

      cy.get('[data-cy="snackbar-title"]').should("contain", "Loja");
      cy.get('[data-cy="snackbar-title"]').should(
        "contain",
        "ativada com sucesso"
      );

      cy.wait("@enableStore");
    });
  });

  it("should navigate in store table", () => {
    cy.visit("/stores");

    cy.intercept(
      "GET",
      "http://localhost:3000/store?page=1&status=active&orderBy=name"
    ).as("getStoresPage1");

    cy.wait("@getStoresPage1");

    cy.get('[data-cy="table-navigate-before"]').should("be.disabled");

    cy.intercept(
      "GET",
      "http://localhost:3000/store?page=2&status=active&orderBy=name"
    ).as("getStoresPage2");

    cy.get('[data-cy="table-navigate-next"]').click();

    cy.wait("@getStoresPage2");

    cy.get('[data-cy="table-navigate-before"]').should("be.enabled");

    cy.get('[data-cy="table-navigate-before"]').click();

    cy.get('[data-cy="table-navigate-before"]').should("be.disabled");
  });

  it("should edit store, add address, edit address and remove address", () => {
    const name = faker.company.name();
    const cep = "65043420";
    const number = faker.string.numeric(3);

    cy.intercept(
      "GET",
      "http://localhost:3000/store?page=1&status=active&orderBy=name"
    ).as("getStoresPage");

    cy.intercept("GET", "https://viacep.com.br/ws/65043-420/json/").as(
      "cepApi"
    );
    cy.intercept(
      "GET",
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados/MA/municipios"
    ).as("citiesAPi");

    cy.visit("/stores");

    cy.get('[data-cy^="button-edit-store-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const storeId = dataCy.split("-").pop();
        cy.wrap(storeId).as("storeId");
      });

    cy.get("@storeId").then((storeId) => {
      cy.intercept("GET", `http://localhost:3000/store/${storeId}`).as(
        "getStore"
      );

      // Edit
      cy.intercept("PATCH", `http://localhost:3000/store/${storeId}`, (req) => {
        if (!req.body.name) return;

        expect(req.body).to.deep.equal({
          name,
        });
      }).as("editStore");

      cy.get(`[data-cy="button-edit-store-${storeId}"]`).click();

      cy.wait("@getStore");

      cy.get('button[type="submit"]').should("be.disabled");

      cy.get('input[name="name"]').clear().type(name);

      cy.get('button[type="submit"]').should("be.enabled");

      cy.get('button[type="submit"]').click();

      cy.wait("@editStore");

      cy.get('[data-cy="snackbar-title"]').should("contain", "Loja");
      cy.get('[data-cy="snackbar-title"]').should(
        "contain",
        "atualizada com sucesso"
      );

      cy.wait("@getStoresPage");

      // Add address
      cy.visit(`/stores/edit/${storeId}`);

      cy.intercept("PATCH", `http://localhost:3000/store/${storeId}`, (req) => {
        if (!req.body.address.add) return;

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
      }).as("addAddress");

      cy.wait("@getStore");

      cy.get('button[type="submit"]').should("be.disabled");

      cy.get('[data-cy="button-append-address"]').click();

      cy.get('input[name="address.0.cep"]').type(cep);
      cy.get('input[name="address.0.number"]').type(number);

      cy.get('button[type="submit"]').should("be.enabled");

      cy.wait("@cepApi");
      cy.wait("@citiesAPi");
      cy.get('button[type="submit"]').click();

      cy.wait("@addAddress");

      cy.get('[data-cy="snackbar-title"]').should("contain", "Loja");
      cy.get('[data-cy="snackbar-title"]').should(
        "contain",
        "atualizada com sucesso"
      );

      cy.wait("@getStoresPage");

      // Edit address
      cy.visit(`/stores/edit/${storeId}`);

      cy.intercept("PATCH", `http://localhost:3000/store/${storeId}`, (req) => {
        if (!req.body.address.update) return;

        expect(req.body).to.deep.equal({
          address: {
            update: {
              cep,
              number: "1234",
              street: "Rua Sete",
              neighborhood: "COHEB do Sacavém",
              cityIbgeCode: "2111300",
            },
          },
        });
      }).as("updateAddress");

      cy.wait("@getStore");

      cy.get('button[type="submit"]').should("be.disabled");

      cy.get('input[name="address.0.number"]').clear().type("1234");

      cy.get('button[type="submit"]').should("be.enabled");

      cy.wait("@cepApi");
      cy.wait("@citiesAPi");
      cy.get('button[type="submit"]').click();

      cy.wait("@updateAddress");

      cy.get('[data-cy="snackbar-title"]').should("contain", "Loja");
      cy.get('[data-cy="snackbar-title"]').should(
        "contain",
        "atualizada com sucesso"
      );

      cy.wait("@getStoresPage");

      // Remove address
      removeStoreAddress(storeId as unknown as string);
    });
  });

  it("should filter store by start date", () => {
    cy.visit("/stores");

    cy.get('[data-cy="button-table-filter"]').click();

    cy.get('input[name="startDate"]').type("2000-01-01");

    cy.intercept(
      "GET",
      "http://localhost:3000/store?page=1&status=active&startDate=2000-01-01&orderBy=name"
    ).as("getStoresPage");

    cy.get('[data-cy="side-sheet-primary-button"').click();

    cy.wait("@getStoresPage");
  });

  it("should not allow end date before start date", () => {
    cy.visit("/stores");

    cy.get('[data-cy="button-table-filter"]').click();

    cy.get('input[name="startDate"]').type("2010-01-01");
    cy.get('input[name="endDate"]').type("2000-01-01");

    cy.get('[data-cy="side-sheet-primary-button"').click();

    cy.get('[data-cy="input-error-endDate"]').should(
      "contain",
      "Data final deve ser após a data inicial"
    );
  });

  it("should create store without address", () => {
    const name = faker.company.name();
    const cnpj = generateCnpj();

    cy.intercept("POST", "http://localhost:3000/store", (req) => {
      expect(req.body).to.deep.equal({
        name,
        cnpj,
        email: null,
        phone: null,
        address: null,
      });
    }).as("createStore");

    cy.visit("/stores");

    cy.get('[data-cy="new-store-button"]').click();

    cy.get('button[type="submit"]').should("be.disabled");

    cy.get('input[name="name"]').type(name);
    cy.get('input[name="cnpj"]').type(cnpj);

    cy.get('button[type="submit"]').should("be.enabled");

    cy.get('button[type="submit"]').click();

    cy.get('[data-cy="snackbar-title"]').should(
      "contain",
      "Loja criada com sucesso"
    );

    cy.wait("@createStore").then((interception) => {
      const responseBody = interception.response.body;

      const storeId = responseBody.id;

      cy.intercept("GET", `http://localhost:3000/store/${storeId}`).as(
        "getStore"
      );

      cy.visit(`/stores/edit/${storeId}`);

      cy.wait("@getStore");
    });
  });

  it("should create store with address", () => {
    const name = faker.company.name();
    const cnpj = generateCnpj();
    const cep = "65043420";
    const number = "123";

    cy.intercept("POST", "http://localhost:3000/store", (req) => {
      expect(req.body).to.deep.equal({
        name,
        cnpj,
        email: null,
        phone: null,
        address: {
          cep,
          number,
          street: "Rua Sete",
          neighborhood: "COHEB do Sacavém",
          cityIbgeCode: "2111300",
        },
      });
    }).as("createStore");

    cy.intercept("GET", "https://viacep.com.br/ws/65043-420/json/").as(
      "cepApi"
    );
    cy.intercept(
      "GET",
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados/MA/municipios"
    ).as("citiesAPi");

    cy.visit("/stores");

    cy.get('[data-cy="new-store-button"]').click();

    cy.get('button[type="submit"]').should("be.disabled");

    cy.get('input[name="name"]').type(name);
    cy.get('input[name="cnpj"]').type(cnpj);

    cy.get('[data-cy="button-append-address"]').click();

    cy.get('input[name="address.0.cep"]').type(cep);
    cy.get('input[name="address.0.number"]').type(number);

    cy.get('button[type="submit"]').should("be.enabled");

    cy.wait("@cepApi");
    cy.wait("@citiesAPi");
    cy.get('button[type="submit"]').click();

    cy.wait("@createStore");

    cy.get('[data-cy="snackbar-title"]').should(
      "contain",
      "Loja criada com sucesso"
    );
  });
});
