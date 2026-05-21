const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\19cca626-c1e1-4a14-9034-66bc6a33fd0b\\.system_generated\\logs\\transcript.jsonl';

async function main() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const data = JSON.parse(line);
    if (data.type === 'USER_INPUT') {
      const contentExcerpt = data.content.substring(0, 300);
      console.log(`Step ${data.step_index}: USER_INPUT`);
      console.log(`  Content: ${contentExcerpt}`);
      console.log('-----------------------------------');
    }
  }
}

main().catch(err => console.error(err));
