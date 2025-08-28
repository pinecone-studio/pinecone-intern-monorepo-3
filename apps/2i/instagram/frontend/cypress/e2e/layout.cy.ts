describe('Root Layout', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render layout with proper HTML structure', () => {
    cy.get('html').should('exist');
    cy.get('html').should('have.attr', 'lang', 'en');
    cy.get('body').should('exist');
  });

  it('should render children content', () => {
    cy.get('body').should('contain.text', 'Home Page');
  });

  it('should have proper document structure', () => {
    cy.document().should('have.property', 'title');
    cy.document().should('have.property', 'body');
  });

  it('should render without errors', () => {
    cy.window().then((win) => {
      const consoleErrors = win.console.error;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(consoleErrors).to.not.have.been.called;
    });
  });
});
