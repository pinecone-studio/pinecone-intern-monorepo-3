describe('Home Page', () => {
  it(`Should render home page`, () => {
    cy.visit('/', { failOnStatusCode: false });
  });
});
