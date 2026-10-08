import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';
import { writeFileSync } from 'node:fs';
import config from './plugin.config.js';

export default defineConfig({
  plugins: [vue(), federation({
    name: config.name,
    filename: 'remoteEntry.js',
    exposes: { './Plugin': './src/Plugin.vue', './Widget': './src/Widget.vue' },
    // A missing/incompatible host Vue is an explicit load failure, never a second runtime.
    shared: { vue: { import: false, generate: false, requiredVersion: '^3.5.0' } },
  }), {
    name: 'manifest',
    closeBundle() { writeFileSync(new URL(`./dist/${config.name}/manifest.json`, import.meta.url), JSON.stringify(config, null, 2)); },
  }],
  build: { target: 'esnext', minify: false, cssCodeSplit: false,
    outDir: `dist/${config.name}`, assetsDir: '', rollupOptions: { input: {} } },
});
