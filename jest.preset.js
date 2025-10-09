const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  snapshotFormat: { escapeString: true, printBasicPrototype: true },
  coverageReporters: ['text', 'html'],
  coverageThreshold: {
    global: {
<<<<<<< HEAD
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
=======
      branches: 97,
      functions: 100,
      lines: 100,
      statements: 100,
>>>>>>> 6e4edb0 (checking error fixed)
    },
  },
};
