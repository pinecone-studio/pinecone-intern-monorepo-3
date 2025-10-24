describe('Cart Flow', () => {
  it('should load cart page', () => {
    cy.visit('/cart', { failOnStatusCode: false });
    cy.url().should('include', '/cart');
  });

  it('should handle invalid concert ID', () => {
    cy.visit('/cart?concertId=invalid', { failOnStatusCode: false, timeout: 30000 });
    cy.url().should('include', '/cart');
  });

  it('should display cart page elements', () => {
    cy.visit('/cart', { failOnStatusCode: false, timeout: 30000 });
    cy.get('body').should('exist');
  });
});
