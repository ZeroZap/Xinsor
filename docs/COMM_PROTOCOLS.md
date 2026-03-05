# 通信协议深度实践 (I2C/SPI/UART/CAN)

## 🧠 功能概述

硬件通信协议是嵌入式系统的神经网络，连接 MCU、传感器、存储器等外设。本学习文档深入讲解四种最常用的通信协议：I2C、SPI、UART 和 CAN，包含理论、实战代码和调试技巧。

## 📚 协议对比总览

| 协议 | 全称 | 线数 | 速率 | 距离 | 拓扑 | 应用 |
|------|------|------|------|------|------|------|
| I2C | Inter-Integrated Circuit | 2 | 100kbps-3.4Mbps | <1m | 多主多从 | 传感器/EEPROM |
| SPI | Serial Peripheral Interface | 4 | 1-50Mbps | <1m | 一主多从 | Flash/显示屏 |
| UART | Universal Asynchronous Rx/Tx | 2 | 9600-10Mbps | <5m | 点对点 | GPS/蓝牙/GPS |
| CAN | Controller Area Network | 2 | 125kbps-1Mbps | <40m | 多主总线 | 汽车/工业 |

---

## 🔵 I2C (Inter-Integrated Circuit)

### 1. 物理层

```
┌─────────────────────────────────────────────────────┐
│              I2C 总线结构                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│   VCC (3.3V/5V)                                     │
│    │                                                │
│   ┌┴┐ 上拉电阻 (4.7kΩ)                              │
│   │ │                                               │
│   └┬┘                                               │
│    ├────────────┬────────────┬────────────┐        │
│    │            │            │            │        │
│   ┌┴┐ SDA      ┌┴┐ SDA      ┌┴┐ SDA      │        │
│   │ │          │ │          │ │          │        │
│   └┬┘          └┬┘          └┬┘          │        │
│    │            │            │           │        │
│   ┌┴┐ SCL      ┌┴┐ SCL      ┌┴┐ SCL      │        │
│   │ │          │ │          │ │          │        │
│   └┬┘          └┬┘          └┬┘          │        │
│    │            │            │           │        │
│  ┌─┴─┐        ┌─┴─┐        ┌─┴─┐        │        │
│  │主 │        │从1│        │从2│       ...       │
│  │MCU│        │传感器│      │EEPROM│     │        │
│  └───┘        └───┘        └───┘        │        │
│                                            │
└─────────────────────────────────────────────────────┘

特性:
• 开漏输出，需要上拉电阻
• 双线：SDA(数据)、SCL(时钟)
• 支持多主多从
• 7 位地址：最多 127 个设备
• 10 位地址：最多 1023 个设备
```

### 2. 时序协议

```
┌─────────────────────────────────────────────────────┐
│              I2C 数据传输时序                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  SCL:   ──┐  ┌──┐  ┌──┐  ┌──┐  ┌──┐  ┌──┐  ┌──    │
│           │  │  │  │  │  │  │  │  │  │  │  │       │
│           └──┘  └──┘  └──┘  └──┘  └──┘  └──┘       │
│                                                     │
│  SDA:   ──┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──    │
│     START │  │ D1   │  │ D2   │  │ D3   │  │ STOP  │
│           └──┘      └──┘      └──┘      └──┘       │
│           ▲          ▲      ▲          ▲           │
│           │          │      │          │           │
│         START      数据位   数据位     STOP         │
│         条件                  条件                  │
│                                                     │
│  START 条件：SCL 高电平时，SDA 由高→低                │
│  STOP  条件：SCL 高电平时，SDA 由低→高                │
│  数据有效：SCL 低电平时 SDA 变化，高电平时稳定        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3. 读写时序

```
写操作 (MCU → 从设备):
┌────────────────────────────────────────────────────┐
│ START │ 地址+W │ ACK │ 寄存器地址 │ ACK │ 数据 │ ACK │ STOP │
└────────────────────────────────────────────────────┘

