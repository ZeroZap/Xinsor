# 电量计 (Fuel Gauge) 学习

## 🧠 功能概述

电量计 (Fuel Gauge) 是用于精确测量电池剩余电量 (SoC - State of Charge) 和电池健康状态 (SoH - State of Health) 的集成电路。它通过监测电池的电压、电流和温度来估算电池的可用容量。

## 📚 核心概念

### 1. SoC (State of Charge) - 荷电状态

| 参数 | 描述 |
|------|------|
| 定义 | 电池当前剩余容量与满充容量的比值 |
| 范围 | 0% (空) ~ 100% (满) |
| 精度 | 通常 ±1% ~ ±5% |

### 2. SoH (State of Health) - 健康状态

| 参数 | 描述 |
|------|------|
| 定义 | 电池当前最大容量与标称容量的比值 |
| 范围 | 0% (损坏) ~ 100% (全新) |
| 寿命终点 | 通常定义为 SoH < 80% |

### 3. 测量方法

```
┌─────────────────────────────────────────────────────┐
│              电量计测量方法                          │
├─────────────┬─────────────┬─────────────────────────┤
│   方法      │   优点      │   缺点                 │
├─────────────┼─────────────┼─────────────────────────┤
│ 电压法      │ 简单、成本低 │ 精度低，受负载影响大    │
│ 库仑计数法  │ 精度高、实时 │ 需要电流传感器，有累积误差│
│ 阻抗追踪法  │ 可测 SoH    │ 算法复杂，需要电池模型  │
│ 混合方法    │ 综合优势    │ 成本较高                │
└─────────────┴─────────────┴─────────────────────────┘
```

## 🔧 工作原理

### 库仑计数法 (Coulomb Counting)

```
SoC(t) = SoC(0) + (1/Cn) × ∫[0→t] η·I(τ) dτ

其中:
- SoC(t): t 时刻的荷电状态
- SoC(0): 初始荷电状态
- Cn: 电池标称容量 (Ah)
- I(τ): 充电/放电电流 (A)
- η: 库仑效率 (充电<1, 放电=1)
```

### 阻抗追踪法

```
┌──────────────────────────────────────────┐
│         阻抗追踪算法流程                  │
├──────────────────────────────────────────┤
│  1. 测量电池开路电压 (OCV)                │
│  2. 查询 OCV-SoC 曲线                     │
│  3. 测量负载下的电压降                    │
│  4. 计算电池内阻 R = ΔV / ΔI             │
│  5. 更新电池模型参数                      │
│  6. 修正 SoC 估算                         │
└──────────────────────────────────────────┘
```

## 🔌 常用电量计 IC

### Texas Instruments (TI)

| 型号 | 类型 | 通信接口 | 精度 | 应用 |
|------|------|----------|------|------|
| BQ27441 | 库仑计数 | I2C | ±1% | 便携式设备 |
| BQ27520 | 阻抗追踪 | I2C | ±1% | 智能手机 |
| BQ28Z610 | 阻抗追踪 | I2C | ±0.5% | 笔记本电脑 |
| BQ40Z50 | 库仑计数 | SMBus | ±1% | 多串电池组 |

### Maxim Integrated (现属 ADI)

| 型号 | 类型 | 通信接口 | 精度 | 应用 |
|------|------|----------|------|------|
| MAX17043 | 模型燃料计 | I2C | ±5% | IoT 设备 |
| MAX17050 | 阻抗追踪 | I2C | ±1% | 医疗设备 |
| MAX17201 | 阻抗追踪 | I2C | ±1% | 电动工具 |

### NXP

| 型号 | 类型 | 通信接口 | 精度 | 应用 |
|------|------|----------|------|------|
| SE97B | 库仑计数 | I2C | ±2% | 可穿戴设备 |
| MC33771 | 库仑计数 | SPI/ISO | ±0.5% | 电动汽车 |

## 📐 硬件设计要点

### 典型应用电路

```
         ┌─────────────────┐
    BAT+─┤ VCC         SDA ├─── SDA (I2C)
         │                 │
    BAT-─┤ VSS         SCL ├─── SCL (I2C)
         │                 │
    RS+──┤ SRP         INT ├─── INT (中断)
         │                 │
    RS-──┤ SRN         TS  ├─── TS (温度)
         │   FUEL GAUGE    │
    GND──┤ GND         BAT ├─── 电池检测
         │                 │
         └─────────────────┘
              ▲
              │
         电流检测电阻
           (典型 10mΩ)
```

### 关键参数选择

```javascript
// 电流检测电阻计算
const targetMaxCurrent = 5.0;  // 最大电流 5A
const senseVoltage = 0.050;    // 满量程电压 50mV
const Rsense = senseVoltage / targetMaxCurrent;  // 10mΩ

// 电阻功率计算
const powerDissipation = targetMaxCurrent ** 2 * Rsense;  // 0.25W
// 选择至少 2 倍余量：0.5W 电阻
```

