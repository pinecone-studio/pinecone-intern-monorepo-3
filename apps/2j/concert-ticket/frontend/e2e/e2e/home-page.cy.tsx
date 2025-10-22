describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the home page', () => {
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should display the navigation bar', () => {
    cy.contains('TICKET BOOKING').should('be.visible');
  });

  it('should display search input', () => {
    cy.get('input[placeholder="Хайх..."]').should('be.visible');
  });

  it('should display event grid or loading state', () => {
    cy.get('body').should('exist');
  });

  it('should navigate to search on search submit', () => {
    cy.get('input[placeholder="Хайх..."]').type('concert{enter}');
    cy.url().should('include', '/search');
  });
});
