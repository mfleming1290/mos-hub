import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const pin = JSON.parse(readFileSync(path.join(root, 'battlemoon-source.json')));
assert.match(pin.revision, /^[a-f0-9]{40}$/);
const scratch = mkdtempSync(path.join(tmpdir(), 'mos-clock-source-'));
function run(command, args, cwd = scratch) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  assert.equal(result.status, 0, result.stdout + result.stderr); return result.stdout;
}
const source = path.join(scratch, 'source'), packed = path.join(scratch, 'packed');
run('git', ['-c', 'core.autocrlf=false', 'clone', pin.repository, source]);
run('git', ['checkout', '--detach', pin.revision], source);
assert.equal(run('git', ['rev-parse', 'HEAD'], source).trim(), pin.revision);
const actual = JSON.parse(run(process.execPath, ['tools/package-components.mjs', packed], source));
for (const [name, expected] of Object.entries(pin.packages)) {
  for (const key of ['version', 'filename', 'integrity']) assert.equal(actual[name][key], expected[key]);
}
const artifacts = path.join(root, '.cache/battlemoon'), generated = path.join(root, 'page/src/generated');
mkdirSync(artifacts, { recursive: true }); mkdirSync(generated, { recursive: true });
for (const expected of Object.values(pin.packages)) copyFileSync(path.join(packed, expected.filename), path.join(artifacts, expected.filename));
// Reuse the reviewed MOS host wrapper, never copy Clock domain code or maintain a second adapter.
copyFileSync(path.join(source, 'adapters/mos-clock/page/src/ClockAdapter.mjs'), path.join(generated, 'ClockAdapter.mjs'));
console.log(`PASS Git-derived artifacts and MOS adapter ${pin.revision}`);
