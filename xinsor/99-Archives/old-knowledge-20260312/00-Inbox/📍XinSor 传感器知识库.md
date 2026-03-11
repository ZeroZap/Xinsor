# 📍 XinSor 传感器知识库

> **XinSor (芯感)** - ZeroZap 组织传感器集成知识库  
> **版本:** v2.0 | **最后更新:** 2026-03-11  
> **格式:** Obsidian Markdown | **同步:** 坚果云

---

## 🎯 知识库定位

本知识库是 ZeroZap 组织 XinSor 项目的核心知识资产，专注于**嵌入式传感器 IC**的系统化学习与整理。

**目标:**
- 📚 建立完整的传感器 IC 知识体系
- 🔍 为每个传感器提供独特的技术讲解
- 🛠️ 提供 MCU 集成指南和代码示例
- ⚡ 覆盖低功耗设计和选型建议
- 🌐 支持 AI Agent 自主学习和应用

---

## 📂 目录结构

```
knowledge/
├── 00-Inbox/                    # 临时笔记和新内容
│   └── 📍XinSor 传感器知识库.md  # 本索引
├── 01-Sensors/                  # 传感器分类库
│   ├── 01-运动传感器/           # 加速度计、陀螺仪、IMU
│   ├── 02-环境传感器/           # 温湿度、气压、气体
│   ├── 03-光学传感器/           # 光强、颜色、ToF
│   ├── 04-磁传感器/             # 霍尔、磁阻、电子罗盘
│   ├── 05-压力传感器/           # 压阻、压电、MEMS
│   ├── 06-生物传感器/           # 心率、血氧、ECG
│   ├── 07-电源管理/             # 电量计、充电 IC、BMS
│   └── 08-信号链/               # ADC、DAC、运放
├── 02-Protocols/                # 通信协议
│   ├── I2C 协议深度解析.md
│   ├── SPI 协议深度解析.md
│   ├── UART 协议深度解析.md
│   ├── CAN 总线协议.md
│   └── 1-Wire 协议.md
├── 03-MCU-Integration/          # MCU 集成指南
│   ├── STM32 传感器驱动框架.md
│   ├── CH32 传感器驱动框架.md
│   ├── 通用驱动模板.md
│   └── HAL 层设计规范.md
├── 04-LowPower/                 # 低功耗设计
│   ├── 传感器低功耗模式.md
│   ├── 系统级功耗优化.md
│   ├── 电池供电设计.md
│   └── 功耗测量方法.md
├── 05-Applications/             # 应用场景
│   ├── 智能家居传感器方案.md
│   ├── 可穿戴设备传感器方案.md
│   ├── 工业物联网传感器方案.md
│   └── 汽车电子传感器方案.md
└── Templates/                   # 文档模板
    ├── 传感器 IC 模板.md
    ├── 应用笔记模板.md
    └── 实验记录模板.md
```

---

## 🏷️ 标签系统

### 传感器类型标签
`#sensor/accelerometer` `#sensor/gyroscope` `#sensor/imu` `#sensor/humidity` `#sensor/temperature` `#sensor/pressure` `#sensor/gas` `#sensor/optical` `#sensor/magnetic`

### 接口协议标签
`#protocol/i2c` `#protocol/spi` `#protocol/uart` `#protocol/can` `#protocol/onewire`

### MCU 平台标签
`#mcu/stm32` `#mcu/ch32` `#mcu/esp32` `#mcu/arduino`

### 应用场景标签
`#app/iot` `#app/wearable` `#app/smart-home` `#app/automotive` `#app/industrial`

### 文档类型标签
`#type/datasheet` `#type/application` `#type/tutorial` `#type/reference` `#type/experiment`

---

## 📊 传感器分类索引

### 🎯 运动传感器 (Motion Sensors)

| 传感器 | 型号 | 轴数 | 接口 | 厂商 | 状态 |
|--------|------|------|------|------|------|
| MPU6050 | 6 轴 IMU | 6 | I2C | InvenSense | 📝 待编写 |
| ICM20948 | 9 轴 IMU | 9 | I2C/SPI | InvenSense | 📝 待编写 |
| BMI088 | 6 轴 IMU | 6 | I2C/SPI | Bosch | 📝 待编写 |
| BNO055 | 智能 IMU | 9 | I2C/UART | Bosch | 📝 待编写 |
| LSM6DS3 | 6 轴 IMU | 6 | I2C/SPI | ST | 📝 待编写 |
| ADXL345 | 3 轴加速度 | 3 | I2C/SPI | ADI | 📝 待编写 |
| H3LIS331DL | 3 轴加速度 | 3 | I2C/SPI | ST | 📝 待编写 |

### 🌡️ 环境传感器 (Environmental Sensors)

