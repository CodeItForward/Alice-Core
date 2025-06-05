const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../plugins/badges/images');
const destDir = path.join(__dirname, '../public/plugins/badges/images');

// Ensure destination directory exists
fs.mkdirSync(destDir, { recursive: true });

// Copy all files from srcDir to destDir
fs.readdirSync(srcDir).forEach(file => {
  const srcFile = path.join(srcDir, file);
  const destFile = path.join(destDir, file);
  if (fs.statSync(srcFile).isFile()) {
    fs.copyFileSync(srcFile, destFile);
    console.log(`Copied ${file}`);
  }
});

console.log('All badge images copied to public/plugins/badges/images/'); 