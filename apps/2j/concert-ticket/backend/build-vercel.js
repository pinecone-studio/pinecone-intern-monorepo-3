const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build...');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy essential files (excluding problematic ones)
const filesToCopy = ['src/vercel.ts', 'src/resolvers', 'src/controllers', 'src/services', 'src/models', 'src/database', 'src/context.ts', 'src/schemas'];

filesToCopy.forEach((file) => {
  const srcPath = path.join(__dirname, file);
  const destPath = path.join(distDir, file);

  if (fs.existsSync(srcPath)) {
    if (fs.statSync(srcPath).isDirectory()) {
      execSync(`cp -r "${srcPath}" "${destPath}"`, { stdio: 'inherit' });
    } else {
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(srcPath, destPath);
    }
    console.log(`✅ Copied ${file}`);
  }
});

// Create package.json for dist
const packageJson = {
  name: 'concert-ticket-backend',
  version: '1.0.0',
  main: 'vercel.js',
  dependencies: {
    '@apollo/server': '4.3.0',
    '@as-integrations/next': '3.0.0',
    '@graphql-tools/merge': '9.0.0',
    bcrypt: '5.1.1',
    cors: '^2.8.5',
    dotenv: '16.0.3',
    express: '4.18.1',
    graphql: '16.6.0',
    jsonwebtoken: '9.0.2',
    mongoose: '8.2.2',
    next: '14.2.14',
    nodemailer: '^6.9.16',
    'otp-generator': '4.0.1',
  },
};

fs.writeFileSync(path.join(distDir, 'package.json'), JSON.stringify(packageJson, null, 2));

console.log('✅ Vercel build completed successfully!');
