// Import all page tests
import './signup.spec';
import './login.spec';
import './forgot.spec';

// This file ensures all page tests are included in the test suite
describe('Frontend Pages Test Suite', () => {
  it('should have all page tests imported', () => {
    expect(true).toBe(true);
  });
});
