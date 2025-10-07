# Concert Ticket Frontend - Testing Guide

This document provides comprehensive information about testing the Concert Ticket Frontend application.

## 🧪 Test Types

### 1. Unit Tests (Jest + React Testing Library)

- **Location**: `src/**/*.test.tsx`
- **Command**: `npx nx test ticket-frontend`
- **Coverage**: Available in `coverage/` directory
- **Configuration**: `jest.config.ts`

**Test Files:**

- `src/components/detail/nav.test.tsx` - Navigation component tests
- `src/components/detail/footer.test.tsx` - Footer component tests
- `src/app/detail/page.test.tsx` - Detail page tests

### 2. E2E Tests (Cypress)

- **Location**: `cypress/e2e/`
- **Command**: `npx nx e2e ticket-frontend`
- **Configuration**: `cypress.config.ts`
- **Reports**: Available in `cypress/results/`

**Test Files:**

- `cypress/e2e/(main)/home-page.cy.tsx` - Home page tests
- `cypress/e2e/detail-page.cy.tsx` - Detail page tests
- `cypress/e2e/render-all.pages.cy.tsx` - All pages render test

### 3. Lint Tests (ESLint)

- **Command**: `npx nx lint ticket-frontend`
- **Configuration**: `.eslintrc.json`
- **Rules**: TypeScript, React, and custom rules

### 4. Build Tests

- **Command**: `npx nx build ticket-frontend`
- **Purpose**: Ensures production build works correctly
- **Output**: `dist/` directory

### 5. Type Tests (TypeScript)

- **Command**: `npx tsc --noEmit`
- **Purpose**: Type checking without compilation

## 🚀 Quick Start

### Run All Tests

```bash
# From project root
cd apps/2j/concert-ticket/frontend
./scripts/test-all.sh
```

### Individual Test Commands

```bash
# Unit tests with coverage
npx nx test ticket-frontend --coverage

# E2E tests (requires backend running)
npx nx e2e ticket-frontend

# Lint check
npx nx lint ticket-frontend

# Build test
npx nx build ticket-frontend

# Preview build
npx nx preview ticket-frontend
```

## 🔧 Test Configuration

### Jest Configuration

- **File**: `jest.config.ts`
- **Coverage**: Enabled for all source files
- **Exclusions**: Generated files, providers, and app files
- **Transform**: Babel for Next.js compatibility

### Cypress Configuration

- **File**: `cypress.config.ts`
- **Browser**: Chrome (default)
- **Viewport**: 1536x960
- **Timeouts**: Extended for slow operations
- **Reporter**: Mochawesome with JSON output

### ESLint Configuration

- **File**: `.eslintrc.json`
- **Rules**: TypeScript, React, and custom rules
- **Exclusions**: Generated files and Cypress files

## 📊 Test Data Attributes

Components use `data-testid` attributes for reliable testing:

### Navigation Component

- `data-testid="logo"` - Logo container
- `data-testid="logo-dot"` - Logo dot element
- `data-testid="search-form"` - Search form
- `data-testid="search-input"` - Search input field
- `data-testid="search-button"` - Search submit button
- `data-testid="cart-button"` - Shopping cart button
- `data-testid="register-button"` - Register button
- `data-testid="login-button"` - Login button

### Footer Component

- `data-testid="footer-logo"` - Footer logo
- `data-testid="footer-copyright"` - Copyright text
- `data-testid="contact-header"` - Contact information header
- `data-testid="email"` - Email contact info
- `data-testid="phone"` - Phone contact info
- `data-testid="support"` - Customer support info

## 🎯 Test Scenarios

### Unit Test Scenarios

1. **Component Rendering**: All elements render correctly
2. **Props Handling**: Optional and required props work
3. **Event Handling**: Click events trigger callbacks
4. **CSS Classes**: Correct styling classes applied
5. **State Management**: Component state updates correctly

### E2E Test Scenarios

1. **Page Navigation**: All pages load without errors
2. **User Interactions**: Search, buttons, and forms work
3. **Responsive Design**: Layout works on different screen sizes
4. **Accessibility**: Components are accessible
5. **Performance**: Pages load within acceptable time

## 🐛 Troubleshooting

### Common Issues

1. **E2E Tests Failing**

   - Ensure backend is running on port 4000
   - Check if frontend is running on port 3000
   - Verify environment variables are set

2. **Unit Tests Failing**

   - Check if all dependencies are installed
   - Verify test files are in correct locations
   - Ensure mock functions are properly set up

3. **Build Failing**

   - Check TypeScript errors
   - Verify all imports are correct
   - Ensure environment variables are set

4. **Lint Errors**
   - Run `npx nx lint ticket-frontend --fix` to auto-fix
   - Check ESLint configuration
   - Verify file patterns in lint configuration

### Debug Commands

```bash
# Run tests in watch mode
npx nx test ticket-frontend --watch

# Run E2E tests in headed mode
npx nx e2e ticket-frontend --headed

# Run specific test file
npx nx test ticket-frontend --testNamePattern="NavBar"

# Debug build issues
npx nx build ticket-frontend --verbose
```

## 📈 Coverage Reports

- **Unit Test Coverage**: `coverage/apps/2j/concert-ticket/frontend/index.html`
- **E2E Test Reports**: `cypress/results/`
- **Lint Reports**: Console output or configured output file

## 🔄 Continuous Integration

The test suite is designed to run in CI/CD pipelines:

1. **Lint Check**: Ensures code quality
2. **Unit Tests**: Validates component functionality
3. **Build Test**: Ensures production readiness
4. **E2E Tests**: Validates user workflows
5. **Type Check**: Ensures type safety

## 📝 Writing New Tests

### Unit Test Template

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { YourComponent } from './YourComponent';

describe('YourComponent', () => {
  it('Should render correctly', () => {
    render(<YourComponent />);
    expect(screen.getByTestId('your-element')).toBeInTheDocument();
  });
});
```

### E2E Test Template

```typescript
describe('Your Feature', () => {
  it('Should work correctly', () => {
    cy.visit('/your-page');
    cy.get('[data-testid="your-element"]').should('be.visible');
    cy.get('[data-testid="your-button"]').click();
  });
});
```

## 🎉 Best Practices

1. **Use data-testid**: Prefer data-testid over CSS selectors
2. **Test User Behavior**: Focus on what users do, not implementation
3. **Mock External Dependencies**: Isolate components for unit tests
4. **Keep Tests Simple**: One assertion per test when possible
5. **Use Descriptive Names**: Test names should explain the scenario
6. **Clean Up**: Remove test data and reset state between tests
7. **Test Edge Cases**: Empty states, error conditions, etc.
8. **Maintain Tests**: Update tests when components change
