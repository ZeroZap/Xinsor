# 充电 IC (Charger IC) 学习

## 🧠 功能概述

充电 IC (Charger IC) 是用于管理电池充电过程的电源管理集成电路。它控制充电电流、电压和温度，确保电池安全、高效地充电，同时延长电池寿命。

## 📚 核心概念

### 1. 充电曲线 (锂离子电池)

```
充电电流
    ▲
    │    恒流 (CC)      恒压 (CV)
Ic  │█████████████▒▒▒▒▒▒▒
    │                ▒   ▒
    │                ▒   ▒
    │                ▒   ▒
  0 └────────────────┴───┴──► 时间
    0                t1  t2
                         充电电压
    ▲                    ▲
Vc  │                    │████
    │                    │   ▒
    │                    │   ▒
Vmax│────────────────────┤   ▒
    │                    │   ▒
  0 └────────────────────┴───┴──► 时间
```

### 2. 充电阶段

| 阶段 | 名称 | 电流 | 电压 | 目的 |
|------|------|------|------|------|
| 0 | 预充 (Pre-charge) | 0.05C~0.1C | <3.0V | 激活过放电池 |
| 1 | 恒流 (CC) | 0.5C~1C | 上升至 Vmax | 快速充电 |
| 2 | 恒压 (CV) | 递减至 0.05C | Vmax (4.2V/4.35V/4.4V) | 充满电池 |
| 3 | 终止 (Termination) | 0 | - | 充电完成 |

### 3. C-Rate (充放电倍率)

```
C = 电池容量 (Ah)

1C 充电电流 = 1 小时充满的电流
0.5C 充电电流 = 2 小时充满的电流
2C 充电电流 = 0.5 小时充满的电流

示例:
- 2000mAh 电池，1C = 2000mA = 2A
- 2000mAh 电池，0.5C = 1000mA = 1A
```

## 🔌 充电器拓扑结构

### 1. 线性充电器 (Linear Charger)

```
┌─────────────────────────────────────┐
│         线性充电器                   │
├─────────────────────────────────────┤
│  优点：                             │
│  • 电路简单，成本低                 │
│  • 无 EMI 问题                       │
│  • 低噪声                           │
│                                     │
│  缺点：                             │
│  • 效率低 (尤其压差大时)            │
│  • 发热严重                         │
│  • 仅适用于小功率                   │
│                                     │
│  效率 ≈ Vbat / Vin × 100%          │
└─────────────────────────────────────┘
```

### 2. 开关充电器 (Switching Charger)

```
┌─────────────────────────────────────┐
│        开关充电器 (Buck)             │
│                                     │
│     Vin                             │
│      │                              │
│     ┌┴┐ 开关                        │
│     │ │                             │
│     └┬┘                             │
│      ├─────┬───→ 至电池             │
│      │     │                       │
│     ┌┴┐   ┌─┴─┐                    │
│     │ │ L │   │ C                  │
│     └┬┘   └───┘                    │
│      │                              │
│     GND                             │
│                                     │
│  优点：                             │
│  • 效率高 (85%~95%)                │
│  • 适用于大功率                     │
│  • 发热小                           │
│                                     │
│  缺点：                             │
│  • 电路复杂                         │
│  • 有 EMI 问题                       │
│  • 成本较高                         │
└─────────────────────────────────────┘
```

### 3. 开关电容充电器 (Charge Pump)

```
┌─────────────────────────────────────┐
│       开关电容充电器                 │
│                                     │
│  特点：                             │
│  • 无电感，体积小                   │
│  • 效率中等 (80%~90%)              │
│  • 适用于中等功率                   │
│  • 成本适中                         │
└─────────────────────────────────────┘
```

## 🔧 常用充电 IC

### Texas Instruments (TI)

| 型号 | 类型 | 最大电流 | 输入电压 | 化学类型 | 应用 |
|------|------|----------|----------|----------|------|
| BQ24072 | 线性 | 1.5A | 4.35-6.5V | Li-Ion | 便携设备 |
| BQ24195 | 开关 | 3A | 3.5-20V | Li-Ion | 平板电脑 |
| BQ25601 | 开关 | 2A | 3.9-6.5V | Li-Ion | 智能手机 |
| BQ25700A | 升降压 | 8A | 3.5-24V | Li-Ion | 笔记本电脑 |