读操作 (MCU ← 从设备):
┌────────────────────────────────────────────────────┐
│ START │ 地址+W │ ACK │ 寄存器地址 │ ACK │       │
└────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────┐
│ ReSTART │ 地址+R │ ACK │   数据   │ NACK │ STOP │
└────────────────────────────────────────────────────┘

ACK: 应答 (SDA 拉低)
NACK: 非应答 (SDA 保持高)
```

### 4. STM32 HAL 驱动代码

```c
// STM32 HAL I2C 驱动示例
#include "stm32f1xx_hal.h"

#define I2C_ADDR_WRITE  0xA0  // EEPROM 地址 (写)
#define I2C_ADDR_READ   0xA1  // EEPROM 地址 (读)
#define EEPROM_ADDR     0x50  // 7 位地址

I2C_HandleTypeDef hi2c1;

// I2C 初始化
void I2C_Init(void) {
  hi2c1.Instance = I2C1;
  hi2c1.Init.ClockSpeed = 100000;  // 100kHz
  hi2c1.Init.DutyCycle = I2C_DUTYCYCLE_2;
  hi2c1.Init.OwnAddress1 = 0x00;
  hi2c1.Init.AddressingMode = I2C_ADDRESSINGMODE_7BIT;
  hi2c1.Init.DualAddressMode = I2C_DUALADDRESS_DISABLE;
  hi2c1.Init.GeneralCallMode = I2C_GENERALCALL_DISABLE;
  hi2c1.Init.NoStretchMode = I2C_NOSTRETCH_DISABLE;
  
  HAL_I2C_Init(&hi2c1);
}

// 写寄存器
HAL_StatusTypeDef I2C_WriteReg(uint8_t reg, uint8_t data) {
  uint8_t buf[2] = {reg, data};
  return HAL_I2C_Master_Transmit(&hi2c1, I2C_ADDR_WRITE, buf, 2, 100);
}

// 读寄存器
HAL_StatusTypeDef I2C_ReadReg(uint8_t reg, uint8_t *data) {
  // 先写寄存器地址
  HAL_StatusTypeDef status = HAL_I2C_Master_Transmit(&hi2c1, I2C_ADDR_WRITE, &reg, 1, 100);
  if (status != HAL_OK) return status;
  
  // 再读数据
  return HAL_I2C_Master_Receive(&hi2c1, I2C_ADDR_READ, data, 1, 100);
}

// 连续读取
HAL_StatusTypeDef I2C_ReadRegs(uint8_t reg, uint8_t *buf, uint16_t len) {
  HAL_StatusTypeDef status = HAL_I2C_Master_Transmit(&hi2c1, I2C_ADDR_WRITE, &reg, 1, 100);
  if (status != HAL_OK) return status;
  return HAL_I2C_Master_Receive(&hi2c1, I2C_ADDR_READ, buf, len, 100);
}
```

### 5. Arduino 示例

```cpp
// Arduino I2C 扫描器
#include <Wire.h>

void setup() {
  Serial.begin(9600);
  Wire.begin();
  Serial.println("I2C Scanner");
}

void loop() {
  Serial.println("Scanning...");
  
  for (byte addr = 1; addr < 127; addr++) {
    Wire.beginTransmission(addr);
    byte error = Wire.endTransmission();
    
    if (error == 0) {
      Serial.print("Found device at 0x");
      Serial.println(addr, HEX);
    }
  }
  delay(5000);
}

// MPU6050 读取示例
#include <Wire.h>

#define MPU_ADDR 0x68
#define ACCEL_XOUT_H 0x3B

void setup() {
  Serial.begin(9600);
  Wire.begin();
  
  // 唤醒 MPU6050
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x6B);  // PWR_MGMT_1
  Wire.write(0);     // 唤醒
  Wire.endTransmission(true);
}

