# Client 風格與架構指南（Manager 為準）

> 目的：以本專案（**quiz-game-frontend-manager**）為設計與互動契約來源，讓 **Player（玩家端）** 與 Manager 共用同一套視覺語彙、婚禮語氣文案、狀態流程與動效節奏。  
> 本文件為完整說明；實作 Player 時應把此文件視為「必須對齊」的契約，而非參考建議。

---

## 目錄

1. [產品定位與雙端差異](#1-產品定位與雙端差異)
2. [技術棧約定](#2-技術棧約定)
3. [專案架構總覽](#3-專案架構總覽)
4. [狀態機與遊戲流程](#4-狀態機與遊戲流程)
5. [畫面／場景說明](#5-畫面場景說明)
6. [視覺設計系統](#6-視覺設計系統)
7. [元件模式與規格](#7-元件模式與規格)
8. [動效與轉場契約](#8-動效與轉場契約)
9. [婚禮語氣文案表](#9-婚禮語氣文案表)
10. [Socket 與資料契約](#10-socket-與資料契約)
11. [Player 端對齊 Checklist](#11-player-端對齊-checklist)
12. [參考檔案索引](#12-參考檔案索引)

---

## 1. 產品定位與雙端差異

### 1.1 共同身分

- 主題：**婚禮向答題遊戲**（房間名硬編碼語境為 `Wedding`）
- 視覺：**黑底舞台 + 白光玻璃態 + 寬字距 Poppins + 儀式感轉場**
- 語氣：婚禮隱喻（幸福、圓滿、抵達），非一般遊戲術語堆疊

### 1.2 Manager vs Player

| 面向 | Manager（本專案） | Player（待做，需對齊風格） |
|---|---|---|
| 角色 | 主持人／大螢幕端 | 賓客手機／平板端 |
| Socket `system` query | `'Manager'` | 應為 `'Player'`（或後端約定值） |
| 核心操作 | 建房、開始、下一題、結束 | 加入房間、作答、（可選）祝福彈幕 |
| 選項互動 | **展示用**（自動輪播高亮，不可投票） | **可點選投票** |
| 排行／結算 | 顯示全場票數與排行 | 可顯示本人結果 + 全場（視覺同款） |
| 版面假設 | 橫向大螢幕為主 | 直向手機為主，但**色／字／玻璃／字距／動效節奏仍須一致** |

### 1.3 統一原則（不可妥協）

1. 同一套色階（黑底、白透明度階梯、玻璃面板）
2. 同一套字體與字距語彙
3. 同一套主按鈕（`GameButton` token）
4. 同一套婚禮文案語氣（見第 9 章）
5. 同一套 `GamePhase` 語意與畫面節奏
6. 同一套 easing：`[0.22, 1, 0.36, 1]`（浪漫緩出）

---

## 2. 技術棧約定

建議 Player 端盡量採用相同技術，降低行為差異：

| 層 | 技術 | 版本參考（Manager） |
|---|---|---|
| 框架 | React + Vite + TypeScript | React 18.2、Vite 5 |
| 樣式 | Tailwind CSS v4（utility-first） | `@tailwindcss/postcss` 4.x |
| 狀態 | Zustand | 5.x |
| 即時通訊 | socket.io-client | 4.7.x |
| 動畫 | `motion`（import 路徑仍可用 `framer-motion`） | 12.x |
| WebGL 背景 | `ogl`（`LightRays`） | 1.0.x |
| 圖示 | Font Awesome 6.4 CDN（可選） | `index.html` |

**刻意未使用**：React Router（畫面由狀態機驅動）、大型 UI 元件庫、全域 CSS Module 設計系統。

環境變數模式：

- `VITE_SERVER_SOCKET_URL`
- `VITE_SERVER_SOCKET_PORT`

### 2.1 執行期依賴（`dependencies`）

來源：`package.json`。Player 若要對齊行為，優先採用相同套件與相近 major 版本。

| 套件 | 版本 | 用途 |
|---|---|---|
| `react` | `^18.2.0` | UI 框架 |
| `react-dom` | `^18.2.0` | React DOM 渲染 |
| `zustand` | `^5.0.13` | 輕量全域狀態（session／game／room／轉場等） |
| `socket.io-client` | `^4.7.2` | 與後端即時通訊 |
| `motion` | `^12.40.0` | 動畫庫（程式中多以 `import { motion } from 'framer-motion'` 使用相容入口） |
| `ogl` | `^1.0.11` | WebGL 微型庫；`LightRays` 背景光柱 |

### 2.2 開發依賴（`devDependencies`）

| 套件 | 版本 | 用途 |
|---|---|---|
| `vite` | `^5.0.0` | 建置／開發伺服器（dev 預設 port `3000 --host`） |
| `@vitejs/plugin-react` | `^4.2.0` | Vite 的 React／JSX 支援 |
| `typescript` | `^5.2.2` | 型別檢查（`build` 會先跑 `tsc`） |
| `tailwindcss` | `^4.3.0` | Utility-first CSS |
| `@tailwindcss/postcss` | `^4.3.0` | Tailwind v4 PostCSS 整合 |
| `autoprefixer` | `^10.5.0` | CSS vendor prefix |
| `@types/react` | `^18.2.37` | React 型別 |
| `@types/react-dom` | `^18.2.15` | React DOM 型別 |
| `@types/styled-components` | `^5.1.36` | 型別殘留；專案**未實際使用** styled-components |
| `eslint` | `^8.53.0` | Lint |
| `@typescript-eslint/parser` | `^6.10.0` | ESLint 解析 TypeScript |
| `@typescript-eslint/eslint-plugin` | `^6.10.0` | TypeScript ESLint 規則 |
| `eslint-plugin-react` | `^7.33.2` | React Lint 規則 |
| `eslint-plugin-react-hooks` | `^4.6.0` | Hooks 規則 |
| `eslint-plugin-react-refresh` | `^0.4.4` | Vite HMR／Refresh 相關規則 |

### 2.3 外部資源（非 npm）

| 資源 | 載入方式 | 用途 |
|---|---|---|
| Poppins（400／600／900） | Google Fonts（`src/index.css` `@import`） | 全域 UI 字體 |
| Font Awesome 6.4 | CDN（`index.html`） | 圖示字體（可選） |
| Noto Serif TC／Songti TC／SimSun | 系統／瀏覽器字體堆疊 | 印章「正確答案」襯線中文（未額外 npm 安裝） |

### 2.4 npm scripts

| Script | 指令 | 說明 |
|---|---|---|
| `dev` | `vite --port 3000 --host` | 本機開發 |
| `build` | `tsc && vite build` | 型別檢查 + 正式建置 |
| `build-p` | `tsc && vite build --mode production --base=/ytdl/` | 指定 base path 的 production build |
| `lint` | `eslint . --ext ts,tsx ...` | Lint（max-warnings 0） |
| `preview` | `vite preview` | 預覽 build 結果 |

### 2.5 Player 建議依賴策略

- **強烈建議對齊**：`react` / `react-dom`、`zustand`、`socket.io-client`、`motion`、`tailwindcss`（v4）
- **視覺同款才需要**：`ogl`（若也做 LightRays 類背景）
- **可不帶**：`@types/styled-components`（Manager 本身也未使用該庫）
- 版本以 Manager 的 major 為準；細部 patch 可跟進 `package.json`

---

## 3. 專案架構總覽

### 3.1 目錄結構（Manager）

```
src/
├── main.tsx                 # React mount
├── App.tsx                  # Lobby ↔ Room + 全域轉場層 + LightRays
├── App.css                  # @import "tailwindcss"
├── index.css                # Poppins、reset、overflow
├── pages/
│   └── QuizGame.tsx         # 進房後頁面殼
├── components/              # UI（buttons / carousel / backgrounds / transitions）
├── stores/                  # Zustand stores
├── socket/                  # client + events
├── transitions/config.ts    # 轉場 preset（單一真相來源）
├── hooks/                   # 打字效果等
└── types/                   # session / game / room / server-response / danmaku
```

### 3.2 畫面驅動方式

**沒有路由。** 根畫面由兩層狀態決定：

1. `SessionState`：連線／登入／是否在房
2. `GamePhase`：房內遊戲子畫面

```
App
├── LightRays（全域背景）
├── Lobby（session !== InRoom，或 createRoom covering）
│   ├── CardCarousel
│   └── CreateRoomButton（底部 CTA）
├── QuizGame（InRoom）
│   └── MainContent
│       ├── DanmakuOverlay（Idle / Lobby）
│       └── QuizContent（依 GamePhase 組裝）
└── 全域轉場層
    ├── EnterRoomRevealImage
    ├── EnterRoomVeil（可選）
    └── StartGameIntro
```

### 3.3 Store 分工

| Store | 職責 |
|---|---|
| `sessionStore` | `SessionState` |
| `gameStore` | `GamePhase`、題目、結算、揭曉、排行 |
| `roomStore` | `roomId` 等房間資訊 |
| `playerStore` | 玩家名單、人數 |
| `danmakuStore` | 彈幕佇列（軌道分配） |
| `enterRoomTransitionStore` | 場景轉場 phase／beat／stage |

Player 端至少需要對齊：`session`（或同等連線狀態）+ `game` phase；其餘依角色增減。

---

## 4. 狀態機與遊戲流程

### 4.1 SessionState

```ts
enum SessionState {
  Initialize = 'Initialize',
  ServerConnected = 'ServerConnected',
  LoggedIn = 'LoggedIn',
  InRoom = 'InRoom',
}
```

Manager 流程：

```
Initialize
  → connect → ServerConnected → Manager:Login → LoggedIn
  → CreateRoom → InRoom
```

### 4.2 GamePhase

```ts
enum GamePhase {
  Idle = 'Idle',
  Lobby = 'Lobby',
  Voting = 'Voting',
  Settle = 'Settle',
  ShowAnswer = 'ShowAnswer',
  ShowRanking = 'ShowRanking',
  Finished = 'Finished',
}
```

### 4.3 完整時序（Manager）

```
LoggedIn
  │ 點「我們結婚吧」→ Room:CreateRoom
  ▼
InRoom + createRoom 轉場（預設 carouselExit）
  │ Idle：玩家加入（彈幕「已加入房間」）
  │ 點「開始遊戲」→ startGameIntro（變黑打字）→ Emit Room:StartGame
  ▼
QuizGame:GameStarted → phase Lobby
  ▼
QuizGame:Question → Voting（題目打字 + 選項輪播高亮 + 倒數）
  ▼
QuizGame:Settle → Settle（票數條）
  ▼
QuizGame:AnswerReveal → ShowAnswer（蓋章 + 下一題鈕）
  │ 點「繼續往幸福邁進」／最後一題「抵達幸福」→ Room:NextQuestion
  │ （循環至最後一題）
  ▼
QuizGame:ShowRanking → ShowRanking（幸福排行榜）
  │ 點「結束遊戲」→ Room:FinishGame
  ▼
QuizGame:Finished → 「已圓滿結束」
```

### 4.4 `QuizContent` 顯示對照

| Phase | 顯示內容 |
|---|---|
| `Idle` / `Lobby` | `PlayerList` + `PlayerCount` + `StartGameButton`；另掛 `DanmakuOverlay` |
| `Voting` | `Question` + `OptionArea` + `Countdown` |
| `Settle` / `ShowAnswer` | `Settle`（票數）；`ShowAnswer` 才出現 `NextQuestionButton` |
| `ShowRanking` | 排行台 + `FinishGameButton` |
| `Finished` | 排行台 + 「已圓滿結束」 |

---

## 5. 畫面／場景說明

### 5.1 Lobby（進房前）

- 全螢幕 `bg-black` + `LightRays`
- 中央上方：3D 相簿輪播（`/w1.jpg`～`/w8.jpg`）
- 底部固定 CTA：`CreateRoomButton`「我們結婚吧」
- **布局刻意與 InRoom 相同**（`p-4` → `min-h-screen` → `h-screen` → 中央欄 `w-[70%]` → 底部 `h-14`），確保轉場前後按鈕座標對齊

### 5.2 房內等待（Idle / Lobby）

- 玩家名多欄網格（最多約 10 欄 × 20 列，依高度動態算列數）
- 名稱透明度循環：`white` / `white/80` / `white/65` / `white/90` / `white/70`
- 底部：「目前參加人數：N」+「開始遊戲」
- 頂部 20% 高度：加入房間彈幕

### 5.3 投票中（Voting）

- 上方：題目（打字機 100ms／字）
- 中間：2×2 選項 A–D（每 200ms 輪流高亮）
- 覆蓋層：倒數；`>10` 靜態淡白，`≤10` 放大彈入

### 5.4 結算／揭曉（Settle / ShowAnswer）

- 同 2×2 格，改為票數進度條 + 百分比 +「N 票」
- 揭曉後：正解高亮白光；錯誤選項 `opacity-45`
- 正解格播放木戳蓋章「正確答案」（2.3s）
- 蓋章完成後淡入下一題按鈕

### 5.5 排行（ShowRanking / Finished）

- 標題「幸福排行榜」
- 前三名頒獎台（視覺順序 2nd | 1st | 3rd，高度階梯）
- 第四名以後列表：名次／玩家／答對／時間
- `ShowRanking`：結束按鈕；`Finished`：狀態文案

### 5.6 目前停用但保留的元素

- `Title`（🤵❤️👰🏻）— 已註解
- 左右 `Picture`（`/left.png`、`/right.png`）— 已註解  

Player 端預設不必實作；若要品牌裝飾，應維持「不搶中央舞台」。

---

## 6. 視覺設計系統

### 6.1 設計理念一句話

**全黑儀式舞台上的白光玻璃介面**：少彩、重層次、寬字距、動效克制而有儀式感。

### 6.2 色彩 Token（de-facto）

本專案尚未建立 `:root` design token 檔；以下為實際使用的契約色。

#### 畫布與文字

| Token 概念 | 值 | 用途 |
|---|---|---|
| Canvas | `#000000` / `bg-black` | 全域背景 |
| Text Primary | `text-white` / `text-white/90` | 標題、強調數字 |
| Text Body | `text-white/80` / `text-white/75` | 內文、按鈕字 |
| Text Muted | `text-white/55` / `text-white/50` / `text-white/45` | 次要資訊、表頭 |
| Text Dim | `opacity-45` | 揭曉後錯誤選項 |

#### 玻璃面板

| Token 概念 | 值 |
|---|---|
| Panel BG | `bg-white/5` |
| Panel Border | `border-white/25` |
| Panel Blur | `backdrop-blur-sm` |
| Panel Radius | `rounded-sm`（主 UI）；輪播卡 `0.75rem` |

#### 強調／選中（白光，非彩色）

| 場景 | 值 |
|---|---|
| 選項高亮 | `border-white` + `shadow-[0_0_0_1px_rgba(255,255,255,0.55),0_0_24px_rgba(255,255,255,0.35)]` |
| 正解選項 | `border-white` + `shadow-[0_0_0_1px_rgba(255,255,255,0.45),0_0_28px_rgba(255,255,255,0.28)]` |
| 進度條（一般） | `bg-white/75` + `shadow-[0_0_10px_rgba(255,255,255,0.45)]` |
| 進度條（正解） | `bg-white` + `shadow-[0_0_12px_rgba(255,255,255,0.7)]` |
| 進度條軌道 | `bg-white/15` |

#### 光柱背景（LightRays）

| Prop | 值 |
|---|---|
| `raysOrigin` | `top-center` |
| `raysColor` | `#ffffff` |
| `raysSpeed` | `1` |
| `lightSpread` | `2` |
| `rayLength` | `3` |
| `followMouse` | `false` |
| `fadeDistance` | `2` |
| `saturation` | `2` |

#### 可選面紗轉場色

| Token | 值 |
|---|---|
| Veil color | `#faf3e4` |
| Veil glow | `rgba(255, 236, 200, 0.95)` |

#### 印章（唯一允許的暖色／紅色強調）

| 元素 | 色 |
|---|---|
| 木頭戳 | `#6B3F1F` … `#A66B3C` 漸層木色 |
| 印面 | `border-red-700/90`、`border-red-600/50` |
| 印文 | `text-red-700` |

> 原則：日常 UI **不要**引入紫、靛、高飽和品牌色。暖色僅用於儀式物件（面紗、印章）。

### 6.3 字體

| 用途 | 字體 | 權重 |
|---|---|---|
| 全域 UI | **Poppins**（Google Fonts） | 400 / 600 / 900 |
| 印章印文 | **Noto Serif TC** / Songti TC / SimSun | black（`font-black`） |

全域設定（`index.css`）：

```css
* {
  font-family: "poppins", sans-serif;
}
```

### 6.4 字距（品牌訊號，必須對齊）

| 場景 | tracking |
|---|---|
| 主按鈕 | `0.35em` |
| 人數列、排行標題 | `0.35em` |
| 題目、開局打字 | `0.15em` |
| 選項標籤 A–D | `0.2em` |
| 選項內文 | `0.08em` |
| 倒數 | `0.2em` |
| 彈幕 | `0.2em` |
| 排行列表 | `0.12em`～`0.2em` |

### 6.5 字級參考

| 元素 | 約略 class |
|---|---|
| 題目／開局字 | `text-4xl` |
| 倒數 | `text-7xl font-light` |
| 選項標籤 | `text-3xl font-semibold` |
| 選項內文 | `text-2xl` |
| 主按鈕 | `text-lg` |
| 排行標題 | `text-3xl` |
| 頒獎台名次 | `text-5xl` / `4xl` / `3xl`（1/2/3 名） |
| 票數百分比 | `text-2xl font-semibold` |
| 「N 票」 | `text-xs` |

### 6.6 佈局契約

| 規則 | 值／說明 |
|---|---|
| 根容器 | `relative min-h-screen overflow-hidden bg-black` |
| 內容外層 | `p-4` |
| 垂直舞台 | `h-screen items-center justify-center p-8` |
| 中央欄寬 | **`w-[70%]`**（Manager 大螢幕基準） |
| 欄內間距 | `flex-col gap-2` / `p-4` |
| 底部 CTA 槽 | **`h-14 shrink-0`** 置中（轉場座標穩定） |
| 圓角 | UI `rounded-sm`；避免大 pill（`rounded-full` 僅進度條本體） |
| overflow | 桌面 `body` 禁止捲動；小寬（≤430px）允許垂直捲動 |

Player 手機版可調整欄寬（例如接近 `w-full`），但玻璃面板、字距、按鈕 token、色階仍須一致。

### 6.7 禁止事項（對齊時避免）

- 扁平單色白／灰後台風儀表板
- 紫色／靛紫漸層主題
- 奶油底 + 襯線大標的「通用 AI 婚禮模板」作為主畫布（面紗可短暫使用奶油色，但常駐畫布是黑）
- 多層厚重陰影卡片堆疊
- 統計條、徽章、貼紙覆蓋在英雄視覺上
- 用 emoji 當主要 UI 文案（Title 的 emoji 目前已停用）

---

## 7. 元件模式與規格

### 7.1 GameButton（主互動按鈕 — 必須複用同一 token）

```
min-w-[220px] px-10 py-3.5
rounded-sm border border-white/25 bg-white/5
text-lg tracking-[0.35em] text-white/80
backdrop-blur-sm transition-all duration-300
hover:enabled:border-white/50 hover:enabled:bg-white/10 hover:enabled:text-white
active:enabled:scale-[0.98]
disabled:cursor-not-allowed disabled:opacity-35
```

所有主 CTA（建房、開始、下一題、結束、Player 的加入／送出答案等）應基於此樣式。

### 7.2 Option（投票中選項卡）

- 容器：玻璃面板 + `p-4` + `transition-all duration-300`
- 布局：`grid-cols-[40px_1fr]`（標籤固定寬 + 文字置中）
- 標籤：`A` `B` `C` `D`
- Manager：自動 `highlighted` 輪播（200ms）
- Player：改為使用者選中態；建議選中態視覺等同 Manager 的 `highlighted`

### 7.3 SettleOption（結算卡）

- 上：標籤 + 文字（左對齊）
- 下：進度條 + 百分比 +「N 票」
- 進度條動畫：`width 0 → %`，`duration 0.6`，`easeOut`
- 揭曉：正解白光；錯誤 dim

### 7.4 AnswerStamp（正確答案蓋章）

- 時長常數：`ANSWER_STAMP_DURATION = 2.3` 秒
- 木戳落下 → 印面「正確答案」留存
- 後續 UI（如下一題按鈕）應 `delay: 2.3s` 再淡入
- 印文字體必須用襯線中文，維持儀式物件差異

### 7.5 Countdown

- `> 10`：`text-white/50` 靜態
- `≤ 10`：每秒 key 切換；`scale [2.4, 1]`、`opacity [0.35, 1]`，`duration 0.35`

### 7.6 Question 打字

- 速度：`100ms`／字
- 樣式：`text-4xl tracking-[0.15em] text-white/90` 置中

### 7.7 PlayerList / PlayerCount

- 列表：`text-base tracking-[0.15em]`，truncate
- 人數：`text-lg tracking-[0.35em] text-white/80`，數字 `font-semibold text-white`

### 7.8 DanmakuOverlay

- 區域：畫面上方 `h-[20%]`，`pointer-events-none`
- 軌道數：由 store `LANE_COUNT` 決定
- 動畫：`x: 100vw → -100%`，`duration 6s`，`ease: linear`
- 樣式：`text-lg tracking-[0.2em] text-white/80`
- 加入文案格式：`{userId} 已加入房間`

### 7.9 ShowRanking

- 頒獎台視覺順序：`[1, 0, 2]` → 顯示為 第2｜第1｜第3
- 台高：`h-36` / `h-28` / `h-24`
- 入場：錯開 delay `0.15 + place * 0.12`，列表列 `0.45 + index * 0.05`
- 時間格式：`totalTime.toFixed(2) + 's'`
- 答對格式：`{n} 題`

### 7.10 CardCarousel（Lobby 專屬，Player 可不實作）

- 長寬比 3:4
- perspective `1600px`
- 預設一圈約 40s（元件 prop）；CSS 變數 `--carousel-duration`
- 卡片邊框 `2px lightgray`，底 `rgb(199, 199, 199)`，圓角 `0.75rem`
- 退場：`scale 1 → 0.1` 並加速旋轉（`shrinkSec: 2`）

### 7.11 命名慣例

| 類型 | 慣例 |
|---|---|
| React 元件 | PascalCase |
| Store hook | `useXxxStore` |
| Socket 監聽 | `On*` |
| Socket 送出 | 動詞函式（`CreateRoom`、`EmitStartGame`） |
| 介面 | `I*` |
| Enum | 字串值與 server 對齊 |

---

## 8. 動效與轉場契約

### 8.1 共用 Easing

```ts
const ROMANTIC_EASE = [0.22, 1, 0.36, 1];
```

多數入場／揭幕使用此曲線；線性僅用於彈幕橫移與部分蓋章段落。

### 8.2 轉場設定單一真相來源

檔案：`src/transitions/config.ts`

```ts
TRANSITION_BY_STAGE = {
  createRoom: 'carouselExit',   // 可改 'veil' | 'none'
  startGame: 'startGameIntro',  // 可改 'veil' | 'none'
}
```

### 8.3 Preset 明細

#### `carouselExit`（預設進房）

| 參數 | 值 |
|---|---|
| 總時長 | 3s |
| coverRatio | 1 |
| shrinkSec | 2（輪播縮到 0.1） |
| revealImageSec | 1（`/yuyu.png` 放大 cover） |
| reveal 初始 scale | 0.1 |
| reveal 基準顯示 | `max-h-[70vh] w-[min(60vw,520px)]` |
| ease | `[0.22, 1, 0.36, 1]` |

#### `veil`（可選進房／開局）

| 參數 | 值 |
|---|---|
| 總時長 | 1.2s |
| coverRatio | 0.4（前段 soft flash 蓋滿） |
| 後段 | 左右奶油色紗拉開 + 中縫 glow 淡出 |
| 色 | `#faf3e4` / `rgba(255,236,200,0.95)` |

#### `startGameIntro`（預設開局）

| 參數 | 值 |
|---|---|
| fadeInSec / fadeOutSec | 1 / 1 |
| typeCharMs | 100 |
| typePauseMs | 500（「讓我們」與「開始吧」之間） |
| typeHoldMs | 1000（打完後、emit 前） |
| typeFirst | `讓我們` |
| typeSecond | `開始吧` |
| 字樣 | `text-4xl tracking-[0.15em] text-white/90` |
| 流程 | 變黑 → 打字 → hold → `EmitStartGame` → 等題目／GameStarted 訊號 → 淡出 |

#### `none`

時長 0，直接切畫面。

### 8.4 其他常駐微動效

| 動效 | 規格 |
|---|---|
| 題目打字 | 100ms／字 |
| 選項輪播高亮 | 200ms |
| 倒數 ≤10 | 0.35s scale/fade |
| 票數條 | 0.6s easeOut |
| 蓋章 | 2.3s，times `[0, 0.13, 0.57, 0.7, 1]` |
| 下一題鈕出現 | delay 2.3s，fade 1s easeOut |
| 彈幕 | 6s linear |
| 按鈕 hover | 300ms |
| 按鈕 active | scale 0.98 |

---

## 9. 婚禮語氣文案表

原則：用「幸福／圓滿／抵達」取代冷冰冰的「Next / Finish / Ranking」。Player 端應沿用同一語感；下表含 **Manager 現況** 與 **Player 建議對照**。

### 9.1 Manager 現有文案（必須保留語感）

| 位置 | 文案 | 備註 |
|---|---|---|
| 建房按鈕 | 我們結婚吧 | Lobby CTA |
| 開始按鈕 | 開始遊戲 | Idle 可點 |
| 開局打字第一段 | 讓我們 | `startGameIntro` |
| 開局打字第二段 | 開始吧 | 接在「讓我們」後 |
| 加入彈幕 | 已加入房間 | `{userId} 已加入房間` |
| 人數 | 目前參加人數： | 後接數字 |
| 蓋章印文 | 正確答案 | 襯線紅印 |
| 票數單位 | {n} 票 | |
| 非最後一題按鈕 | 繼續往幸福邁進 | ShowAnswer |
| 最後一題按鈕 | 抵達幸福 | `questionIndex >= totalQuestions - 1` |
| 排行標題 | 幸福排行榜 | |
| 排列表頭 | 名次／玩家／答對／時間 | |
| 答對單位 | {n} 題 | |
| 結束按鈕 | 結束遊戲 | ShowRanking |
| 結束後狀態 | 已圓滿結束 | Finished |

### 9.2 Player 建議文案（同語氣、角色不同）

| 場景 | 建議文案 | 說明 |
|---|---|---|
| 加入房間 CTA | 參加婚禮／入場 | 對應 Manager「我們結婚吧」的賓客視角；二選一後全專案統一 |
| 等待開始 | 婚禮即將開始／等待新人宣布開始 | 對應 Lobby |
| 作答送出 | 許下答案／送出祝福答案 | 避免「Submit」 |
| 已作答等待 | 靜候揭曉 | 對應 Settle 等待 |
| 答對回饋 | 心有靈犀 | 可選短回饋 |
| 答錯回饋 | 緣分未至 | 可選；勿嘲諷 |
| 看排行 | 幸福排行榜 | **必須與 Manager 相同** |
| 結束 | 已圓滿結束 | **必須與 Manager 相同** |
| 斷線／錯誤 | 緣分連線中／請稍候再試 | 維持語氣，勿技術腔直出 |

> 若產品決定 Player 加入 CTA 用「參加婚禮」或「入場」，請在實作前定稿並回填本表，避免雙端文案漂移。

### 9.3 文案語氣 Checklist

- [ ] 不出現「Next Question」「Finish」「Leaderboard」等英文操作詞於主 UI
- [ ] 「幸福」「圓滿」「抵達」語彙與 Manager 一致
- [ ] 印章「正確答案」不改成「Correct」或「Bingo」
- [ ] 錯誤回饋不羞辱玩家

---

## 10. Socket 與資料契約

### 10.1 連線

```ts
io(socketUrl, {
  query: { system: 'Manager' }, // Player 改為對應 system
  transports: ['websocket'],
});
```

### 10.2 Manager Emit

| 事件 | Payload 要點 |
|---|---|
| `Manager:Login` | manager 身分 |
| `Room:CreateRoom` | `{ roomName: 'Wedding' }` |
| `Room:StartGame` | `{ roomName: 'Wedding' }` |
| `Room:NextQuestion` | `{ roomName: 'Wedding' }` |
| `Room:FinishGame` | `{ roomName: 'Wedding' }` |

### 10.3 Manager On（驅動 UI）

| 事件 | 主要副作用 |
|---|---|
| `Room:CreateRoom` | `InRoom` + 進房轉場 |
| `Room:UserJoined` | 更新名單／人數／彈幕 |
| `QuizGame:GameStarted` | `phase = Lobby`，記錄 `quizCount` |
| `QuizGame:Question` | 寫入題目 → `Voting`；通知 intro 可淡出 |
| `QuizGame:Settle` | 聚合票數 → `Settle` |
| `QuizGame:AnswerReveal` | 正解索引 → `ShowAnswer` |
| `QuizGame:ShowRanking` | 排行 → `ShowRanking` |
| `QuizGame:Finished` | `Finished` |

### 10.4 關鍵資料形狀

```ts
IQuestionData {
  questionIndex: number
  question: string
  options: string[]
  votingTime: number
  totalQuestions: number
}

ISettleData {
  questionIndex: number
  votes: number[]
  totalVotes: number
  correctAnswer: number
}

IRankingEntry {
  userId: string
  rank: number
  correctCount: number
  totalTime: number
}
```

Player 端作答事件名稱以後端為準，但 **收到的 Question / Settle / AnswerReveal / ShowRanking 畫面語意應與上表一致**。

### 10.5 Server 狀態 enum（對照用）

```ts
ServerRoomState: Prepare | InGame | Finished
ServerGameState: Prepare | StartGame | Voting | Settle | ShowAnswer | ShowRanking | Waiting | Finished
```

前端 `GamePhase` 是 UI 狀態；不必與 server enum 一一同名，但語意應對得起來。

---

## 11. Player 端對齊 Checklist

### 視覺

- [ ] 常駐畫布為黑底 + 白光（LightRays 或同等白光柱）
- [ ] 面板：`white/5` + `border-white/25` + `backdrop-blur-sm` + `rounded-sm`
- [ ] 字體 Poppins；印章類儀式字用襯線中文
- [ ] 主按鈕使用 GameButton token（含字距 `0.35em`）
- [ ] 選中／正解使用白光 glow，不用彩色描邊
- [ ] 文字透明度階梯與 Manager 同級

### 流程與畫面

- [ ] 以 phase 驅動畫面，不依賴雜亂多路由拼湊
- [ ] Voting / Settle / ShowAnswer / Ranking 資訊架構與 Manager 同構
- [ ] 倒數 ≤10 有放大節奏；題目可打字或至少同字級字距
- [ ] 排行標題固定「幸福排行榜」

### 文案與動效

- [ ] 採用第 9 章婚禮語氣
- [ ] 主要 easing 使用 `[0.22, 1, 0.36, 1]`
- [ ] 微動效時長不飄（打字 100ms、條 0.6s、彈幕 6s 等）

### 互動差異（允許）

- [ ] 選項可點選；送出後進入等待態
- [ ] 佈局改直式，但元件視覺 token 不變
- [ ] 可不做 CardCarousel／建房／主持人轉場，但若做進房儀式，優先复用 veil 或同等浪漫曲線

---

## 12. 參考檔案索引

| 主題 | 路徑 |
|---|---|
| 根場景與 Lobby | `src/App.tsx` |
| 房內頁殼 | `src/pages/QuizGame.tsx` |
| Phase 組裝 | `src/components/QuizContent.tsx` |
| 主按鈕 | `src/components/buttons/GameButton.tsx` |
| 轉場 preset | `src/transitions/config.ts` |
| 開局打字 | `src/components/transitions/StartGameIntro.tsx` |
| 進房揭幕圖 | `src/components/transitions/EnterRoomRevealImage.tsx` |
| 面紗 | `src/components/transitions/EnterRoomVeil.tsx` |
| 選項／結算 | `src/components/Option.tsx`、`SettleOption.tsx` |
| 蓋章 | `src/components/AnswerStamp.tsx` |
| 排行 | `src/components/ShowRanking.tsx` |
| 彈幕 | `src/components/DanmakuOverlay.tsx` |
| 全域字體 | `src/index.css` |
| 遊戲狀態 | `src/stores/gameStore.ts`、`src/types/game.ts` |
| Socket 初始化 | `src/socket/index.ts` |
| 房間／遊戲事件 | `src/socket/events/room.ts`、`game.ts` |
| Server 型別 | `src/types/server-response.ts` |

---

## 附錄 A：Manager 畫面線框（文字版）

```
┌──────────────────────────────────────────────┐
│ LightRays（頂部白光）                         │
│                                              │
│          ┌──────── w-[70%] ────────┐         │
│          │      主內容區            │         │
│          │  （名單／題目／選項／排行）│         │
│          │                         │         │
│          │      ┌──── h-14 ────┐   │         │
│          │      │   主 CTA 鈕   │   │         │
│          │      └──────────────┘   │         │
│          └─────────────────────────┘         │
└──────────────────────────────────────────────┘
```

## 附錄 B：快速 Token 抄寫卡

```
BG:            black
Panel:         bg-white/5 + border-white/25 + backdrop-blur-sm + rounded-sm
Text:          white → white/90 → /80 → /75 → /55 → /50 → /45
Font:          Poppins；印章 Noto Serif TC
Button:        min-w-[220px] px-10 py-3.5 text-lg tracking-[0.35em]
Ease:          [0.22, 1, 0.36, 1]
Type speed:    100ms/char
Column:        w-[70%]（桌機舞台）；CTA slot h-14
```

---

*文件版本：依 quiz-game-frontend-manager 現況整理，供 Player client 統一風格使用。若 Manager 文案或轉場 preset 變更，請同步更新第 8、9 章。*
