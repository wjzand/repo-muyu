## 1. 架构设计

```mermaid
graph TB
    "前端 React App" --> "状态管理 Zustand"
    "状态管理 Zustand" --> "localStorage 持久化"
    "前端 React App" --> "Canvas/WebGL 渲染引擎"
    "前端 React App" --> "Web Audio API 音效引擎"
    "前端 React App" --> "Web Share API 社交分享"
    "前端 React App" --> "html2canvas 海报生成"
```

纯前端架构，无后端服务。所有数据存储在浏览器 localStorage 中，排行榜采用本地模拟数据。

## 2. 技术说明
- **前端框架**：React@18 + TypeScript + Vite
- **样式方案**：Tailwind CSS@3
- **状态管理**：Zustand（含持久化中间件）
- **渲染引擎**：Canvas 2D（木鱼、粒子、波纹效果）
- **音效引擎**：Web Audio API（合成电子音色，无需外部音频文件）
- **海报生成**：html2canvas
- **分享**：Web Share API（降级为复制链接）
- **数据存储**：localStorage
- **初始化工具**：vite-init（react-ts 模板）

## 3. 路由定义
| 路由 | 用途 |
|------|------|
| `/` | 修行主界面 - 木鱼敲击核心页面 |
| `/merit` | 功德体系 - 等级、进度、升级记录 |
| `/skins` | 皮肤系统 - 皮肤选择与预览 |
| `/leaderboard` | 排行榜 - 功德榜单与社交 |
| `/profile` | 个人中心 - 用户信息与设置 |

## 4. 数据模型

### 4.1 数据模型定义

```mermaid
erDiagram
    "User" {
        string id PK
        string name
        string avatar
        number totalMerit
        number dailyMerit
        string level
        string currentSkin
        string[] ownedSkins
        string[] customSutras
        string[] achievements
        Settings settings
    }
    "Settings" {
        boolean soundEnabled
        boolean vibrateEnabled
        boolean sutraEnabled
        boolean bgMusicEnabled
        string soundType
        number sutraFrequency
        number sutraOpacity
        boolean showOnLeaderboard
    }
    "Skin" {
        string id PK
        string name
        string description
        number unlockMerit
        string type
        string colorScheme
    }
    "Achievement" {
        string id PK
        string name
        string description
        string icon
        number meritRequired
        boolean unlocked
    }
    "LeaderboardEntry" {
        string userId FK
        number merit
        number rank
        string period
    }
    "User ||--o| Settings" : "has"
    "User ||--o{ Achievement" : "has"
    "User ||--o{ LeaderboardEntry" : "in"
```

### 4.2 数据定义

```typescript
interface UserData {
  id: string
  name: string
  avatar: string
  totalMerit: number
  dailyMerit: number
  lastMeritDate: string
  level: string
  currentSkin: string
  ownedSkins: string[]
  customSutras: string[]
  achievements: string[]
  settings: Settings
  createdAt: string
}

interface Settings {
  soundEnabled: boolean
  vibrateEnabled: boolean
  sutraEnabled: boolean
  bgMusicEnabled: boolean
  soundType: 'electronic' | 'wooden' | 'synth' | 'drum'
  sutraFrequency: number
  sutraOpacity: number
  showOnLeaderboard: boolean
}

interface SkinConfig {
  id: string
  name: string
  description: string
  unlockMerit: number
  type: 'default' | 'neon' | 'crystal' | 'glitch' | 'golden' | 'cat'
  colors: { primary: string; secondary: string; glow: string }
  particleType: string
}

interface AchievementConfig {
  id: string
  name: string
  description: string
  meritRequired: number
}
```

## 5. 核心模块设计

### 5.1 木鱼渲染模块（Canvas）
- 使用 Canvas 2D 绘制木鱼本体
- 不同皮肤对应不同绘制函数
- 敲击动画：缩放+波纹扩散
- 霓虹描边效果：使用 shadowBlur + shadowColor

### 5.2 粒子系统
- 背景星空粒子：缓慢漂浮的光点
- 敲击波纹：从木鱼中心向外扩散的圆环
- 经文粒子：从屏幕边缘飘入的文字

### 5.3 音效引擎（Web Audio API）
- 电子音：OscillatorNode 合成
- 木鱼原声：噪声+滤波器模拟
- 合成器音：多振荡器叠加
- 鼓点音：低频+噪声组合

### 5.4 功德计算
- 手动敲击：功德 +1
- 自动敲击：功德 +0.5（向下取整为0，每2次+1）
- 每日上限：1000（可突破）
- 等级判定：根据总功德值查表

### 5.5 状态管理（Zustand）
- useMeritStore：功德值、等级、敲击计数
- useSkinStore：当前皮肤、拥有皮肤列表
- useSettingsStore：音效/震动/经文等设置
- useAchievementStore：成就解锁状态
- 所有 store 使用 persist 中间件自动同步 localStorage
