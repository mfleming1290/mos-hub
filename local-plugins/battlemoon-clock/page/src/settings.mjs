import { defaultClockConfig, validateClockConfig } from '@battlemoon/clock';

export async function requestSettings(method, body, signal, fetcher = globalThis.fetch) {
  const token = globalThis.localStorage?.getItem('authToken') || globalThis.localStorage?.getItem('token');
  const response = await fetcher('/api/v1/mos/plugins/settings/battlemoon-clock', {
    method, signal,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!response.ok) throw new Error(response.status === 401 || response.status === 403 ? 'MOS settings access denied' : 'MOS settings unavailable');
  return response.json();
}

export function settingsConfig(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { code: 'invalid' };
  return validateClockConfig(value.clock ?? defaultClockConfig);
}
