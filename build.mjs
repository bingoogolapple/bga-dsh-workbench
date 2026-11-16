import { build } from 'esbuild'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'

// React is shared with the rc.3 Web renderer. Cordis and DSH SDK imports in
// browser sources are types only: feature access belongs to injected services.
const clientRuntime = new Set(['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'])

const clientRuntimeGate = {
  name: 'dsh-client-runtime',
  setup(pluginBuild) {
    pluginBuild.onResolve({ filter: /^(?:@deepseek-ai\/|react(?:-dom)?(?:\/|$)|scheduler(?:\/|$))/ }, args => {
      if (clientRuntime.has(args.path)) return { path: args.path, external: true }
      return {
        errors: [{ text: `Unsupported workbench client runtime import "${args.path}" from ${args.importer}. Use an injected service or a type-only import.` }],
      }
    })
  },
}

// Keep the build directory at the same path depth as lib so source maps
// point to src after it moves into place.
const temporaryOutput = mkdtempSync('.workbench-build-')
const previousOutput = `${temporaryOutput}-old`

try {
  await build({
    entryPoints: ['src/index.ts'],
    outfile: join(temporaryOutput, 'index.js'),
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: ['node24'],
    sourcemap: true,
    external: ['@deepseek-ai/cordis', '@deepseek-ai/dsh-*'],
  })

  const client = await build({
    entryPoints: ['src/client/index.tsx'],
    outfile: join(temporaryOutput, 'client.js'),
    bundle: true,
    format: 'cjs',
    platform: 'browser',
    target: ['es2022'],
    sourcemap: true,
    jsx: 'automatic',
    write: false,
    plugins: [clientRuntimeGate],
    banner: {
      js: "window.__ModuleLoader__.load({ id: 'bga-dsh-workbench', factory: (require) => { var module = { exports: {} }; var exports = module.exports;",
    },
    footer: { js: '__DSH_WORKBENCH_CLIENT_EXPORTS__' },
  })

  const css = client.outputFiles.find(file => basename(file.path) === 'client.css')?.text
  if (css === undefined) throw new Error('The workbench client CSS is missing')
  const clientExports = `return { ...module.exports, apply(ctx) {
    ctx.effect(() => {
      const style = document.createElement('style');
      style.dataset.pluginCss = 'bga-dsh-workbench';
      style.textContent = ${JSON.stringify(css)};
      document.head.appendChild(style);
      return () => style.remove();
    }, 'bga-dsh-workbench: styles');
    return module.exports.apply(ctx);
  } }; } });`
  for (const file of client.outputFiles) {
    const contents = basename(file.path) === 'client.js'
      ? file.text.replace('__DSH_WORKBENCH_CLIENT_EXPORTS__', () => clientExports)
      : file.contents
    writeFileSync(file.path, contents)
  }
  execFileSync('node_modules/.bin/tsc', ['-p', 'tsconfig.json', '--outDir', join(temporaryOutput, 'types')], { stdio: 'inherit' })

  if (existsSync('lib')) renameSync('lib', previousOutput)
  try {
    renameSync(temporaryOutput, 'lib')
  } catch (error) {
    if (existsSync(previousOutput)) renameSync(previousOutput, 'lib')
    throw error
  }
  rmSync(previousOutput, { recursive: true, force: true })
} finally {
  rmSync(temporaryOutput, { recursive: true, force: true })
}
