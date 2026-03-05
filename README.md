# XinSor - Sensor Integration AI Agents 🎯

> **XinSor (芯感)** - 传感器集成与生态系统

XinSor 是 ZeroZap 组织旗下的传感器集成项目，提供智能 AI Agents 用于传感器生态系统的设计、讨论和开发。

## 🌐 ZeroZap 组织

| 仓库 | 描述 |
|------|------|
| [**ZeroZap**](https://github.com/ZeroZap) | 主组织枢纽 |
| [**XinYi**](https://github.com/ZeroZap/XinYi) | 嵌入式系统框架 (STM32/CH32) |
| [**XinLink**](https://github.com/ZeroZap/XinLink) | 硬件桥接板 |
| [**XinSor**](https://github.com/ZeroZap/Xinsor) | 📍 传感器集成 |
| [**XinBoard**](https://github.com/ZeroZap/XinBoard) | 开发板 |
| [**mcu**](https://github.com/ZeroZap/st) | MCU HAL 库 |
| [**2020**](https://github.com/ZeroZap/2020) | 📚 知识库 (极光云) |
| [**discord**](https://github.com/ZeroZap/discord) | 🤖 AI Agent 社区 |

## ✨ 功能特性

- **🎯 传感器生态**：Raw 传感器接口、MCU 转换器、传感器仿真
- **🤖 多 Agent 协作**：共识驱动的架构设计
- **🛠️ 核心 Skills**：Git、Format、Search、Link、Protocol、HAL 生成等
- **🌍 跨平台**：Linux、macOS、Windows、Android

## 🚀 快速开始

```bash
git clone git@github.com:ZeroZap/Xinsor.git
cd Xinsor
npm install
cp .env.example .env
# 编辑 .env 填入 DISCORD_TOKEN
npm start
```

## 🤖 Agents

### 🧠 AI 学习 Agents

| Agent | 命令 | 描述 |
|-------|------|------|
| YOLOLearning | `!yolo` | YOLO 目标检测自主学习 (每 5 分钟) |
| XinSorDiscussion | `!xinsor` | 传感器生态蓝图讨论协调 |

### 🎯 传感器核心 Agents

| Agent | 命令 | 描述 |
|-------|------|------|
| XinSorDiscussion | `!xinsor` | 传感器生态蓝图讨论协调 |
| SensorAgent | `!sensor` | 传感器接口和协议 |
| DataCollectionAgent | `!data` | 数据采集管道设计 |
| SimulationAgent | `!sim` | 传感器仿真框架 |

### 代码质量 Agents

| Agent | 命令 | 描述 |
|-------|------|------|
| CodeReview | `!CodeReview` | 代码质量分析 |
| Debug | `!Debug` | 调试协助 |
| Doc | `!Doc` | 文档生成 |
| Test | `!Test` | 单元测试生成 |
| Security | `!Security` | 安全扫描 |

### 嵌入式 Agents

| Agent | 命令 | 描述 |
|-------|------|------|
| XinYi | `!XinYi` | 嵌入式系统框架 |
| MCUHAL | `!MCUHAL` | MCU HAL 层生成 |
| EmbeddedDriver | `!driver` | 嵌入式驱动开发 |
| RTOS | `!RTOS` | 实时操作系统 |

## 🛠️ Skills

| Skill | 命令 | 描述 |
|-------|------|------|
| Git | `!git` | Git 操作 |
| Format | `!format` | 代码格式化 |
| Search | `!search` | 知识库搜索 |
| Link | `!link` | Obsidian 链接生成器 |
| Protocol | `!protocol` | 协议转换设计 |
| HALGenerator | `!hal` | HAL 层代码生成 |
| EmbeddedBuild | `!build` | 嵌入式构建 |
| Crypto | `!crypto` | 加密操作 |

## 📋 常用命令

### 🧠 YOLO 学习命令
`!yolo` - 开始/继续学习  `!yolo status` - 查看进度  `!yolo reset` - 重置

### 🎯 传感器命令
`!xinsor` `!sensor` `!data` `!sim` `!blueprint`

### 讨论命令
`!discuss <topic>` - 启动多 Agent 讨论
`!history` - 查看讨论历史

### 工具命令
`!help` `!agents` `!skills` `!search` `!link`

## 💬 讨论示例

```
!discuss sensor I2C protocol implementation
!xinsor blueprint
!sensor list interfaces
```

## 📁 项目结构

```
Xinsor/
├── src/
│   ├── agents/
│   │   ├── knowledge/      # 知识 Agent
│   │   ├── sensor/         # 传感器 Agent
│   │   ├── AgentRegistry.js
│   │   ├── BaseAgent.js
│   │   ├── OrchestratorAgent.js
│   │   └── ...
│   ├── skills/
│   │   ├── SkillRegistry.js
│   │   ├── BaseSkill.js
│   │   └── ...
│   ├── utils/
│   │   └── CommandHandler.js
│   ├── config/
│   │   └── bot.config.js
│   └── index.js
├── docs/                   # 文档
├── scripts/                # 脚本
├── .env.example
├── package.json
└── README.md
```

## 🔗 链接

- [ZeroZap Discord](https://github.com/ZeroZap/discord)
- [XinYi 框架](https://github.com/ZeroZap/XinYi)
- [知识库](https://github.com/ZeroZap/2020)

**License**: MIT - ZeroZap Team
