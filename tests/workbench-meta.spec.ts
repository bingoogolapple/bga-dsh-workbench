// ============================================================
// workbench-meta.spec.ts —— 工作台元数据（日报「当日完成」打卡）测试
// ============================================================
// 覆盖：空元数据、打卡/取消/切换、查询、外部数据校验。
import { describe, expect, it } from 'vitest'
import {
  emptyWorkbenchMeta, isDayMarked, isWorkbenchMeta, markDayDone, toggleDayDone, unmarkDayDone,
} from '../src/core/workbench-meta.ts'

describe('emptyWorkbenchMeta', () => {
  it('返回空打卡表与更新时间戳', () => {
    const meta = emptyWorkbenchMeta(1234)
    expect(meta.dayDoneAt).toEqual({})
    expect(meta.updatedAt).toBe(1234)
  })
})

describe('markDayDone / unmarkDayDone / toggleDayDone', () => {
  it('打卡写入时间戳且不动其他天', () => {
    const meta = markDayDone(emptyWorkbenchMeta(0), '2018-08-20', 100)
    expect(meta.dayDoneAt['2018-08-20']).toBe(100)
    expect(meta.updatedAt).toBe(100)
    const next = markDayDone(meta, '2018-08-21', 200)
    expect(next.dayDoneAt['2018-08-20']).toBe(100)
    expect(next.dayDoneAt['2018-08-21']).toBe(200)
  })

  it('取消打卡只删除该天', () => {
    const meta = markDayDone(markDayDone(emptyWorkbenchMeta(0), '2018-08-20', 100), '2018-08-21', 200)
    const unmarked = unmarkDayDone(meta, '2018-08-20', 300)
    expect(unmarked.dayDoneAt['2018-08-20']).toBeUndefined()
    expect(unmarked.dayDoneAt['2018-08-21']).toBe(200)
  })

  it('打卡后保留周起始/分类/提醒等其余字段（防止数据丢失）', () => {
    const base = emptyWorkbenchMeta(0)
    base.weekStart = 'sunday'
    base.categories = [{ id: 'custom', label: '自定义' }]
    base.reminder = { enabled: true, cron: '0 21 * * *' }
    const marked = markDayDone(base, '2018-08-20', 100)
    expect(marked.weekStart).toBe('sunday')
    expect(marked.categories).toEqual([{ id: 'custom', label: '自定义' }])
    expect(marked.reminder).toEqual({ enabled: true, cron: '0 21 * * *' })
  })

  it('切换：未打卡→打卡，已打卡→取消', () => {
    const a = toggleDayDone(emptyWorkbenchMeta(0), '2018-08-20', 100)
    expect(isDayMarked(a, '2018-08-20')).toBe(true)
    const b = toggleDayDone(a, '2018-08-20', 200)
    expect(isDayMarked(b, '2018-08-20')).toBe(false)
  })
})

describe('isWorkbenchMeta 校验', () => {
  it('接受合法元数据', () => {
    expect(isWorkbenchMeta({ dayDoneAt: { '2018-08-20': 1 }, updatedAt: 1 })).toBe(true)
    expect(isWorkbenchMeta(emptyWorkbenchMeta(0))).toBe(true)
  })

  it('拒绝非法载荷（文件损坏/结构不符时容错回退）', () => {
    expect(isWorkbenchMeta(null)).toBe(false)
    expect(isWorkbenchMeta('x')).toBe(false)
    expect(isWorkbenchMeta({ dayDoneAt: 'bad', updatedAt: 1 })).toBe(false)
    expect(isWorkbenchMeta({ dayDoneAt: { 'not-a-date': 1 }, updatedAt: 1 })).toBe(false)
    expect(isWorkbenchMeta({ dayDoneAt: { '2018-08-20': 'x' }, updatedAt: 1 })).toBe(false)
    expect(isWorkbenchMeta({ dayDoneAt: {}, updatedAt: NaN })).toBe(false)
  })
})