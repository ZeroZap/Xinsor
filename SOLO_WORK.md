# 🤖 XinSor 自主工作模式

## 概述

XinSor 自主工作模式是一个多任务自动化系统，可持续运行执行各种 AI 任务。

## 📋 任务列表

| 任务 | 间隔 | 描述 | 优先级 |
|------|------|------|--------|
| **YOLO 学习** | 5 分钟 | YOLO 目标检测自主学习 | P1 |
| **传感器数据采集** | 3 分钟 | 模拟传感器数据读取 | P2 |
| **传感器数据分析** | 10 分钟 | 统计分析采集的数据 | P3 |
| **HAL 代码生成** | 15 分钟 | 生成嵌入式 HAL 代码 | P4 |
| **API 文档生成** | 20 分钟 | 自动生成 API 文档 | P5 |
| **学习报告生成** | 30 分钟 | 生成学习进度报告 | P6 |
| **系统健康检查** | 5 分钟 | 检查系统状态 | P7 |

## 🚀 启动方式

### 方式 1: NPM 命令
```bash
# 自主工作模式（推荐）
npm run work

# 或
npm run solo
```

### 方式 2: 直接运行
```bash
node src/autonomous-work.js
```

### 方式 3: 仅 YOLO 学习
```bash
npm run learn
```

## 📊 输出目录结构

```
Xinsor/
├── logs/
│   ├── autonomous_work.log    # 自主工作日志
│   └── yolo_learning.log      # YOLO 学习日志
├── docs/
│   ├── yolo_progress.json     # YOLO 进度
│   └── autonomous_state.json  # 自主工作状态
├── data/
│   ├── sensor_readings.json   # 传感器数据
│   └── sensor_analysis.json   # 数据分析结果
├── generated/
│   ├── hal/                   # 生成的 HAL 代码
│   └── docs/                  # 生成的文档
└── reports/
    ├── learning_report_*.md   # 学习报告
    └── health_check.json      # 健康检查
```

## 📈 监控命令

### 查看实时日志
```bash
# Windows PowerShell
Get-Content logs/autonomous_work.log -Wait -Tail 20

# Linux/Mac
tail -f logs/autonomous_work.log
```

### 查看任务状态
```bash
# 查看自主工作状态
type docs/autonomous_state.json

# 查看 YOLO 进度
type docs/yolo_progress.json

# 查看健康报告
type reports/health_check.json
```

## 📝 日志示例

```
╔═══════════════════════════════════════════════════════════╗
║        🤖 XinSor 自主工作模式 - SOLO 到天亮                ║
║           Autonomous Working Mode                         ║
╚═══════════════════════════════════════════════════════════╝

[2026-03-03T00:00:00.000Z] [SYSTEM] XinSor 自主工作系统启动
[2026-03-03T00:00:00.000Z] [INFO] 已加载 14 个 Agents

✅ 注册任务：yolo_learning (每 5 分钟)
✅ 注册任务：sensor_collection (每 3 分钟)
✅ 注册任务：sensor_analysis (每 10 分钟)
✅ 注册任务：hal_generation (每 15 分钟)
✅ 注册任务：api_documentation (每 20 分钟)
✅ 注册任务：learning_report (每 30 分钟)
✅ 注册任务：health_check (每 5 分钟)

📋 已注册任务：7 个
🕐 启动时间：2026/3/3 00:00:00
────────────────────────────────────────────────────

📝 [2026/3/3 00:00:01] 执行任务：sensor_collection #1
   ✅ 完成：sensor_collection
   📋 采集 4 个传感器数据点
   ⏱️  下次执行：2026/3/3 00:03:01
```

## ⚙️ 配置选项

编辑 `src/config/yolo.config.js` 和 `src/autonomous-work.js` 可自定义：

- 任务执行间隔
- 日志级别
- 输出目录
- 启用的任务

## 🛑 停止方式

按 `Ctrl+C` 优雅停止，系统会自动保存所有状态。

## 📊 状态查看

系统会定期生成以下报告：

1. **学习报告** - `reports/learning_report_*.md`
2. **健康检查** - `reports/health_check.json`
3. **数据分析** - `data/sensor_analysis.json`
4. **生成代码** - `generated/hal/`
5. **生成文档** - `generated/docs/`

---

**SOLO 到天亮** - 让 XinSor 陪你工作到天亮 🌅
