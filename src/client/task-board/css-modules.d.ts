/**
 * CSS Modules 的类型声明。
 *
 * 为 `import css from './xxx.module.css'` 提供类型：
 * 编译后 classes 是「类名（原 key）→ 编译后类名」的映射对象。
 */
 declare module '*.module.css' {
   const classes: Record<string, string>
   export default classes
 }