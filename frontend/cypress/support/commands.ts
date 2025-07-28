Cypress.Commands.add("login", () => {
  cy.request("POST", "http://localhost:3000/auth/sign-in", {
    email: "john.doe@email.com",
    password: "Senha12345@",
  });
});
