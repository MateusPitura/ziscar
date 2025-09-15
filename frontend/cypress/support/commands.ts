Cypress.Commands.add("login", () => {
  cy.request("POST", "http://localhost:3000/auth/sign-in", {
    email: "john.doe@email.com",
    password: "Senha12345@",
  });
});

Cypress.Commands.add(
  "getDataCy",
  (
    value: string,
    options?: Partial<
      Cypress.Loggable &
        Cypress.Timeoutable &
        Cypress.Withinable &
        Cypress.Shadow
    >
  ) => {
    return cy.get(`[data-cy="${value}"]`, options);
  }
);

Cypress.Commands.add("fillInputByName", (name, value) => {
  cy.get(`input[name="${name}"]`).clear().type(value);
});