# XinSor 学习系统使用指南

## 📚 概述

XinSor 学习系统是一个完整的技术学习平台，包含 13 个学习领域，支持自主学习、项目驱动学习和进度追踪。

## 🎯 学习领域 (13 个)

### 电源管理
- 🔋 **电量计** - SoC/SoH 估算、库仑计数、阻抗追踪
- ⚡ **充电 IC** - CC/CV 充电、拓扑结构、安全保护
- 🔬 **电流计** - 分流电阻、霍尔效应、电流测量
- 🔋 **BMS** - 电池管理系统、均衡技术、CAN 通信

### 传感器与信号链
- 📊 **ADC** - 模数转换器、SAR/Δ-Σ架构
- 📈 **DAC** - 数模转换器、波形生成
- 📡 **IMU** - 惯性测量、姿态解算

### 通信与开发
- 📡 **通信协议** - I2C/SPI/UART/CAN 深度实践
- 💻 **MCU 开发** - STM32/CH32 外设开发
- 🧠 **传感器融合** - 卡尔曼滤波、姿态估计
- 🤖 **边缘 AI** - TensorFlow Lite/NCNN 部署
- 🔌 **PCB 设计** - KiCad 实战、布局布线

### 人工智能
- 🧠 **YOLO** - 目标检测、模型优化

---

## 🚀 启动方式

### Windows 用户

**推荐**: 使用启动器
```bash
start-learning.bat
```

会显示交互式菜单，可选择不同模式。

### 命令行方式

```bash
# 综合学习系统 (所有模块)
npm run learn:full

# 仅 YOLO 学习
npm run learn:yolo

# 仅硬件学习
npm run learn:hardware

# 项目学习 (交互式)
npm run project

# 查看进度
npm run status
```

### Linux/Mac 用户

```bash
# 使用启动脚本
./start-learning.bat  # 或使用以下命令

# 综合学习
npm run learn:full

# 单独模块
npm run learn:yolo
npm run learn:hardware
npm run project
npm run status
```

---

## 📖 使用模式

### 模式 1: 综合学习系统

**命令**: `npm run learn:full`

**特点**:
- YOLO 学习 (每 5 分钟)
- 硬件学习 (每 10 分钟)
- 自动进度追踪
- 成就系统
- 每小时生成报告

**适合**: 全天候自主学习

**输出示例**:
```
╔═══════════════════════════════════════════════════════════╗
║        🎓 XinSor 综合学习系统                              ║
║           XinSor Integrated Learning System               ║
╚═══════════════════════════════════════════════════════════╝

🧠 YOLO 学习调度器已启动
🔧 硬件学习调度器已启动
═══════════════════════════════════════════════════════════
✅ 所有学习模块已启动
ℹ️  按 Ctrl+C 停止学习并保存进度
═══════════════════════════════════════════════════════════

🧠 [YOLO] 会话 #1 完成
   主题：YOLO Architecture
🔧 [硬件] 会话 #1 完成
   主题：Fuel Gauge Basics
   类别：fuel_gauge
```

---

### 模式 2: YOLO 专项学习

**命令**: `npm run learn:yolo`

**特点**:
- 专注 YOLO 目标检测
- 5 分钟一个会话
- 8 个主题循环学习
- 自动保存进度

**适合**: 快速掌握 YOLO

---

### 模式 3: 硬件专项学习

**命令**: `npm run learn:hardware`

**特点**:
- 12 个硬件领域
- 10 分钟一个会话
- 自动读取文档
- 提取代码示例

**学习流程**:
```
1. 选择进度最低的类别
2. 读取对应文档
3. 提取知识点
4. 生成代码示例
5. 保存到知识库
```