void loop() {
  int16_t ax, ay, az;
  
  // 读取加速度
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(ACCEL_XOUT_H);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDR, 6, true);
  
  ax = Wire.read() << 8 | Wire.read();
  ay = Wire.read() << 8 | Wire.read();
  az = Wire.read() << 8 | Wire.read();
  
  Serial.printf("AX: %d, AY: %d, AZ: %d\n", ax, ay, az);
  delay(100);
}
```

### 6. 常见问题调试

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 无 ACK | 地址错误、设备未供电 | 检查地址、测量电压 |
| 数据全为 0xFF | 上拉电阻缺失 | 添加 4.7kΩ上拉 |
| 通信不稳定 | 线太长、干扰 | 缩短线缆、添加滤波电容 |
| 只能读不能写 | 写保护引脚 | 检查 WP 引脚状态 |

---

## 🟡 SPI (Serial Peripheral Interface)

### 1. 物理层

```
┌─────────────────────────────────────────────────────┐
│              SPI 总线结构 (4 线制)                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ┌─────────┐                                       │
│   │   MCU   │                                       │
│   │  (主)   │                                       │
│   └────┬────┘                                       │
│        │                                            │
│   ┌────┼────┬──────┬────────┐                       │
│   │    │    │      │        │                       │
│   │  ┌─┴─┐  │    ┌─┴─┐    ┌─┴─┐                    │
│   │  │S1 │  │    │S2 │    │S3 │                    │
│   │  │从 │  │    │从 │    │从 │                    │
│   │  └─┬─┘  │    └─┬─┘    └─┬─┘                    │
│   │    │    │      │        │                       │
│   │    └────┴──────┴────────┘                       │
│   │         MOSI (主出从入)                          │
│   │         MISO (主入从出)                          │
│   │         SCK  (时钟)                              │
│   └──────── CS   (片选，独立控制每个从机)            │
│                                                     │
│  全双工通信，速率可达 50Mbps+                        │
└─────────────────────────────────────────────────────┘
```

### 2. SPI 模式 (时钟极性和相位)

```
┌─────────────────────────────────────────────────────┐
│              SPI 时钟模式                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  CPOL: 时钟极性 (Clock Polarity)                    │
│  CPHA: 时钟相位 (Clock Phase)                       │
│                                                     │
│  Mode 0 (CPOL=0, CPHA=0):                           │
│  SCK: ──┐  ┌──┐  ┌──┐  ┌──┐  ┌──┐  ┌──            │
│         │  │  │  │  │  │  │  │  │  │               │
│         └──┘  └──┘  └──┘  └──┘  └──┘  └──          │
│  MOSI:  ──D0───D1───D2───D3───D4───D5───            │
│         ▲                                           │
│         采样点 (上升沿)                              │
│                                                     │
│  Mode 3 (CPOL=1, CPHA=1):                           │
│  SCK: ──┐  ┌──┐  ┌──┐  ┌──┐  ┌──┐  ┌──            │
│     ┌───┘  │  │  │  │  │  │  │  │  │               │
│     └──────┘  └──┘  └──┘  └──┘  └──┘  └──          │
│  MOSI:  ──D0───D1───D2───D3───D4───D5───            │
│             ▲                                       │
│             采样点 (下降沿)                          │
│                                                     │
│  常见设备模式:                                      │
│  • MPU6050: Mode 0                                  │
│  • W25Qxx Flash: Mode 0                             │
│  • SD 卡：Mode 0                                    │
│  • ADS1115: Mode 1                                  │
└─────────────────────────────────────────────────────┘
```

### 3. STM32 HAL 驱动代码

```c
#include "stm32f1xx_hal.h"

SPI_HandleTypeDef hspi1;

// SPI 初始化
void SPI_Init(void) {
  hspi1.Instance = SPI1;
  hspi1.Init.Mode = SPI_MODE_MASTER;
  hspi1.Init.Direction = SPI_DIRECTION_2LINES;
  hspi1.Init.DataSize = SPI_DATASIZE_8BIT;
  hspi1.Init.CLKPolarity = SPI_POLARITY_LOW;  // CPOL=0
  hspi1.Init.CLKPhase = SPI_PHASE_1EDGE;      // CPHA=0
  hspi1.Init.NSS = SPI_NSS_SOFT;
  hspi1.Init.BaudRatePrescaler = SPI_BAUDRATEPRESCALER_16;
  hspi1.Init.FirstBit = SPI_FIRSTBIT_MSB;
  hspi1.Init.TIMode = SPI_TIMODE_DISABLE;
  hspi1.Init.CRCCalculation = SPI_CRCCALCULATION_DISABLE;
  
  HAL_SPI_Init(&hspi1);
}

