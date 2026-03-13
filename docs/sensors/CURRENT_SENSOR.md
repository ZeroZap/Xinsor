# 电流计 (Current Sensor) 学习

## 🧠 功能概述

电流计 (Current Sensor) 是用于测量电路中电流大小的传感器装置。它通过将电流转换为可测量的电压信号或数字信号，实现对电流的精确监测。广泛应用于电源管理、电机控制、电池管理系统等领域。

## 📚 核心概念

### 1. 电流测量原理

```
┌─────────────────────────────────────────────────────────┐
│              电流测量方法对比                            │
├─────────────┬─────────────┬─────────────┬───────────────┤
│   方法      │   优点      │   缺点      │   应用场景    │
├─────────────┼─────────────┼─────────────┼───────────────┤
│ 分流电阻法  │ 简单、成本低│ 有功耗、无隔离│ 小电流测量   │
│ 霍尔效应    │ 隔离、低功耗│ 易受磁场干扰 │ 中大电流测量 │
│ 电流互感器  │ 隔离、高精度│ 只能测交流  │ 交流电流测量 │
│ 磁阻效应    │ 高灵敏度    │ 温度漂移大  │ 精密测量     │
│ 罗氏线圈    │ 宽频带、线性│ 需要积分器  │ 高频交流测量 │
└─────────────┴─────────────┴─────────────┴───────────────┘
```

### 2. 关键参数

| 参数 | 符号 | 单位 | 说明 |
|------|------|------|------|
| 测量范围 | I_range | A | 可测量的最小/最大电流 |
| 灵敏度 | S | mV/A | 输出变化与电流变化的比值 |
| 精度 | ε | % | 测量值与真实值的偏差 |
| 带宽 | BW | kHz | 可响应的频率范围 |
| 响应时间 | t_r | μs | 输出达到稳态的时间 |
| 隔离电压 | V_iso | V | 输入输出间的耐压值 |
| 温漂 | TC | ppm/°C | 温度变化引起的误差 |

### 3. 分流电阻法原理

```
┌─────────────────────────────────────────────────────┐
│              分流电阻 (Shunt Resistor) 测量          │
│                                                     │
│     负载电流                                        │
│        │                                            │
│        ▼                                            │
│    ┌─────────┐                                      │
│    │         │                                      │
│ +──┤  负载   ├───┐                                  │
│    │         │   │                                  │
│    └─────────┘   │                                  │
│        │         ▼ I_shunt                          │
│        │     ┌───────┐                              │
│        │     │ R_s   │ ← 分流电阻 (典型 1-100mΩ)     │
│        │     └───────┘                              │
│        │         │                                  │
│        │         ▼                                  │
│       GND       GND                                 │
│                                                     │
│  测量电压：V_shunt = I_load × R_s                   │
│  功耗：P = I_load² × R_s                            │
│                                                     │
│  示例：I = 10A, R_s = 10mΩ                          │
│  V_shunt = 10A × 0.01Ω = 100mV                      │
│  P = 10² × 0.01 = 1W                                │
└─────────────────────────────────────────────────────┘
```

### 4. 霍尔效应原理

```
┌─────────────────────────────────────────────────────┐
│              霍尔效应电流传感器                      │
│                                                     │
│           磁力线                                     │
│             ║                                        │
│      ═══════╬═══════  导体 (电流 I)                  │
│             ║                                        │
│             ▼ B (磁场)                               │
│                                                     │
│    ┌─────────────────────────┐                      │
│    │    霍尔元件             │                      │
│    │                         │                      │
│    │   V_H = K_H × B × I     │ ← 霍尔电压          │
│    │                         │                      │
│    └─────────────────────────┘                      │
│                                                     │
│  其中:                                              │
│  - V_H: 霍尔电压                                    │
│  - K_H: 霍尔系数                                    │
│  - B: 磁感应强度                                    │
│  - I: 控制电流                                      │
│                                                     │
│  特点：电气隔离、双向测量、低功耗                   │
└─────────────────────────────────────────────────────┘
```

## 🔌 常用电流传感器 IC

### 分流电阻 + 放大器方案

| 型号 | 厂商 | 增益 | 带宽 | 精度 | 应用 |
|------|------|------|------|------|------|
| INA219 | TI | 可编程 | 500kHz | 0.5% | 电源监测 |
| INA226 | TI | 可编程 | 500kHz | 0.1% | 精密测量 |
| MAX4080 | Maxim | 5/20/60 | 200kHz | 0.1% | 工业控制 |
| LTC6101 | ADI | 可调 | 1MHz | 0.5% | 电机驱动 |

