# DAC (数模转换器) 学习

## 🧠 功能概述

数模转换器 (Digital-to-Analog Converter, DAC) 是将离散数字信号转换为连续模拟信号的电子器件。它是数字系统控制模拟世界的桥梁，广泛应用于音频播放、波形生成、电机控制、电源管理、通信系统等领域。

## 📚 核心概念

### 1. DAC 工作原理

```
┌─────────────────────────────────────────────────────────┐
│              DAC 转换过程                                │
│                                                         │
│  数字输入 ──→ 解码网络 ──→ 模拟开关 ──→ 输出放大 ──→ 模拟输出 │
│     │                                              │   │
│     │                                              │   │
│  离散信号                                      连续信号 │
│                                                         │
│  输出电压：V_out = V_ref × (D / 2^N)                   │
│                                                         │
│  其中:                                                  │
│  - V_ref: 参考电压                                      │
│  - D: 数字输入值 (0 ~ 2^N-1)                           │
│  - N: DAC 分辨率 (位数)                                 │
└─────────────────────────────────────────────────────────┘
```

### 2. 关键性能参数

| 参数 | 符号 | 单位 | 说明 |
|------|------|------|------|
| 分辨率 | N | bit | 输入数字量的位数 |
| 建立时间 | t_s | μs | 输出达到稳态的时间 |
| 转换速率 | SR | V/μs | 输出电压变化率 |
| 精度 | ε | %FSR | 满量程误差 |
| 微分非线性 | DNL | LSB | 相邻码宽的偏差 |
| 积分非线性 | INL | LSB | 实际与理想曲线的偏差 |
| 毛刺脉冲 | Glitch | mV·s | 码跃迁时的能量 |
| 信噪比 | SNR | dB | 信号与噪声的比值 |
| 无杂散动态范围 | SFDR | dB | 信号与最大杂散的比值 |

### 3. 分辨率与输出

```
┌─────────────────────────────────────────────────────┐
│              DAC 分辨率计算                          │
│                                                     │
│  输出电压：V_out = V_ref × (D / 2^N)               │
│                                                     │
│  最小步进：V_step = V_ref / 2^N                    │
│                                                     │
│  示例 (V_ref = 3.3V):                               │
│  ┌───────┬──────────────┬───────────────────┐      │
│  │ 位数  │ 量化级数     │ 最小步进          │      │
│  ├───────┼──────────────┼───────────────────┤      │
│  │ 8-bit │ 256          │ 3.3V/256 = 12.9mV │      │
│  │ 10-bit│ 1,024        │ 3.3V/1024 = 3.2mV │      │
│  │ 12-bit│ 4,096        │ 3.3V/4096 = 0.8mV │      │
│  │ 16-bit│ 65,536       │ 3.3V/65536 = 50μV │      │
│  └───────┴──────────────┴───────────────────┘      │
│                                                     │
│  示例计算：12-bit DAC, V_ref=3.3V, D=2048          │
│  V_out = 3.3V × (2048 / 4096) = 1.65V              │
└─────────────────────────────────────────────────────┘
```

### 4. DAC 架构类型

```
┌─────────────────────────────────────────────────────────┐
│              常见 DAC 架构对比                           │
├─────────────┬───────────┬───────────┬─────────┬─────────┤
│   类型      │  分辨率   │   速度    │  精度   │  应用   │
├─────────────┼───────────┼───────────┼─────────┼─────────┤
│ 电阻串      │ 8-12 bit  │ 中        │ 中      │ 通用   │
│ (R-String)  │           │           │         │         │
├─────────────┼───────────┼───────────┼─────────┼─────────┤
│ R-2R 梯形   │ 8-16 bit  │ 高        │ 高      │ 精密   │
│ (R-2R)      │           │           │         │         │
├─────────────┼───────────┼───────────┼─────────┼─────────┤
│ 电流舵       │ 8-16 bit  │ 很高      │ 中      │ 高速   │
│ (Current-   │           │           │         │         │
│ Steering)   │           │           │         │         │
├─────────────┼───────────┼───────────┼─────────┼─────────┤
│ Δ-Σ (Delta- │ 16-24 bit │ 低        │ 很高    │ 音频   │
│ Sigma)      │           │           │         │         │
├─────────────┼───────────┼───────────┼─────────┼─────────┤
│ PWM+ 滤波   │ 8-12 bit  │ 低        │ 低      │ 低成本 │
│             │           │           │         │         │
└─────────────┴───────────┴───────────┴─────────┴─────────┘
```

