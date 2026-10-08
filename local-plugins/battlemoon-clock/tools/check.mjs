import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import config from '../page/plugin.config.js';
const root = fileURLToPath(new URL('../', import.meta.url));
const json = file => JSON.parse(readFileSync(path.join(root, file)));
const pin = json('battlemoon-source.json'), lock = json('page/package-lock.json');
for (const [name, expected] of Object.entries(pin.packages)) {
  assert.equal(lock.packages[`node_modules/${name}`].version, expected.version);
  assert.equal(lock.packages[`node_modules/${name}`].integrity, expected.integrity);
  assert.equal('sha512-' + createHash('sha512').update(readFileSync(path.join(root, '.cache/battlemoon', expected.filename))).digest('base64'), expected.integrity);
}
const battle = process.argv.slice(2).find(arg => !arg.startsWith('--'));
if (battle) assert.deepEqual(pin, JSON.parse(readFileSync(path.join(battle, 'battlemoon-source.json'))), 'Battle pin differs');
const manifest = json(`page/dist/${config.name}/manifest.json`);
assert.deepEqual(manifest, config); assert.equal(manifest.widget, true);
const dir = path.join(root, 'page/dist', config.name), files = readdirSync(dir);
assert(files.includes('remoteEntry.js'));
assert(!files.some(file => /shared_vue/.test(file)), 'Bundled Vue fallback');
const entry = readFileSync(path.join(dir, 'remoteEntry.js'), 'utf8');
for (const key of ['./Plugin', './Widget']) assert(entry.includes(key));
const chunks = files.filter(file => file.endsWith('.js')).map(file => readFileSync(path.join(dir, file), 'utf8')).join('\n');
assert(chunks.includes('getSharedFromRuntime'));
assert(!chunks.includes('Vue.js v') && !chunks.includes('createRenderer('), 'Vue runtime leaked');
assert(!chunks.includes('H:/') && !chunks.includes('H:\\'), 'Machine path leaked');
const pkg = `${config.name}-${config.version}-1+mos-plugin_all.deb`;
if (process.argv.includes('--package')) {
  const command = process.platform === 'win32' ? 'wsl' : 'dpkg-deb';
  const file = path.join(root, 'dist', pkg);
  const linuxFile = file.replaceAll('\\', '/').replace(/^([A-Za-z]):/, (_match, drive) => `/mnt/${drive.toLowerCase()}`);
  const invoke = args => {
    const result = spawnSync(command, process.platform === 'win32' ? ['-d', 'Ubuntu-24.04', '--exec', 'dpkg-deb', ...args, linuxFile] : [...args, file], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr); return result.stdout;
  };
  const info = invoke(['--info']), listing = invoke(['--contents']);
  assert(info.includes('Architecture: all')); assert(info.includes('Package: mos-battlemoon-clock-plugin'));
  for (const name of files) assert(listing.includes(`/var/www/mos-plugins/${config.name}/${name}`));
  assert(!listing.includes('/usr/bin/') && !listing.includes('node_modules') && !listing.includes('777'));
  assert.equal(readFileSync(path.join(root, 'dist', pkg + '.md5'), 'utf8').trim(), createHash('md5').update(readFileSync(file)).digest('hex'));
  const archive = spawnSync('tar', ['-tzf', path.join(root, 'dist', `${config.name}-${config.version}-source.tar.gz`)], { encoding: 'utf8' });
  assert.equal(archive.status, 0, archive.stderr);
  assert(archive.stdout.includes('page/plugin.config.js') && archive.stdout.includes('settings.json'));
  assert(!/node_modules|\.cache|src\/generated|page\/dist|\.deb/.test(archive.stdout));
}
const hub = path.resolve(root, '../../plugins');
for (const name of (existsSync(hub) ? readdirSync(hub) : []).filter(name => name.endsWith('.json'))) {
  const item = JSON.parse(readFileSync(path.resolve(root, '../../plugins', name)));
  assert.match(item.repository, /^https:\/\//); assert(Array.isArray(item.architecture));
}
console.log(`PASS exact component artifacts, manifest/exposes, host-only Vue and portable bundles. Hub catalog check: ${existsSync(hub) ? 'PASS existing entries' : 'NOT RUN outside Hub checkout'}. Clock release catalog intentionally not activated.`);