// 片选控制
#define CS_LOW()  HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_RESET)
#define CS_HIGH() HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_SET)

// 写读字节
uint8_t SPI_WriteRead(uint8_t tx_data) {
  uint8_t rx_data;
  HAL_SPI_TransmitReceive(&hspi1, &tx_data, &rx_data, 1, 100);
  return rx_data;
}

// W25Qxx Flash 读取示例
void W25Qxx_Read(uint32_t addr, uint8_t *buf, uint16_t len) {
  CS_LOW();
  SPI_WriteRead(0x03);  // READ 命令
  SPI_WriteRead((addr >> 16) & 0xFF);
  SPI_WriteRead((addr >> 8) & 0xFF);
  SPI_WriteRead(addr & 0xFF);
  
  for (uint16_t i = 0; i < len; i++) {
    buf[i] = SPI_WriteRead(0xFF);
  }
  CS_HIGH();
}
```

### 4. Arduino 示例

```cpp
// Arduino SPI 主设备
#include <SPI.h>

const int CS_PIN = 10;

void setup() {
  Serial.begin(9600);
  pinMode(CS_PIN, OUTPUT);
  digitalWrite(CS_PIN, HIGH);
  SPI.begin();
  SPI.setClockDivider(SPI_CLOCK_DIV16);  // 1MHz
  SPI.setDataMode(SPI_MODE0);
  SPI.setBitOrder(MSBFIRST);
}

uint8_t spi_transfer(uint8_t data) {
  return SPI.transfer(data);
}

void loop() {
  // 读取 Flash ID
  digitalWrite(CS_PIN, LOW);
  spi_transfer(0x90);  // 读取 ID 命令
  spi_transfer(0);
  spi_transfer(0);
  spi_transfer(0);
  
  uint8_t id1 = spi_transfer(0xFF);
  uint8_t id2 = spi_transfer(0xFF);
  digitalWrite(CS_PIN, HIGH);
  
  Serial.print("Flash ID: 0x");
  Serial.println(id1, HEX);
  
  delay(1000);
}
```

---

## 🟢 UART (Universal Asynchronous Receiver/Transmitter)

### 1. 物理层

```
┌─────────────────────────────────────────────────────┐
│              UART 点对点连接                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ┌─────────┐              ┌─────────┐             │
│   │  MCU    │              │  设备   │             │
│   │         │              │         │             │
│   │ TX  ────┼──────────────┼──→ RX   │             │
│   │ RX  ────┼──────────────┼──← TX   │             │
│   │ GND ────┼──────────────┼──→ GND  │             │
│   └─────────┘              └─────────┘             │
│                                                     │
│  特性：                                             │
│  • 异步通信 (无时钟线)                              │
│  • 全双工                                           │
│  • 波特率需匹配 (9600, 115200 等)                    │
│  • 可配置数据位、停止位、校验位                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2. 数据帧格式

```
┌─────────────────────────────────────────────────────┐
│              UART 数据帧 (8N1)                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  空闲 ─┐ ┌───────┐ ┌─┐                             │
│  (高)  │ │ START │ │ │ DATA0-7 │ PARITY │ STOP │   │
│        └─┤   0   ├─┴─┴─────────┴────────┴──1──┘   │
│          └───────┘                                 │
│                                                     │
│  • START: 1 位，低电平                              │
│  • DATA: 5-9 位 (常用 8 位)，LSB 先传                 │
│  • PARITY: 无/奇/偶校验 (可选)                       │
│  • STOP: 1-2 位，高电平                             │
│                                                     │
│  常用配置:                                          │
│  • 8N1: 8 数据位，无校验，1 停止位 (最常用)           │
│  • 8E1: 8 数据位，偶校验，1 停止位                    │
│  • 7O1: 7 数据位，奇校验，1 停止位                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3. STM32 HAL 驱动代码

```c
#include "stm32f1xx_hal.h"

