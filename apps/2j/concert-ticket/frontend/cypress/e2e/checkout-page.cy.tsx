describe('Checkout Page', () => {
  const ticketData = JSON.stringify([{ type: 'VIP тасалбар', price: 129000, quantity: 2 }]);

  beforeEach(() => {
    cy.visit(`/checkout?concertId=test&selectedDate=2024-12-25&ticketData=${encodeURIComponent(ticketData)}`);
  });

  it('should load checkout page', () => {
    cy.url().should('include', '/checkout');
  });

  it('should display back button', () => {
    cy.get('[data-testid="back-button"]').should('be.visible');
  });

  it('should display checkout title', () => {
    cy.contains('Захиалга баталгаажуулах').should('be.visible');
  });

  it('should display phone input', () => {
    cy.get('input[placeholder="9900-0000"]').should('be.visible');
  });

  it('should display email input', () => {
    cy.get('input[placeholder="name@example.com"]').should('be.visible');
  });

  it('should display continue button', () => {
    cy.contains('Үргэлжлүүлэх').should('be.visible');
  });
});
