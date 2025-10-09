const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  snapshotFormat: { escapeString: true, printBasicPrototype: true },
  coverageReporters: ['text', 'html'],
  coverageThreshold: {
    global: {
      branches: 97,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
