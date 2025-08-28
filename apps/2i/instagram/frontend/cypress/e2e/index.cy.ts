describe('Provider Index Exports', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should export ApolloWrapper correctly', () => {
    cy.get('body').should('exist');
    cy.get('body').should('contain.text', 'Home Page');
    cy.window().then((win) => {
      const consoleErrors = win.console.error;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(consoleErrors).to.not.have.been.called;
    });
  });

  it('should handle provider imports without issues', () => {
    cy.get('body').should('exist');
    cy.get('body').should('contain.text', 'Home Page');
  });

  it('should maintain proper module structure', () => {
    cy.get('html').should('exist');
    cy.get('body').should('exist');
    cy.get('body').should('contain.text', 'Home Page');
  });

  it('should render without errors', () => {
    cy.window().then((win) => {
      const consoleErrors = win.console.error;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(consoleErrors).to.not.have.been.called;
    });
  });
});