**输出示例**:
```
╔═══════════════════════════════════════════════════════════╗
║        🔧 硬件学习系统                                     ║
║           Hardware Learning System                        ║
║                                                           ║
║   学习领域 (12):                                           ║
║   🔋 电量计 | 🔬 电流计 | ⚡ 充电 IC | 📊 ADC | 📈 DAC   ║
║   📡 IMU | 🔋 BMS | 📡 通信协议 | 💻 MCU 开发            ║
║   🧠 传感器融合 | 🤖 边缘 AI | 🔌 PCB 设计               ║
╚═══════════════════════════════════════════════════════════╝

🔧 硬件学习代理初始化完成
═══════════════════════════════════════════════════════════
会话 #1 完成
主题：Fuel Gauge Basics
类别：fuel_gauge
知识点：3 个
代码示例：2 个
═══════════════════════════════════════════════════════════
```

---

### 模式 4: 项目学习 (交互式)

**命令**: `npm run project`

**特点**:
- 6 个实战项目
- 代码生成
- 实验记录
- 项目报告

**可用项目**:
| 项目 ID | 名称 | 难度 | 周期 |
|---------|------|------|------|
| bms_design | BMS 电池管理系统 | advanced | 4 周 |
| imu_attitude | IMU 姿态解算 | intermediate | 2 周 |
| edge_ai_deploy | 边缘 AI 部署 | advanced | 3 周 |
| power_monitor | 电源监测仪 | intermediate | 2 周 |
| signal_generator | DDS 信号发生器 | advanced | 3 周 |
| data_logger | 数据采集记录仪 | intermediate | 2 周 |

**命令菜单**:
```
list              - 列出所有项目
start <project>   - 开始项目
status            - 查看当前项目状态
generate <phase>  - 生成代码
log <title>       - 记录实验
report            - 生成项目报告
help              - 显示帮助
quit              - 退出程序
```

**使用示例**:
```bash
# 启动项目
🛠️  project> start imu_attitude
✅ 项目已启动：IMU 姿态解算与传感器融合
📁 项目目录：projects/imu_attitude

# 生成代码
🛠️  project> generate firmware
📄 mpu6050.c:
📄 filter.c:
📄 main.c:

# 记录实验
🛠️  project> log 互补滤波测试
✅ 实验已记录
```

---

### 模式 5: 查看进度

**命令**: `npm run status`

**输出示例**:
```
╔═══════════════════════════════════════════════════════════╗
║           📊 综合学习进度报告                              ║
╠═══════════════════════════════════════════════════════════╣
║ 生成时间：2026-03-04                                      ║
╠═══════════════════════════════════════════════════════════╣
║ 总体概览                                                  ║
║   总会话数：25                                            ║
║   总学习时长：125 分钟                                     ║
║   连续学习：7 天                                           ║
║   完成项目：2                                             ║
╠═══════════════════════════════════════════════════════════╣
║ 🧠 YOLO 学习                                               ║
║   会话数：15                                              ║
║   当前周期：第 2 轮                                          ║
╠═══════════════════════════════════════════════════════════╣
║ 🔧 硬件学习                                               ║
║   会话数：10                                              ║
║   🔋 电量计：████████░░ 40%                               ║
║   📡 IMU: ████████░░ 40%                                  ║
╠═══════════════════════════════════════════════════════════╣
║ 🏆 成就墙                                                 ║
║   🎯 第一步                                                ║
║   💪 坚持不懈                                              ║
║   🔥 持之以恒                                              ║
╚═══════════════════════════════════════════════════════════╝
```

---

## 📂 文件结构

