#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

const [, , command, projectName] = process.argv;

if (command !== 'init' || !projectName) {
  console.log('Usage: alice-core init <project-name>');
  process.exit(1);
}

const templateDir = path.join(__dirname, '..', 'template');
const targetDir = path.resolve(process.cwd(), projectName);

fs.copy(templateDir, targetDir)
  .then(() => {
    console.log(`Project initialized in ${targetDir}`);
    console.log('Next steps:');
    console.log(`  cd ${projectName}`);
    console.log('  npm install');
    console.log('  npm run dev');
  })
  .catch(err => {
    console.error('Error copying template:', err);
    process.exit(1);
  }); 