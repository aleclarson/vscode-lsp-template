import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'client/out/extension': './client/src/extension.ts',
    'server/out/server': './server/src/main.ts',
  },
  format: ['cjs'],
  splitting: false,
  dts: false,
})
