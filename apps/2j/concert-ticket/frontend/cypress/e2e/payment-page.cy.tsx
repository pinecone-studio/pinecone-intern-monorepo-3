describe('Payment Page', () => {
  const ticketData = JSON.stringify([{ type: 'VIP тасалбар', price: 129000, quantity: 1 }]);

  beforeEach(() => {
    cy.visit(`/payment?concertId=test&ticketData=${encodeURIComponent(ticketData)}&totalAmount=129000`);
  });

  it('should load payment page', () => {
    cy.url().should('include', '/payment');
  });

  it('should display back button', () => {
    cy.get('[data-testid="back-button"]').should('be.visible');
  });

  it('should display payment title', () => {
    cy.contains('Төлбөр төлөх').should('be.visible');
  });

  it('should display total amount', () => {
    cy.contains('129,000₮').should('be.visible');
  });

  it('should display payment methods', () => {
    cy.contains('Qpay').should('be.visible');
    cy.contains('Social Pay').should('be.visible');
  });

  it('should display pay button', () => {
    cy.contains('Төлбөр төлөх').should('be.visible');
  });
});