```
Xinsor/
├── docs/                       # 学习文档
│   ├── FUEL_GAUGE.md          # 电量计
│   ├── CURRENT_SENSOR.md      # 电流计
│   ├── CHARGER_IC.md          # 充电 IC
│   ├── ADC.md                 # ADC
│   ├── DAC.md                 # DAC
│   ├── IMU.md                 # IMU
│   ├── BMS.md                 # BMS ⭐
│   ├── COMM_PROTOCOLS.md      # 通信协议 ⭐
│   ├── MCU_DEVELOPMENT.md     # MCU 开发 ⭐
│   ├── SENSOR_FUSION.md       # 传感器融合 ⭐
│   ├── EDGE_AI.md             # 边缘 AI ⭐
│   ├── PCB_DESIGN.md          # PCB 设计 ⭐
│   └── HARDWARE_LEARNING_INDEX.md  # 总索引
│
├── src/
│   ├── agents/
│   │   ├── ai/
│   │   │   └── YOLOLearningAgent.js
│   │   └── embedded/
│   │       ├── HardwareLearningAgent.js  # 增强版
│   │       └── ProjectLearningAgent.js   # ⭐ 新增
│   ├── utils/
│   │   ├── LearningProgressTracker.js    # ⭐ 新增
│   │   └── AutoLearnScheduler.js
│   ├── learning-system.js     # ⭐ 综合学习主程序
│   ├── hardware-learning.js   # ⭐ 硬件学习
│   ├── project-learning.js    # ⭐ 项目学习
│   └── show-progress.js       # ⭐ 进度查看
│
├── logs/
│   └── learning/              # 学习日志
│
├── projects/                  # 项目目录 ⭐
│   └── <project-id>/
│       ├── src/
│       ├── hardware/
│       ├── docs/
│       └── README.md
│
├── experiments/               # 实验记录 ⭐
│   └── <project-id>/
│       └── exp_<id>.json
│
├── start-learning.bat         # ⭐ 启动器
└── LEARNING.md                # 本文档
```

---

## 🏆 成就系统

| 成就 | 条件 | 图标 |
|------|------|------|
| 第一步 | 完成第一次学习 | 🎯 |
| 坚持不懈 | 完成 10 次学习 | 💪 |
| 学习大师 | 完成 50 次学习 | 🏆 |
| 传奇学者 | 完成 100 次学习 | 👑 |
| 初露锋芒 | 连续学习 1 天 | 🔥 |
| 持之以恒 | 连续学习 7 天 | 🔥🔥 |
| 日复一日 | 连续学习 30 天 | 🔥🔥🔥 |
| 实验家 | 完成第一次实验 | 🧪 |
| 程序员 | 生成第一段代码 | 💻 |
| 项目完成 | 完成第一个项目 | ✅ |
| 小时突破 | 累计学习 1 小时 | ⏱️ |
| 十小时挑战 | 累计学习 10 小时 | ⏱️⏱️ |

---

## 💡 学习建议

### 新手入门
1. 从 YOLO 学习开始 (简单、反馈快)
2. 同时学习硬件基础 (电量计、IMU)
3. 完成第一个项目 (IMU 姿态解算)

### 进阶学习
1. 深入学习通信协议
2. 掌握 MCU 开发
3. 学习传感器融合算法

### 高级应用
1. BMS 系统设计
2. 边缘 AI 部署
3. 完整 PCB 设计

---

## 🔧 配置选项

### 修改学习间隔

编辑 `src/learning-system.js`:
```javascript
const config = {
  yolo: {
    enabled: true,
    intervalMinutes: 5  // 修改 YOLO 学习间隔
  },
  hardware: {
    enabled: true,
    intervalMinutes: 10  // 修改硬件学习间隔
  }
};
```

### 禁用模块

```javascript
const config = {
  yolo: { enabled: false },  // 禁用 YOLO
  hardware: { enabled: true },
  project: { enabled: true }
};
```

---

## 📞 问题排查

### 常见问题

**Q: 学习系统无法启动？**
```bash
# 检查依赖
npm install

# 检查 Node 版本
node --version  # 需要 >=18.0.0
```

**Q: 进度没有保存？**
- 检查 `docs/learning_progress.json` 是否存在
- 确保有写入权限

**Q: 代码生成失败？**
- 确保项目已启动 (`start <project>`)
- 检查 `projects/` 目录权限

---

## 📝 学习日志

学习日志保存在 `logs/learning/` 目录：
- `learning_system.log` - 综合学习日志
- `hardware_learning.log` - 硬件学习日志
- `project_learning.log` - 项目学习日志
- `session_YYYY-MM-DD.json` - 每日会话记录

---

*最后更新：2026 年 3 月 4 日*
