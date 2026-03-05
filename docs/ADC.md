# ADC (模数转换器) 学习

## 🧠 功能概述

模数转换器 (Analog-to-Digital Converter, ADC) 是将连续变化的模拟信号转换为离散数字信号的电子器件。它是连接模拟世界与数字系统的桥梁，广泛应用于传感器数据采集、音频处理、通信系统、仪器仪表等领域。

## 📚 核心概念

### 1. ADC 工作原理

```
┌─────────────────────────────────────────────────────────┐
│              ADC 转换过程                                │
│                                                         │
│  模拟信号 ──→ 采样 ──→ 保持 ──→ 量化 ──→ 编码 ──→ 数字输出 │
│     ▲                                              │   │
│     │                                              │   │
│  连续信号                                      离散信号 │
│                                                         │
│  采样定理：f_sample ≥ 2 × f_signal_max                 │
│  (奈奎斯特 - 香农定理)                                  │
└─────────────────────────────────────────────────────────┘
```

### 2. 关键性能参数

| 参数 | 符号 | 单位 | 说明 |
|------|------|------|------|
| 分辨率 | N | bit | 输出数字量的位数 |
| 采样率 | f_s | SPS | 每秒采样次数 |
| 量化误差 | Q | LSB | 最小有效位的一半 |
| 信噪比 | SNR | dB | 信号与噪声的比值 |
| 信纳比 | SINAD | dB | 信号与噪声+失真的比值 |
| 有效位数 | ENOB | bit | 实际有效分辨率 |
| 无杂散动态范围 | SFDR | dB | 信号与最大杂散的比值 |
| 积分非线性 | INL | LSB | 实际与理想传输曲线的偏差 |
| 微分非线性 | DNL | LSB | 相邻码宽的偏差 |

### 3. 分辨率与精度

```
┌─────────────────────────────────────────────────────┐
│              ADC 分辨率计算                          │
│                                                     │
│  量化步长：Q = V_ref / 2^N                          │
│                                                     │
│  其中:                                              │
│  - V_ref: 参考电压                                   │
│  - N: ADC 位数                                      │
│                                                     │
│  示例 (V_ref = 3.3V):                               │
│  ┌───────┬──────────────┬───────────────────┐      │
│  │ 位数  │ 量化级数     │ 最小分辨率        │      │
│  ├───────┼──────────────┼───────────────────┤      │
│  │ 8-bit │ 256          │ 3.3V/256 = 12.9mV │      │
│  │ 10-bit│ 1,024        │ 3.3V/1024 = 3.2mV │      │
│  │ 12-bit│ 4,096        │ 3.3V/4096 = 0.8mV │      │
│  │ 16-bit│ 65,536       │ 3.3V/65536 = 50μV │      │
│  │ 24-bit│ 16,777,216   │ 3.3V/16M = 0.2μV  │      │
│  └───────┴──────────────┴───────────────────┘      │
│                                                     │
│  数字输出计算：                                     │
│  D = (V_in / V_ref) × 2^N                          │
│                                                     │
│  示例：12-bit ADC, V_ref=3.3V, V_in=1.65V          │
│  D = (1.65 / 3.3) × 4096 = 2048                    │
└─────────────────────────────────────────────────────┘
```

### 4. ADC 架构类型

```
┌─────────────────────────────────────────────────────────┐
│              常见 ADC 架构对比                           │
├─────────────┬───────────┬───────────┬─────────┬─────────┤
│   类型      │  分辨率   │   采样率  │  精度   │  应用   │
├─────────────┼───────────┼───────────┼─────────┼─────────┤
│ 逐次逼近    │ 8-18 bit  │ 10k-5M SPS│ 中      │ 通用   │
│ (SAR)       │           │           │         │         │
├─────────────┼───────────┼───────────┼─────────┼─────────┤
│ Δ-Σ (Delta- │ 16-32 bit │ 10-1k SPS │ 高      │ 精密   │
│ Sigma)      │           │           │         │         │
├─────────────┼───────────┼───────────┼─────────┼─────────┤
│ 流水线      │ 8-16 bit  │ 10M-10G SPS│ 中     │ 高速   │
│ (Pipeline)  │           │           │         │         │
├─────────────┼───────────┼───────────┼─────────┼─────────┤
│ 闪存        │ 4-10 bit  │ 100M-10G SPS│ 低    │ 超高速 │
│ (Flash)     │           │           │         │         │
├─────────────┼───────────┼───────────┼─────────┼─────────┤
│ 双斜率      │ 16-24 bit │ 10-100 SPS│ 很高    │ 万用表 │
│ (Dual-Slope)│           │           │         │         │
└─────────────┴───────────┴───────────┴─────────┴─────────┘
```

