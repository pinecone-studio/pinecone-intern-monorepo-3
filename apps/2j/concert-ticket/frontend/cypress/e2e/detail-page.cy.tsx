describe('Detail Page', () => {
  beforeEach(() => {
    cy.visit('/detail');
  });

  it('Should render navigation bar with all elements', () => {
    // Check logo
    cy.get('[data-testid="logo"]').should('contain', 'TICKET BOOKING');
    cy.get('[data-testid="logo-dot"]').should('have.class', 'bg-cyan-400');

    // Check search bar
    cy.get('[data-testid="search-input"]').should('have.attr', 'placeholder', 'Хайлт');
    cy.get('[data-testid="search-button"]').should('be.visible');

    // Check cart icon
    cy.get('[data-testid="cart-button"]').should('be.visible');

    // Check buttons
    cy.get('[data-testid="register-button"]').should('contain', 'Бүртгүүлэх');
    cy.get('[data-testid="login-button"]').should('contain', 'Нэвтрэх');
  });

  it('Should render footer with contact information', () => {
    // Check footer logo
    cy.get('[data-testid="footer-logo"]').should('contain', 'TICKET BOOKING');
    cy.get('[data-testid="footer-copyright"]').should('contain', '© 2024 Booking Mongolia');

    // Check contact information
    cy.get('[data-testid="contact-header"]').should('contain', 'Contact Information');
    cy.get('[data-testid="email"]').should('contain', 'support@ticketinbooking.mn');
    cy.get('[data-testid="phone"]').should('contain', '+976 (11) 123-4567');
    cy.get('[data-testid="support"]').should('contain', 'Available 24/7');
  });

  it('Should handle search functionality', () => {
    const searchQuery = 'concert';
    cy.get('[data-testid="search-input"]').type(searchQuery);
    cy.get('[data-testid="search-form"]').submit();

<<<<<<< HEAD
    // Check that search input has the value
=======
    // For now, just verify the form submission works without errors
    // The actual search functionality can be tested in unit tests
>>>>>>> 2610c65 (update)
    cy.get('[data-testid="search-input"]').should('have.value', searchQuery);
  });

  it('Should handle button clicks', () => {
<<<<<<< HEAD
    // Test register button
    cy.get('[data-testid="register-button"]').click();
    cy.get('[data-testid="register-button"]').should('be.visible');

    // Test login button
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="login-button"]').should('be.visible');

    // Test cart button
    cy.get('[data-testid="cart-button"]').click();
=======
    // Test that buttons are clickable and don't cause errors
    cy.get('[data-testid="register-button"]').should('be.visible').click();
    cy.get('[data-testid="login-button"]').should('be.visible').click();
    cy.get('[data-testid="cart-button"]').should('be.visible').click();
    
    // Verify buttons are still visible after clicking (no navigation occurred)
    cy.get('[data-testid="register-button"]').should('be.visible');
    cy.get('[data-testid="login-button"]').should('be.visible');
>>>>>>> 2610c65 (update)
    cy.get('[data-testid="cart-button"]').should('be.visible');
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