## 🔧 DAC 架构详解

### 1. R-2R 梯形网络

```
┌─────────────────────────────────────────────────────┐
│              R-2R 梯形 DAC 原理                      │
│                                                     │
│  V_ref                                               │
│    │                                                 │
│   ┌┴┐                                               │
│   │ │ 2R                                            │
│   └┬┘                                               │
│    ├─────┬─────────────────────────────────→ V_out  │
│    │     │                                          │
│   ┌┴┐   ┌┴┐                                        │
│   │ │ R │ │ 2R                                     │
│   └┬┘   └┬┘                                        │
│    │     ├─────┬────────────────────────────        │
│    │     │     │                                    │
│   ┌┴┐   ┌┴┐   ┌┴┐                                  │
│   │ │ R │ │ R │ │ 2R                               │
│   └┬┘   └┬┘   └┬┘                                  │
│    │     │     │                                   │
│   D3    D2    D1    D0  (数字输入)                  │
│   MSB                   LSB                         │
│                                                     │
│  工作原理：                                         │
│  - 每个数字位控制一个开关                           │
│  - 开关将 2R 电阻接地或接运放虚地                    │
│  - 电流按二进制权重分配                             │
│  - 运放将电流转换为电压                             │
│                                                     │
│  优点：精度高、匹配性好                             │
│  缺点：需要精密电阻                                 │
└─────────────────────────────────────────────────────┘
```

### 2. 电流舵 DAC

```
┌─────────────────────────────────────────────────────┐
│              电流舵 DAC 原理                         │
│                                                     │
│  I_ref ──┬──[I]──┬──[I]──┬── ... ──┬──[I]──        │
│          │   │   │   │           │   │              │
│         ┌┴┐ ┌┴┐ ┌┴┐ ┌┴┐       ┌┴┐ ┌┴┐             │
│         │S│ │S│ │S│ │S│  ...  │S│ │S│             │
│         └┬┘ └┬┘ └┬┘ └┬┘       └┬┘ └┬┘             │
│          │   │   │   │         │   │               │
│         D0  D1  D2  D3       D(n-1) Dn  (数字控制)  │
│                                                     │
│  工作原理：                                         │
│  - 每个电流源由数字位控制                           │
│  - 电流按二进制权重比例                             │
│  - 开关将电流导向输出或地                           │
│  - 总电流经运放转换为电压                           │
│                                                     │
│  优点：高速、适合高频应用                           │
│  缺点：功耗较大、需要匹配                          │
└─────────────────────────────────────────────────────┘
```

### 3. Δ-Σ DAC (用于音频)

```
┌─────────────────────────────────────────────────────┐
│              Δ-Σ DAC 原理                            │
│                                                     │
│  数字输入 ──→ 数字插值滤波器 ──→ Δ-Σ 调制器 ──→ 1-bit DAC ──→ 模拟滤波 ──→ 输出 │
│                                                     │
│  高分辨率数字信号                                   │
│  (如 24-bit/48kHz)                                  │
│       ↓                                             │
│  过采样 (如 64x = 3.072MHz)                        │
│       ↓                                             │
│  噪声整形 (将量化噪声推向高频)                      │
│       ↓                                             │
│  1-bit 高速调制                                     │
│       ↓                                             │
│  模拟低通滤波 (去除高频噪声)                        │
│       ↓                                             │
│  高质量模拟输出                                     │
│                                                     │
│  优点：高分辨率、高线性度、低成本                   │
│  应用：音频 DAC、精密信号源                         │
└─────────────────────────────────────────────────────┘
```

## 🔌 常用 DAC 芯片

### 内置 DAC (MCU)

