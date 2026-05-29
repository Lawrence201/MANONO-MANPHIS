const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir(path.join(__dirname, 'src'), (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace $ followed by numbers or variables in template strings
    // Examples: $10.00 -> GH₵10.00, $25 -> GH₵25, $${value} -> GH₵${value}
    // Also replace US$
    content = content.replace(/US\$(\d)/g, 'GH₵$1');
    content = content.replace(/\$(\d)/g, 'GH₵$1');
    content = content.replace(/\$\$\{/g, 'GH₵\${');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