### ON Semiconductor

| 型号 | 类型 | 最大电流 | 输入电压 | 化学类型 | 应用 |
|------|------|----------|----------|----------|------|
| NCP1835 | 开关 | 3A | 4.35-20V | Li-Ion | 智能手机 |
| NCP3800 | 线性 | 1A | 4.35-6.5V | Li-Ion | IoT 设备 |

### Microchip

| 型号 | 类型 | 最大电流 | 输入电压 | 化学类型 | 应用 |
|------|------|----------|----------|----------|------|
| MCP73831 | 线性 | 500mA | 4.75-6.0V | Li-Po | 小型设备 |
| MCP73903 | 线性 | 1.1A | 4.25-12V | Li-Ion | 可穿戴设备 |

### 国产芯片

| 型号 | 类型 | 最大电流 | 输入电压 | 厂商 | 应用 |
|------|------|----------|----------|------|------|
| TP4056 | 线性 | 1A | 4.5-8V | 南京拓微 | 通用模块 |
| TP5100 | 开关 | 2A | 4.2-6V | 南京拓微 | 移动电源 |
| IP5306 | 升降压 | 2.4A | 3.7-4.2V | 英集芯 | 移动电源 |

## 📐 典型应用电路

### TP4056 典型电路

```
         Vin (USB 5V)
            │
           ┌┴┐
           │ │ Rprog (1.2kΩ → 1A)
           └┬┘
            ├───────┐
            │   1   │ 8
    PROG ───┤ 2   7 ├─── BAT
            │   3   │ 6
    GND ────┤ 4   5 ├─── Vin
            │ TP4056│
            └───────┘
                │
               ┌┴┐
               │ │ 10μF
               └┬┘
                │
               GND

充电电流计算:
Icharge = 1200V / Rprog
Rprog = 1200Ω → Icharge = 1A
Rprog = 2400Ω → Icharge = 0.5A
Rprog = 4800Ω → Icharge = 0.25A
```

### BQ24195 开关充电电路

```
                    Vin (5-20V)
                       │
                      ┌┴┐
                      │ │ 输入电容
                      └┬┘
                       │
    ┌──────────────────┼──────────────────┐
    │             1    │    20            │
    │  VIN  ───────────┤ 21          19   ├─── SYS
    │             3    │    18            │      │
    │  SW  ─────┬──────┤ 17          16   ├─── BAT
    │           │      │    15            │      │
    │          ┌┴┐     │     BQ24195      │     ┌┴┐
    │          │ │ L   │                  │     │ │ 电池
    │          └┬┘     │                  │     └┬┘
    │           │      │                  │      │
    │          GND     └──────────────────┘     GND
    │                                           │
    └───────────────────────────────────────────┘
```

## 💻 充电管理示例

### 充电状态机