## 🔧 ADC 架构详解

### 1. SAR ADC (逐次逼近寄存器型)

```
┌─────────────────────────────────────────────────────┐
│              SAR ADC 工作原理                        │
│                                                     │
│  模拟输入 ──→ 采样保持 ──→ 比较器 ──→ SAR 逻辑     │
│                   ↑              │                  │
│                   │              ▼                  │
│              ┌─────────────────────┐                │
│              │      DAC            │                │
│              │  (数模转换器)       │                │
│              └─────────────────────┘                │
│                         │                           │
│                         ▼                           │
│                    数字输出                          │
│                                                     │
│  转换过程 (以 4-bit 为例):                           │
│  1. 采样输入电压 Vin                                │
│  2. SAR 置 1000 (8/16 Vref)                         │
│  3. 比较：Vin > DAC 输出？                          │
│     是 → 保留 MSB=1                                 │
│     否 → 清除 MSB=0                                 │
│  4. 重复步骤 2-3，直到所有位确定                    │
│  5. 输出最终数字值                                   │
│                                                     │
│  特点：中速、中精度、低功耗                          │
└─────────────────────────────────────────────────────┘
```

### 2. Δ-Σ ADC (Delta-Sigma)

```
┌─────────────────────────────────────────────────────┐
│              Δ-Σ ADC 工作原理                        │
│                                                     │
│  模拟输入 ──→⊕──→ 积分器 ──→ 1-bit ADC ──→ 数字滤波器 ──→ 输出 │
│             ↑−                                      │
│             │                                       │
│         ┌───┴───┐                                   │
│         │  1-bit│                                   │
│         │  DAC  │                                   │
│         └───────┘                                   │
│                                                     │
│  过采样：f_sample >> 2 × f_signal                  │
│  噪声整形：将量化噪声推向高频                       │
│  数字滤波：抽取滤波，提高有效位数                   │
│                                                     │
│  特点：高精度、低速、内置数字滤波                   │
│  应用：音频、精密测量、地磅                         │
└─────────────────────────────────────────────────────┘
```

### 3. Pipeline ADC (流水线型)

```
┌─────────────────────────────────────────────────────┐
│              Pipeline ADC 架构                       │
│                                                     │
│  输入 → Stage1 → Stage2 → Stage3 → ... → StageN → 输出 │
│         │        │        │              │          │
│         ▼        ▼        ▼              ▼          │
│        S/H      S/H      S/H            S/H         │
│         │        │        │              │          │
│         ▼        ▼        ▼              ▼          │
│       ADC      ADC      ADC            ADC         │
│         │        │        │              │          │
│         ▼        ▼        ▼              ▼          │
│       DAC      DAC      DAC            DAC         │
│         │        │        │              │          │
│         └───⊕────┴───⊕────┴────── ... ──┴──→ 数字校正 │
│                                                     │
│  特点：高速、中高精度、高功耗                        │
│  应用：通信、视频、雷达                             │
└─────────────────────────────────────────────────────┘
```

## 🔌 常用 ADC 芯片

### 内置 ADC (MCU)

| 系列 | 厂商 | 分辨率 | 采样率 | 通道数 | 特点 |
|------|------|--------|--------|--------|------|
| STM32F1 | ST | 12-bit | 1M SPS | 16 | 通用 |
| STM32F4 | ST | 12-bit | 2.4M SPS | 24 | 高性能 |
| ESP32 | Espressif | 12-bit | 200k SPS | 18 | WiFi/BT |
| Arduino Uno | ATmega328P | 10-bit | 15k SPS | 6 | 入门 |
| RP2040 | Raspberry Pi | 12-bit | 500k SPS | 5 | 双核 |

### 外置 ADC

| 型号 | 厂商 | 分辨率 | 采样率 | 接口 | 应用 |
|------|------|--------|--------|------|------|
| ADS1115 | TI | 16-bit | 860 SPS | I2C | 精密测量 |
| ADS1256 | TI | 24-bit | 30k SPS | SPI | 高精度 |
| MCP3008 | Microchip | 10-bit | 200k SPS | SPI | 通用 |
| MCP3421 | Microchip | 18-bit | 240 SPS | I2C | 低功耗 |
| MAX11100 | Maxim | 16-bit | 100k SPS | SPI | 工业 |
| HX711 | 海芯微 | 24-bit | 80 SPS | 2 线 | 称重传感器 |

