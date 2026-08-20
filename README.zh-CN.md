# DeepSeek Harness 个人工作台插件

[![License](https://img.shields.io/github/license/bingoogolapple/bga-dsh-workbench)](LICENSE)
[![npm](https://img.shields.io/npm/v/bga-dsh-workbench.svg)](https://www.npmjs.com/package/bga-dsh-workbench)
[![npm](https://img.shields.io/npm/dm/bga-dsh-workbench.svg)](https://www.npmjs.com/package/bga-dsh-workbench)

**🌐 [English Documentation](README.md)**

一个为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 定制的个人工作台插件：在 hero 空态页顶部展示个性化横幅与头像、完成回合时撒彩带庆祝，并内置一个可驱动 agent 会话执行的「任务看板」。

![主界面截图](images/bga-dsh-workbench-main.png)
![设置页截图](images/bga-dsh-workbench-settings.png)

## 功能介绍

### 🎉 个性化横幅（Hero Banner）

- 在 Harness Web 界面的 hero 空态顶部展示一条工作台横幅。
- 可自定义：
  - **问候语文本**：默认「的专属 Harness 工作台」，可改成任意文案（如「张三的专属 Harness 工作台」）。
  - **头像图片**：可上传本地图片作为横幅头像，留空则使用内置默认头像；支持的格式为 PNG / JPG / GIF / WebP，由后端嗅探类型后落盘到存储目录。
  - **显示开关**：随时关闭横幅。
- 配置通过「工作台设置」命名空间持久化，可在设置页直接修改并即时生效。

### 🎊 完成回合庆祝（Confetti）

- 每当一个对话回合完成，前端自动播放撒彩带动画。
- 可选**庆祝音效**开关（默认开启）。

### 🧠 英语学习（多邻国式微学习）

- **随彩带一起触发**：整轮对话完成放彩带的同时（配置了话题卡时）弹出一道英语小题。
- **话题卡片**：每套生成/内置的词库是一张卡，多张卡并存，你**手动选择当天学习哪张卡**（选择会持久化）。
- **词库来源**：
  - **内置 CEFR 分级词库（A1–C2）**——一键选用，无需模型生成；
  - **模型按主题生成**——输入主题，驱动一个真实 agent 会话生成约 12 个词（含释义与例句），并落盘本地缓存。
- **游戏化机制**（全部本地、无后端）：
  - ❤️ **心形**（每天 5 颗）：答错扣 1 颗，扣完当天该卡锁定；
  - 🔥 **连击**：连续活跃天数；
  - ⚡ **XP 与段位**（青铜→钻石）；
  - 🎓 **掌握**：已达标的词标记为已完成（不删除），不再出现在随机抽取中。
- **掌握规则**：每张卡可选「按次数（答对 N 次）」或「间隔重复 SRS」。
- **答题模式**：抄写 / 回忆（给中文填英文）/ 四选一 / 听音拼写（本地 Web Speech 朗读）。
- **数据隐私**：全部进度持久化到宿主存储目录（`english-data.json`）；支持 **导出 / 导入 JSON** 以备份与迁移，**无需自建后端**。
- 当前卡全部掌握后，会弹出提示，引导你换一张话题卡或生成新主题。

### 📋 内置任务看板（Task Board）

- 在侧边栏提供「任务看板」入口，以多列看板形式管理任务。
- 任务可**真实执行**——驱动 agent 会话去完成；执行目标可钉定为：
  - 工作区（workspace）；
  - 模式（agent 预设）；
  - 权限（`read-only` / `workspace-write` / `danger-full-access`，缺省用运行时默认）。
- 支持 **5 段 cron 定时执行**（如 `0 23 * * *` 每天 23 点）。
- 任务数据由宿主持久化到存储目录（`tasks.json`）。
- 限制说明：
  - 定时调度在浏览器端，需要 GUI 标签页打开；错过即跳过，不会补跑。
  - 执行会消耗 API 额度。
- 插件会向 agent 的 system prompt 注入任务看板使用指引，使你提到「任务看板 / 看板 / 定时任务」时 agent 能据此协作。

## 任务看板来源说明

本插件的「任务看板」功能基于开源项目 [`zhu1090093659/dsh-web-ui`](https://github.com/zhu1090093659/dsh-web-ui) 下的子包 [`packages/dsh-task-board`](https://github.com/zhu1090093659/dsh-web-ui/tree/main/packages/dsh-task-board) **二次开发定制**而成。

- **上游项目**：`dsh-task-board` —— 一个可热插拔的 DeepSeek Harness（DSH）Web GUI 任务看板插件，具备 Host 权威账本、真实 DSH 会话执行、Host 端 5 段 cron 定时调度等能力，通过 `cordis.patch.yml` 与 profile 机制挂载，不改动 DSH 源码。
- **本插件定制点**：在沿用其任务看板核心（多列看板、Host 权威账本 `tasks.json`、真实会话执行、5 段 cron 调度、system prompt 注入）的基础上，集成了本插件的工作台横幅与完成回合彩带，并统一纳入「工作台设置」命名空间与宿主装配。
- **许可证**：请以上游仓库 `packages/dsh-task-board/LICENSE` 文件为准，遵循其开源协议使用与分发。

## 软件使用者

如果你只是想安装并使用这个插件，无需从源码构建。

### 安装（通过 DSH 插件机制）

本插件以 DSH 插件包的形式分发。在已安装 DeepSeek Harness 的环境中，使用 `dsh` CLI 将其加入你的 profile 即可：

```bash
# 从 npm 安装（发布后）
dsh plugin --profile <你的 profile 名> add bga-dsh-workbench

# 或从 Git 仓库安装
dsh plugin --profile <你的 profile 名> add github:bingoogolapple/bga-dsh-workbench

# 或本地路径安装（开发调试）
dsh plugin --profile <你的 profile 名> add /path/to/bga-dsh-workbench
```

> 安装后重启 DSH 服务（或相应 profile），横幅、任务看板等能力即生效。

### 使用

1. 打开 Harness Web 界面，在设置页的「工作台」分组中配置横幅文本、头像、彩带音效等。
2. 从侧边栏「任务看板」入口进入看板，新建并管理你的任务；需要时开启定时执行。
3. 在对话框中与「任务看板」协作，让 agent 帮你管理并执行任务。

## 软件维护者

如果你是仓库维护者或想基于源码自行修改、重新构建，请往下看。

### 目录结构

```
bga-dsh-workbench/
├── images/                       # README 截图素材
│   ├── bga-dsh-workbench-main.png   # 主界面
│   └── bga-dsh-workbench-settings.png  # 设置页
├── src/                          # 源码
│   ├── index.ts                  # 宿主端（Host）入口：装配横幅/路由/任务看板
│   ├── routes.ts                 # HTTP 路由：横幅头像/配置/设置/任务持久化
│   ├── settings.ts               # 「工作台设置」命名空间与 schema
│   ├── task-board-host.ts        # 向 agent system prompt 注入任务看板指引
│   ├── open-app.ts               # 「打开方式」相关逻辑（终端/编辑器/附加 IDE）
│   ├── core/                     # 任务看板存储等核心逻辑
│   └── client/                   # 浏览器端（Client）：横幅、任务看板 UI、设置分区等
├── lib/                          # 构建产物（esbuild 打包 + tsc 类型声明），发布时随包携带
├── build.mjs                     # 构建脚本：产出 lib/index.js（宿主）与 lib/client.js（浏览器）
├── cordis.patch.yml              # Cordis 组合补丁：把插件插入宿主组合
├── dsh.plugin.json               # 插件清单（入口、注入、客户端平台）
├── package.json                  # 依赖与脚本
├── tsconfig.json                 # TypeScript 配置（含 declaration 输出）
├── vitest.config.ts              # 测试配置
├── pnpm-lock.yaml                # pnpm 依赖锁定
├── pnpm-workspace.yaml
├── LICENSE                       # MIT License
└── README.zh-CN.md
```

### 从源码构建

前置条件：Node.js ≥ 22.19、pnpm、本地已存在 `../deepseek-harness`（开发依赖以 `link:` 引用）。

```bash
pnpm install          # 安装依赖（devDeps 链接到本地 deepseek-harness）
pnpm typecheck       # tsc --noEmit 类型检查
pnpm test            # vitest 运行单元测试（当前 145 个用例）
pnpm build           # 执行 build.mjs：产出 lib/ 下的宿主/浏览器产物与类型声明
pnpm check           # 依次运行 typecheck + test + build
```

> `prepack` 脚本会在 `pnpm publish` 前自动执行 `pnpm build`，保证发布的 `lib/` 是最新构建。

### 本地调试

开发阶段可用本地路径安装到你的 DSH profile：

```bash
dsh plugin --profile <你的 profile 名> add .
```

修改源码后重新 `pnpm build`，再重启对应 profile 的 DSH 服务即可加载最新产物。

### 打包发布

1. 确保 `package.json` 的 `files` 字段（已包含 `lib`、`dsh.plugin.json`、`cordis.patch.yml`、`LICENSE`、`README.md`、`README.zh-CN.md`）与实际产物一致；发布前先本地 `pnpm build` 生成 `lib/`。
2. 打版本 tag 并推送，例如：

   ```bash
   git tag v0.0.1
   git push origin v0.0.1
   ```

3. 使用者即可安装本插件：

   - 从 npm（发布后）：

     ```bash
     dsh plugin --profile <profile> add bga-dsh-workbench
     ```

     其中 `<profile>` 为目标 DSH profile 名称（如 `web`）：

     ```bash
     dsh plugin --profile web add bga-dsh-workbench
     ```

   - 从 Git 仓库（未发布 npm 时）：

     ```bash
     dsh plugin --profile <profile> add github:bingoogolapple/bga-dsh-workbench
     ```

## 打赏支持作者

* 作者主要使用的 Coding Plan 是 [OpenCode Go](https://opencode.ai/go?ref=8CYK5082AG)，基于开源的 [opencode.ai](https://opencode.ai/go?ref=8CYK5082AG) 提供云端订阅（OpenCode Go）。通过作者的邀请链接 [订阅 OpenCode Go](https://opencode.ai/go?ref=8CYK5082AG)，**您和作者各可得 $5 订阅额度**——欢迎通过此链接支持作者，感谢！

OpenCode Go 包含以下使用额度限制，使用便宜点的模型几乎不会有 Token 焦虑：

- 5 小时限制 — 12 美元使用额度
- 每周限制 — 30 美元使用额度
- 每月限制 — 60 美元使用额度

## 作者项目推荐

* 欢迎您使用作者开发的第一个独立开发软件产品 [上帝小助手浏览器扩展/插件开发平台](https://github.com/bingoogolapple/bga-god-assistant-config)
* 欢迎您使用作者的另一个 DSH 项目 [DSH 桌面客户端（bga-dsh-client）](https://github.com/bingoogolapple/bga-dsh-client)：一个基于 Tauri 2 的 DeepSeek Harness 桌面客户端，提供菜单栏、托盘、窗口管理、配置导入导出等桌面端能力，可独立运行也可与网关协同。

## License

本项目基于 [MIT License](LICENSE) 开源，可自由使用、修改与分发。
