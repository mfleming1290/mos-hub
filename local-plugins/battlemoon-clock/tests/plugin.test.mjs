import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { JSDOM } from '../page/node_modules/jsdom/lib/api.js';
const dom = new JSDOM('<div id="app"></div>', { url: 'http://mos-fixture.invalid/' });
for (const key of ['window', 'document', 'Element', 'HTMLElement', 'SVGElement', 'Node', 'localStorage']) globalThis[key] = dom.window[key];
const Vue = await import('../page/node_modules/vue/index.mjs');
// This matches the inspected MOS loader's full-version and major-version shared scope.
globalThis.__federation_shared__ = { default: { vue: { [Vue.version]: { get: () => () => Vue, loaded: true }, '3': { get: () => () => Vue, loaded: true } } } };
const remote = await import('../page/dist/battlemoon-clock/remoteEntry.js');
const unwrap = factory => { const value = factory(); return value.default || value; };
const Page = unwrap(await remote.get('./Plugin')), Widget = unwrap(await remote.get('./Widget'));
const { requestSettings, settingsConfig } = await import('../page/src/settings.mjs');
const flush = async () => { await Vue.nextTick(); await new Promise(resolve => setTimeout(resolve, 0)); await Vue.nextTick(); };
const defaults = { locale: 'en-GB', timeZone: 'UTC', seconds: true, hour12: false };
let current = { clock: { ...defaults }, future: 'preserved' }, calls, timers;
function fixture() {
  calls = []; timers = new Set();
  let now = 1700000000000;
  globalThis.fetch = async (_url, options) => { calls.push(options); if (options.method === 'POST') current = JSON.parse(options.body); return { ok: true, json: async () => structuredClone(current) }; };
  return { async readTime() { return { code: 'success', value: now }; }, schedule(tick) { timers.add(tick); return () => timers.delete(tick); }, advance() { now += 1000; for (const tick of timers) tick(); } };
}
test('real federated page/widget use host Vue; independent tick/suspend/unmount', async () => {
  const host = fixture(), state = Vue.reactive({ page: true, widget: true });
  const app = Vue.createApp({ render: () => Vue.h('div', [Vue.h(Page, { host, active: state.page }), Vue.h(Widget, { host, active: state.widget })]) });
  app.mount('#app'); await flush();
  assert.equal(document.querySelectorAll('output').length, 2); assert.equal(timers.size, 2);
  assert.match(document.body.textContent, /22:13:20/);
  const ids = [...document.querySelectorAll('output')].map(element => element.getAttribute('data-clock-instance'));
  assert(ids.every(Boolean)); assert.notEqual(ids[0], ids[1]);
  host.advance(); await flush(); assert.match(document.body.textContent, /22:13:21/);
  state.page = false; await flush(); assert.equal(timers.size, 1);
  state.widget = false; await flush(); assert.equal(timers.size, 0);
  state.page = true; state.widget = true; await flush(); assert.equal(timers.size, 2);
  app.unmount(); await flush(); assert.equal(timers.size, 0);
});
test('configuration save validates with shared core and preserves other settings', async () => {
  current = { clock: { ...defaults }, future: 'preserved' }; const host = fixture();
  const app = Vue.createApp(Page, { host }); app.mount('#app'); await flush();
  const input = document.querySelector('[name="seconds"]'); input.checked = false; input.dispatchEvent(new window.Event('change')); await flush();
  document.querySelector('form').dispatchEvent(new window.Event('submit', { cancelable: true })); await flush();
  assert.equal(current.clock.seconds, false); assert.equal(current.future, 'preserved');
  assert.equal(document.querySelector('output').textContent, '22:13');
  const zone = document.querySelector('[name="timeZone"]'); zone.value = 'not-a-zone'; zone.dispatchEvent(new window.Event('input')); await flush();
  const before = calls.length; document.querySelector('form').dispatchEvent(new window.Event('submit', { cancelable: true })); await flush();
  assert.equal(calls.length, before); assert.match(document.body.textContent, /Invalid locale or time zone/);
  app.unmount(); await flush(); assert.equal(timers.size, 0);
});
test('late settings read after owner disposal is cancelled and cannot affect replacement', async () => {
  const host = fixture(); let resolve, signal;
  globalThis.fetch = (_url, options) => { signal = options.signal; return new Promise(done => { resolve = done; }); };
  const app = Vue.createApp(Page, { host }); app.mount('#app'); await flush(); app.unmount();
  assert.equal(signal.aborted, true); assert.equal(timers.size, 0);
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ clock: defaults }) });
  const replacement = Vue.createApp(Widget, { host }); replacement.mount('#app'); await flush();
  resolve({ ok: true, json: async () => ({ clock: { ...defaults, seconds: false } }) }); await flush();
  assert.match(document.querySelector('output').textContent, /22:13:20/);
  replacement.unmount(); await flush(); assert.equal(timers.size, 0);
});
test('MOS settings denial/unavailability and invalid stored config are truthful', async () => {
  await assert.rejects(requestSettings('GET', null, null, async () => ({ ok: false, status: 403 })), /denied/);
  await assert.rejects(requestSettings('GET', null, null, async () => ({ ok: false, status: 500 })), /unavailable/);
  assert.equal(settingsConfig([]).code, 'invalid'); assert.equal(settingsConfig({ clock: { timeZone: 'bad' } }).code, 'invalid');
  assert.equal(settingsConfig({ clock: defaults }).code, 'success');
});
test('auth token is used only for MOS settings request, never package persistence', async () => {
  localStorage.setItem('authToken', 'fixture-only'); let headers;
  await requestSettings('GET', null, null, async (_url, options) => { headers = options.headers; return { ok: true, json: async () => ({ clock: defaults }) }; });
  assert.equal(headers.Authorization, 'Bearer fixture-only'); localStorage.clear();
});
test('denied initial settings load disables save and cleanup still releases Clock', async () => {
  const host = fixture(); globalThis.fetch = async () => ({ ok: false, status: 403 });
  const app = Vue.createApp(Page, { host }); app.mount('#app'); await flush();
  assert.match(document.body.textContent, /MOS settings access denied/);
  assert.equal(document.querySelector('button').disabled, true);
  app.unmount(); await flush(); assert.equal(timers.size, 0);
});
test('built remote rejects missing host Vue rather than using a bundled runtime', () => {
  const entry = new URL('../page/dist/battlemoon-clock/remoteEntry.js', import.meta.url);
  const result = spawnSync(process.execPath, ['--input-type=module', '--eval', `import assert from 'node:assert/strict'; await assert.rejects(async () => { const remote = await import(${JSON.stringify(entry.href)}); const factory = await remote.get('./Plugin'); factory(); });`], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
