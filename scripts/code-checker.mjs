#!/usr/bin/env node
import { execSync } from 'child_process';
import chalk from 'chalk';

const checks = [
  { name: 'Format Check', cmd: 'npm run format:check' },
  { name: 'Lint Check', cmd: 'npm run lint:npx' },
  { name: 'Type Check', cmd: 'npm run typecheck' },
];

let failed = [];
console.log(chalk.cyan('Running Code Quality Checks...'));

for (const check of checks) {
  try {
    console.log(chalk.yellow(`▶ Running: ${check.name}...`));
    execSync(check.cmd, { stdio: 'pipe' });
    console.log(chalk.green(`✓ ${check.name} passed`));
  } catch (e) {
    console.log(chalk.red(`✗ ${check.name} failed`));
    failed.push({
      name: check.name,
      command: check.cmd,
      output: e.stdout?.toString() || e.message,
    });
  }
}

console.log('\n--- Code Quality Check Summary ---');
if (failed.length === 0) {
  console.log(chalk.green.bold('✨ All checks passed successfully!'));
  process.exit(0);
}

failed.forEach((f) => console.log(chalk.red(`✗ ${f.name} failed`)));
console.log(chalk.red('\nSome checks failed. See details below.'));

console.log(chalk.cyan('\n--- AI Task Prompt for Failed Checks ---\n'));
console.log(
  'The following code quality checks failed. Your task is to provide the necessary code changes or commands to fix these issues.\n',
);
console.log('### Summary of Failures:\n');

failed.forEach((f) => {
  console.log(`- **Check:** ${f.name}`);
  console.log(`- **Command:** \`${f.command}\``);
  console.log(`- **Error Output:**\n\`\`\`\n${f.output.trim()}\n\`\`\`\n`);
});

console.log(
  'Please analyze the error output for each failed check and provide a plan or code patch to resolve the problems.',
);
console.log(chalk.cyan('\n------------------------------------\n'));

process.exit(1);