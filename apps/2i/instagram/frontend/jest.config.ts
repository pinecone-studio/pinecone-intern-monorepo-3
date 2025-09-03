/* eslint-disable */
export default {
  displayName: 'instagram-frontend',
  preset: '../../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'], babelrc: false }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/apps/2i/instagram/frontend',
  collectCoverageFrom: ['src/app/forgot/page.{ts,tsx,js,jsx}', 'src/app/login/page.{ts,tsx,js,jsx}', 'src/app/signup/page.{ts,tsx,js,jsx}'],
};