| 系列 | 厂商 | 分辨率 | 通道数 | 特点 |
|------|------|--------|--------|------|
| STM32F1 | ST | 12-bit | 2 | 通用 |
| STM32F4 | ST | 12-bit | 2 | 高性能 |
| ESP32 | Espressif | 8-bit | 2 | WiFi/BT |
| Arduino Due | SAM3X | 12-bit | 2 | Arduino |
| RP2040 | Raspberry Pi | - | 0 | 需外置 |

### 外置 DAC

| 型号 | 厂商 | 分辨率 | 接口 | 特点 | 应用 |
|------|------|--------|------|------|------|
| MCP4725 | Microchip | 12-bit | I2C | 低功耗 | 通用 |
| MCP4921 | Microchip | 12-bit | SPI | 高速 | 工业 |
| DAC8560 | TI | 16-bit | SPI | 高精度 | 精密 |
| AD5662 | ADI | 16-bit | I2C | 低漂移 | 测试设备 |
| PCM5102 | TI | 32-bit | I2S | 音频 | 音频播放 |
| ES9023 | ESS | 24-bit | I2S | HiFi | 高端音频 |

## 📐 典型应用电路

### MCP4725 I2C DAC 模块

```
                    Vcc (2.7V-5.5V)
                       │
              ┌────────┴────────┐
              │                 │
    A0 ───────┤ A0          Vcc ├─── Vcc
              │                 │
              │  MCP4725        │
              │                 │
              │            SDA ├─── SDA (I2C)
              │            SCL ├─── SCL (I2C)
              │            GND ├─── GND
              │            Vout├─── 模拟输出
              │                 │
              └─────────────────┘
    
    I2C 地址：0x60 (A0=GND) 或 0x61 (A0=Vcc)
    
    特性:
    - 12 位分辨率
    - I2C 接口 (最高 3.4MHz)
    - 内置非易失性存储器
    - 片上精密参考源
    - 建立时间：6μs (至 0.5LSB)
    - 功耗：200μA (典型)
```

### DAC8560 高精度 SPI DAC

```
                    AVcc (2.7V-5.5V)
                       │
              ┌────────┴────────┐
              │                 │
    REFIN ────┤ REF         AVcc├─── AVcc
              │                 │
    SYNC ─────┤ SYNC      DGND├─── DGND
    SCLK ─────┤ SCLK      Vout├─── 模拟输出
    DIN  ─────┤ DIN       LDAC├─── LDAC (可选)
              │                 │
              │   DAC8560       │
              │                 │
              └─────────────────┘
    
    SPI 模式：CPOL=0, CPHA=0 (模式 0)
    最大时钟：50MHz
    
    特性:
    - 16 位分辨率
    - INL: ±2LSB (最大)
    - 建立时间：5μs
    - 温漂：2ppm/°C
    - 参考电压：2.5V 内置或外置
```

### 音频 DAC (I2S 接口)

```
                    3.3V
                       │
              ┌────────┴────────┐
              │                 │
    BCLK ─────┤ BCLK        AVCC├─── AVCC
    LRCLK ────┤ LRCLK       AGND├─── AGND
    DIN  ─────┤ DIN       LOUTL├─── 左声道输出
              │                 │
    PCM5102   │                 │
              │                 │
              │            LOUTR├─── 右声道输出
              │            VOUT├─── 模拟输出
              │                 │
              └─────────────────┘
    
    I2S 格式:
    - BCLK: 位时钟 (64×采样率)
    - LRCLK: 左右声道选择
    - DIN: 串行数据
    
    特性:
    - 32 位分辨率
    - 384kHz 采样率
    - SNR: 112dB
    - THD+N: -93dB
```

## 💻 驱动与软件示例

### MCP4725 Arduino 驱动