UART_HandleTypeDef huart1;

// UART 初始化
void UART_Init(void) {
  huart1.Instance = USART1;
  huart1.Init.BaudRate = 115200;
  huart1.Init.WordLength = UART_WORDLENGTH_8B;
  huart1.Init.StopBits = UART_STOPBITS_1;
  huart1.Init.Parity = UART_PARITY_NONE;
  huart1.Init.Mode = UART_MODE_TX_RX;
  huart1.Init.HwFlowCtl = UART_HWCONTROL_NONE;
  huart1.Init.OverSampling = UART_OVERSAMPLING_16;
  
  HAL_UART_Init(&huart1);
}

// 发送数据
HAL_StatusTypeDef UART_Send(uint8_t *data, uint16_t len) {
  return HAL_UART_Transmit(&huart1, data, len, 100);
}

// 接收数据
HAL_StatusTypeDef UART_Receive(uint8_t *data, uint16_t len) {
  return HAL_UART_Receive(&huart1, data, len, 100);
}

// 中断接收回调
void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart) {
  if (huart->Instance == USART1) {
    // 处理接收到的数据
    // 重新启动接收
    HAL_UART_Receive_IT(&huart1, &rx_byte, 1);
  }
}

// printf 重定向
int __io_putchar(int ch) {
  HAL_UART_Transmit(&huart1, (uint8_t*)&ch, 1, 100);
  return ch;
}
```

### 4. Arduino 示例

```cpp
// Arduino GPS 读取示例
#include <SoftwareSerial.h>

SoftwareSerial gpsSerial(2, 3);  // RX, TX

void setup() {
  Serial.begin(9600);
  gpsSerial.begin(9600);  // GPS 波特率
}

void loop() {
  if (gpsSerial.available()) {
    String line = gpsSerial.readStringUntil('\n');
    Serial.println(line);
    
    // 解析 NMEA 语句
    if (line.startsWith("$GPGGA")) {
      // 处理 GPS 数据
    }
  }
}
```

---

## 🔴 CAN (Controller Area Network)

### 1. 物理层

```
┌─────────────────────────────────────────────────────┐
│              CAN 总线结构                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ┌─────────┐                                       │
│   │  MCU1   │                                       │
│   │ +CAN PHY│                                       │
│   └────┬────┘                                       │
│        │                                            │
│   ┌────┼────────────────────┐                       │
│   │    │                    │                       │
│   │  ┌─┴─┐                ┌─┴─┐                    │
│   │  │PHY│                │PHY│                    │
│   │  └─┬─┘                └─┬─┘                    │
│   │    │                    │                       │
│   │  ┌─┴─┐                ┌─┴─┐                    │
│   │  │MCU│                │MCU│                    │
│   │  │ 2  │                │ 3  │                   │
│   │  └───┘                └───┘                    │
│   │                                                │
│   └────────────────────────────────────────────────│
│            CAN_H ───────────────────────            │
│            CAN_L ───────────────────────            │
│                                                     │
│  特性：                                             │
│  • 差分信号 (CAN_H, CAN_L)                          │
│  • 多主架构，任意节点可发起通信                      │
│  • 带仲裁机制，高优先级优先                          │
│  • 120Ω终端电阻 (总线两端)                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2. CAN 帧格式

