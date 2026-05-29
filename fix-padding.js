const fs = require('fs');
const files = [
  'src/app/inventory/cashew/add/page.tsx',
  'src/app/inventory/sheabutter/add/page.tsx',
  'src/app/inventory/honey/add/page.tsx',
  'src/app/inventory/honey/edit/[id]/page.tsx'
];
files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    let newContent = content.replace(/className=\"pl-8 h-10 border-border dark:border-white\/10 dark:bg-transparent font-mono shadow-none\"/g, 'className=\"pl-12 h-10 border-border dark:border-white/10 dark:bg-transparent font-mono shadow-none\"');
    if (content !== newContent) {
      fs.writeFileSync(f, newContent, 'utf8');
      console.log('Updated ' + f);
    }
  }
});