## 💻 软件驱动示例

### I2C 读取示例 (Arduino)

```cpp
#include <Wire.h>

#define FUEL_GAUGE_ADDR 0x55

// BQ27441 寄存器定义
#define REG_SOC      0x2C
#define REG_VOLTAGE  0x08
#define REG_CURRENT  0x0A
#define TEMPERATURE  0x06

void setup() {
  Serial.begin(115200);
  Wire.begin();
}

uint16_t readRegister(uint8_t reg) {
  Wire.beginTransmission(FUEL_GAUGE_ADDR);
  Wire.write(reg);
  Wire.endTransmission();
  
  Wire.requestFrom(FUEL_GAUGE_ADDR, 2);
  uint16_t value = Wire.read() | (Wire.read() << 8);
  return value;
}

void loop() {
  uint16_t soc = readRegister(REG_SOC);
  uint16_t voltage = readRegister(REG_VOLTAGE);
  int16_t current = (int16_t)readRegister(REG_CURRENT);
  uint16_t temp = readRegister(TEMPERATURE);
  
  Serial.printf("SoC: %d%%\n", soc);
  Serial.printf("Voltage: %d mV\n", voltage);
  Serial.printf("Current: %d mA\n", current);
  Serial.printf("Temperature: %.1f °C\n", (temp - 2731) / 10.0);
  
  delay(1000);
}
```

### Python 读取示例 (Raspberry Pi)

```python
import smbus2
import time

class FuelGauge:
    def __init__(self, i2c_bus=1, address=0x55):
        self.bus = smbus2.SMBus(i2c_bus)
        self.address = address
        
    def read_word(self, reg):
        data = self.bus.read_word_data(self.address, reg)
        return data
    
    def get_soc(self):
        return self.read_word(0x2C)
    
    def get_voltage(self):
        return self.read_word(0x08)  # mV
    
    def get_current(self):
        current = self.read_word(0x0A)
        return current if current < 32768 else current - 65536  # mA
    
    def get_temperature(self):
        temp = self.read_word(0x06)
        return (temp - 2731) / 10.0  # °C
    
    def get_all(self):
        return {
            'soc': self.get_soc(),
            'voltage': self.get_voltage(),
            'current': self.get_current(),
            'temperature': self.get_temperature()
        }

# 使用示例
fg = FuelGauge()
while True:
    data = fg.get_all()
    print(f"SoC: {data['soc']}%")
    print(f"Voltage: {data['voltage']} mV")
    print(f"Current: {data['current']} mA")
    print(f"Temperature: {data['temperature']:.1f} °C")
    time.sleep(1)
```

## 🎯 校准流程

### 学习周期 (Learning Cycle)

```
┌─────────────────────────────────────────────────────────┐
│              电量计校准学习周期                          │
├─────────────────────────────────────────────────────────┤
│  1. 完全充电电池 (100% SoC)                             │
│     - 充电至截止电流 < C/20                              │
│     - 记录满充容量 (FCC)                                 │
│                                                         │
│  2. 静置电池 (≥2 小时)                                   │
│     - 让电池电压稳定                                     │
│     - 测量开路电压 (OCV)                                 │
│                                                         │
│  3. 完全放电电池 (0% SoC)                               │
│     - 放电至截止电压                                     │
│     - 记录放电容量                                       │
│                                                         │
│  4. 更新电池模型参数                                     │
│     - 计算实际 FCC                                       │
│     - 更新阻抗表                                         │
└─────────────────────────────────────────────────────────┘
```

## ⚠️ 常见问题与解决

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| SoC 跳变 | 未校准 | 执行完整学习周期 |
| 读数不准确 | 电流检测电阻误差 | 使用高精度电阻 (1%) |
| 通信失败 | I2C 上拉电阻不当 | 使用 4.7kΩ 上拉电阻 |
| 温度异常 | 热敏电阻位置不当 | 靠近电池极耳安装 |
| SoC 累积误差 | 库仑计数漂移 | 定期用 OCV 校准 |

## 📖 参考资源

- [TI 电量计选型指南](https://www.ti.com/battery-fuel-gauges)
- [BQ27441 数据手册](https://www.ti.com/product/BQ27441-G1)
- [电池大学 - 电量计原理](https://batteryuniversity.com/learn/article/fuel_gauge)
- [MAX17043 应用笔记](https://www.analog.com/en/product/MAX17043)

## 🔗 相关主题

- [充电 IC (Charger IC)](./CHARGER_IC.md)
- [电池管理系统 (BMS)](./BMS.md)
- [电源管理 (Power Management)](./POWER_MANAGEMENT.md)