### 霍尔效应传感器

| 型号 | 厂商 | 量程 | 灵敏度 | 带宽 | 隔离 | 应用 |
|------|------|------|--------|------|------|------|
| ACS712 | Allegro | ±5/20/30A | 185/100/66mV/A | 80kHz | 2.1kV | 通用 |
| ACS723 | Allegro | ±5/20/30A | 400/100/66mV/A | 120kHz | 2.1kV | 汽车 |
| ACS770 | Allegro | ±50/100/150A | 40/20/13.3mV/A | 200kHz | 4.8kV | 大功率 |
| DRV8305 | TI | 集成 | 可编程 | - | - | 电机驱动 |

### 磁阻传感器

| 型号 | 厂商 | 量程 | 精度 | 特点 | 应用 |
|------|------|------|------|------|------|
| TMCS1100 | TI | ±23/46A | 0.2% | 高隔离 | 工业 |
| TMCS1101 | TI | ±23/46A | 0.5% | 双向 | 电源 |
| MLX91208 | Melexis | ±25/50A | 1% | 可编程 | 汽车 |

## 📐 典型应用电路

### INA219 电流电压监测电路

```
                    +Vbus (0-26V)
                       │
              ┌────────┴────────┐
              │                 │
             ┌┴┐               ┌┴┐
             │ │ R_shunt       │ │ 负载
             │ │ 0.01Ω/1W      │ │
             └┬┘               └┬┘
              │                 │
    ┌─────────┴──────┐          │
    │                │          │
    │  IN+  INA219   ├─── SDA ──┼──→ MCU
    │  IN-          SCL├────────┘
    │  GND         A0 │
    │                │
    └────────────────┘
    
    I2C 地址：0x40 (A0=GND)
    最大测量电流：I_max = V_fullscale / R_shunt
    INA219 V_fullscale = 320mV (最大档)
    I_max = 320mV / 0.01Ω = 32A
    
    配置示例:
    - 总线电压范围：0-26V
    - 电流 LSB：32A / 2^15 = 0.977mA/bit
    - 功率 LSB：20 × 电流 LSB = 19.54mW/bit
```

### ACS712 霍尔电流传感器电路

```
                    Vcc (5V)
                      │
                     ┌┴┐
                     │ │ 10μF
                     └┬┘
                      │
    ┌─────────────────┼─────────────────┐
    │            1    │    8            │
    │  FILTER  ───────┤ 5         Vcc   ├─── Vcc
    │            2    │    7            │
    │  VIOUT ─────────┤ 6         IP+   ├───→ 至 ADC
    │            3    │    5            │
    │  GND   ─────────┤ 4         IP-   ├───→ 负载
    │            4    │                 │
    │                 └─────────────────┘
    │                      ACS712
    │
    │  输出特性:
    │  - 零电流输出：Vcc/2 = 2.5V
    │  - 灵敏度：185mV/A (ACS712-5A)
    │  - 电流计算：I = (V_out - 2.5V) / 0.185
    │
    └──→ 至 MCU ADC
    
    示例:
    V_out = 3.0V
    I = (3.0 - 2.5) / 0.185 = 2.7A
```

### 高精度双向电流检测电路

```
┌─────────────────────────────────────────────────────┐
│          双向电流检测 (高侧 + 低侧)                  │
│                                                     │
│     +Vbus                                          │
│       │                                            │
│      ┌┴┐                                           │
│      │ │ R_hs (高侧分流 0.005Ω)                    │
│      └┬┘                                           │
│       ├─────→ INA226 (高侧检测)                    │
│       │                                            │
│      ┌┴┐                                           │
│      │ │ 负载                                      │
│      └┬┘                                           │
│       ├─────→ INA226 (低侧检测)                    │
│      ┌┴┐                                           │
│      │ │ R_ls (低侧分流 0.005Ω)                    │
│      └┬┘                                           │
│       │                                            │
│      GND                                           │
│                                                     │
│  高侧检测：测量电源输出电流                         │
│  低侧检测：测量负载返回电流                         │
│  差值检测：可发现漏电/短路                          │
└─────────────────────────────────────────────────────┘
```

## 💻 驱动与软件示例

### INA219 Arduino 驱动