```cpp
enum ChargeState {
    CHARGE_IDLE,      // 无电池
    CHARGE_PRE,       // 预充电
    CHARGE_CC,        // 恒流充电
    CHARGE_CV,        // 恒压充电
    CHARGE_DONE,      // 充电完成
    CHARGE_FAULT      // 故障
};

class ChargerManager {
private:
    ChargeState currentState = CHARGE_IDLE;
    float batteryVoltage = 0;
    float chargeCurrent = 0;
    float temperature = 0;
    
public:
    void update() {
        batteryVoltage = readBatteryVoltage();
        chargeCurrent = readChargeCurrent();
        temperature = readTemperature();
        
        // 温度保护
        if (temperature < 0 || temperature > 45) {
            currentState = CHARGE_FAULT;
            disableCharging();
            return;
        }
        
        switch (currentState) {
            case CHARGE_IDLE:
                if (batteryVoltage > 2.0 && batteryVoltage < 4.2) {
                    currentState = CHARGE_CC;
                    setChargeMode(CC_MODE, 1.0);  // 1A 恒流
                }
                break;
                
            case CHARGE_PRE:
                if (batteryVoltage >= 3.0) {
                    currentState = CHARGE_CC;
                    setChargeMode(CC_MODE, 1.0);
                }
                break;
                
            case CHARGE_CC:
                if (batteryVoltage >= 4.2) {
                    currentState = CHARGE_CV;
                    setChargeMode(CV_MODE, 4.2);  // 4.2V 恒压
                }
                break;
                
            case CHARGE_CV:
                if (chargeCurrent <= 0.05) {  // 电流 < 0.05C
                    currentState = CHARGE_DONE;
                    disableCharging();
                }
                break;
                
            case CHARGE_DONE:
                if (batteryVoltage < 4.05) {  // 重新充电阈值
                    currentState = CHARGE_CC;
                    enableCharging();
                }
                break;
                
            case CHARGE_FAULT:
                if (temperature >= 5 && temperature <= 40) {
                    currentState = CHARGE_IDLE;
                }
                break;
        }
    }
    
    const char* getStateString() {
        switch (currentState) {
            case CHARGE_IDLE: return "空闲";
            case CHARGE_PRE: return "预充电";
            case CHARGE_CC: return "恒流充电";
            case CHARGE_CV: return "恒压充电";
            case CHARGE_DONE: return "充满";
            case CHARGE_FAULT: return "故障";
            default: return "未知";
        }
    }
};
```

### I2C 配置示例 (BQ24195)

```python
import smbus2
import time

class BQ24195:
    # 寄存器地址
    REG_INPUT_SOURCE = 0x00
    REG_POWERON_CONFIG = 0x01
    REG_CHARGE_CURRENT = 0x02
    REG_PRE_CHARGE = 0x03
    REG_CHARGE_VOLTAGE = 0x04
    REG_CHARGE_TERMINATION = 0x05
    
    def __init__(self, i2c_bus=1, address=0x6B):
        self.bus = smbus2.SMBus(i2c_bus)
        self.address = address
        
    def configure(self, 
                  input_current_limit=3.0,  # 输入电流限制 (A)
                  charge_current=2.0,       # 充电电流 (A)
                  charge_voltage=4.2,       # 充电电压 (V)
                  precharge_current=0.256,  # 预充电流 (A)
                  termination_current=0.256 # 终止电流 (A)
                 ):
        # 配置输入源
        # 输入电压限制 4.52V, 输入电流限制 3A
        self.bus.write_byte_data(self.address, 
                                  self.REG_INPUT_SOURCE, 
                                  0x20 | 0x03)
        
        # 配置充电电流
        # 2A 充电电流 (寄存器值 = 电流/64mA)
        icharge_reg = int(charge_current / 0.064)
        self.bus.write_byte_data(self.address,
                                  self.REG_CHARGE_CURRENT,
                                  icharge_reg)
        
        # 配置充电电压
        # 4.2V (寄存器值 = (电压 - 3.5V) / 12.8mV)
        vcharge_reg = int((charge_voltage - 3.5) / 0.0128)
        self.bus.write_byte_data(self.address,
                                  self.REG_CHARGE_VOLTAGE,
                                  vcharge_reg)
        
        # 配置预充电流和终止电流
        pre_reg = int(precharge_current / 0.064)
        term_reg = int(termination_current / 0.064)
        self.bus.write_byte_data(self.address,
                                  self.REG_PRE_CHARGE,
                                  (pre_reg & 0x0F) | ((term_reg & 0x0F) << 4))
        
        print("BQ24195 配置完成")
        print(f"  充电电流：{charge_current}A")
        print(f"  充电电压：{charge_voltage}V")
        print(f"  预充电流：{precharge_current}A")
        print(f"  终止电流：{termination_current}A")
    
    def get_charge_status(self):
        """读取充电状态"""
        status = self.bus.read_byte_data(self.address, 0x08)
        charge_status = (status >> 4) & 0x03
        
        states = {
            0: "空闲",
            1: "预充电",
            2: "恒流充电",
            3: "恒压充电"
        }
        return states.get(charge_status, "未知")
    
    def get_fault_status(self):
        """读取故障状态"""
        fault = self.bus.read_byte_data(self.address, 0x08) & 0x03
        faults = {
            0: "正常",
            1: "超时",
            2: "过热",
            3: "输入过压"
        }
        return faults.get(fault, "未知")

# 使用示例
charger = BQ24195()
charger.configure(
    charge_current=2.0,
    charge_voltage=4.2,
    precharge_current=0.256,
    termination_current=0.256
)

while True:
    print(f"充电状态：{charger.get_charge_status()}")
    print(f"故障状态：{charger.get_fault_status()}")
    time.sleep(1)
```

