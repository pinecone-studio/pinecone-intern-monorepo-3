// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add global test configuration
beforeEach(() => {
  // Clear any existing console logs
  cy.window().then((win) => {
    win.console.clear();
  });
});

// Custom commands removed - using simple element checks instead
