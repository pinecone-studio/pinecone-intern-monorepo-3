/// <reference types="cypress" />

// Custom commands for the concert ticket app
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to visit the detail page
       * @example cy.visitDetailPage()
       */
      visitDetailPage(): Chainable<void>;

      /**
       * Custom command to search for concerts
       * @example cy.searchConcerts('rock concert')
       */
      searchConcerts(query: string): Chainable<void>;

      /**
       * Custom command to click register button
       * @example cy.clickRegister()
       */
      clickRegister(): Chainable<void>;

      /**
       * Custom command to click login button
       * @example cy.clickLogin()
       */
      clickLogin(): Chainable<void>;

      /**
       * Custom command to click cart button
       * @example cy.clickCart()
       */
      clickCart(): Chainable<void>;
    }
  }
}

// Custom command implementations
Cypress.Commands.add('visitDetailPage', () => {
  cy.visit('/detail');
});

Cypress.Commands.add('searchConcerts', (query: string) => {
  cy.get('[data-testid="search-input"]').type(query);
  cy.get('[data-testid="search-form"]').submit();
});

Cypress.Commands.add('clickRegister', () => {
  cy.get('[data-testid="register-button"]').click();
});

Cypress.Commands.add('clickLogin', () => {
  cy.get('[data-testid="login-button"]').click();
});

Cypress.Commands.add('clickCart', () => {
  cy.get('[data-testid="cart-button"]').click();
});

export {};
