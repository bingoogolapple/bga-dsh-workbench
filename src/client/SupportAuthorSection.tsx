// ============================================================================
// 文件：SupportAuthorSection.tsx —— 设置页「支持作者」区块
//
// 职责：
//   纯展示区块，包含「打赏支持作者」与「作者项目推荐」两部分：
//     - 「打赏支持作者」：引导用户通过作者邀请链接订阅 OpenCode Go，
//       双方各得 $5 订阅额度，并附上使用额度限制说明；
//     - 「作者项目推荐」：推荐作者的独立开发软件产品与 DSH 项目。
//   无状态、无请求、无回调，直接渲染静态链接，放在「工作区打开方式」模块之后。
// ============================================================================
import { useState, type CSSProperties, type ReactNode } from 'react'

const OPENCODE_GO_URL = 'https://opencode.ai/go?ref=8CYK5082AG'
const GOD_ASSISTANT_URL = 'https://github.com/bingoogolapple/bga-god-assistant-config'
const DSH_CLIENT_URL = 'https://github.com/bingoogolapple/bga-dsh-client'

const cardStyle: CSSProperties = {
  background: 'var(--dsw-alias-bg-layer, #fff)',
  border: '1px solid var(--dsw-alias-border-l2, #ddd)',
  borderRadius: 10,
  padding: '10px 12px',
  marginTop: 8,
}
const h3Style: CSSProperties = { fontSize: 15, margin: '0 0 8px' }
const subH3Style: CSSProperties = { fontSize: 13, margin: '12px 0 6px', fontWeight: 600 }
const paragraphStyle: CSSProperties = {
  fontSize: 13,
  lineHeight: 1.7,
  margin: '4px 0',
  color: 'var(--dsw-alias-text-primary, #111)',
}
const captionStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--dsw-alias-label-secondary, #666)',
  marginTop: 6,
}
const listStyle: CSSProperties = {
  margin: '4px 0 0',
  paddingLeft: 18,
  fontSize: 12,
  lineHeight: 1.7,
  color: 'var(--dsw-alias-label-secondary, #666)',
}
// 链接默认态：硬编码业界标准链接蓝 #1677ff（antd 主色），不依赖宿主主题变量。
// 注意：宿主 --dsw-alias-brand-primary 实为文本前景色（浅色主题近黑 / 深色主题近白），
// 并非蓝色，直接引用会导致链接与正文同色、无法辨识。
const linkStyle: CSSProperties = {
  color: '#1677ff',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'filter 0.15s ease',
}
// 链接悬停态：出现下划线并整体压暗一档提供反馈（品牌色跟随主题变量，不做硬编码）
const linkHoverStyle: CSSProperties = {
  textDecoration: 'underline',
  textUnderlineOffset: 2,
  filter: 'brightness(0.8)',
}

// 内联样式无法书写 :hover，故用小组件 + 事件切换实现悬停反馈
function SupportLink({ href, children }: { href: string; children: ReactNode }): JSX.Element {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={hovered ? { ...linkStyle, ...linkHoverStyle } : linkStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  )
}

export function SupportAuthorSection(): JSX.Element {
  return (
    <div style={cardStyle}>
      <h3 style={h3Style}>支持作者</h3>

      <h4 style={subH3Style}>打赏支持作者</h4>
      <p style={paragraphStyle}>
        作者主要使用的 Coding Plan 是 <SupportLink href={OPENCODE_GO_URL}>OpenCode Go</SupportLink>，
        基于开源的 <SupportLink href={OPENCODE_GO_URL}>opencode.ai</SupportLink> 提供云端订阅（OpenCode Go）。
        通过作者的邀请链接 <SupportLink href={OPENCODE_GO_URL}>订阅 OpenCode Go</SupportLink>，您和作者各可得 $5 订阅额度——欢迎通过此链接支持作者，感谢！
      </p>
      <div style={captionStyle}>OpenCode Go 包含以下使用额度限制，使用便宜点的模型几乎不会有 Token 焦虑：</div>
      <ul style={listStyle}>
        <li>5 小时限制 — 12 美元使用额度</li>
        <li>每周限制 — 30 美元使用额度</li>
        <li>每月限制 — 60 美元使用额度</li>
      </ul>

      <h4 style={subH3Style}>作者项目推荐</h4>
      <p style={paragraphStyle}>
        · 欢迎您使用作者开发的第一个独立开发软件产品
        <SupportLink href={GOD_ASSISTANT_URL}> 上帝小助手浏览器扩展/插件开发平台</SupportLink>
      </p>
      <p style={paragraphStyle}>
        · 欢迎您使用作者的另一个 DSH 项目
        <SupportLink href={DSH_CLIENT_URL}> DSH 桌面客户端（bga-dsh-client）</SupportLink>：
        一个基于 Tauri 2 的 DeepSeek Harness 桌面客户端，提供小白用户一键安装、dsh 服务管理、局域网代理服务管理等功能。
      </p>
    </div>
  )
}