## 📐 典型应用电路

### ADS1115 精密 ADC 模块

```
                    Vcc (3.3V-5V)
                       │
              ┌────────┴────────┐
              │                 │
    A0 ───────┤ A0          Vcc ├─── Vcc
    A1 ───────┤ A1         GND ├─── GND
    A2 ───────┤ A2          SDA ├─── SDA (I2C)
    A3 ───────┤ A3          SCL ├─── SCL (I2C)
              │                 │
              │  ADS1115        │
              │                 │
              └────────┬────────┘
                       │
                      ADDR
                       │
                    选择地址:
                    GND → 0x48
                    Vcc → 0x49
                    SDA → 0x4A
                    SCL → 0x4B

    特性:
    - 16 位 Δ-Σ ADC
    - 可编程增益：2/3, 1, 2, 4, 8, 16
    - 差分/单端输入
    - 可编程比较器
    - 860 SPS 最大采样率
```

### HX711 称重传感器接口

```
                    称重传感器 (应变片)
                    ┌─────────────┐
              E+ ───┤+         E+│
              E- ───┤-         E-│
              A+ ───┤A+       A+│───→ HX711 A+
              A- ───┤A-       A-│───→ HX711 A-
              B+ ───┤B+       B+│───→ HX711 B+
              B- ───┤B-       B-│───→ HX711 B-
                    └─────────────┘

    ┌─────────────────────────────────────┐
    │         HX711                       │
    │                                     │
    │  A+  A-  B+  B-  VSOUT  DOUT SCK   │
    │   │   │   │   │    │     │    │    │
    │   └───┴───┴───┴────┘     │    │    │
    │      称重传感器          │    │    │
    │                         │    │    │
    │  VCC ───────────────────┘    │    │
    │  GND ────────────────────────┘    │
    │  (2.6V-5.5V)                      │
    │                                   │
    │  至 MCU GPIO                      │
    └────────────────────────────────────┘

    特性:
    - 24 位 Δ-Σ ADC
    - 内置低噪声 PGA
    - 增益：32/64/128
    - 80 SPS 输出率
    - 同步抑制 50/60Hz
```

## 💻 驱动与软件示例

### ADS1115 Arduino 驱动

```cpp
#include <Wire.h>

#define ADS1115_ADDR 0x48

// 寄存器
#define REG_CONV    0x00
#define REG_CONFIG  0x01
#define REG_LO_THRESH 0x02
#define REG_HI_THRESH 0x03

// 配置寄存器位
#define OS_SINGLE   (1 << 15)  // 开始转换
#define MUX_SINGLE_0 (0b100 << 12)  // A0-GND
#define PGA_6_144   (0b000 << 9)   // ±6.144V
#define PGA_4_096   (0b001 << 9)   // ±4.096V
#define PGA_2_048   (0b010 << 9)   // ±2.048V
#define PGA_1_024   (0b011 << 9)   // ±1.024V
#define PGA_0_512   (0b100 << 9)   // ±0.512V
#define PGA_0_256   (0b101 << 9)   // ±0.256V
#define MODE_SINGLE (0b1 << 8)     // 单步模式
#define DR_128      (0b101 << 5)   // 128 SPS
#define COMP_MODE   (0b0 << 4)     // 传统比较器
#define COMP_POL    (0b0 << 3)     // 低有效
#define COMP_LAT    (0b0 << 2)     // 非锁存
#define COMP_QUE_1  (0b01)         // 1 次转换后触发

class ADS1115 {
private:
  float voltagePerBit = 0.1875;  // mV/bit @ ±2.048V
  
public:
  bool begin() {
    Wire.begin();
    return true;
  }
  
  void writeRegister(uint8_t reg, uint16_t value) {
    Wire.beginTransmission(ADS1115_ADDR);
    Wire.write(reg);
    Wire.write(value >> 8);
    Wire.write(value & 0xFF);
    Wire.endTransmission();
  }
  
  uint16_t readRegister(uint8_t reg) {
    Wire.beginTransmission(ADS1115_ADDR);
    Wire.write(reg);
    Wire.endTransmission();
    Wire.requestFrom(ADS1115_ADDR, 2);
    return (Wire.read() << 8) | Wire.read();
  }
  
  bool isReady() {
    uint16_t config = readRegister(REG_CONFIG);
    return (config >> 15) & 0x01;
  }
  
  int16_t readADC(uint8_t channel) {
    // 配置：单端输入，±2.048V, 128 SPS, 单步模式
    uint16_t config = OS_SINGLE | MODE_SINGLE | DR_128 | COMP_QUE_1;
    
    // 选择通道
    config |= ((4 + channel) & 0x07) << 12;
    
    // 启动转换
    writeRegister(REG_CONFIG, config);
    
    // 等待转换完成
    while (!isReady()) {
      delay(1);
    }
    
    // 读取结果
    int16_t result = (int16_t)readRegister(REG_CONV);
    return result;
  }
  
  float readVoltage(uint8_t channel) {
    int16_t adc = readADC(channel);
    return adc * voltagePerBit / 1000.0;  // 转换为 V
  }
  
  void printAllChannels() {
    for (int i = 0; i < 4; i++) {
      Serial.print("A");
      Serial.print(i);
      Serial.print(": ");
      Serial.print(readVoltage(i), 4);
      Serial.print("V (");
      Serial.print(readADC(i));
      Serial.print(") | ");
    }
    Serial.println();
  }
};

ADS1115 ads;

void setup() {
  Serial.begin(115200);
  ads.begin();
}

void loop() {
  ads.printAllChannels();
  delay(1000);
}
```

