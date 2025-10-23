/* eslint-disable */
export default {
  displayName: 'ticket-frontend',
  preset: '../../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'], babelrc: false }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/apps/2j/concert-ticket/frontend',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/generated/**/*.{ts,tsx}',
    '!src/app/**/*.tsx',
    '!src/components/providers/**/*.{ts,tsx}',
    '!src/components/home/**/*',
    '!src/types/**/*.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 7,
      functions: 34,
      lines: 15,
      statements: 15,
    },
  },
};