```cpp
#include <Wire.h>

#define INA219_ADDR 0x40

// 寄存器地址
#define REG_CONFIG      0x00
#define REG_SHUNT_VOLT  0x01
#define REG_BUS_VOLT    0x02
#define REG_POWER       0x03
#define REG_CURRENT     0x04
#define REG_CALIB       0x05

class INA219 {
private:
  float shuntResistor = 0.01;  // 0.01Ω
  float currentLSB = 0.001;    // 1mA/bit
  float powerLSB = 0.02;       // 20mW/bit
  
public:
  bool begin() {
    Wire.begin();
    reset();
    calibrate();
    return true;
  }
  
  void reset() {
    writeRegister(REG_CONFIG, 0x8000);
    delay(10);
  }
  
  void calibrate() {
    uint16_t calValue = 0.04096 / (currentLSB * shuntResistor);
    writeRegister(REG_CALIB, calValue);
  }
  
  void configure() {
    // 配置：总线电压±32V, 分流电压±320mV, 12 位平均
    uint16_t config = 0x799F;
    writeRegister(REG_CONFIG, config);
  }
  
  void writeRegister(uint8_t reg, uint16_t value) {
    Wire.beginTransmission(INA219_ADDR);
    Wire.write(reg);
    Wire.write(value >> 8);
    Wire.write(value & 0xFF);
    Wire.endTransmission();
  }
  
  int16_t readRegister(uint8_t reg) {
    Wire.beginTransmission(INA219_ADDR);
    Wire.write(reg);
    Wire.endTransmission();
    Wire.requestFrom(INA219_ADDR, 2);
    uint16_t value = Wire.read() << 8 | Wire.read();
    return (int16_t)value;
  }
  
  float getBusVoltage() {
    int16_t value = readRegister(REG_BUS_VOLT);
    return (value >> 3) * 0.004;  // 4mV/bit
  }
  
  float getCurrent() {
    int16_t value = readRegister(REG_CURRENT);
    return value * currentLSB;
  }
  
  float getPower() {
    int16_t value = readRegister(REG_POWER);
    return value * powerLSB;
  }
  
  float getShuntVoltage() {
    int16_t value = readRegister(REG_SHUNT_VOLT);
    return value * 0.00001;  // 10μV/bit
  }
  
  void printData() {
    Serial.print("Bus Voltage: ");
    Serial.print(getBusVoltage());
    Serial.print(" V | ");
    Serial.print("Current: ");
    Serial.print(getCurrent() * 1000);
    Serial.print(" mA | ");
    Serial.print("Power: ");
    Serial.print(getPower());
    Serial.println(" mW");
  }
};

INA219 ina219;

void setup() {
  Serial.begin(115200);
  ina219.begin();
  ina219.configure();
}

void loop() {
  ina219.printData();
  delay(1000);
}
```

### INA219 Python/Raspberry Pi 驱动

```python
import smbus2
import time

class INA219:
    ADDRESS = 0x40
    
    # 寄存器
    CONFIG = 0x00
    SHUNT_VOLT = 0x01
    BUS_VOLT = 0x02
    POWER = 0x03
    CURRENT = 0x04
    CALIB = 0x05
    
    def __init__(self, i2c_bus=1, shunt_resistor=0.01):
        self.bus = smbus2.SMBus(i2c_bus)
        self.shunt = shunt_resistor
        self.current_lsb = 0.001  # 1mA/bit
        self.power_lsb = 0.02     # 20mW/bit
        
    def write_register(self, reg, value):
        self.bus.write_word_data(self.ADDRESS, reg, value)
        
    def read_register(self, reg):
        data = self.bus.read_word_data(self.ADDRESS, reg)
        # 处理有符号数
        if data > 0x7FFF:
            data -= 0x10000
        return data
    
    def calibrate(self):
        cal_value = int(0.04096 / (self.current_lsb * self.shunt))
        self.write_register(self.CALIB, cal_value)
        
    def configure(self):
        # BUSTV=32V, SHUNTV=320mV, 12-bit average
        config = 0x799F
        self.write_register(self.CONFIG, config)
        
    def begin(self):
        self.write_register(self.CONFIG, 0x8000)  # Reset
        time.sleep(0.01)
        self.calibrate()
        self.configure()
        
    def get_bus_voltage(self):
        value = self.read_register(self.BUS_VOLT)
        return (value >> 3) * 0.004  # 4mV/bit
    
    def get_current(self):
        value = self.read_register(self.CURRENT)
        return value * self.current_lsb
    
    def get_power(self):
        value = self.read_register(self.POWER)
        return value * self.power_lsb
    
    def get_shunt_voltage(self):
        value = self.read_register(self.SHUNT_VOLT)
        return value * 0.00001  # 10μV/bit
    
    def get_all(self):
        return {
            'bus_voltage': self.get_bus_voltage(),
            'current': self.get_current(),
            'power': self.get_power(),
            'shunt_voltage': self.get_shunt_voltage()
        }

# 使用示例
ina = INA219()
ina.begin()

while True:
    data = ina.get_all()
    print(f"电压：{data['bus_voltage']:.2f}V")
    print(f"电流：{data['current']*1000:.1f}mA")
    print(f"功率：{data['power']:.1f}mW")
    time.sleep(1)
```