```cpp
#include <Wire.h>

#define MCP4725_ADDR 0x60

// 命令字节
#define CMD_WRITE_DAC 0x40
#define CMD_WRITE_EEPROM 0x60

class MCP4725 {
private:
  uint8_t address;
  
public:
  MCP4725(uint8_t addr = MCP4725_ADDR) {
    address = addr;
  }
  
  bool begin() {
    Wire.begin();
    return true;
  }
  
  bool setValue(uint16_t value) {
    // 限制值范围 0-4095
    value = constrain(value, 0, 4095);
    
    Wire.beginTransmission(address);
    Wire.write(CMD_WRITE_DAC);
    Wire.write((value >> 8) & 0x0F);  // 高 4 位
    Wire.write(value & 0xFF);          // 低 8 位
    return Wire.endTransmission() == 0;
  }
  
  bool setVoltage(float voltage, float vcc = 5.0) {
    // 计算 DAC 值
    uint16_t dacValue = (voltage / vcc) * 4096;
    return setValue(dacValue);
  }
  
  bool setPercentage(float percent) {
    // 0-100% 输出
    percent = constrain(percent, 0, 100);
    uint16_t dacValue = (percent / 100.0) * 4096;
    return setValue(dacValue);
  }
  
  // 保存值到 EEPROM (断电保持)
  bool saveToEEPROM(uint16_t value) {
    value = constrain(value, 0, 4095);
    
    Wire.beginTransmission(address);
    Wire.write(CMD_WRITE_EEPROM);
    Wire.write((value >> 8) & 0x0F);
    Wire.write(value & 0xFF);
    return Wire.endTransmission() == 0;
  }
};

MCP4725 dac;

void setup() {
  Serial.begin(115200);
  dac.begin();
  
  // 设置 2.5V 输出 (假设 Vcc=5V)
  dac.setVoltage(2.5);
  
  // 或设置 50% 输出
  // dac.setPercentage(50);
  
  // 或设置原始值
  // dac.setValue(2048);
}

void loop() {
  // 生成三角波
  for (uint16_t i = 0; i < 4096; i += 10) {
    dac.setValue(i);
    delay(1);
  }
  for (uint16_t i = 4095; i > 0; i -= 10) {
    dac.setValue(i);
    delay(1);
  }
}
```

### MCP4725 Python/Raspberry Pi 驱动

```python
import smbus2
import time
import math

class MCP4725:
    ADDRESS = 0x60
    CMD_WRITE_DAC = 0x40
    CMD_WRITE_EEPROM = 0x60
    
    def __init__(self, i2c_bus=1, address=0x60):
        self.bus = smbus2.SMBus(i2c_bus)
        self.address = address
        
    def set_value(self, value):
        """设置 DAC 值 (0-4095)"""
        value = max(0, min(4095, value))
        
        data = [
            self.CMD_WRITE_DAC,
            (value >> 8) & 0x0F,
            value & 0xFF
        ]
        
        self.bus.write_i2c_block_data(self.address, 0, data)
        
    def set_voltage(self, voltage, vcc=5.0):
        """设置输出电压"""
        dac_value = int((voltage / vcc) * 4096)
        self.set_value(dac_value)
        
    def set_percentage(self, percent):
        """设置百分比输出 (0-100%)"""
        percent = max(0, min(100, percent))
        dac_value = int((percent / 100) * 4096)
        self.set_value(dac_value)
        
    def save_to_eeprom(self, value):
        """保存值到 EEPROM"""
        value = max(0, min(4095, value))
        
        data = [
            self.CMD_WRITE_EEPROM,
            (value >> 8) & 0x0F,
            value & 0xFF
        ]
        
        self.bus.write_i2c_block_data(self.address, 0, data)
        time.sleep(0.05)  # EEPROM 写入时间

# 使用示例
dac = MCP4725()

# 设置 2.5V 输出
dac.set_voltage(2.5, vcc=5.0)

# 生成正弦波
while True:
    for i in range(100):
        angle = (i / 100) * 2 * math.pi
        value = int(2048 + 2000 * math.sin(angle))
        dac.set_value(value)
        time.sleep(0.01)
```

### STM32 HAL DAC 输出示例