## ⚠️ 安全保护

### 保护机制

| 保护类型 | 触发条件 | 响应 |
|----------|----------|------|
| 过压保护 (OVP) | Vin > 6.5V | 关闭输入 |
| 过流保护 (OCP) | Iout > 限制值 | 限流或关闭 |
| 过热保护 (OTP) | T > 120°C | 降低电流或关闭 |
| 电池过压保护 | Vbat > 4.35V | 停止充电 |
| 短路保护 | 输出短路 | 关闭输出 |
| 反向电流保护 | 电流反向 | 阻断反向电流 |

### 热管理

```
┌─────────────────────────────────────────────────────┐
│              热降额曲线                              │
│                                                     │
│  充电电流                                           │
│     ▲                                              │
│ Imax│█████████████████████                         │
│     │                        ▒▒▒▒▒                 │
│     │                             ▒▒▒▒             │
│   0 └──────────────────────────────────► 温度      │
│     0    45    60    90    120   (°C)               │
│                                                     │
│  • <45°C: 全电流充电                                │
│  • 45-60°C: 正常充电                                │
│  • 60-90°C: 线性降额                                │
│  • >90°C: 暂停充电                                  │
└─────────────────────────────────────────────────────┘
```

## 🎯 设计考虑

### 1. PCB 布局要点

```
┌─────────────────────────────────────────────────────┐
│              充电器 PCB 布局指南                      │
├─────────────────────────────────────────────────────┤
│  ✓ 输入电容尽量靠近 IC 引脚                          │
│  ✓ 大电流路径使用宽走线                             │
│  ✓ 电流检测电阻使用开尔文连接                       │
│  ✓ 热焊盘良好接地散热                               │
│  ✓ 反馈走线远离噪声源                               │
│  ✓ 多层板使用完整地平面                             │
│  ✗ 避免在功率器件下方走敏感信号                     │
└─────────────────────────────────────────────────────┘
```

### 2. 元件选择

```javascript
// 输入电容选择
const inputRipple = 0.1;  // 允许纹波 100mV
const dutyCycle = 0.75;   // 占空比
const chargeCurrent = 2;  // 2A
const frequency = 500000; // 500kHz

// Cin ≥ Iout × D × (1-D) / (f × ΔV)
const Cin_min = chargeCurrent * dutyCycle * (1 - dutyCycle) / 
                (frequency * inputRipple);
// 选择 ≥ 2 倍余量的电容

// 电感选择
const Vin = 5.0;
const Vout = 4.2;
const rippleRatio = 0.3;  // 纹波电流 30%

// L = (Vin - Vout) × D / (f × ΔI)
const L_min = (Vin - Vout) * dutyCycle / 
              (frequency * chargeCurrent * rippleRatio);
// 选择饱和电流 > Iout + ΔI/2 的电感
```

## 📖 参考资源

- [TI 电池充电管理](https://www.ti.com/battery-charger-ics)
- [BQ24195 数据手册](https://www.ti.com/product/BQ24195)
- [电池大学 - 充电方法](https://batteryuniversity.com/learn/article/charging)
- [TP4056 数据手册](https://www.toygarden.co.il/media/catalog/product/file/TP4056.pdf)

## 🔗 相关主题

- [电量计 (Fuel Gauge)](./FUEL_GAUGE.md)
- [电池管理系统 (BMS)](./BMS.md)
- [电源管理 (Power Management)](./POWER_MANAGEMENT.md)
