# XinSor (芯感) 📍

> **ZeroZap Sensor Knowledge Base & Toolchain**

XinSor 是 ZeroZap 组织的传感器知识库和工具链，提供传感器文档、参考设计和开发工具。

## 🌐 ZeroZap 组织

| 仓库 | 描述 | 状态 |
|------|------|------|
| [**ZeroZap**](https://github.com/ZeroZap) | 主组织枢纽 | 🏠 |
| [**XinYi**](https://github.com/ZeroZap/XinYi) | 嵌入式系统框架 | ✅ |
| [**XinSor**](https://github.com/ZeroZap/Xinsor) | 📍 传感器知识库 | 🔄 v2.0 |
| [**st_hal**](https://github.com/ZeroZap/st_hal) | STM32 HAL 库 | ✅ |
| [**xhsc**](https://github.com/ZeroZap/xhsc) | HC32 HAL 库 | ✅ |
| [**wch**](https://github.com/ZeroZap/wch) | CH32 HAL 库 | ✅ |

## 📁 项目结构

```
Xinsor/
├── docs/
│   ├── sensors/       # 传感器文档
│   │   ├── ADC.md
│   │   ├── DAC.md
│   │   ├── IMU.md
│   │   ├── BMS.md
│   │   └── ...
│   ├── protocols/     # 通信协议
│   │   ├── COMM_PROTOCOLS.md
│   │   └── SENSOR_FUSION.md
│   ├── reference/     # 参考设计
│   │   ├── PCB_DESIGN.md
│   │   ├── MCU_DEVELOPMENT.md
│   │   └── obsidian-kb/  # Obsidian 知识库归档
│   └── guides/        # 开发指南
│       ├── sensor-roadmap.md
│       └── ...
├── tools/             # 工具脚本
├── src/               # JavaScript/TypeScript 工具库
├── templates/         # 文档/代码模板
└── tests/             # 单元测试
```

## 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/ZeroZap/Xinsor.git
cd Xinsor

# 安装依赖
npm install

# 验证文档
npm run validate

# 运行测试
npm run test
```

## 📚 文档分类

### 传感器文档 (`docs/sensors/`)
- **ADC.md** - 模数转换器技术参考
- **DAC.md** - 数模转换器技术参考
- **IMU.md** - 惯性测量单元
- **CURRENT_SENSOR.md** - 电流传感器
- **FUEL_GAUGE.md** - 电量计
- **BMS.md** - 电池管理系统
- **CHARGER_IC.md** - 充电管理 IC

### 协议文档 (`docs/protocols/`)
- **COMM_PROTOCOLS.md** - 通信协议 (I2C, SPI, UART, CAN)
- **SENSOR_FUSION.md** - 传感器融合算法

### 参考设计 (`docs/reference/`)
- **PCB_DESIGN.md** - PCB 设计指南
- **MCU_DEVELOPMENT.md** - MCU 开发指南
- **EDGE_AI.md** - 边缘 AI 部署
- **obsidian-kb/** - Obsidian 知识库归档

### 开发指南 (`docs/guides/`)
- **sensor-roadmap.md** - 传感器技术路线图
- **HARDWARE_LEARNING_INDEX.md** - 硬件学习索引
- **YOLO_LEARNING.md** - YOLO 学习指南

## 🛠️ 工具链

### 文档验证
```bash
npm run validate
```

### 代码生成
```bash
npm run generate -- --sensor=adc --mcu=stm32u5
```

### 格式检查
```bash
npm run lint
npm run format
```

## 🤝 贡献

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

## 📄 许可证

MIT License - ZeroZap Team

## 🔗 链接

- [ZeroZap 组织](https://github.com/ZeroZap)
- [XinYi 框架文档](https://github.com/ZeroZap/XinYi)
- [重构说明](./RESTRUCTURE.md)

---

**最后更新**: 2026-03-13  
**版本**: 2.0.0 (重构版)
