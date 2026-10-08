import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const root = fileURLToPath(new URL('../', import.meta.url));
const scratch = mkdtempSync(path.join(tmpdir(), 'mos-clock-replay-'));
const source = path.join(scratch, 'source'); mkdirSync(source);
function run(exe, args, cwd = source, shell = false) {
  const result = spawnSync(exe, args, { cwd, encoding: 'utf8', shell, maxBuffer: 8 * 1024 * 1024 });
  assert.equal(result.status, 0, result.stdout + result.stderr); console.log(result.stdout.trim());
}
run('tar', ['-xzf', path.join(root, 'dist/battlemoon-clock-0.1.0-source.tar.gz'), '-C', source]);
run(process.execPath, ['tools/prepare.mjs']);
const npmArgs = ['ci', '--ignore-scripts', '--cache', path.join(scratch, 'npm-cache')];
if (process.platform === 'win32') {
  const npmCli = process.env.npm_execpath || path.join(path.dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js');
  assert(existsSync(npmCli), 'Run through npm or supply its installed Node CLI; no shell fallback');
  run(process.execPath, [npmCli, ...npmArgs], path.join(source, 'page'));
} else run('npm', npmArgs, path.join(source, 'page'));
run(process.execPath, ['node_modules/vite/bin/vite.js', 'build'], path.join(source, 'page'));
run(process.execPath, ['--test', 'tests/plugin.test.mjs']);
// The extracted source is not a catalog checkout. Compare output/artifacts directly.
for (const file of readdirSync(path.join(root, 'page/dist/battlemoon-clock'))) {
  assert.deepEqual(readFileSync(path.join(root, 'page/dist/battlemoon-clock', file)), readFileSync(path.join(source, 'page/dist/battlemoon-clock', file)), `Fresh build differs: ${file}`);
}
run(process.execPath, ['tools/package.mjs']);
run(process.execPath, ['tools/check.mjs', '--package']);
console.log(`PASS fresh source archive + fresh Git inputs + empty npm cache: ${scratch}; identical built assets. NOT actual MOS.`);
