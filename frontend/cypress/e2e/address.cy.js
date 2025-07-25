describe("Should update address successfully", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should show the dashboard page", () => {
    cy.visit("/vehicles");

    cy.url().should("include", "/vehicles");
  });
});