```
┌─────────────────────────────────────────────────────┐
│         CAN 2.0A 标准帧格式 (11 位 ID)                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  SOF │ ID(11) │ RTR │ IDE │ DLC │ DATA │ CRC │ ACK │
│  1   │   11   │  1  │  1  │  4  │ 0-8  │ 15  │ 2  │
│                                                     │
│  • SOF: 帧起始 (显性)                                │
│  • ID: 标识符 (决定优先级，值越小优先级越高)          │
│  • RTR: 远程发送请求                                 │
│  • IDE: 标识符扩展                                   │
│  • DLC: 数据长度码 (0-8)                            │
│  • DATA: 数据场 (0-8 字节)                          │
│  • CRC: 循环冗余校验                                │
│  • ACK: 应答槽                                      │
│                                                     │
│  CAN FD 帧 (支持更多数据):                           │
│  • 数据场可达 64 字节                                │
│  • 可变波特率 (仲裁段 500kbps, 数据段 2Mbps)          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3. STM32 HAL CAN 驱动代码

```c
#include "stm32f1xx_hal.h"

CAN_HandleTypeDef hcan;

// CAN 初始化
void CAN_Init(void) {
  hcan.Instance = CAN1;
  hcan.Init.Prescaler = 4;
  hcan.Init.Mode = CAN_MODE_NORMAL;
  hcan.Init.SyncJumpWidth = CAN_SJW_1TQ;
  hcan.Init.TimeSeg1 = CAN_BS1_6TQ;
  hcan.Init.TimeSeg2 = CAN_BS2_7TQ;
  // 波特率 = 36MHz / (4 * (1+6+7)) = 500kbps
  
  HAL_CAN_Init(&hcan);
  
  // 配置滤波器
  CAN_FilterTypeDef filter;
  filter.FilterBank = 0;
  filter.FilterMode = CAN_FILTERMODE_IDMASK;
  filter.FilterScale = CAN_FILTERSCALE_32BIT;
  filter.FilterIdHigh = 0x0000;
  filter.FilterIdLow = 0x0000;
  filter.FilterMaskIdHigh = 0x0000;
  filter.FilterMaskIdLow = 0x0000;
  filter.FilterFIFOAssignment = CAN_RX_FIFO0;
  filter.FilterActivation = ENABLE;
  
  HAL_CAN_ConfigFilter(&hcan, &filter);
  HAL_CAN_Start(&hcan);
}

// 发送 CAN 帧
HAL_StatusTypeDef CAN_Send(uint32_t id, uint8_t *data, uint8_t len) {
  CAN_TxHeaderTypeDef tx_header;
  tx_header.StdId = id;
  tx_header.IDE = CAN_ID_STD;
  tx_header.RTR = CAN_RTR_DATA;
  tx_header.DLC = len;
  
  uint32_t tx_mailbox;
  return HAL_CAN_AddTxMessage(&hcan, &tx_header, data, &tx_mailbox);
}

// 接收 CAN 帧
HAL_StatusTypeDef CAN_Receive(uint32_t *id, uint8_t *data, uint8_t *len) {
  CAN_RxHeaderTypeDef rx_header;
  HAL_StatusTypeDef status = HAL_CAN_GetRxMessage(&hcan, CAN_RX_FIFO0, &rx_header, data);
  if (status == HAL_OK) {
    *id = rx_header.StdId;
    *len = rx_header.DLC;
  }
  return status;
}
```

---

## 📊 学习检查清单

### I2C
- [ ] 理解开漏输出和上拉电阻作用
- [ ] 掌握 START/STOP 条件时序
- [ ] 能够编写 I2C 读写驱动
- [ ] 能够调试 I2C 通信问题

### SPI
- [ ] 理解 4 线制工作原理
- [ ] 掌握 CPOL/CPHA 四种模式
- [ ] 能够编写 SPI Flash 驱动
- [ ] 理解片选信号控制

### UART
- [ ] 理解异步通信原理
- [ ] 掌握波特率计算
- [ ] 能够配置数据帧格式
- [ ] 能够使用中断接收

### CAN
- [ ] 理解差分信号和终端电阻
- [ ] 掌握 CAN 帧格式和仲裁机制
- [ ] 能够配置 CAN 波特率
- [ ] 能够编写 CAN 收发程序

---

*最后更新：2026 年 3 月 4 日*
