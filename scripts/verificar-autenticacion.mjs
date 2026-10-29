import { build } from 'esbuild';
import { mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
mkdirSync('tmp', { recursive: true });
await build({ entryPoints: ['tests/autenticacion-real.integration.ts'], outfile: 'tmp/autenticacion-real.mjs', bundle: true, packages: 'external', platform: 'node', format: 'esm', target: 'node24', tsconfig: 'tsconfig.json' });
const resultado = spawnSync(process.execPath, ['tmp/autenticacion-real.mjs'], { stdio: 'inherit' });
process.exitCode = resultado.status ?? 1;
