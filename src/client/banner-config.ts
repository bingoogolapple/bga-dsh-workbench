// ============================================================================
// 文件：banner-config.ts —— 横幅配置的获取与订阅
//
// 职责：
//   提供横幅组件所需的配置（问候语文案 text 与是否显示 show）及其获取逻辑：
//   封装了从 /bga-dsh-workbench/config 拉取配置、监听“配置已变更”事件实时刷新的
//   React Hook（useBannerConfig），并导出默认文案与头像地址等常量。
// ============================================================================
import { useEffect, useRef, useState } from 'react'

// 横幅配置数据（与后端 /config 接口返回的 banner 字段对齐）。
export interface BannerConfig {
  /** 横幅问候语文案 */
  readonly text: string
  /** 是否显示横幅 */
  readonly show: boolean
}

// 默认问候语后缀：用户未配置文案时使用（例如“xxx 的专属 Harness 工作台”）。
export const DEFAULT_TEXT = '的专属 Harness 工作台'
// 头像图片的读取地址（GET 获取图片；上传走 POST）。
export const AVATAR_URL = '/bga-dsh-workbench/avatar'

// 配置读取地址（设置页与横幅组件共用）
const CONFIG_URL = '/bga-dsh-workbench/config'

// 横幅配置 Hook：组件挂载时拉取一次配置，并订阅“配置已变更”事件持续刷新。
// @param defaultText 后端未配置文案（或文案为空）时使用的默认问候语
// @returns 当前生效的横幅配置；初始为 { text: defaultText, show: true }
export function useBannerConfig(defaultText: string): BannerConfig {
  const [config, setConfig] = useState<BannerConfig>({ text: defaultText, show: true })
  // 递增令牌用于防竞态：只有最后一次发起的请求结果才被采纳，
  // 避免响应较慢的旧请求覆盖较新的配置。
  const fetchToken = useRef(0)

  useEffect(() => {
    // 拉取一次配置并更新 state；拉取失败时静默保留当前值
    const fetchConfig = (): void => {
      const token = ++fetchToken.current
      fetch(CONFIG_URL, { cache: 'no-store' }) // no-store：每次实时拉取，避免命中缓存
        .then(response => response.ok ? response.json() : Promise.reject(new Error(String(response.status))))
        .then((value: { banner?: Partial<BannerConfig> }) => {
          if (token !== fetchToken.current) return // 已有更新的请求发出，丢弃本次结果
          const banner = value.banner ?? {}
          setConfig({
            text: typeof banner.text === 'string' && banner.text.length > 0 ? banner.text : defaultText,
            show: banner.show !== false,
          })
        })
        // 网络异常 / 后端不可用时静默忽略：保持现有配置不变
        .catch(() => {  })
    }
    fetchConfig()
    // 监听全局“配置已变更”事件（设置页保存后广播），触发重新拉取
    const refresh = (): void => { fetchConfig() }
    window.addEventListener('bga-dsh-workbench:config-changed', refresh)
    return () => {
      // 清理：移除事件监听，并递增令牌让仍在途的请求结果作废
      window.removeEventListener('bga-dsh-workbench:config-changed', refresh)
      fetchToken.current += 1
    }
  }, [defaultText])

  return config
}