```c
// STM32 HAL 库 DAC 配置
#include "stm32f4xx_hal.h"

DAC_HandleTypeDef hdac;

void MX_DAC_Init(void) {
  DAC_ChannelConfTypeDef sConfig = {0};
  
  // DAC 配置
  hdac.Instance = DAC;
  
  if (HAL_DAC_Init(&hdac) != HAL_OK) {
    Error_Handler();
  }
  
  // 通道 1 配置
  sConfig.DAC_Trigger = DAC_TRIGGER_NONE;
  sConfig.DAC_OutputBuffer = DAC_OUTPUTBUFFER_ENABLE;
  
  if (HAL_DAC_ConfigChannel(&hdac, &sConfig, DAC_CHANNEL_1) != HAL_OK) {
    Error_Handler();
  }
}

void DAC_SetValue(uint32_t channel, uint16_t value) {
  // 12 位右对齐
  HAL_DAC_SetValue(&hdac, channel, DAC_ALIGN_12B_R, value);
  HAL_DAC_Start(&hdac, channel);
}

void DAC_SetVoltage(uint32_t channel, float voltage, float vref) {
  uint16_t dacValue = (voltage / vref) * 4095;
  DAC_SetValue(channel, dacValue);
}

// 生成三角波
void DAC_GenerateTriangleWave(uint32_t channel) {
  uint16_t value = 0;
  int direction = 1;
  
  while (1) {
    DAC_SetValue(channel, value);
    
    if (direction) {
      value += 10;
      if (value >= 4095) direction = 0;
    } else {
      value -= 10;
      if (value == 0) direction = 1;
    }
    
    HAL_Delay(1);
  }
}

// 使用 DMA 输出波形
uint32_t sineWave[100];
void InitSineWave(void) {
  for (int i = 0; i < 100; i++) {
    float angle = (i / 100.0) * 2 * 3.14159;
    sineWave[i] = 2048 + (uint16_t)(2000 * sin(angle));
  }
}

void DAC_Start_DMA(void) {
  InitSineWave();
  HAL_DAC_Start_DMA(&hdac, DAC_CHANNEL_1, sineWave, 100, DAC_ALIGN_12B_R);
}

int main(void) {
  HAL_Init();
  SystemClock_Config();
  MX_DAC_Init();
  
  // 启动 DMA 输出正弦波
  DAC_Start_DMA();
  
  while (1) {
    // 主循环
  }
}
```

### ESP32 DAC 输出示例

```cpp
// ESP32 内置 DAC (仅 GPIO25/26)
#define DAC_CHANNEL_1 25  // GPIO25
#define DAC_CHANNEL_2 26  // GPIO26

void setup() {
  Serial.begin(115200);
  
  // ESP32 DAC 使用 dacWrite 函数
  pinMode(DAC_CHANNEL_1, OUTPUT);
}

void loop() {
  // 生成正弦波
  for (int i = 0; i < 360; i++) {
    float radian = i * PI / 180;
    float value = 128 + 127 * sin(radian);  // 8-bit, 0-255
    dacWrite(DAC_CHANNEL_1, (uint8_t)value);
    delay(2);
  }
}

// 使用 I2S 实现更高精度 DAC (所有 GPIO 可用)
#include <driver/i2s.h>

#define I2S_PORT I2S_NUM_0
#define I2S_BCLK 26
#define I2S_LRC 25
#define I2S_DOUT 22

void I2S_DAC_Init() {
  i2s_config_t i2s_config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_TX),
    .sample_rate = 44100,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
    .channel_format = I2S_CHANNEL_FMT_RIGHT_LEFT,
    .communication_format = I2S_COMM_FORMAT_STAND_I2S,
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count = 8,
    .dma_buf_len = 1024,
    .use_apll = false,
    .tx_desc_auto_clear = true,
    .fixed_mclk = 0
  };
  
  i2s_pin_config_t pin_config = {
    .bck_io_num = I2S_BCLK,
    .ws_io_num = I2S_LRC,
    .data_out_num = I2S_DOUT,
    .data_in_num = I2S_PIN_NO_CHANGE
  };
  
  i2s_driver_install(I2S_PORT, &i2s_config, 0, NULL);
  i2s_set_pin(I2S_PORT, &pin_config);
}

void I2S_PlayTone(float frequency, int duration_ms) {
  int16_t sample[1];
  int samples = (44100 * duration_ms) / 1000;
  
  for (int i = 0; i < samples; i++) {
    sample[0] = (int16_t)(32767 * sin(2 * PI * frequency * i / 44100));
    size_t bytes_written;
    i2s_write(I2S_PORT, sample, sizeof(sample), &bytes_written, portMAX_DELAY);
  }
}

void setup() {
  I2S_DAC_Init();
}

void loop() {
  // 播放 440Hz 音调 1 秒
  I2S_PlayTone(440, 1000);
  delay(500);
}
```

