const fs = require('fs');
let content = fs.readFileSync('src/app/products/[id]/page.tsx', 'utf8');

// 1. Restore text-center
content = content.replace(/className="cell-value"/g, 'className="cell-value text-center"');

// 2. Hide stock exact value from Availability row
const oldStockCode = `                          {compareList.map((p) => {
                            let stockText = "";
                            if (p.stockQuantity) {
                              const num = parseInt(p.stockQuantity);
                              if (!isNaN(num)) {
                                stockText = \`\${num} in stock\`;
                              } else {
                                stockText = p.stockQuantity;
                              }
                            }
                            return (
                              <td key={p.id} className="cell-value text-center">
                                {stockText || ""}
                              </td>
                            );
                          })}`;

const newStockCode = `                          {compareList.map((p) => {
                            const stockText = p.stockStatus || "In Stock";
                            return (
                              <td key={p.id} className="cell-value text-center">
                                {stockText}
                              </td>
                            );
                          })}`;

content = content.replace(oldStockCode, newStockCode);

fs.writeFileSync('src/app/products/[id]/page.tsx', content, 'utf8');
console.log('Fixed page.tsx');
