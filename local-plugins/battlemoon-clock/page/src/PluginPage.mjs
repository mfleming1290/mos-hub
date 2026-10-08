import { defineComponent, h, ref, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue';
import { defaultClockConfig, validateClockConfig } from '@battlemoon/clock';
import ClockAdapter from './generated/ClockAdapter.mjs';
import { requestSettings, settingsConfig } from './settings.mjs';

function setupClock(props, editable) {
  const config = ref({ ...defaultClockConfig });
  const draft = ref({ ...defaultClockConfig });
  const message = ref('Loading MOS settings…');
  const ready = ref(false), saving = ref(false);
  const owner = new AbortController();
  let alive = true, stored = {};
  const id = `mos-battlemoon-clock-${getCurrentInstance().uid}`;
  onBeforeUnmount(() => { alive = false; owner.abort(); });
  onMounted(async () => {
    try {
      const value = await requestSettings('GET', null, owner.signal);
      if (!alive) return;
      const checked = settingsConfig(value);
      if (checked.code !== 'success') throw new Error('Invalid MOS Clock settings');
      stored = value; config.value = checked.value; draft.value = { ...checked.value };
      ready.value = true; message.value = '';
    } catch (error) { if (alive) message.value = error.message || 'MOS settings unavailable'; }
  });
  async function save() {
    if (!alive || !ready.value || saving.value) return;
    const checked = validateClockConfig(draft.value);
    if (checked.code !== 'success') { message.value = 'Invalid locale or time zone'; return; }
    saving.value = true;
    try {
      const value = await requestSettings('POST', { ...stored, clock: checked.value }, owner.signal);
      if (!alive) return;
      const result = settingsConfig(value);
      if (result.code !== 'success') throw new Error('MOS returned invalid Clock settings');
      stored = value; config.value = result.value; draft.value = { ...result.value }; message.value = 'Saved. Reload dashboard widgets to apply.';
    } catch (error) { if (alive) message.value = error.message || 'MOS settings unavailable'; }
    finally { if (alive) saving.value = false; }
  }
  return () => h('section', { 'aria-label': 'Battlemoon Clock' }, [
    h(ClockAdapter, { instanceId: props.instanceId || id, config: config.value, active: props.active, ...(props.host ? { host: props.host } : {}) }),
    message.value ? h('p', { role: 'status' }, message.value) : null,
    editable ? h('form', { onSubmit: event => { event.preventDefault(); void save(); } }, [
      ...['locale', 'timeZone'].map(key => h('label', [key === 'locale' ? 'Locale ' : 'Time zone ', h('input', { name: key, value: draft.value[key], onInput: event => { draft.value = { ...draft.value, [key]: event.target.value }; } })])),
      ...['seconds', 'hour12'].map(key => h('label', [h('input', { type: 'checkbox', name: key, checked: draft.value[key], onChange: event => { draft.value = { ...draft.value, [key]: event.target.checked }; } }), key === 'seconds' ? ' Show seconds ' : ' 12-hour time '])),
      h('button', { type: 'submit', disabled: !ready.value || saving.value }, saving.value ? 'Saving…' : 'Save Clock settings'),
    ]) : null,
  ]);
}
const props = { plugin: Object, instanceId: String, active: { type: Boolean, default: true }, host: Object };
export const Widget = defineComponent({ name: 'BattlemoonClockWidget', props, setup: p => setupClock(p, false) });
export default defineComponent({ name: 'BattlemoonClockPlugin', props, setup: p => setupClock(p, true) });
