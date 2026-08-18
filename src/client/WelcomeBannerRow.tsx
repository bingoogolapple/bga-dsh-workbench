// ============================================================================
// 文件：WelcomeBannerRow.tsx —— 任务看板嵌入视图中的“欢迎横幅行”
//
// 职责：
//   在任务看板的嵌入式欢迎视图（embed 视图）顶部渲染与 hero 横幅一致的
//   「头像 + 问候语」行。配置来源与 Banner.tsx 完全相同（useBannerConfig），
//   因此用户在设置页修改文案后，这里也会同步生效。
// ============================================================================
import type { CSSProperties } from 'react'
import { AVATAR_URL, DEFAULT_TEXT, useBannerConfig } from './banner-config.ts'
import css from './task-board/embed.module.css'

// 头像样式：圆形裁切 + 轻阴影（尺寸 40px，略小于 hero 横幅的 44px）
const avatarStyle: CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  objectFit: 'cover',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
}

// 问候语文案样式
const textStyle: CSSProperties = {
  fontSize: 18,
  lineHeight: 1.2,
  fontWeight: 600,
  color: 'var(--dsw-alias-label-primary, #222)',
}

// 任务看板嵌入视图里的欢迎横幅行：外层样式由 task-board/embed.module.css 提供。
// 当设置中关闭横幅（config.show === false）时返回 null，不渲染任何内容。
export function WelcomeBannerRow() {
  const config = useBannerConfig(DEFAULT_TEXT)
  if (!config.show) return null
  return (
    <div className={css['bga-kb-embed-welcome']} data-bga-welcome-row="">
      <img src={AVATAR_URL} alt="" style={avatarStyle} />
      <span style={textStyle}>{config.text}</span>
    </div>
  )
}