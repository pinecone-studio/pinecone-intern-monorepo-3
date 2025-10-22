/* eslint-disable @typescript-eslint/no-var-requires */

import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    baseUrl: 'http://localhost:3000',
    supportFile: 'e2e/support/e2e.ts',
    specPattern: 'e2e/e2e/**/*.cy.tsx',
  },
});
