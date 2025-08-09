describe("Sign", () => {
  it("should sign in successfully", () => {
    cy.visit("/");

    cy.get('input[name="email"]').type("john.doe@email.com");
    cy.get('input[name="password"]').type("Senha12345@");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/vehicles");
  });

  it("should warn if not fill one field on sign in", () => {
    cy.visit("/");

    cy.get('input[name="email"]').type("john.doe@email.com");

    cy.get('button[type="submit"]').click();

    cy.get('[data-cy="input-error-password"]').should("exist");
  });

  it("should sign out successfully", () => {
    cy.login();

    cy.visit("/vehicles");

    cy.get('[data-cy="button-sign-out"]').click();

    cy.url().should("include", "/");
  });

  it("should render sign up", () => {
    cy.visit("/new-account");

    cy.get('input[name="name"]').should("exist");
    cy.get('input[name="cnpj"]').should("exist");
    cy.get('input[name="fullName"]').should("exist");
    cy.get('input[name="email"]').should("exist");

    cy.get('button[type="submit"]').should("exist");
  });

  it("should open forget password modal", () => {
    const email = "john.doe@email.com";

    cy.intercept(
      "POST",
      "http://localhost:3000/auth/forget-password",
      (req) => {
        expect(req.body).to.deep.equal({
          email,
        });
      }
    ).as("forgetPassword");

    cy.visit("/");

    cy.get('[data-cy="forget-password-button"]').click();

    cy.get('input[name="email"]').eq(1).type("john.doe@email.com");

    cy.get('button[type="submit"]').eq(1).click();

    cy.get('[data-cy="snackbar-title"]').should(
      "have.text",
      "Um email será enviado"
    );
    cy.get('[data-cy="snackbar-description"]').should(
      "have.text",
      "Confira também a caixa de spam"
    );

    cy.wait("@forgetPassword");
  });
});