### ADS1115 Python/Raspberry Pi 驱动

```python
import smbus2
import time

class ADS1115:
    ADDRESS = 0x48
    
    # 寄存器
    REG_CONV = 0x00
    REG_CONFIG = 0x01
    
    # 配置值
    OS_SINGLE = 1 << 15
    MUX_0 = 0b100 << 12  # A0-GND
    MUX_1 = 0b101 << 12  # A1-GND
    MUX_2 = 0b110 << 12  # A2-GND
    MUX_3 = 0b111 << 12  # A3-GND
    PGA_2_048 = 0b010 << 9
    MODE_SINGLE = 1 << 8
    DR_128 = 0b101 << 5
    COMP_QUE_1 = 0b01
    
    def __init__(self, i2c_bus=1, address=0x48):
        self.bus = smbus2.SMBus(i2c_bus)
        self.address = address
        self.voltage_per_bit = 0.1875  # mV @ ±2.048V
        
    def write_register(self, reg, value):
        self.bus.write_word_data(self.address, reg, value)
        
    def read_register(self, reg):
        return self.bus.read_word_data(self.address, reg)
    
    def is_ready(self):
        config = self.read_register(self.REG_CONFIG)
        return (config >> 15) & 0x01
    
    def read_adc(self, channel=0):
        # 配置
        mux_values = [0b100, 0b101, 0b110, 0b111]
        config = (
            self.OS_SINGLE |
            self.MODE_SINGLE |
            self.DR_128 |
            self.COMP_QUE_1 |
            (mux_values[channel] << 12)
        )
        
        # 启动转换
        self.write_register(self.REG_CONFIG, config)
        
        # 等待完成
        while not self.is_ready():
            time.sleep(0.001)
        
        # 读取结果
        result = self.read_register(self.REG_CONV)
        # 处理有符号数
        if result > 0x7FFF:
            result -= 0x10000
        return result
    
    def read_voltage(self, channel=0):
        adc = self.read_adc(channel)
        return adc * self.voltage_per_bit / 1000.0
    
    def read_differential(self, ch_pos, ch_neg):
        """差分测量"""
        # 配置差分输入
        mux_map = {
            (0, 1): 0b000,
            (0, 3): 0b001,
            (1, 3): 0b010,
            (2, 3): 0b011
        }
        mux = mux_map.get((ch_pos, ch_neg), 0b000)
        
        config = (
            self.OS_SINGLE |
            self.MODE_SINGLE |
            self.DR_128 |
            self.COMP_QUE_1 |
            (mux << 12)
        )
        
        self.write_register(self.REG_CONFIG, config)
        
        while not self.is_ready():
            time.sleep(0.001)
        
        result = self.read_register(self.REG_CONV)
        if result > 0x7FFF:
            result -= 0x10000
        return result * self.voltage_per_bit / 1000.0

# 使用示例
ads = ADS1115()

while True:
    for ch in range(4):
        voltage = ads.read_voltage(ch)
        adc = ads.read_adc(ch)
        print(f"A{ch}: {voltage:.4f}V ({adc})")
    print("---")
    time.sleep(1)
```

