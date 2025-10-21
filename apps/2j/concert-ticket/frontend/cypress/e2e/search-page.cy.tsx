describe('Search Page', () => {
  beforeEach(() => {
    cy.visit('/search');
  });

  it('should load the search page', () => {
    cy.url().should('include', '/search');
  });

  it('should display search input', () => {
    cy.get('input[placeholder="Хайлт..."]').should('be.visible');
  });

  it('should display navigation bar', () => {
    cy.contains('TICKET BOOKING').should('be.visible');
  });

  it('should allow entering search query', () => {
    cy.get('input[placeholder="Хайлт..."]').type('music').should('have.value', 'music');
  });

  it('should display date filter button', () => {
    cy.contains('Огноо сонгох').should('be.visible');
  });
});