## ⚠️ 设计注意事项

### 1. 参考电压设计

```
┌─────────────────────────────────────────────────────┐
│              DAC 参考电压设计                        │
│                                                     │
│  参考电压类型：                                     │
│  ┌─────────────┬──────────┬──────────┬───────────┐ │
│  │ 类型        │ 精度     │ 温漂     │ 应用      │ │
│  ├─────────────┼──────────┼──────────┼───────────┤ │
│  │ 外部精密    │ 0.05%    │ 5ppm/°C  │ 精密输出  │ │
│  │ 内部带隙    │ 1%       │ 50ppm/°C │ 一般应用  │ │
│  │ 电源 Vcc    │ 5%       │ 高       │ 低成本    │ │
│  └─────────────┴──────────┴──────────┴───────────┘ │
│                                                     │
│  推荐参考电压 IC:                                   │
│  - REF50xx 系列 (TI): 0.05%, 3ppm/°C               │
│  - ADR4xx 系列 (ADI): 0.1%, 8ppm/°C                │
│  - LM4040: 0.1%, 100ppm/°C (低成本)                │
└─────────────────────────────────────────────────────┘
```

### 2. 输出缓冲设计

```
┌─────────────────────────────────────────────────────┐
│              DAC 输出缓冲电路                        │
│                                                     │
│  DAC 输出 ──┬───[R]───┬───→ 运放+ ──→ 缓冲输出      │
│             │         │      │                      │
│            ┌┴┐        │     ┌┴┐                    │
│            │ │ C      │     │ │ Rf                  │
│            └┬┘        │     └┬┘                    │
│             │         │      │                      │
│            GND       GND    └──→ 运放 -             │
│                                    │                │
│  作用：                            │                │
│  - 提供驱动能力                    │                │
│  - 隔离负载影响                    │                │
│  - 降低输出阻抗                    │                │
│                                    │                │
│  运放选择：                        │                │
│  - 低输入偏置电流                  │                │
│  - 低失调电压                      │                │
│  - 单位增益稳定                    │                │
│  - 轨到轨输出                      │                │
│                                                     │
│  推荐运放：OPA333, MCP6002, TLV2372                │
└─────────────────────────────────────────────────────┘
```

### 3. 滤波设计

```
┌─────────────────────────────────────────────────────┐
│              DAC 输出低通滤波器                      │
│                                                     │
│  DAC 输出 ──┬───[R]───┬───→ 输出                    │
│             │         │                             │
│            ┌┴┐       ┌┴┐                           │
│            │ │ C1    │ │ C2                        │
│            └┬┘       └┬┘                           │
│             │         │                             │
│            GND       GND                           │
│                                                     │
│  二阶 RC 低通滤波器                                  │
│  截止频率：f_c = 1 / (2π√(R1×R2×C1×C2))           │
│                                                     │
│  简化设计 (R1=R2=R, C1=C2=C):                      │
│  f_c = 1 / (2πRC)                                  │
│                                                     │
│  示例：R=1kΩ, C=100nF                              │
│  f_c = 1 / (2π × 1000 × 100×10^-9) ≈ 1.59kHz      │
│                                                     │
│  应用：                                             │
│  - PWM DAC 平滑滤波                                 │
│  - 去除量化噪声                                     │
│  - 音频重建滤波                                     │
└─────────────────────────────────────────────────────┘
```

## 🎯 应用实例

### 可编程电源

