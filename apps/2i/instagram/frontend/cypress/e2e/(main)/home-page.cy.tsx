describe('Home Page', () => {
  it(`Should render home page`, () => {
    cy.visit('/');
    cy.wait(1000);
    cy.get('[data-cy="home-page"]').should('exist');
  });
});
