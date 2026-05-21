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
    
    if (step >= 40 && step <= 55) {
      console.log(`========================================`);
      console.log(`STEP ${step} (Type: ${data.type})`);
      console.log(`========================================`);
      if (data.tool_calls) {
        for (const tc of data.tool_calls) {
          console.log(`Tool: ${tc.name}`);
          if (tc.args.TargetFile) console.log(`Target: ${tc.args.TargetFile}`);
          if (tc.args.CommandLine) console.log(`CommandLine: ${tc.args.CommandLine}`);
          if (tc.args.ReplacementChunks) {
            console.log(`Chunks: ${tc.args.ReplacementChunks.length}`);
            for (let i = 0; i < tc.args.ReplacementChunks.length; i++) {
              const chunk = tc.args.ReplacementChunks[i];
              console.log(`  Chunk ${i}: StartLine: ${chunk.StartLine}, EndLine: ${chunk.EndLine}`);
              console.log(`    TargetContent:\n${chunk.TargetContent}\n    ReplacementContent:\n${chunk.ReplacementContent}`);
            }
          }
          if (tc.args.TargetContent) {
            console.log(`  TargetContent:\n${tc.args.TargetContent}\n  ReplacementContent:\n${tc.args.ReplacementContent}`);
          }
        }
      }
    }
  }
}

main().catch(err => console.error(err));