```cpp
// 基于 DAC 的可编程电源控制
class ProgrammablePowerSupply {
private:
  MCP4725 dac;
  float minVoltage = 0.0;
  float maxVoltage = 5.0;
  float currentVoltage = 0.0;
  
public:
  void begin() {
    dac.begin();
    setVoltage(0.0);
  }
  
  void setVoltage(float voltage) {
    voltage = constrain(voltage, minVoltage, maxVoltage);
    currentVoltage = voltage;
    dac.setVoltage(voltage, 5.0);
  }
  
  void rampTo(float targetVoltage, float stepTime = 10) {
    float step = (targetVoltage > currentVoltage) ? 0.1 : -0.1;
    
    while (abs(currentVoltage - targetVoltage) > 0.05) {
      setVoltage(currentVoltage + step);
      delay(stepTime);
    }
    
    setVoltage(targetVoltage);
  }
  
  void generateWaveform(String type, float frequency, float amplitude) {
    unsigned long period = 1000 / frequency;  // ms
    unsigned long stepTime = period / 100;
    
    for (int i = 0; i < 100; i++) {
      float value;
      
      if (type == "sine") {
        value = sin((i / 100.0) * 2 * PI) * amplitude + amplitude;
      } else if (type == "triangle") {
        value = (i < 50) ? (i / 50.0) * amplitude : (2 - i / 50.0) * amplitude;
      } else if (type == "square") {
        value = (i < 50) ? amplitude : 0;
      } else {
        value = amplitude;
      }
      
      setVoltage(value);
      delay(stepTime);
    }
  }
  
  float getCurrentVoltage() {
    return currentVoltage;
  }
};

ProgrammablePowerSupply pps;

void setup() {
  Serial.begin(115200);
  pps.begin();
  
  // 软启动：缓慢上升到 3.3V
  pps.rampTo(3.3, 20);
}

void loop() {
  // 生成 1Hz 正弦波，幅度 2V
  pps.generateWaveform("sine", 1, 2);
}
```

### 电机速度控制

```cpp
// DAC 控制电机驱动器速度
class MotorSpeedController {
private:
  MCP4725 dac;
  float minSpeed = 0.0;
  float maxSpeed = 1000.0;  // RPM
  
public:
  void begin() {
    dac.begin();
    setSpeed(0);
  }
  
  void setSpeed(float rpm) {
    rpm = constrain(rpm, minSpeed, maxSpeed);
    
    // 假设 0-1000 RPM 对应 0-3.3V
    float voltage = (rpm / maxSpeed) * 3.3;
    dac.setVoltage(voltage, 3.3);
  }
  
  void setPercentage(float percent) {
    percent = constrain(percent, 0, 100);
    dac.setPercentage(percent);
  }
  
  void accelerate(float targetRpm, float accelTime) {
    float currentRpm = minSpeed;
    float step = (targetRpm - currentRpm) / (accelTime * 100);
    
    for (int i = 0; i < accelTime * 100; i++) {
      setSpeed(currentRpm);
      currentRpm += step;
      delay(10);
    }
    
    setSpeed(targetRpm);
  }
  
  void decelerate(float targetRpm, float decelTime) {
    float currentRpm = maxSpeed;
    float step = (currentRpm - targetRpm) / (decelTime * 100);
    
    for (int i = 0; i < decelTime * 100; i++) {
      setSpeed(currentRpm);
      currentRpm -= step;
      delay(10);
    }
    
    setSpeed(targetRpm);
  }
};

MotorSpeedController motor;

void setup() {
  motor.begin();
  
  // 缓慢加速到 500 RPM
  motor.accelerate(500, 2);
}

void loop() {
  // 运行 5 秒
  delay(5000);
  
  // 缓慢停止
  motor.decelerate(0, 2);
  
  delay(2000);
  
  // 重新启动
  motor.accelerate(500, 2);
}
```

## 📖 参考资源

- [TI DAC 选型指南](https://www.ti.com/data-converters/dac-circuits/)
- [MCP4725 数据手册](https://www.microchip.com/en-us/product/MCP4725)
- [ADI DAC 技术文档](https://www.analog.com/en/product-category/digital-to-analog-converters-dac.html)
- [STM32 DAC 应用笔记](https://www.st.com/resource/en/application_note/an3965.pdf)

## 🔗 相关主题

- [ADC (模数转换器)](./ADC.md)
- [运算放大器](./OPAMP.md)
- [电源管理](./POWER_MANAGEMENT.md)
