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
    const step = data.step_index;
    
    // We want the SYSTEM/tool response for view_file at step 59, 63, or 67.
    // In JSONL, the tool call is from MODEL, and the output is in the next step (which is type: VIEW_FILE or similar, source: MODEL).
    // Let's print all steps with type containing VIEW_FILE or LIST_DIRECTORY etc. to check.
    if (step >= 57 && step <= 70) {
      console.log(`Step ${step}: Source: ${data.source}, Type: ${data.type}`);
      if (data.content && data.content.includes('page.tsx')) {
        console.log(`  Content length: ${data.content.length}`);
        console.log(`  Preview (first 200 chars): ${data.content.substring(0, 200)}`);
      }
    }
  }
}

main().catch(err => console.error(err));