| 传感器 | 测量 | 精度 | 接口 | 厂商 | 状态 |
|--------|------|------|------|------|------|
| SHT30 | 温湿度 | ±2% RH | I2C | Sensirion | 📝 待编写 |
| AHT20 | 温湿度 | ±3% RH | I2C | ASAIR | 📝 待编写 |
| BME280 | 温湿压 | ±1% RH | I2C/SPI | Bosch | 📝 待编写 |
| BMP280 | 温压 | ±0.12% | I2C/SPI | Bosch | 📝 待编写 |
| SGP30 | eCO2/TVOC | - | I2C | Sensirion | 📝 待编写 |
| CCS811 | eCO2/TVOC | - | I2C | AMS | 📝 待编写 |
| MH-Z19 | CO2 | ±50ppm | UART | Winsen | 📝 待编写 |

### 🔆 光学传感器 (Optical Sensors)

| 传感器 | 类型 | 量程 | 接口 | 厂商 | 状态 |
|--------|------|------|------|------|------|
| BH1750 | 光强 | 1-65535 lux | I2C | ROHM | 📝 待编写 |
| VEML7700 | 光强 | 0-120k lux | I2C | Vishay | 📝 待编写 |
| TCS34725 | RGB 颜色 | - | I2C | AMS | 📝 待编写 |
| APDS9960 | RGB+ 手势 | - | I2C | Broadcom | 📝 待编写 |
| VL53L0X | ToF 测距 | 0-2m | I2C | ST | 📝 待编写 |
| VL53L1X | ToF 测距 | 0-4m | I2C | ST | 📝 待编写 |

### 🧲 磁传感器 (Magnetic Sensors)

| 传感器 | 类型 | 量程 | 接口 | 厂商 | 状态 |
|--------|------|------|------|------|------|
| HMC5883L | 3 轴磁力 | ±8 Gauss | I2C | Honeywell | 📝 待编写 |
| QMC5883L | 3 轴磁力 | ±8 Gauss | I2C | QST | 📝 待编写 |
| MMC5603 | 3 轴磁力 | ±30 Gauss | I2C | Memsic | 📝 待编写 |
| TMAG5170 | 3 轴磁力 | - | SPI | TI | 📝 待编写 |

### 🔋 电源管理 (Power Management)

| 传感器 | 功能 | 接口 | 厂商 | 状态 |
|--------|------|------|------|------|
| INA219 | 电流/电压 | I2C | TI | ✅ 已学习 |
| INA226 | 电流/电压 | I2C | TI | 📝 待编写 |
| MAX17043 | 电量计 | I2C | Maxim | 📝 待编写 |
| BQ27441 | 电量计 | I2C | TI | 📝 待编写 |
| TP4056 | 充电 IC | - | TP | ✅ 已学习 |
| BQ24072 | 充电 IC | - | TI | 📝 待编写 |

### 📡 信号链 (Signal Chain)

| 传感器 | 类型 | 分辨率 | 接口 | 厂商 | 状态 |
|--------|------|--------|------|------|------|
| ADS1115 | ADC | 16-bit | I2C | TI | ✅ 已学习 |
| HX711 | ADC | 24-bit | 2-wire | HX | 📝 待编写 |
| MCP3008 | ADC | 10-bit | SPI | Microchip | 📝 待编写 |
| MCP4725 | DAC | 12-bit | I2C | Microchip | ✅ 已学习 |
| DAC8560 | DAC | 16-bit | SPI | TI | 📝 待编写 |

---

## 🔗 快速链接

### 核心文档
- [[01-传感器 IC 选型指南]] - 如何选择合适的传感器
- [[02-通信协议对比]] - I2C/SPI/UART/CAN 对比
- [[03-低功耗设计实践]] - 电池供电系统优化
- [[04-MCU 驱动开发规范]] - 统一驱动框架

### 学习路径
```
新手入门 → 传感器基础 → 通信协议 → MCU 集成 → 低功耗设计 → 实际应用
```

### 外部资源
- [ZeroZap 组织](https://github.com/ZeroZap)
- [XinYi 框架](https://github.com/ZeroZap/XinYi)
- [2020 知识库](https://github.com/ZeroZap/2020)

---

## 📝 更新日志

| 日期 | 更新内容 | 作者 |
|------|----------|------|
| 2026-03-11 | 知识库框架重构，创建目录结构 | EE Agent |
| 2026-03-04 | 新增 BMS、通信协议、MCU 开发文档 | 原团队 |

---

## 🎯 下一步计划

- [ ] 完成运动传感器系列文档 (MPU6050, ICM20948, BMI088)
- [ ] 完成环境传感器系列文档 (SHT30, BME280, SGP30)
- [ ] 完成光学传感器系列文档 (BH1750, VL53L0X, TCS34725)
- [ ] 创建传感器 IC 选型决策树
- [ ] 编写 STM32/CH32 通用驱动模板
- [ ] 整理低功耗设计最佳实践

---

**#xinSor #传感器 #知识库 #嵌入式 #ZeroZap**

---

*本知识库由 XinSor AI Agents 维护 · ZeroZap 团队*
