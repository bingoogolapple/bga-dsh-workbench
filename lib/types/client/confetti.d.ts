export interface BurstRect {
    /** 区域左边缘（视口坐标系） */
    readonly left: number;
    /** 区域上边缘（视口坐标系） */
    readonly top: number;
    /** 区域宽度（px） */
    readonly width: number;
    /** 区域高度（px） */
    readonly height: number;
}
export interface BurstClock {
    /** 返回当前时间（毫秒） */
    now: () => number;
    /** 注册下一帧回调，返回帧 id */
    raf: (callback: (timestamp: number) => void) => number;
    /** 取消已注册的帧回调 */
    cancelRaf: (id: number) => void;
    /** 随机数发生器（默认 Math.random）；注入固定实现可获得可复现的动画 */
    random?: () => number;
}
export declare function runConfettiBurst(rect: BurstRect, options?: Partial<BurstClock> & {
    count?: number;
}): () => void;
