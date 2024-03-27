import type { Options } from 'tsup';

export const tsup: Options = {
  splitting: true,
  clean: true,
  dts: true,
  format: ['cjs', 'esm'],
  skipNodeModulesBundle: true,
  entryPoints: ['src/index.ts'],
  target: 'es2020',
  outDir: 'lib',
};
