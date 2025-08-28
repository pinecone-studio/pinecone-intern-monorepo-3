describe('signup Page', () => {
  it(`Should render signup page`, () => {
    cy.visit('/signup');
    cy.wait(1000);
    cy.get('[data-cy="signup-page"]').should('exist');
    cy.get('[data-cy="email-input"]').should('exist');
    cy.get('[data-cy="full-name-input"]').should('exist');
    cy.get('[data-cy="username-input"]').should('exist');
    cy.get('[data-cy="password-input"]').should('exist');
    cy.get('[data-cy="email-input"]').type('test@test.com');
    cy.get('[data-cy="full-name-input"]').type('John Doe');
    cy.get('[data-cy="username-input"]').type('john_doe');
    cy.get('[data-cy="password-input"]').type('password');
    cy.get('[data-cy="submit-button"]').click();
    cy.wait(1000);
  });
});
