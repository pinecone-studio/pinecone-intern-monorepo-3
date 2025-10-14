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

// Add custom assertions
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom assertion to check if console.log was called with specific message
       * @param message - The expected console message
       */
      haveConsoleLog(message: string): Chainable<Window>;
    }
  }
}

Cypress.Commands.add('haveConsoleLog', { prevSubject: 'window' }, (win: Window, message: string) => {
  return cy.wrap(win).then(() => {
    const consoleSpy = cy.spy((win as any).console, 'log');
    expect(consoleSpy).to.have.been.calledWith(message);
  });
});
