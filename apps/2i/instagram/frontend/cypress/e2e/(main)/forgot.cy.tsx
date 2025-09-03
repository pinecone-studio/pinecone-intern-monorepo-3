describe('forgot Page', () => {
  it(`Should render forgot page`, () => {
    cy.visit('/forgot');
    cy.wait(1000);
    cy.get('[data-cy="forgot-page"]').should('exist');
    cy.get('[data-cy="email-input"]').should('exist');
    cy.get('[data-cy="email-input"]').type('test@test.com');
    cy.get('[data-cy="submit-button"]').click();
    cy.wait(1000);
  });
});
