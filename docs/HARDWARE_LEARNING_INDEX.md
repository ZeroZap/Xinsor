# 硬件技术学习索引

## 📚 学习主题概览

本索引汇集了 XinSor 项目中的所有硬件技术学习文档。

---

## 🔋 电源管理系列

### [电量计 (Fuel Gauge)](./FUEL_GAUGE.md)

学习电池电量监测技术，包括 SoC/SoH 估算、库仑计数、阻抗追踪等。

**核心内容**:
- SoC (荷电状态) 和 SoH (健康状态) 概念
- 库仑计数法与阻抗追踪法
- 常用电量计 IC (TI BQ 系列、Maxim MAX 系列)
- I2C 通信与软件驱动
- 校准流程与学习周期

**适用场景**: 电池供电设备、电量显示、电池健康管理

---

### [电流计 (Current Sensor)](./CURRENT_SENSOR.md)

学习电流测量技术，包括分流电阻、霍尔效应、磁阻传感器等。

**核心内容**:
- 分流电阻法与霍尔效应原理
- 常用电流传感器 (INA219、ACS712、TMCS1100)
- 双向电流检测设计
- 电流监测驱动开发
- 过流保护应用

**适用场景**: 电源监测、电机控制、电池管理系统

---

### [充电 IC (Charger IC)](./CHARGER_IC.md)

学习电池充电管理技术，包括充电曲线、拓扑结构、安全保护等。

**核心内容**:
- CC/CV 充电曲线与 C-Rate 概念
- 线性充电器 vs 开关充电器
- 常用充电 IC (TI BQ 系列、TP4056 等)
- 充电状态机设计
- 热管理与安全保护

**适用场景**: 充电电路设计、移动电源、无线充电

---

### [BMS 电池管理系统](./BMS.md) ⭐ NEW

学习电池管理系统的完整设计，包括 AFE 选型、均衡技术、通信协议等。

**核心内容**:
- BMS 系统架构与核心功能
- 电池组配置计算 (S/P 配置)
- AFE 芯片选型 (BQ76940/952, LTC6811)
- 被动/主动均衡技术
- CAN 通信协议
- SOC 估算算法

**适用场景**: 电动自行车、电动汽车、储能系统

---

## 📡 传感器与信号链系列

### [ADC (模数转换器)](./ADC.md)

学习模数转换技术，包括 SAR、Δ-Σ、Pipeline 等架构。

**核心内容**:
- ADC 关键参数 (分辨率、采样率、ENOB)
- SAR、Δ-Σ、Pipeline 架构原理
- 常用 ADC 芯片 (ADS1115、HX711、MCP3008)
- 过采样与数字滤波
- 精密测量设计

**适用场景**: 传感器数据采集、精密测量、音频处理

---

### [DAC (数模转换器)](./DAC.md)

学习数模转换技术，包括 R-2R、电流舵、Δ-Σ 等架构。

**核心内容**:
- DAC 关键参数 (分辨率、建立时间、INL/DNL)
- R-2R、电流舵、Δ-Σ 架构原理
- 常用 DAC 芯片 (MCP4725、DAC8560、PCM5102)
- 波形生成技术
- 可编程电源设计

**适用场景**: 波形发生器、电机控制、音频播放

---

### [IMU 惯性测量单元](./IMU.md)

学习运动传感器技术，包括加速度计、陀螺仪、磁力计及传感器融合。

**核心内容**:
- 加速度计、陀螺仪、磁力计原理
- 欧拉角与四元数表示
- 互补滤波与卡尔曼滤波
- 常用 IMU 芯片 (MPU6050、BMI088、BNO055)
- 姿态解算算法

**适用场景**: 无人机、机器人、姿态检测、运动追踪

---

## 📡 通信协议系列

### [通信协议深度实践](./COMM_PROTOCOLS.md) ⭐ NEW

深入学习 I2C、SPI、UART、CAN 四种常用通信协议。

**核心内容**:
- I2C: 开漏输出、时序协议、多主多从
- SPI: 4 线制、时钟模式、全双工通信
- UART: 异步通信、波特率、数据帧
- CAN: 差分信号、仲裁机制、汽车应用
- STM32/Arduino 驱动代码

**适用场景**: 所有嵌入式系统开发

---

## 💻 MCU 开发系列

### [MCU 开发实战](./MCU_DEVELOPMENT.md) ⭐ NEW

STM32/CH32 MCU 开发完整指南，涵盖核心外设。

**核心内容**:
- GPIO 配置 (8 种模式)
- 中断系统 (NVIC, EXTI)
- 定时器 (PWM, 输入捕获)
- DMA (直接存储器访问)
- ADC 采集 (多通道 DMA)
- STM32 HAL 库开发

**适用场景**: 所有基于 ARM Cortex-M/RISC-V 的开发

---

## 🧠 算法与融合系列

### [传感器融合与卡尔曼滤波](./SENSOR_FUSION.md) ⭐ NEW

学习多传感器数据融合算法，实现精确姿态估计。