### HX711 称重传感器驱动

```cpp
// HX711 驱动 (无需外部库)
#define HX711_DOUT  2
#define HX711_SCK   3

class HX711_ADC {
private:
  int doutPin;
  int sckPin;
  long offset = 0;
  float scale = 1.0;
  
  bool isReady() {
    return digitalRead(doutPin) == LOW;
  }
  
  unsigned long readRaw() {
    // 等待就绪
    while (!isReady());
    
    unsigned long data = 0;
    
    // 读取 24 位数据
    for (int i = 0; i < 24; i++) {
      digitalWrite(sckPin, HIGH);
      data = data << 1;
      digitalWrite(sckPin, LOW);
      
      if (digitalRead(doutPin)) {
        data |= 1;
      }
    }
    
    // 第 25 个脉冲选择增益和通道
    // 25 个脉冲 = 通道 A, 增益 128
    digitalWrite(sckPin, HIGH);
    digitalWrite(sckPin, LOW);
    
    // 处理有符号数 (24 位补码)
    data ^= 0x800000;
    
    return data;
  }
  
public:
  HX711_ADC(int dout, int sck) {
    doutPin = dout;
    sckPin = sck;
  }
  
  void begin() {
    pinMode(doutPin, INPUT);
    pinMode(sckPin, OUTPUT);
    digitalWrite(sckPin, LOW);
    
    // 上电复位
    digitalWrite(sckPin, HIGH);
    delayMicroseconds(100);
    digitalWrite(sckPin, LOW);
    
    // 等待稳定
    delay(100);
  }
  
  void tare(int samples = 10) {
    long sum = 0;
    for (int i = 0; i < samples; i++) {
      sum += readRaw();
      delay(10);
    }
    offset = sum / samples;
  }
  
  void setScale(float newScale) {
    scale = newScale;
  }
  
  float readWeight() {
    unsigned long raw = readRaw();
    long value = (long)raw - offset;
    return (float)value / scale;
  }
  
  long readAverage(int samples = 10) {
    long sum = 0;
    for (int i = 0; i < samples; i++) {
      sum += readRaw();
      delay(10);
    }
    return sum / samples - offset;
  }
};

HX711_ADC hx(HX711_DOUT, HX711_SCK);

void setup() {
  Serial.begin(115200);
  hx.begin();
  
  Serial.println("正在去皮...");
  hx.tare(20);
  Serial.println("去皮完成");
  
  // 校准：放置已知重量的砝码，调整 scale 值
  // 示例：放置 100g 砝码，读数为 50000
  // scale = 50000 / 100 = 500
  hx.setScale(500.0);
}

void loop() {
  float weight = hx.readWeight();
  Serial.print("重量：");
  Serial.print(weight);
  Serial.println(" g");
  delay(500);
}
```

### STM32 ADC 多通道 DMA 示例

