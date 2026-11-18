# PickBank iOS · Official Swiss Monograph, Preview Sandbox & Intro Film

**PickBank 拾念记账原生 Swift 6 + SwiftUI iOS / iPadOS App** 的官方瑞士国际主义风格（International Typographic Style）产品规格展示站。

> **说明**：本 Web 项目仅作为原生 iOS 应用的产品规格展示、54s 介绍片放映厅与浏览器端交互预览沙盒（**非 WebApp / 非 PWA**）。真正的 iPhone / iPad 应用程序位于 [pickbank-ios](https://github.com/smartlotus/pickbank-ios)（统一 Swift Package + `PickBank.xcodeproj` + 1,813 份内嵌像素美术资产）。

## 设计系统（Swiss International Style × Modern Web Guidance）

- **三套高对比瑞士版式**：`PAPER`（#F4F2EC 瑞士纸白 + 朱红 `#D92B00`）、`CARBON`（#0C0C0B 曜石黑 + 荧光橙 `#FF441A`）、`KLEIN / HERMES`（#0018E6 克莱因蓝 + 酸性黄 `#EDFF45`），均通过 `:root` CSS Custom Properties + `color-scheme` + View Transition 圆形扩散切屏实现。
- **独立隔离的 iOS Specimen 容器**：模拟器内部使用 `.ios-specimen-scope`（`color-scheme: dark; accent-color: var(--accent)`），完整保留真机的经典暖黑 OLED 与 Hermes 皇室蓝液态玻璃视觉。
- **Web 平台标准合规**：
  - `css-layout`：2D CSS Grid + 卡片内部 `grid-template-rows: subgrid` 对齐、`container-type: inline-size`、逻辑属性、无固定文本高度。
  - `responsive-table`：Android v1.9.2 ↔ iOS v2.0.0 功能矩阵对照表支持 sticky 行列头与 `@container (width < 640px)` 自动堆叠卡片化。
  - `dialog` / `animate-to-from-top-layer`：原生 `<dialog>` + `@starting-style` + `transition-behavior: allow-discrete` + `overscroll-behavior: contain`。
  - `tabs`：`focusgroup="tablist nomemory"` + `hidden="until-found"` + `beforematch` 驱动的 `$0` 原生装机协议切换面板。

## 本地开发与 Cloudflare 部署

```zsh
npm install
npx tsc --noEmit && npm run build
npx vite preview --host 127.0.0.1 --port 4173
npx wrangler deploy
```