### ACS712 Arduino 读取示例

```cpp
#define ACS_PIN A0
#define VCC 5.0
#define SENSITIVITY 0.185  // 185mV/A for ACS712-5A

class ACS712 {
private:
  int adcPin;
  float sensitivity;
  float zeroCurrentVoltage;
  
public:
  ACS712(int pin, float sens = 0.185) {
    adcPin = pin;
    sensitivity = sens;
    zeroCurrentVoltage = VCC / 2.0;
  }
  
  float readCurrent() {
    // 多次采样取平均
    int samples = 100;
    float sum = 0;
    
    for (int i = 0; i < samples; i++) {
      sum += analogRead(adcPin);
      delay(1);
    }
    
    float avgVoltage = (sum / samples) * (VCC / 1023.0);
    float current = (avgVoltage - zeroCurrentVoltage) / sensitivity;
    
    return current;
  }
  
  float readCurrentAC() {
    // 交流电流测量 (RMS)
    int samples = 100;
    float sumSquared = 0;
    
    for (int i = 0; i < samples; i++) {
      float voltage = analogRead(adcPin) * (VCC / 1023.0);
      float diff = voltage - zeroCurrentVoltage;
      sumSquared += diff * diff;
      delay(1);
    }
    
    float rmsVoltage = sqrt(sumSquared / samples);
    float currentRMS = rmsVoltage / sensitivity;
    
    return currentRMS;
  }
};

ACS712 acs(ACS_PIN);

void setup() {
  Serial.begin(115200);
}

void loop() {
  float current = acs.readCurrent();
  Serial.print("Current: ");
  Serial.print(current);
  Serial.println(" A");
  delay(1000);
}
```

## ⚠️ 设计注意事项

### 1. 分流电阻选择

```javascript
// 分流电阻设计计算
function calculateShuntResistor(maxCurrent, maxVoltage, powerRating) {
  // 基于最大电压降计算
  const R_max = maxVoltage / maxCurrent;
  
  // 基于功耗计算
  const R_power = maxVoltage / (maxCurrent * maxCurrent);
  
  // 选择较小值，并考虑安全余量
  const R_shunt = Math.min(R_max, R_power) * 0.8;
  
  // 计算实际功耗
  const P_actual = maxCurrent * maxCurrent * R_shunt;
  
  // 选择电阻功率 (2 倍余量)
  const P_rating = P_actual * 2;
  
  return {
    resistance: R_shunt,
    powerRating: P_rating,
    voltageDrop: maxCurrent * R_shunt,
    powerDissipation: P_actual
  };
}

// 示例：10A 最大电流，100mV 最大压降
const result = calculateShuntResistor(10, 0.1, 1);
console.log(result);
// { resistance: 0.008Ω, powerRating: 2W, voltageDrop: 80mV, powerDissipation: 0.8W }
```

### 2. PCB 布局要点

```
┌─────────────────────────────────────────────────────┐
│              电流检测 PCB 布局指南                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ✓ 分流电阻使用开尔文 (4 线) 连接                     │
│  ✓ 检测走线对称且尽量短                            │
│  ✓ 远离高 di/dt 节点                                │
│  ✓ 使用差分走线                                    │
│  ✓ 添加滤波电容靠近 IC 引脚                         │
│  ✓ 大电流走线足够宽                                │
│  ✓ 多层板使用完整地平面                            │
│                                                     │
│  ✗ 避免检测走线与功率走线平行                      │
│  ✗ 避免在分流电阻下方走信号线                      │
│  ✗ 避免长距离单端走线                              │
└─────────────────────────────────────────────────────┘
```

