describe('Detail Page', () => {
  beforeEach(() => {
    cy.visit('/concerts/68e75debb6cd9759bc4033ec');
  });

  it('Should render navigation bar with all elements', () => {
    // Check logo
    cy.get('[data-testid="logo"]').should('contain', 'TICKET BOOKING');
    cy.get('[data-testid="logo-dot"]').should('have.class', 'bg-cyan-400');

    // Check search bar visibility
    cy.get('[data-testid="search-input"]').should('be.visible');
  });

  it('Should render footer with contact information', () => {
    // Check footer logo
    cy.get('[data-testid="footer-logo"]').should('contain', 'TICKET BOOKING');
    cy.get('[data-testid="footer-logo-dot"]').should('have.class', 'bg-cyan-400');
  });

  it('Should handle search functionality', () => {
    // Check that search input is visible
    cy.get('[data-testid="search-input"]').should('be.visible');
  });

  it('Should be responsive on mobile', () => {
    cy.viewport(375, 667); // iPhone SE size
    cy.get('[data-testid="logo"]').should('be.visible');
    cy.get('[data-testid="search-input"]').should('be.visible');
  });

  it('Should be responsive on tablet', () => {
    cy.viewport(768, 1024); // iPad size
    cy.get('[data-testid="logo"]').should('be.visible');
    cy.get('[data-testid="search-input"]').should('be.visible');
  });
});
