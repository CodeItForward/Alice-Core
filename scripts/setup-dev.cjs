const fs = require('fs-extra');
const path = require('path');

const root = process.cwd();
const template = path.join(root, 'template');

async function copyForDev() {
  // Copy src
  await fs.copy(path.join(template, 'src'), path.join(root, 'src'));
  // Copy themes
  await fs.copy(path.join(template, 'themes'), path.join(root, 'themes'));
  // Copy plugins
  await fs.copy(path.join(template, 'plugins'), path.join(root, 'plugins'));
  // Copy config files
  await fs.copy(path.join(template, 'config.json'), path.join(root, 'config.json'));
  await fs.copy(path.join(template, 'sample.config.json'), path.join(root, 'sample.config.json'));
  // Copy index.html
  await fs.copy(path.join(template, 'index.html'), path.join(root, 'index.html'));
  console.log('Development files copied from template to root.');
}

copyForDev().catch(err => {
  console.error('Error copying dev files:', err);
  process.exit(1);
}); 