```c
// STM32 HAL 库 ADC 多通道 DMA 配置
#include "stm32f4xx_hal.h"

#define ADC_CHANNELS 4
uint32_t adcValues[ADC_CHANNELS];
ADC_HandleTypeDef hadc1;

void MX_ADC1_Init(void) {
  ADC_ChannelConfTypeDef sConfig = {0};
  
  // ADC1 配置
  hadc1.Instance = ADC1;
  hadc1.Init.ClockPrescaler = ADC_CLOCK_SYNC_PCLK_DIV4;
  hadc1.Init.Resolution = ADC_RESOLUTION_12B;
  hadc1.Init.ScanConvMode = ENABLE;
  hadc1.Init.ContinuousConvMode = ENABLE;
  hadc1.Init.DiscontinuousConvMode = DISABLE;
  hadc1.Init.ExternalTrigConvEdge = ADC_EXTERNALTRIGCONVEDGE_NONE;
  hadc1.Init.DataAlign = ADC_DATAALIGN_RIGHT;
  hadc1.Init.NbrOfConversion = ADC_CHANNELS;
  hadc1.Init.DMAContinuousRequests = ENABLE;
  hadc1.Init.EOCSelection = ADC_EOC_SEQ_CONV;
  
  if (HAL_ADC_Init(&hadc1) != HAL_OK) {
    Error_Handler();
  }
  
  // 配置通道
  sConfig.SamplingTime = ADC_SAMPLETIME_480CYCLES;
  
  sConfig.Channel = ADC_CHANNEL_0;
  sConfig.Rank = 1;
  HAL_ADC_ConfigChannel(&hadc1, &sConfig);
  
  sConfig.Channel = ADC_CHANNEL_1;
  sConfig.Rank = 2;
  HAL_ADC_ConfigChannel(&hadc1, &sConfig);
  
  sConfig.Channel = ADC_CHANNEL_2;
  sConfig.Rank = 3;
  HAL_ADC_ConfigChannel(&hadc1, &sConfig);
  
  sConfig.Channel = ADC_CHANNEL_3;
  sConfig.Rank = 4;
  HAL_ADC_ConfigChannel(&hadc1, &sConfig);
}

void ADC_Start_DMA(void) {
  // 启动 ADC + DMA
  HAL_ADC_Start_DMA(&hadc1, adcValues, ADC_CHANNELS);
}

// 转换完成回调
void HAL_ADC_ConvCpltCallback(ADC_HandleTypeDef* hadc) {
  // 处理 ADC 数据
  float voltages[ADC_CHANNELS];
  for (int i = 0; i < ADC_CHANNELS; i++) {
    voltages[i] = (adcValues[i] / 4095.0) * 3.3;  // 12-bit, 3.3V
  }
  
  // 重新启动 DMA
  HAL_ADC_Start_DMA(&hadc1, adcValues, ADC_CHANNELS);
}

// 使用示例
int main(void) {
  HAL_Init();
  SystemClock_Config();
  MX_ADC1_Init();
  ADC_Start_DMA();
  
  while (1) {
    // ADC 数据在回调中处理
  }
}
```

## ⚠️ 设计注意事项

### 1. 参考电压设计

```
┌─────────────────────────────────────────────────────┐
│              ADC 参考电压设计                        │
│                                                     │
│  参考电压类型：                                     │
│  ┌─────────────┬──────────┬──────────┬───────────┐ │
│  │ 类型        │ 精度     │ 温漂     │ 应用      │ │
│  ├─────────────┼──────────┼──────────┼───────────┤ │
│  │ 外部精密    │ 0.05%    │ 5ppm/°C  │ 精密测量  │ │
│  │ 内部带隙    │ 1%       │ 50ppm/°C │ 一般应用  │ │
│  │ 电源 Vcc    │ 5%       │ 高       │ 低成本    │ │
│  └─────────────┴──────────┴──────────┴───────────┘ │
│                                                     │
│  推荐参考电压 IC:                                   │
│  - REF50xx 系列 (TI): 0.05%, 3ppm/°C               │
│  - ADR4xx 系列 (ADI): 0.1%, 8ppm/°C                │
│  - LM4040: 0.1%, 100ppm/°C (低成本)                │
│                                                     │
│  PCB 布局要点：                                     │
│  ✓ 参考电压走线尽量短                               │
│  ✓ 添加去耦电容 (10μF + 0.1μF)                     │
│  ✓ 远离噪声源 (数字信号、开关电源)                  │
│  ✓ 使用地平面屏蔽                                   │
└─────────────────────────────────────────────────────┘
```

### 2. 输入滤波设计

```
┌─────────────────────────────────────────────────────┐
│              ADC 输入滤波电路                        │
│                                                     │
│  模拟输入 ──┬───[R]───┬───→ ADC 输入                │
│             │         │                             │
│            ┌┴┐       ┌┴┐                           │
│            │ │ C1    │ │ C2                        │
│            └┬┘       └┬┘                           │
│             │         │                             │
│            GND       GND                           │
│                                                     │
│  R: 串联电阻 (100Ω - 1kΩ)                          │
│  C1: 外部滤波电容 (10nF - 100nF)                   │
│  C2: ADC 内部采样电容 (典型几 pF)                  │
│                                                     │
│  作用：                                             │
│  - 限制输入电流                                     │
│  - 滤除高频噪声                                     │
│  - 提供电荷给采样电容                              │
│                                                     │
│  截止频率：f_c = 1 / (2πRC)                        │
│  示例：R=100Ω, C=100nF → f_c ≈ 15.9kHz            │
└─────────────────────────────────────────────────────┘
```

