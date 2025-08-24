import { faker } from "@faker-js/faker";

function removeUserAddress(userId: string) {
  cy.visit(`/users/edit/${userId}`);

  cy.intercept("PATCH", `http://localhost:3000/user/${userId}`, (req) => {
    if (!req.body.address.remove) return;

    expect(req.body).to.deep.equal({
      address: {
        remove: true,
      },
    });
  }).as("removeAddress");

  cy.wait("@getUser");
  cy.wait("@cepApi");
  cy.wait("@citiesAPi");

  cy.get('button[type="submit"]').should("be.disabled");
  cy.get('[data-cy="button-remove-address"]').click();
  cy.get('button[type="submit"]').should("be.enabled");
  cy.get('button[type="submit"]').click();
  cy.wait("@removeAddress");

  cy.get('[data-cy="snackbar-title"]').should("contain", "Usuário");
  cy.get('[data-cy="snackbar-title"]').should(
    "contain",
    "atualizado com sucesso"
  );
  cy.wait("@getUsersPage");
}

describe("User", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should disable user", () => {
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

    cy.wait("@createUser").then((interception) => {
      const responseBody = interception.response.body;

      const userId = responseBody.id;

      cy.intercept("GET", `http://localhost:3000/user/${userId}`).as("getUser");

      cy.visit(`/users/edit/${userId}`);

       cy.wait("@getUser")
    });
  });

  it("should create user with address", () => {
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
      "http://localhost:3000/user?page=1&status=active&orderBy=fullName"
    ).as("getUsersPage1");

    cy.wait("@getUsersPage1");

    cy.get('[data-cy="table-navigate-before"]').should("be.disabled");

    cy.intercept(
      "GET",
      "http://localhost:3000/user?page=2&status=active&orderBy=fullName"
    ).as("getUsersPage2");

    cy.get('[data-cy="table-navigate-next"]').click();

    cy.wait("@getUsersPage2");

    cy.get('[data-cy="table-navigate-before"]').should("be.enabled");

    cy.get('[data-cy="table-navigate-before"]').click();

    cy.get('[data-cy="table-navigate-before"]').should("be.disabled");
  });

  it("should generate user report", () => {
    cy.visit("/users");

    cy.intercept(
      "GET",
      "http://localhost:3000/user?page=1&status=active&orderBy=fullName"
    ).as("getUsersPage1");

    cy.intercept(
      "GET",
      "http://localhost:3000/user?page=1&status=active&orderBy=fullName"
    ).as("getUsersPage2");

    cy.wait("@getUsersPage1");

    cy.get('[data-cy="export-button"]').click();

    cy.get('[data-cy="snackbar-title"]').should(
      "contain",
      "O PDF está sendo gerado"
    );

    cy.wait("@getUsersPage2");

    cy.task("downloads:folder").then((downloadsFolder) => {
      cy.task("list:files", downloadsFolder).then((files: string[]) => {
        const pdfFile = files.find(
          (file) =>
            file.startsWith("Relatório Usuários") && file.endsWith(".pdf")
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

  it("should edit user, add address, edit address and remove address", () => {
    const fullName = faker.person.fullName();
    const cep = "65043420";
    const number = faker.string.numeric(3);

    cy.intercept(
      "GET",
      "http://localhost:3000/user?page=1&status=active&orderBy=fullName"
    ).as("getUsersPage");

    cy.intercept("GET", "https://viacep.com.br/ws/65043-420/json/").as(
      "cepApi"
    );
    cy.intercept(
      "GET",
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados/MA/municipios"
    ).as("citiesAPi");

    cy.visit("/users");

    cy.get('[data-cy^="button-edit-user-"]')
      .first()
      .invoke("attr", "data-cy")
      .then((dataCy) => {
        const userId = dataCy.split("-").pop();
        cy.wrap(userId).as("userId");
      });

    cy.get("@userId").then((userId) => {
      cy.intercept("GET", `http://localhost:3000/user/${userId}`).as("getUser");

      cy.visit(`/users/edit/${userId}`);
      cy.get("body").then(($body) => {
        if ($body.find('[data-cy="button-remove-address"]').length) {
          removeUserAddress(userId as unknown as string);
        }
      });

      cy.visit("/users");

      // Edit
      cy.intercept("PATCH", `http://localhost:3000/user/${userId}`, (req) => {
        if (!req.body.fullName) return;

        expect(req.body).to.deep.equal({
          fullName,
        });
      }).as("editUser");

      cy.get(`[data-cy="button-edit-user-${userId}"]`).click();

      cy.wait("@getUser");

      cy.get('button[type="submit"]').should("be.disabled");

      cy.get('input[name="fullName"]').clear().type(fullName);

      cy.get('button[type="submit"]').should("be.enabled");

      cy.get('button[type="submit"]').click();

      cy.wait("@editUser");

      cy.get('[data-cy="snackbar-title"]').should("contain", "Usuário");
      cy.get('[data-cy="snackbar-title"]').should(
        "contain",
        "atualizado com sucesso"
      );

      cy.wait("@getUsersPage");

      // Add address
      cy.visit(`/users/edit/${userId}`);

      cy.intercept("PATCH", `http://localhost:3000/user/${userId}`, (req) => {
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

      cy.wait("@getUser");

      cy.get('button[type="submit"]').should("be.disabled");

      cy.get('[data-cy="button-append-address"]').click();

      cy.get('input[name="address.0.cep"]').type(cep);
      cy.get('input[name="address.0.number"]').type(number);

      cy.get('button[type="submit"]').should("be.enabled");

      cy.wait("@cepApi");
      cy.wait("@citiesAPi");
      cy.get('button[type="submit"]').click();

      cy.wait("@addAddress");

      cy.get('[data-cy="snackbar-title"]').should("contain", "Usuário");
      cy.get('[data-cy="snackbar-title"]').should(
        "contain",
        "atualizado com sucesso"
      );

      cy.wait("@getUsersPage");

      // Edit address
      cy.visit(`/users/edit/${userId}`);

      cy.intercept("PATCH", `http://localhost:3000/user/${userId}`, (req) => {
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

      cy.wait("@getUser");

      cy.get('button[type="submit"]').should("be.disabled");

      cy.get('input[name="address.0.number"]').clear().type("1234");

      cy.get('button[type="submit"]').should("be.enabled");

      cy.wait("@cepApi");
      cy.wait("@citiesAPi");
      cy.get('button[type="submit"]').click();

      cy.wait("@updateAddress");

      cy.get('[data-cy="snackbar-title"]').should("contain", "Usuário");
      cy.get('[data-cy="snackbar-title"]').should(
        "contain",
        "atualizado com sucesso"
      );

      cy.wait("@getUsersPage");

      // Remove address
      removeUserAddress(userId as unknown as string);
    });
  });

  it("should filter user by start date", () => {
    cy.visit("/users");

    cy.get('[data-cy="button-table-filter"]').click();

    cy.get('input[name="startDate"]').type("2000-01-01");

    cy.intercept(
      "GET",
      "http://localhost:3000/user?page=1&status=active&startDate=2000-01-01&orderBy=fullName"
    ).as("getUsersPage");

    cy.get('[data-cy="side-sheet-primary-button"').click();

    cy.wait("@getUsersPage");
  });

  it("should not allow end date before start date", () => {
    cy.visit("/users");

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
