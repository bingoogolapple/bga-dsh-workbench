import type { CSSProperties } from 'react'
import { AVATAR_URL, DEFAULT_TEXT, useBannerConfig } from './banner-config.ts'

const bannerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
  minWidth: 0,
  maxWidth: '100%',
  padding: '8px 16px',
  userSelect: 'text',
}

const avatarStyle: CSSProperties = {
  flex: 'none',
  width: 44,
  height: 44,
  borderRadius: '50%',
  objectFit: 'cover',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
}

const textStyle: CSSProperties = {
  fontSize: 20,
  lineHeight: 1.2,
  fontWeight: 600,
  color: 'var(--dsw-alias-label-primary)',
  overflowWrap: 'anywhere',
}

/** Welcome banner placed by the Conversation hero slot. */
export function WorkbenchBanner() {
  const config = useBannerConfig(DEFAULT_TEXT)

  if (!config.show) return null
  return (
    <div style={bannerStyle} data-bga-banner="">
      <img src={AVATAR_URL} alt="" style={avatarStyle} />
      <span style={textStyle}>{config.text}</span>
    </div>
  )
}
