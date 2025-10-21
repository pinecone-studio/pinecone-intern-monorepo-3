describe('Cart Flow', () => {
  it('should load cart page', () => {
    cy.visit('/cart', { failOnStatusCode: false });
    cy.url().should('include', '/cart');
  });

  it('should display error for missing concert', () => {
    cy.visit('/cart?concertId=invalid', { timeout: 30000 });
    cy.contains('Концертын мэдээлэл олдсонгүй', { timeout: 30000 }).should('be.visible');
  });

  it('should display back button on error state', () => {
    cy.visit('/cart?concertId=invalid', { timeout: 30000 });
    cy.contains('Концертын мэдээлэл олдсонгүй', { timeout: 30000 }).should('be.visible');
    cy.wait(1000);
    cy.get('[data-testid="back-button"]').should('be.visible');
  });
});
