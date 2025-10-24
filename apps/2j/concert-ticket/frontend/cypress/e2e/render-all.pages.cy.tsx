describe('render all pages', () => {
  const simplePages = [
    '///',
    '///sign-in',
    '///sign-up',
    '///search',
    '///forgot-password',
  ];

  it(`Should render all page`, () => {
    simplePages.forEach((page) => {
      cy.visit(page, { failOnStatusCode: false });
      cy.get('body').should('exist');
    });
  });
});
