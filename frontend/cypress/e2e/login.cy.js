describe("Login", () => {
  it("should log in successfully", () => {
    cy.visit("/");

    cy.get('input[name="email"]').type("john.doe@email.com");
    cy.get('input[name="password"]').type("123456");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/vehicles");
  });
});
