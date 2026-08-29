/**
 * 构建脚本（node build.mjs）。
 *
 * 用 esbuild 把插件打成两个产物：
 * 1. lib/index.js  —— 宿主端（Host）ESM 包，Node 平台运行；
 * 2. lib/client.js —— 浏览器端（Client）CJS 包，注入 DSH 的模块加载器横幅
 *    （window.__ModuleLoader__.load），并把编译出的 CSS 内联进 JS。
 * 最后运行 tsc 生成 .d.ts 类型声明（tsconfig.json 配置 declaration 输出）。
 */
 import { build } from 'esbuild'
 import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs'
 import { mkdirSync } from 'node:fs'
 import { execFileSync } from 'node:child_process'

 // 清空 lib 输出目录，避免旧构建产物（如已删除的 worktree 残留 d.ts）混入
 if (existsSync('lib')) {
   rmSync('lib', { recursive: true, force: true })
 }
 mkdirSync('lib', { recursive: true })

 // 需要保持外部（不打包）的 DSH 相关包：宿主与浏览器端都会引用
 const dshExternal = ['@deepseek-ai/cordis', '@deepseek-ai/dsh-*']

 // ---- 客户端 bundle 纯度门 ----
 // client bundle 里每个 external 的 @deepseek-ai/* 都会编译成运行时 require()，
 // 由 DSH 的冻结模块表（platform seed 表）解析。而这份 seed 表随版本变化：
 //   - 0.1.1-rc.x     ：有 @deepseek-ai/dsh-client-runtime/client
 //   - 0.1.2-alpha.1+ ：改为裸名 @deepseek-ai/dsh-client-store
 // 一旦 require 到「当前版本不存在」的 seed，报的不是某个功能失效，而是
 // “missed the module table” → **整个插件加载失败**。
 // 所以在构建期就把这类值导入拦住，避免「构建过了、真机炸」。

 /** 新旧版本平台模块表**都存在的** seed 词（可放心 external）。 */
 const PLATFORM_SEED_BOTH = new Set([
   'react', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom', 'react-dom/client',
   '@deepseek-ai/cordis',
   '@deepseek-ai/dsh-client-ui-slots',
   '@deepseek-ai/dsh-client-ui-primitives',
 ])

 /** 只存在于单一版本的 seed 词：必须经兼容层惰性 require，禁止静态值导入。 */
 const VERSION_SPECIFIC = new Set([
   '@deepseek-ai/dsh-client-store', // 仅 0.1.2-alpha.1+
   '@deepseek-ai/dsh-client-runtime/client', // 仅 0.1.1-rc.x（新版已移除）
 ])

 /** 唯一被允许 require 版本专属 seed 的文件。 */
 const COMPAT_SHIM = 'compat/runtime-modules.ts'

 /**
  * esbuild 插件：拦截 client bundle 内所有 @deepseek-ai/* 的解析。
  * - 平台 seed（新旧版本都有）→ 放行
  * - 版本专属 seed + 来自兼容层的 require() 调用 → 放行（该处会 try/catch 兜底）
  * - 其余 → 构建失败
  * 注意：`import type` 会被 esbuild 在解析前擦除，不会触发本门。
  */
 function clientPurityGate() {
   return {
     name: 'dsh-client-purity',
     setup(pluginBuild) {
       pluginBuild.onResolve({ filter: /^@deepseek-ai\// }, (args) => {
         if (PLATFORM_SEED_BOTH.has(args.path)) return null
         const fromShim = args.importer.endsWith(COMPAT_SHIM)
         if (args.kind === 'require-call' && fromShim && VERSION_SPECIFIC.has(args.path)) return null
         const hint = VERSION_SPECIFIC.has(args.path)
           ? `该 specifier 只存在于单一 DSH 版本，必须经 ${COMPAT_SHIM} 惰性 require（带 try/catch 兜底）`
           : '它不在平台模块表的 seed 列表里，运行时 require 会失败'
         return {
           errors: [{
             text:
               `client bundle purity: 浏览器端不允许值导入 "${args.path}" —— ${hint}\n`
               + `  引入位置：${args.importer}\n`
               + `  改法：改 import type（类型在编译期擦除，不产生运行时 require），或经 compat 层取用。`,
           }],
         }
       })
     },
   }
 }

 // ---- 产物 1：宿主端 ----
 await build({
   entryPoints: ['src/index.ts'],
   outfile: 'lib/index.js',
   bundle: true,
   format: 'esm',
   platform: 'node',
   target: ['node22'],
   sourcemap: true,
   external: dshExternal,
   logLevel: 'info',
 })

 // ---- 产物 2：浏览器端 ----
 await build({
   entryPoints: ['src/client/index.tsx'],
   outfile: 'lib/client.js',
   bundle: true,
   format: 'cjs', // 由下方的 ModuleLoader 包装成工厂函数，因此保持 CJS 形态
   platform: 'browser',
   target: ['es2022'],
   sourcemap: true,
   jsx: 'automatic', // 自动 JSX runtime
   external: [...dshExternal, 'react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'scheduler'],
   // 纯度门：拦住会让旧版 DSH 加载失败的“版本专属”值导入
   plugins: [clientPurityGate()],
   // 头部包装：把产物包进 DSH 的模块加载器，注册为 bga-dsh-workbench 插件模块
   banner: {
     js: "window.__ModuleLoader__.load({ id: 'bga-dsh-workbench', factory: (require) => { var module = { exports: {} }; var exports = module.exports;",
   },
   // 尾部包装：返回模块导出并闭合加载器调用
   footer: {
     js: 'return module.exports; } });',
   },
   logLevel: 'info',
 })

 // ---- CSS 内联 ----
 // 把 esbuild 输出的 CSS 文件内容内联成一段 <style> 注入脚本，拼进 client.js，
 // 这样浏览器侧无需单独加载 .css 文件也能生效
 const cssFile = 'lib/client.css'
 const jsFile = 'lib/client.js'
 try {
   const css = readFileSync(cssFile, 'utf8')
   const cssSnippet = `
if(typeof document!=="undefined"){var __s=document.createElement("style");__s.dataset.pluginCss="bga-dsh-workbench-kb";__s.textContent=${JSON.stringify(css)};document.head.appendChild(__s);}
`
   const js = readFileSync(jsFile, 'utf8')
   // 找到包装器锚点，在其后插入 CSS 注入代码
   const marker = 'var exports = module.exports;'
   const idx = js.indexOf(marker)
   if (idx !== -1) {
     const insertAt = idx + marker.length
     writeFileSync(jsFile, js.slice(0, insertAt) + '\n' + cssSnippet + js.slice(insertAt))
     console.log(`  lib/client.js  CSS inlined (${(Buffer.byteLength(css) / 1024).toFixed(1)}KB)`)
   }
 } catch {
   // 浏览器端没有 CSS 产物时跳过内联（不致命）
 }

 // ---- 类型声明 ----
 // 用 tsc 按 tsconfig.json 生成 lib/types 下的 .d.ts
 execFileSync('node_modules/.bin/tsc', ['-p', 'tsconfig.json'], { stdio: 'inherit' })