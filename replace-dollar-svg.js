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
    
    // Check if DollarSign is imported from lucide-react
    if (content.match(/import\s+{([^}]*)}\s+from\s+['"]lucide-react['"]/)) {
      // Use replace with function to correctly modify the import statement
      content = content.replace(/import\s+{([^}]*)}\s+from\s+['"]lucide-react['"]/g, (match, p1) => {
        let imports = p1.split(',').map(s => s.trim());
        if (imports.includes('DollarSign')) {
          imports = imports.filter(i => i !== 'DollarSign');
          let newImport = '';
          if (imports.length > 0) {
            newImport = `import { ${imports.join(', ')} } from "lucide-react";\n`;
          }
          return newImport + 'import { CediSign as DollarSign } from "@/components/CediSign";';
        }
        return match;
      });
    }
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
