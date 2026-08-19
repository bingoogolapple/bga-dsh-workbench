/**
 * 内置默认头像模块（宿主端）。
 *
 * 当用户尚未上传自定义头像（或头像路径缺失/被清空）时，
 * 网页路由会回退返回本模块提供的默认头像。
 * 图片以 base64 内嵌为常量，运行时一次性解码成 Buffer。
 * The embedded default avatar: the base64 encoding of Avatar.png, so a fresh
 * install shows the banner avatar even before any image file exists on disk
 * (and survives a missing/cleared avatar path).
 * @module bga-dsh-workbench/default-avatar
 */
/** Content type of the embedded default avatar. */
export declare const DEFAULT_AVATAR_CONTENT_TYPE = "image/png";
/** The decoded default avatar bytes, materialized once at module load. */
export declare const DEFAULT_AVATAR_BYTES: Buffer;
