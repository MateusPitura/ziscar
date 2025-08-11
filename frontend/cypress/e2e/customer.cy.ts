import { faker } from "@faker-js/faker";
import { generateCpf } from "../../../shared/src/test/generateCpf";

function removeCustomerAddress(customerId: string) {
  cy.visit(`/customers/edit/${customerId}`);

  cy.intercept("PATCH", `http://localhost:3000/customer/${customerId}`, (req) => {
    if (!req.body.address.remove) return;

    expect(req.body).to.deep.equal({
      address: {
        remove: true,
      },
    });
  }).as("removeAddress");

  cy.wait("@getCustomer");
  cy.wait("@cepApi");
  cy.wait("@citiesAPi");

  cy.get('button[type="submit"]').should("be.disabled");

  cy.get('[data-cy="button-remove-address"]').click();

  cy.get('button[type="submit"]').should("be.enabled");

  cy.get('button[type="submit"]').click();

  cy.wait("@removeAddress");

  cy.get('[data-cy="snackbar-title"]').should("contain", "Cliente");
  cy.get('[data-cy="snackbar-title"]').should(
    "contain",
    "atualizado com sucesso"
  );

  cy.wait("@getCustomersPage");
}

describe("Customer", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should disable customer", () => {
    cy.visit("/customers");

    cy.get('[data-cy^="button-disable-customer-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const customerId = dataCy.split("-").pop();
        cy.wrap(customerId).as("customerId");
      });

    cy.get("@customerId").then((customerId) => {
      cy.intercept(
        "DELETE",
        `http://localhost:3000/customer/${customerId}`,
        (req) => {
          expect(req.body).to.have.property("archivedAt");
          expect(req.body.archivedAt).to.be.a("string");
        }
      ).as("disableCustomer");

      cy.get(`[data-cy="button-disable-customer-${customerId}"]`).click();

      cy.get('[data-cy="dialog-footer-button-primary"]').click();

      cy.get('[data-cy="snackbar-title"]').should("contain", "Cliente");
      cy.get('[data-cy="snackbar-title"]').should(
        "contain",
        "desativado com sucesso"
      );

      cy.wait("@disableCustomer");
    });
  });

  it("should enable customer", () => {
    cy.visit("/customers");

    cy.get('[data-cy="button-table-filter"]').click();

    cy.get('[data-cy="form-radio-Inativo"]').check({ force: true });

    cy.get('[data-cy="side-sheet-primary-button"').click();

    cy.get('[data-cy^="button-enable-customer-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const customerId = dataCy.split("-").pop();
        cy.wrap(customerId).as("customerId");
      });

    cy.get("@customerId").then((customerId) => {
      cy.intercept(
        "DELETE",
        `http://localhost:3000/customer/${customerId}`,
        (req) => {
          expect(req.body).to.deep.equal({
            archivedAt: null,
          });
        }
      ).as("enableCustomer");

      cy.get(`[data-cy="button-enable-customer-${customerId}"]`).click();

      cy.get('[data-cy="snackbar-title"]').should("contain", "Cliente");
      cy.get('[data-cy="snackbar-title"]').should(
        "contain",
        "ativado com sucesso"
      );

      cy.wait("@enableCustomer");
    });
  });

  it("should create customer without address", () => {
    const fullName = faker.person.fullName();
    const cpf = generateCpf();

    cy.intercept("POST", "http://localhost:3000/customer", (req) => {
      expect(req.body).to.deep.equal({
        fullName,
        cpf,
        email: null,
        phone: null,
        address: null,
      });
    }).as("createCustomer");

    cy.visit("/customers");

    cy.get('[data-cy="new-customer-button"]').click();

    cy.get('button[type="submit"]').should("be.disabled");

    cy.get('input[name="fullName"]').type(fullName);
    cy.get('input[name="cpf"]').type(cpf);

    cy.get('button[type="submit"]').should("be.enabled");

    cy.get('button[type="submit"]').click();

    cy.wait("@createCustomer");
  });

  it("should create customer with address", () => {
    const fullName = faker.person.fullName();
    const cpf = generateCpf();
    const cep = "65043420";
    const number = "123";

    cy.intercept("POST", "http://localhost:3000/customer", (req) => {
      expect(req.body).to.deep.equal({
        fullName,
        cpf,
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
    }).as("createCustomer");

    cy.intercept("GET", "https://viacep.com.br/ws/65043-420/json/").as(
      "cepApi"
    );
    cy.intercept(
      "GET",
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados/MA/municipios"
    ).as("citiesAPi");

    cy.visit("/customers");

    cy.get('[data-cy="new-customer-button"]').click();

    cy.get('button[type="submit"]').should("be.disabled");

    cy.get('input[name="fullName"]').type(fullName);
    cy.get('input[name="cpf"]').type(cpf);

    cy.get('[data-cy="button-append-address"]').click();

    cy.get('input[name="address.0.cep"]').type(cep);
    cy.get('input[name="address.0.number"]').type(number);

    cy.get('button[type="submit"]').should("be.enabled");

    cy.wait("@cepApi");
    cy.wait("@citiesAPi");
    cy.get('button[type="submit"]').click();

    cy.wait("@createCustomer");
  });

  it("should navigate in customer table", () => {
    cy.visit("/customers");

    cy.intercept(
      "GET",
      "http://localhost:3000/customer?page=1&orderBy=fullName&status=active"
    ).as("getCustomersPage1");

    cy.wait("@getCustomersPage1");

    cy.get('[data-cy="table-navigate-before"]').should("be.disabled");

    cy.intercept(
      "GET",
      "http://localhost:3000/customer?page=2&orderBy=fullName&status=active"
    ).as("getCustomersPage2");

    cy.get('[data-cy="table-navigate-next"]').click();

    cy.wait("@getCustomersPage2");

    cy.get('[data-cy="table-navigate-before"]').should("be.enabled");

    cy.get('[data-cy="table-navigate-before"]').click();

    cy.get('[data-cy="table-navigate-before"]').should("be.disabled");
  });

  it("should edit customer, add address, edit address and remove address", () => {
    const fullName = faker.person.fullName();
    const cep = "65043420";
    const number = faker.string.numeric(3);

    cy.intercept(
      "GET",
      "http://localhost:3000/customer?page=1&orderBy=fullName&status=active"
    ).as("getCustomersPage");

    cy.intercept("GET", "https://viacep.com.br/ws/65043-420/json/").as(
      "cepApi"
    );
    cy.intercept(
      "GET",
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados/MA/municipios"
    ).as("citiesAPi");

    cy.visit("/customers");

    cy.get('[data-cy^="button-edit-customer-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const customerId = dataCy.split("-").pop();
        cy.wrap(customerId).as("customerId");
      });

    cy.get("@customerId").then((customerId) => {
      cy.intercept("GET", `http://localhost:3000/customer/${customerId}`).as(
        "getCustomer"
      );

      cy.visit(`/customers/edit/${customerId}`);
      cy.get("body").then(($body) => {
        if ($body.find('[data-cy="button-remove-address"]').length) {
          removeCustomerAddress(customerId as unknown as string);
        }
      });

      cy.visit("/customers");

      // Edit
      cy.intercept("PATCH", `http://localhost:3000/customer/${customerId}`, (req) => {
        if (!req.body.fullName) return;

        expect(req.body).to.deep.equal({
          fullName,
        });
      }).as("editCustomer");

      cy.get(`[data-cy="button-edit-customer-${customerId}"]`).click();

      cy.wait("@getCustomer");

      cy.get('button[type="submit"]').should("be.disabled");

      cy.get('input[name="fullName"]').clear().type(fullName);

      cy.get('button[type="submit"]').should("be.enabled");

      cy.get('button[type="submit"]').click();

      cy.wait("@editCustomer");

      cy.get('[data-cy="snackbar-title"]').should("contain", "Cliente");
      cy.get('[data-cy="snackbar-title"]').should(
        "contain",
        "atualizado com sucesso"
      );

      cy.wait("@getCustomersPage");

      // Add address
      cy.visit(`/customers/edit/${customerId}`);

      cy.intercept("PATCH", `http://localhost:3000/customer/${customerId}`, (req) => {
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

      cy.wait("@getCustomer");

      cy.get('button[type="submit"]').should("be.disabled");

      cy.get('[data-cy="button-append-address"]').click();

      cy.get('input[name="address.0.cep"]').type(cep);
      cy.get('input[name="address.0.number"]').type(number);

      cy.get('button[type="submit"]').should("be.enabled");

      cy.wait("@cepApi");
      cy.wait("@citiesAPi");
      cy.get('button[type="submit"]').click();

      cy.wait("@addAddress");

      cy.get('[data-cy="snackbar-title"]').should("contain", "Cliente");
      cy.get('[data-cy="snackbar-title"]').should(
        "contain",
        "atualizado com sucesso"
      );

      cy.wait("@getCustomersPage");

      // Edit address
      cy.visit(`/customers/edit/${customerId}`);

      cy.intercept("PATCH", `http://localhost:3000/customer/${customerId}`, (req) => {
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

      cy.wait("@getCustomer");

      cy.get('button[type="submit"]').should("be.disabled");

      cy.get('input[name="address.0.number"]').clear().type("1234");

      cy.get('button[type="submit"]').should("be.enabled");

      cy.wait("@cepApi");
      cy.wait("@citiesAPi");
      cy.get('button[type="submit"]').click();

      cy.wait("@updateAddress");

      cy.get('[data-cy="snackbar-title"]').should("contain", "Cliente");
      cy.get('[data-cy="snackbar-title"]').should(
        "contain",
        "atualizado com sucesso"
      );

      cy.wait("@getCustomersPage");

      // Remove address
      removeCustomerAddress(customerId as unknown as string);
    });
  });

  it("should filter customer by start date", () => {
    cy.visit("/customers");

    cy.get('[data-cy="button-table-filter"]').click();

    cy.get('input[name="startDate"]').type("2000-01-01");

    cy.intercept(
      "GET",
      "http://localhost:3000/customer?page=1&orderBy=fullName&status=active&startDate=2000-01-01"
    ).as("getCustomersPage");

    cy.get('[data-cy="side-sheet-primary-button"').click();

    cy.wait("@getCustomersPage");
  });

  it("should not allow end date before start date", () => {
    cy.visit("/customers");

    cy.get('[data-cy="button-table-filter"]').click();

    cy.get('input[name="startDate"]').type("2010-01-01");
    cy.get('input[name="endDate"]').type("2000-01-01");

    cy.get('[data-cy="side-sheet-primary-button"').click();

    cy.get('[data-cy="input-error-endDate"]').should(
      "contain",
      "Data final deve ser após a data inicial"
    );
  });
});
