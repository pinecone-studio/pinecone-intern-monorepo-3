describe('Login Page', () => {
  it(`Should render Login page`, () => {
    cy.visit('/login');
    cy.wait(1000);
    cy.get('[data-cy="login-page"]').should('exist');
    cy.get('[data-cy="email-input"]').should('exist');
    cy.get('[data-cy="password-input"]').should('exist');
    cy.get('[data-cy="email-input"]').type('test@test.com');
    cy.get('[data-cy="password-input"]').type('password');
    cy.get('[data-cy="submit-button"]').click();
    cy.wait(1000);
  });
});
