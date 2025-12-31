# Electron Vue TypeScript App

一个基于 Electron、Vue 3 和 TypeScript 构建的跨平台桌面应用模板。

## 技术栈

- **Electron**: 跨平台桌面应用框架
- **Vue 3**: 渐进式 JavaScript 框架
- **TypeScript**: 类型安全的 JavaScript 超集
- **Pinia**: Vue 3 状态管理库
- **Vite**: 下一代前端构建工具
- **Electron-Vite**: Electron 与 Vite 集成的构建工具
- **Naive UI**: Vue 3 组件库
- **Electron-Store**: 持久化数据存储

## 目录结构

```
src/
    ├── main/                   # 主进程代码
    │   ├── index.ts            # 主进程入口
    │   ├── windowManager.ts    # 窗口管理
    │   └── ipcHandlers.ts      # IPC处理器
    ├── preload/                # 预加载脚本
    │   └── mainWindow/         # 预加载脚本源码
    │       └── index.ts        # 预加载脚本入口
    ├── renderer/               # 渲染进程
    │   └── src/                # Vue 应用源码
    │       ├── App.vue         # 根组件
    │       │   └── main.ts     # 应用入口
    │       └── index.html      # HTML 模板
    └── shared/                 # 共享代码
        ├── stores/             # Pinia 状态管理
        │   ├── index.ts        # 状态管理入口
        │   ├── init.ts         # 初始化配置
        │   └── app.ts          # 应用状态
        ├── utils/              # 工具函数
        └── constants/          # 常量定义
```

## 安装和运行

### 环境要求

- Node.js 18.x 或更高版本
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 类型检查

```bash
npm run typecheck
```

### 构建生产版本

```bash
# 构建所有平台
npm run build

# 构建 Windows 版本
npm run build:win

# 构建 macOS 版本
npm run build:mac

# 构建 Linux 版本
npm run build:linux
```

## 开发流程

### 主进程开发

主进程代码位于 `src/main/` 目录，主要负责：

- 应用初始化
- 窗口管理
- 系统集成
- IPC 通信处理

### 渲染进程开发

渲染进程代码位于 `src/renderer/mainWindow/` 目录，基于 Vue 3 开发：

- 界面组件开发
- 用户交互处理
- 通过预加载脚本与主进程通信

### 状态管理

使用 Pinia 进行状态管理，状态定义在 `src/shared/stores/` 目录：

- `app.ts`: 应用全局状态
- `init.ts`: Pinia 初始化配置

### 通信机制

通过 Electron 的 IPC 机制实现主进程与渲染进程通信：

- 主进程: `ipcMain` 监听和处理事件
- 渲染进程: 通过预加载脚本暴露的 API 发送事件

## 代码规范

项目使用 ESLint 和 Prettier 进行代码规范检查和格式化：

```bash
# 代码格式化
npm run format

# 代码检查
npm run lint
```

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT License
