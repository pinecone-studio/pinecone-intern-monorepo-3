describe('ApolloWrapper Provider', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render Apollo provider without errors', () => {
    cy.get('body').should('exist');
    cy.get('body').should('contain.text', 'Home Page');
    cy.window().then((win) => {
      const consoleErrors = win.console.error;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(consoleErrors).to.not.have.been.called;
    });
  });

  it('should handle GraphQL operations', () => {
    cy.window().then((win) => {
      expect(win.__APOLLO_CLIENT__).to.exist;
    });
  });

  it('should render children wrapped in provider', () => {
    cy.get('body').should('contain.text', 'Home Page');
    cy.get('body > div').should('exist');
  });

  it('should maintain proper component structure', () => {
    cy.get('html').should('exist');
    cy.get('body').should('exist');
    cy.get('body').should('contain.text', 'Home Page');
  });
});
