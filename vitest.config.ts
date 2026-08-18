/**
 * Vitest 测试配置。
 *
 * 定义两套测试项目：
 * - client：浏览器端组件/特效测试，环境为 jsdom，匹配 *.client.spec.tsx；
 * - node：宿主端逻辑测试（路由等），环境为 node，匹配 *.spec.ts。
 */
 import { defineConfig } from 'vitest/config'

 export default defineConfig({
   test: {
     projects: [
       {
         test: {
           name: 'client', // 测试项目名：client
           include: ['tests/**/*.client.spec.tsx'], // 浏览器端测试
           environment: 'jsdom', // 用 jsdom 模拟 DOM
         },
       },
       {
         test: {
           name: 'node', // 测试项目名：node
           include: ['tests/**/*.spec.ts'], // 宿主端测试
           environment: 'node', // 原生 Node 环境
         },
       },
     ],
   },
 })