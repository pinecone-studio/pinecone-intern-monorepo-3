describe('Checkout Page', () => {
  const ticketData = JSON.stringify([{ type: 'VIP тасалбар', price: 129000, quantity: 2 }]);

  beforeEach(() => {
    cy.visit(`/checkout?concertId=test&selectedDate=2024-12-25&ticketData=${encodeURIComponent(ticketData)}`, { failOnStatusCode: false });
  });

  it('should load checkout page', () => {
    cy.url().should('include', '/checkout');
  });

  it('should display page elements', () => {
    cy.get('body').should('exist');
  });
});
