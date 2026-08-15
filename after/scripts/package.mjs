import { mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

await mkdir('release', { recursive: true });
const result = process.platform === 'win32'
  ? spawnSync(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', 'npm.cmd pack --pack-destination release'], { stdio: 'inherit' })
  : spawnSync('npm', ['pack', '--pack-destination', 'release'], { stdio: 'inherit' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
