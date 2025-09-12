declare namespace Cypress {
  interface Chainable {
    login(): void;

    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.getDataCy('submit-button')
     */
    getDataCy(
      value: string,
      options?: Partial<
        Cypress.Loggable &
          Cypress.Timeoutable &
          Cypress.Withinable &
          Cypress.Shadow
      >
    ): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom command to fill an input by its name attribute
     * @example cy.fillInputByName("payment.competencyDate", "2025-01-01")
     */
    fillInputByName(
      name: string,
      value: string
    ): Chainable<JQuery<HTMLInputElement>>;
  }
}
