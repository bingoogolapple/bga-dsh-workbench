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
 import { readFileSync, writeFileSync } from 'node:fs'
 import { mkdirSync } from 'node:fs'
 import { execFileSync } from 'node:child_process'

 // 创建 lib 输出目录
 mkdirSync('lib', { recursive: true })

 // 需要保持外部（不打包）的 DSH 相关包：宿主与浏览器端都会引用
 const dshExternal = ['@deepseek-ai/cordis', '@deepseek-ai/dsh-*']

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