**核心内容**:
- 姿态表示 (欧拉角、四元数、旋转矩阵)
- 互补滤波原理与实现
- 卡尔曼滤波 (EKF) 推导
- IMU 姿态解算实战
- 算法对比与选型

**适用场景**: 无人机、机器人、VR/AR、自平衡车

---

## 🤖 边缘 AI 系列

### [边缘 AI 部署](./EDGE_AI.md) ⭐ NEW

学习将深度学习模型部署到嵌入式设备。

**核心内容**:
- TensorFlow Lite Micro 框架
- NCNN 框架
- 模型量化 (FP32→INT8)
- 模型剪枝与蒸馏
- STM32 部署实战
- 性能优化 (CMSIS-NN)

**适用场景**: 目标检测、语音识别、异常检测

---

## 🔌 PCB 设计系列

### [PCB 设计实战](./PCB_DESIGN.md) ⭐ NEW

使用 KiCad 进行 PCB 设计的完整流程。

**核心内容**:
- KiCad 工具链
- 原理图设计
- PCB 布局布线
- 叠层设计与阻抗控制
- EMI/EMC 设计
- Gerber 输出

**适用场景**: 所有硬件项目开发

---

## 🤖 人工智能系列

### [YOLO 目标检测](./YOLO_LEARNING.md)

学习 YOLO 目标检测技术，包括网络架构、模型优化等。

**核心内容**:
- YOLO 网络架构
- Anchor Boxes 与 IoU
- 损失函数分析
- 数据增强技术
- 模型优化与部署

**适用场景**: 视频监控、自动驾驶、工业检测

---

## 📊 学习进度追踪

| 主题 | 文档 | 状态 | 最后更新 |
|------|------|------|----------|
| 电量计 | [FUEL_GAUGE.md](./FUEL_GAUGE.md) | ✅ 完成 | 2026/3/3 |
| 电流计 | [CURRENT_SENSOR.md](./CURRENT_SENSOR.md) | ✅ 完成 | 2026/3/3 |
| 充电 IC | [CHARGER_IC.md](./CHARGER_IC.md) | ✅ 完成 | 2026/3/3 |
| ADC | [ADC.md](./ADC.md) | ✅ 完成 | 2026/3/3 |
| DAC | [DAC.md](./DAC.md) | ✅ 完成 | 2026/3/3 |
| IMU | [IMU.md](./IMU.md) | ✅ 完成 | 2026/3/3 |
| YOLO | [YOLO_LEARNING.md](./YOLO_LEARNING.md) | ✅ 完成 | 2026/3/4 |
| BMS | [BMS.md](./BMS.md) | ✅ 新增 | 2026/3/4 |
| 通信协议 | [COMM_PROTOCOLS.md](./COMM_PROTOCOLS.md) | ✅ 新增 | 2026/3/4 |
| MCU 开发 | [MCU_DEVELOPMENT.md](./MCU_DEVELOPMENT.md) | ✅ 新增 | 2026/3/4 |
| 传感器融合 | [SENSOR_FUSION.md](./SENSOR_FUSION.md) | ✅ 新增 | 2026/3/4 |
| 边缘 AI | [EDGE_AI.md](./EDGE_AI.md) | ✅ 新增 | 2026/3/4 |
| PCB 设计 | [PCB_DESIGN.md](./PCB_DESIGN.md) | ✅ 新增 | 2026/3/4 |

---

## 🎯 学习路径建议

### 电源管理方向
```
电量计 → 充电 IC → 电流计 → BMS 系统 → 电源管理整体设计
```

### 传感器方向
```
IMU 基础 → 传感器融合 → 姿态解算 → 实际应用 (无人机/机器人)
```

### 嵌入式开发方向
```
GPIO/中断 → 定时器/PWM → ADC/DAC → 通信协议 → DMA → 综合项目
```

### 人工智能方向
```
YOLO 基础 → 模型训练 → 量化优化 → 边缘部署 (TFLM/NCNN)
```

### 硬件设计方向
```
原理图 → PCB 布局 → 叠层设计 → EMI/EMC → 生产文件
```

---

## 📝 笔记与实验

建议在每个主题学习过程中记录：
1. **理论笔记** - 核心概念理解
2. **实验记录** - 硬件测试数据
3. **代码示例** - 驱动与应用代码
4. **问题总结** - 遇到的问题与解决方案

---

## 🔗 相关资源

- [电池大学](https://batteryuniversity.com/) - 电池技术学习
- [SparkFun 教程](https://learn.sparkfun.com/) - 硬件项目实践
- [Adafruit 学习系统](https://learn.adafruit.com/) - 传感器应用
- [Arduino 参考](https://www.arduino.cc/reference/) - 嵌入式编程
- [STM32 参考手册](https://www.st.com/en/microcontrollers-microprocessors/stm32-32-bit-arm-cortex-mcus.html) - MCU 开发
- [KiCad 文档](https://www.kicad.org/doc/) - PCB 设计
- [TensorFlow Lite](https://www.tensorflow.org/lite/micro) - 边缘 AI

---

*最后更新：2026 年 3 月 4 日*
