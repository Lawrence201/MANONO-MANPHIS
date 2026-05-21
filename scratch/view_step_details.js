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
    if (step === 49) {
      if (data.tool_calls) {
        console.log(`Step ${step} Keys:`);
        for (const tc of data.tool_calls) {
          console.log(`  Tool Name: ${tc.name}`);
          console.log(`  Args Keys: ${Object.keys(tc.args).join(', ')}`);
          if (tc.args.ReplacementChunks) {
            let chunks = tc.args.ReplacementChunks;
            if (typeof chunks === 'string') {
              chunks = JSON.parse(chunks);
            }
            console.log(`  ReplacementChunks type: ${typeof chunks}`);
            console.log(`  ReplacementChunks length: ${chunks.length}`);
            if (chunks.length > 0) {
              console.log(`  First Chunk Keys: ${Object.keys(chunks[0]).join(', ')}`);
              console.log(`  First Chunk TargetContent: \n${chunks[0].TargetContent || chunks[0].targetContent}\n`);
              console.log(`  First Chunk ReplacementContent: \n${chunks[0].ReplacementContent || chunks[0].replacementContent}\n`);
            }
          }
        }
      }
    }
  }
}

main().catch(err => console.error(err));