### 3. 滤波设计

```
┌─────────────────────────────────────────────────────┐
│              RC 低通滤波器设计                       │
│                                                     │
│     V_shunt                                         │
│       │                                             │
│       ├───┬─────────→ V_out                         │
│       │   │                                         │
│      ┌┴┐  └┬┘                                       │
│      │ │ R  │                                       │
│      │ │    └┬┐                                     │
│      └┬┘     │ │ C                                  │
│       │      └┬┘                                     │
│      GND     GND                                     │
│                                                     │
│  截止频率：f_c = 1 / (2πRC)                         │
│                                                     │
│  示例：R=100Ω, C=100nF                              │
│  f_c = 1 / (2π × 100 × 100×10^-9) ≈ 15.9kHz        │
│                                                     │
│  选择原则：                                         │
│  - f_c > 信号带宽                                   │
│  - f_c < 噪声频率                                   │
│  - 考虑 ADC 采样率 (f_c < f_sample/10)              │
└─────────────────────────────────────────────────────┘
```

## 🎯 应用实例

### 电池充放电电流监测

```cpp
// 电池管理系统中的电流监测
class BatteryCurrentMonitor {
private:
  INA219 ina219;
  float chargeCurrent = 0;
  float dischargeCurrent = 0;
  float accumulatedCharge = 0;  // mAh
  
public:
  void begin() {
    ina219.begin();
    ina219.configure();
  }
  
  void update() {
    float current = ina219.getCurrent();
    
    if (current > 0) {
      // 充电电流
      chargeCurrent = current;
      dischargeCurrent = 0;
      accumulatedCharge += current * 0.001;  // 假设 1 秒更新
    } else {
      // 放电电流
      dischargeCurrent = -current;
      chargeCurrent = 0;
      accumulatedCharge -= current * 0.001;
    }
  }
  
  float getCoulombCount() {
    return accumulatedCharge;
  }
  
  float getEfficiency() {
    if (chargeCurrent == 0) return 0;
    return (accumulatedCharge / chargeCurrent) * 100;
  }
  
  void printStatus() {
    Serial.print("充电电流：");
    Serial.print(chargeCurrent * 1000);
    Serial.print(" mA | ");
    Serial.print("放电电流：");
    Serial.print(dischargeCurrent * 1000);
    Serial.print(" mA | ");
    Serial.print("累计电量：");
    Serial.print(accumulatedCharge);
    Serial.println(" mAh");
  }
};
```

### 电机过流保护

```cpp
// 电机驱动过流保护
class MotorOverCurrentProtection {
private:
  int currentSensorPin;
  float overCurrentThreshold = 5.0;  // 5A
  unsigned long faultTime = 0;
  unsigned long faultDuration = 100; // 100ms
  
public:
  MotorOverCurrentProtection(int pin) {
    currentSensorPin = pin;
  }
  
  bool checkOverCurrent() {
    float current = readCurrent();
    
    if (current > overCurrentThreshold) {
      if (millis() - faultTime > faultDuration) {
        // 持续过流，触发保护
        triggerProtection();
        return true;
      }
    } else {
      faultTime = millis();
    }
    
    return false;
  }
  
  float readCurrent() {
    int adc = analogRead(currentSensorPin);
    float voltage = adc * (5.0 / 1023.0);
    return (voltage - 2.5) / 0.1;  // 假设 100mV/A
  }
  
  void triggerProtection() {
    Serial.println("⚠️ 过流保护触发！");
    // 关闭电机驱动
    disableMotor();
  }
  
  void disableMotor() {
    // 实现电机禁用逻辑
  }
};
```

## 📖 参考资源

- [TI 电流检测放大器](https://www.ti.com/current-sense-amplifiers)
- [INA219 数据手册](https://www.ti.com/product/INA219)
- [Allegro 电流传感器](https://www.allegromicro.com/en/products/sense/current-sensor-ics)
- [ADI 电流检测方案](https://www.analog.com/en/product-category/current-sense-amplifiers.html)

## 🔗 相关主题

- [电量计 (Fuel Gauge)](./FUEL_GAUGE.md)
- [充电 IC (Charger IC)](./CHARGER_IC.md)
- [ADC (模数转换器)](./ADC.md)
- [电池管理系统 (BMS)](./BMS.md)