### 3. 提高精度的技巧

```javascript
// 过采样提高有效分辨率
function oversample(analogPin, bits) {
  // 每增加 1 位需要 4 倍过采样
  const oversampleRatio = Math.pow(4, bits - 10);  // 假设原始 10 位
  let sum = 0;
  
  for (let i = 0; i < oversampleRatio; i++) {
    sum += analogRead(analogPin);
  }
  
  // 右移得到结果 (相当于除以 oversampleRatio)
  return sum >> (Math.log2(oversampleRatio));
}

// 使用示例：将 10 位 ADC 提升到 12 位
const value12bit = oversample(A0, 12);

// 数字滤波 (移动平均)
const FILTER_WINDOW = 16;
int filterBuffer[FILTER_WINDOW];
int filterIndex = 0;

int movingAverage(int newValue) {
  filterBuffer[filterIndex] = newValue;
  filterIndex = (filterIndex + 1) % FILTER_WINDOW;
  
  int sum = 0;
  for (int i = 0; i < FILTER_WINDOW; i++) {
    sum += filterBuffer[i];
  }
  
  return sum / FILTER_WINDOW;
}

// 中值滤波 (去除异常值)
int medianFilter(int newValue) {
  static int buffer[5];
  static int index = 0;
  
  buffer[index] = newValue;
  index = (index + 1) % 5;
  
  // 简单排序
  for (int i = 0; i < 4; i++) {
    for (int j = i + 1; j < 5; j++) {
      if (buffer[i] > buffer[j]) {
        int temp = buffer[i];
        buffer[i] = buffer[j];
        buffer[j] = temp;
      }
    }
  }
  
  // 返回中值
  return buffer[2];
}
```

## 🎯 应用实例

### 多通道数据采集系统

```cpp
// 8 通道数据采集系统
class DataAcquisitionSystem {
private:
  ADS1115 ads1;  // 0x48
  ADS1115 ads2;  // 0x49
  float calibration[16];
  
public:
  void begin() {
    Wire.begin();
    ads1.begin();
    ads2.begin();
    
    // 校准系数 (需要通过校准确定)
    for (int i = 0; i < 16; i++) {
      calibration[i] = 1.0;
    }
  }
  
  float readChannel(int channel) {
    float value;
    
    if (channel < 8) {
      value = ads1.readVoltage(channel % 4);
    } else {
      value = ads2.readVoltage(channel % 4);
    }
    
    return value * calibration[channel];
  }
  
  void readAllChannels(float* buffer) {
    for (int i = 0; i < 16; i++) {
      buffer[i] = readChannel(i);
      delay(1);
    }
  }
  
  void calibrateChannel(int channel, float knownVoltage) {
    float measured = 0;
    int samples = 10;
    
    for (int i = 0; i < samples; i++) {
      measured += readChannel(channel);
      delay(10);
    }
    measured /= samples;
    
    calibration[channel] = knownVoltage / measured;
    
    Serial.print("通道 ");
    Serial.print(channel);
    Serial.print(" 校准系数：");
    Serial.println(calibration[channel]);
  }
};

DataAcquisitionSystem das;

void setup() {
  Serial.begin(115200);
  das.begin();
  
  // 校准示例
  // das.calibrateChannel(0, 2.5);  // 施加 2.5V 已知电压
}

void loop() {
  float voltages[16];
  das.readAllChannels(voltages);
  
  // 打印所有通道
  for (int i = 0; i < 16; i++) {
    Serial.print("CH");
    Serial.print(i);
    Serial.print(": ");
    Serial.print(voltages[i], 4);
    Serial.print("V  ");
    
    if ((i + 1) % 4 == 0) {
      Serial.println();
    }
  }
  Serial.println("---");
  
  delay(1000);
}
```

## 📖 参考资源

- [TI ADC 选型指南](https://www.ti.com/data-converters/adc-circuits/)
- [ADS1115 数据手册](https://www.ti.com/product/ADS1115)
- [ADI ADC 技术文档](https://www.analog.com/en/product-category/analog-to-digital-converters-adc.html)
- [STM32 ADC 应用笔记](https://www.st.com/resource/en/application_note/an3116.pdf)

## 🔗 相关主题

- [DAC (数模转换器)](./DAC.md)
- [电流计 (Current Sensor)](./CURRENT_SENSOR.md)
- [传感器信号调理](./SIGNAL_CONDITIONING.md)
