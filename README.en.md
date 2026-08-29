# DeepSeek Harness Personal Workbench Plugin

[![License](https://img.shields.io/github/license/bingoogolapple/bga-dsh-workbench)](LICENSE)
[![npm](https://img.shields.io/npm/v/bga-dsh-workbench.svg)](https://www.npmjs.com/package/bga-dsh-workbench)
[![npm](https://img.shields.io/npm/dm/bga-dsh-workbench.svg)](https://www.npmjs.com/package/bga-dsh-workbench)

English | [中文](README.md)

A personal workbench plugin customized for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness): it shows a customizable banner with an avatar at the top of the empty state; when a chat turn completes it plays confetti with the color theme, intensity and trigger timing you pick, and can kick off a foreign-language quiz session (1 question by default, 1–10 adjustable; built-in CEFR-graded word lists or model-generated topics, with hearts, streaks, badge tiers and a wrong-word notebook); the built-in Task Board offers both a Week Matrix and a five-column kanban — use it as a lightweight todo list, or hand tasks to the agent to actually execute, with cron scheduling; and open a workspace directory in one click with your local terminal, editor, or apps like Xcode / Android Studio. All data lives in the host's local storage directory, so no self-hosted backend is needed.

![bga-dsh-workbench](images/bga-dsh-workbench.gif)

## Features

### 🎉 Personalized Banner (Hero Banner)

- Displays a workbench banner at the top of the empty state on the Harness web interface. When enabled, it automatically hides Harness's default "Explore the Unknown" headline so the two never overlap.
- Customizable:
  - **Greeting text**: defaults to "的专属 Harness 工作台" (Harness Workbench). You can change it to anything, e.g. "张三的专属 Harness 工作台" (Zhang San's Harness Workbench).
  - **Avatar image**: upload a local image as the banner avatar; if left empty, a built-in default avatar is used. Supported formats are PNG / JPG / GIF / WebP; the backend sniffs the type and persists it to the storage directory.
  - **Visibility toggle**: hide the banner at any time.
- Configuration is persisted under the "Workbench Settings" namespace and takes effect immediately after editing on the settings page.

### 🎊 Turn-Complete Celebration (Confetti)

- Whenever a chat turn completes, the page automatically plays a confetti animation to add a little ceremony to your workflow.
- Fully customizable (all on the settings page):
  - **Celebration sound**: on/off toggle plus a "Preview" button (on by default);
  - **Color themes**: Default / Gold / Ocean / Sakura / Neon;
  - **Intensity**: Small / Medium / Large / Epic;
  - **Trigger timing**: On success only / Every turn / Task execution only (with "Task execution only", normal chat turns no longer trigger confetti).

### 🧠 Foreign Language Learning (Duolingo-style micro-learning)

- **Triggered with confetti**: when a chat turn completes, alongside the confetti a one-question quiz pops up (when a learning card is configured), and you can control the pace:
  - **Learning frequency**: after every turn / every 2 turns / every 5 turns / every 10 turns / manual trigger only;
  - **Daily answer limit**: to avoid over-practice (set 0 for unlimited).
- **Topic cards**: each vocabulary set is a card; multiple cards coexist and you **manually select which card to learn today** (persisted).
- **Content sources**:
  - **Built-in CEFR-graded word lists** (A1–C2) — one click to adopt, no model needed.
  - **Model generation** — pick a topic and the currently selected model generates ~20 items (about 10 words + 10 practical sentences with meanings and example sentences), cached locally.
- **Multi-language support**: the target language can be English (including Simple English for beginners) / Japanese / Korean / Spanish / French / German / Portuguese / Russian / Arabic, and the definition (native) language is also selectable.
- **Gamification** (all local, no backend):
  - ❤️ **Hearts** (5/day): a wrong answer costs one heart; 0 hearts locks the card until tomorrow.
  - 🔥 **Streak**: consecutive active days.
  - ⚡ **XP** and **badge tiers** (Bronze → Diamond).
  - 🎓 **Mastery**: mastered items are marked complete (not deleted) and stop appearing in random picks.
- **Mastery rules**: per card, choose **By-count** (answer N times) or **SRS spaced repetition**; the number of questions per session is also adjustable.
- **Quiz modes**: Copy (type the word), Recall (type the target language from the definition), Choice, Audio (listen then spell, local Web Speech).
- **Wrong-word notebook**: wrongly answered words go to the notebook automatically; you can review, remove, or clear them all for focused review.
- **Learning report**: check total XP, streak days, mastered words, wrong words, and accuracy at any time.
- **Data privacy**: all progress persists to the host storage directory (`english-data.json`); **Export / Import JSON** for backup & migration — no self-hosted backend.
- When the current card is fully mastered, a banner prompts you to pick another card or generate a new topic.

### 📋 Built-in Task Board

- Provides a "Task Board" entry in the sidebar, with two views you can switch between at any time:
  - **Week Matrix** (default main view): lays out this week's tasks by "category × Mon–Sun" for a quick overview;
  - **Five-column kanban**: Planned / To-do / In Progress / Done / Failed, ideal for pipeline-style progress.
- **Two task types**:
  - **Lightweight todo**: jot it down and tick it off manually — great for small chores;
  - **Executable task**: hand the task to the agent to **actually execute** — the execution target can be pinned to:
    - a workspace;
    - a mode (agent preset);
    - a permission level (read-only / workspace-write / full access; falls back to the runtime default when omitted).
- **Scheduling**: supports 5-field cron expressions (e.g. `0 23 * * *` runs every day at 23:00), with handy presets like "daily 09:00 / hourly / every 10 min / every Monday 09:00".
- **Organization**: tasks can carry a priority (High / Medium / Low), category, and date; when creating a task you can fill in common title templates from "quick phrases".
- **Nice details**: the search box filters by title/description; the "quick add" box creates a todo by pressing Enter; archived tasks can be restored anytime.
- **Execution history**: every executable task keeps a history you can review, including the generated chat session.
- **Week Matrix extras** (use your weekly plan as a workbench):
  - **Week start**: choose Monday or Sunday;
  - **Category management**: built-in Business/Tech Needs, Operations, General Management, and Support Expectations categories, all customizable;
  - **Daily check-in**: mark "today's daily report done" after finishing;
  - **Stats panel**: per-category task counts and completion rates for the week;
  - **Daily-report reminder**: banner reminder when the day is not yet complete;
  - **One-click export**: copy this week's / a single day's / plain-text report, or export a JSON backup.
- Task data is persisted by the host to the storage directory (`tasks.json`).
- Limitations:
  - Scheduling runs in the browser, so the GUI tab must stay open; a missed run is skipped and never backfilled.
  - Execution consumes API quota.
- The plugin injects task-board usage guidance into the agent's system prompt, so when you mention "task board / kanban / scheduled task", the agent can collaborate accordingly.

### 🧭 Open With

- In the workspace list, every workspace has an "Open" menu to open its directory with a local app in one click:
  - **Open in Finder**: launches the system file manager (Explorer on Windows, file manager on Linux);
  - **Open in Terminal**: launches your terminal (you can set a default terminal on the settings page, e.g. iTerm / Windows Terminal / GNOME Terminal / Konsole / XFCE; falls back to the system default);
  - **Open in Editor**: launches your editor (you can set a default editor on the settings page, e.g. VS Code / Cursor / CodeBuddy / Trae / Qoder / CatPaw and other popular flavors; falls back to the system default).
- **Extra IDEs** (optional, all on by default): the menu can also append "Open in Xcode / Android Studio / DevEco Studio / WeChat DevTools / WebStorm / IntelliJ IDEA / PyCharm / GoLand" — turn them on as needed.
- **Thoughtful handling**: uninstalled apps are skipped automatically and fall back to available commands without erroring out; WeChat DevTools requires enabling its "Settings → Security → Service Port" first and only opens when the directory is a WeChat mini-program project.

## Task Board Credits

The "Task Board" feature of this plugin is a **customized derivative** of the [`packages/dsh-task-board`](https://github.com/zhu1090093659/dsh-web-ui/tree/main/packages/dsh-task-board) sub-package from the open-source project [`zhu1090093659/dsh-web-ui`](https://github.com/zhu1090093659/dsh-web-ui).

- **Upstream project**: `dsh-task-board` — a hot-pluggable DeepSeek Harness (DSH) Web GUI task board plugin, featuring a Host-authoritative ledger, real DSH session execution, and Host-side 5-field cron scheduling. It is mounted through `cordis.patch.yml` and the profile mechanism without modifying DSH source code.
- **Customizations in this plugin**: while reusing its task-board core (multi-column kanban, Host-authoritative `tasks.json` ledger, real session execution, 5-field cron scheduling, system-prompt injection), this plugin adds its own **Week Matrix main view** (category × weekly plan, daily check-in, stats panel, daily-report reminder, one-click export), and integrates the workbench banner, turn-complete confetti, and the "Open With" menu — all unified under the "Workbench Settings" namespace and host wiring.
- **License**: governed by the `LICENSE` file in the upstream `packages/dsh-task-board` directory; use and distribute in accordance with its open-source terms.

## For End Users

If you just want to install and use this plugin, you don't need to build from source.

### Install (via the DSH plugin mechanism)

This plugin is distributed as a DSH plugin package. In an environment where DeepSeek Harness is already installed, add it to your profile using the `dsh` CLI:

```bash
# Install from npm (after publishing)
dsh plugin --profile <your profile name> add bga-dsh-workbench

# Or install from a Git repository
dsh plugin --profile <your profile name> add github:bingoogolapple/bga-dsh-workbench

# Or install from a local path (for development/debugging)
dsh plugin --profile <your profile name> add /path/to/bga-dsh-workbench
```

> After installation, restart the DSH service (or the corresponding profile) for the banner, task board, and other capabilities to take effect.

### Usage

1. Open the Harness web interface and configure the banner text, avatar, confetti theme & sound, foreign-language learning, and Open With preferences under the "Workbench" group on the settings page.
2. Enter the board from the sidebar "Task Board" entry, manage your tasks with the Week Matrix or the kanban view; enable scheduled execution when needed.
3. Collaborate with the "Task Board" in the chat, letting the agent help you manage and execute tasks.

## For Maintainers

If you are a repository maintainer or want to modify and rebuild from source yourself, read on.

### Directory Structure

```
bga-dsh-workbench/
├── images/                       # README screenshot assets
│   ├── bga-dsh-workbench-main.png   # main screen
│   └── bga-dsh-workbench-settings.png  # settings page
├── src/                          # source code
│   ├── index.ts                  # Host entry: wires up banner / routes / task board
│   ├── routes.ts                 # HTTP routes: banner avatar / config / settings / task persistence
│   ├── settings.ts               # "Workbench Settings" namespace and schema
│   ├── task-board-host.ts        # injects task-board guidance into the agent system prompt
│   ├── open-app.ts               # "Open with" logic (terminal / editor / extra IDEs)
│   ├── core/                     # task board storage and other core logic
│   └── client/                   # browser-side (Client): banner, confetti, foreign-language learning, task board UI, Open With, settings section, etc.
├── lib/                          # build output (esbuild bundle + tsc type declarations), shipped with the package
├── build.mjs                     # build script: produces lib/index.js (host) and lib/client.js (browser)
├── cordis.patch.yml              # Cordis composition patch: plugs the plugin into the host composition
├── dsh.plugin.json               # plugin manifest (entry, injections, client platform)
├── package.json                  # dependencies and scripts
├── tsconfig.json                 # TypeScript config (with declaration output)
├── vitest.config.ts              # test config
├── pnpm-lock.yaml                # pnpm dependency lock
├── pnpm-workspace.yaml
├── LICENSE                       # MIT License
├── README.md                     # Chinese (default)
└── README.en.md                  # English
```

### Build from Source

Prerequisites: Node.js ≥ 22.19, pnpm, and a local `../deepseek-harness` (devDependencies reference it via `link:`).

```bash
pnpm install          # install dependencies (devDeps linked to local deepseek-harness)
pnpm typecheck       # tsc --noEmit type checking
pnpm test            # vitest runs the unit tests (currently 129 cases)
pnpm build           # run build.mjs: produces host/browser output and type declarations under lib/
pnpm check           # runs typecheck + test + build in sequence
```

> The `prepack` script automatically runs `pnpm build` before `pnpm publish`, ensuring the published `lib/` is up to date.

### Local Debugging

During development you can install from a local path into your DSH profile:

```bash
dsh plugin --profile <your profile name> add .
```

After editing the source, run `pnpm build` again and restart the DSH service for the corresponding profile to load the latest output.

### Packaging and Publishing

1. Make sure the `files` field in `package.json` (which includes `lib`, `dsh.plugin.json`, `cordis.patch.yml`, `LICENSE`, `README.md`, `README.en.md`) matches the actual artifacts; run `pnpm build` locally to generate `lib/` before publishing.
2. Tag a version and push, for example:

   ```bash
   git tag v0.0.1
   git push origin v0.0.1
   ```

3. Users can then install the plugin:

   - From npm (after publishing):

     ```bash
     dsh plugin --profile <profile> add bga-dsh-workbench
     ```

     where `<profile>` is the target DSH profile name (e.g. `web`):

     ```bash
     dsh plugin --profile web add bga-dsh-workbench
     ```

   - From a Git repository (when not yet published to npm):

     ```bash
     dsh plugin --profile <profile> add github:bingoogolapple/bga-dsh-workbench
     ```

## Support the Author

* The author's main coding plan is [OpenCode Go](https://opencode.ai/go?ref=8CYK5082AG), a cloud subscription (OpenCode Go) built on the open-source [opencode.ai](https://opencode.ai/go?ref=8CYK5082AG). By subscribing through the author's referral link [Subscribe to OpenCode Go](https://opencode.ai/go?ref=8CYK5082AG), **both you and the author get $5 of subscription credit** — feel free to support the author through this link. Thank you!

OpenCode Go includes the following usage credit limits, so using cheaper models almost never causes token anxiety:

- 5-hour limit — $12 of usage credit
- Weekly limit — $30 of usage credit
- Monthly limit — $60 of usage credit

## Recommended Projects by the Author

* You are welcome to try the author's first indie software product, the [God Assistant browser extension / plugin development platform](https://github.com/bingoogolapple/bga-god-assistant-config).
* You are also welcome to check out the author's other DSH project, the [DSH Desktop Client (bga-dsh-client)](https://github.com/bingoogolapple/bga-dsh-client): a Tauri 2 based DeepSeek Harness desktop client offering one-click installation for novices, dsh service management, and LAN proxy service management.

## License

This project is open-sourced under the [MIT License](LICENSE) and can be freely used, modified, and distributed.
