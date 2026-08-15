import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

const projects = [
  'auth-service',
  'identity-service',
  'platform-service',
  'procurement-service',
  'collaboration-service',
  'sync-service',
  'codegen-service',
  'scheduler-service',
  'file-service',
  'monitor-service',
  'api-gateway',
];
const prod = process.argv.includes('--prod');
const watch = process.argv.includes('--watch');
const children = projects.map((project) => {
  const command = prod ? process.execPath : (process.platform === 'win32' ? 'npm.cmd' : 'npm');
  const builtFile = `dist/apps/${project}/main.js`;
  if (prod && !existsSync(builtFile)) throw new Error(`Missing ${builtFile}; run npm run build first.`);
  const args = prod ? [builtFile] : ['exec', '--', 'nest', 'start', project, ...(watch ? ['--watch'] : [])];
  const child = spawn(command, args, { stdio: 'inherit', env: process.env });
  child.on('exit', (code) => {
    if (code && code !== 0) process.exitCode = code;
  });
  return child;
});

function shutdown() {
  for (const child of children) child.kill('SIGTERM');
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
