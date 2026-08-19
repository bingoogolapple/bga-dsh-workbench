export interface BannerConfig {
    /** 横幅问候语文案 */
    readonly text: string;
    /** 是否显示横幅 */
    readonly show: boolean;
}
export declare const DEFAULT_TEXT = "\u7684 Harness \u5DE5\u4F5C\u53F0";
export declare const AVATAR_URL = "/bga-dsh-workbench/avatar";
export declare function useBannerConfig(defaultText: string): BannerConfig;
