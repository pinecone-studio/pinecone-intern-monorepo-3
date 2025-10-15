const { join } = require('path');

module.exports = {
  plugins: {
    'postcss-nesting': {},
    tailwindcss: {
      config: join(__dirname, 'tailwind.config.js'),
    },
    autoprefixer: {},
  },
};
