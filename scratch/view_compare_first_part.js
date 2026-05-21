const fs = require('fs');
const readline = require('readline');

const filePath = 'c:\\Users\\HP\\Desktop\\Import_System\\src\\app\\products\\[id]\\page.tsx';

async function main() {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineNum = 1;
  for await (const line of rl) {
    if (lineNum >= 780 && lineNum <= 922) {
      console.log(`${lineNum}: ${line}`);
    }
    lineNum++;
  }
}

main().catch(err => console.error(err));
