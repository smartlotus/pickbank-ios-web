# PickBank iOS Showcase, Interactive PWA Simulator & Remotion Intro Film

PickBank（拾念记账 · 液态玻璃版）官方网站、在线可玩 iPhone / iPad 模拟器与 1080p 产品介绍影片工程。

## 目录结构

- `src/` — Vite + React + TypeScript + 原生现代 CSS（严格遵循 Google `modern-web-guidance` 规范）展示站与本地持久化交互模拟器（完整移植 PickBankCore NLP 多笔解析、分类占比分析、8 物种昼夜像素伙伴、SHA-256 JSON/CSV 导出与 Dry-Run 导入时光机）
- `public/media/pickbank-ios-intro.mp4` — Remotion 渲染的 1080p 30fps 双语产品介绍影片（10.28 MiB）
- `public/assets/` — App Icon、8 种 MIT 像素伙伴昼夜背景与精灵序列图、FusionPixel 字体子集
- `public/downloads/altstore-source.json` — SideStore / AltStore 免签侧载源清单
- `video/` — Remotion 1080p 影片合成源码与自定义音频合成脚本

## 本地运行与构建

```zsh
npm install
npx tsc --noEmit
npm run build
```

## 部署

已部署至 Cloudflare Pages (`https://pickbank-ios.pages.dev`)；原生 iOS/iPadOS App 源码仓库见 [`smartlotus/pickbank-ios`](https://github.com/smartlotus/pickbank-ios)。
