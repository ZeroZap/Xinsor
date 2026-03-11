# BMI088 6 轴 IMU 传感器

> **一句话描述:** Bosch 高性能 6 轴 IMU，独立加速度计 + 陀螺仪设计，超低噪声，专为无人机和机器人优化  
> **标签:** `#sensor/imu` `#sensor/accelerometer` `#sensor/gyroscope` `#protocol/spi` `#protocol/i2c` `#vendor/bosch` `#app/drone`  
> **状态:** ✅ 完成  
> **最后更新:** 2026-03-11

---

## 🎯 概述

**BMI088** 是 Bosch Sensortec 专为无人机、机器人和高动态应用设计的高性能 6 轴 IMU。与 MPU6050 等集成方案不同，BMI088 采用独立的加速度计和陀螺仪芯片设计，提供更高的灵活性和性能。

**核心特性:**
- ✨ **独立设计:** 加速度计 (BMA088) + 陀螺仪 (BMG088) 独立封装
- ✨ **超低噪声:** 加速度计噪声密度 25μg/√Hz，陀螺仪 0.014°/s/√Hz
- ✨ **高冲击耐受:** 加速度计可承受 20000g 冲击
- ✨ **宽量程:** 加速度计±3/±6/±12/±24g，陀螺仪±125/±250/±500/±1000/±2000°/s
- ✨ **双接口:** I2C (主/辅) 或 SPI (400kHz/10MHz)
- ✨ **宽电压:** 1.71V-3.6V 供电

**典型应用:** 无人机飞控、机器人导航、工业平台稳定、AGV、高精度姿态控制

---

## 📊 技术规格

### 电气参数

| 参数 | 最小值 | 典型值 | 最大值 | 单位 |
|------|--------|--------|--------|------|
| 供电电压 (Accel) | 1.71 | 3.3 | 3.6 | V |
| 供电电压 (Gyro) | 1.71 | 3.3 | 3.6 | V |
| 加速度计电流 | - | 160 | 220 | μA |
| 陀螺仪电流 | - | 2.0 | 3.0 | mA |
| 睡眠模式电流 | - | 2 | 10 | μA |
| 工作温度 | -40 | 25 | 105 | °C |

### 加速度计规格 (BMA088)

| 参数 | 值 | 单位 | 说明 |
|------|-----|------|------|
| 量程 | ±3/±6/±12/±24 | g | 可编程 |
| 灵敏度 | 10923/5461/2731/1365 | LSB/g | 对应各量程 |
| 分辨率 | 16 | bit | - |
| 噪声密度 | 25 | μg/√Hz | 超低噪声 |
| 带宽 | 23-1586 | Hz | 可配置 |
| 冲击耐受 | 20000 | g | 工业级 |

### 陀螺仪规格 (BMG088)

| 参数 | 值 | 单位 | 说明 |
|------|-----|------|------|
| 量程 | ±125/±250/±500/±1000/±2000 | °/s | 可编程 |
| 灵敏度 | 262.4/131.2/65.6/32.8/16.4 | LSB/°/s | 对应各量程 |
| 分辨率 | 16 | bit | - |
| 噪声密度 | 0.014 | °/s/√Hz | 高性能 |
| 带宽 | 32-523 | Hz | 可配置 |
| 零偏稳定性 | 5 | °/h | 典型值 |

### 封装信息

| 参数 | 值 |
|------|-----|
| 加速度计封装 | LGA-14 |
| 陀螺仪封装 | LGA-12 |
| 加速度计尺寸 | 2.0 × 2.0 × 0.68 mm |
| 陀螺仪尺寸 | 2.0 × 2.0 × 0.68 mm |

---

## 🔌 硬件设计

### 引脚定义 (加速度计)

| 引脚 | 名称 | 类型 | 功能描述 |
|------|------|------|----------|
| 1 | VDD | P | 电源 (1.71V-3.6V) |
| 2 | GND | P | 电源地 |
| 3 | SCL/SCL | I | I2C 时钟 / SPI 时钟 |
| 4 | SDA/SDO | I/O | I2C 数据 / SPI 数据输出 |
| 5 | CSB | I | SPI 片选 (低有效) |
| 6 | INT1 | O | 中断输出 1 |
| 7 | INT2 | O | 中断输出 2 |
| 8 | SDO/SDI | O/I | I2C 辅口 / SPI 数据输入 |

### 引脚定义 (陀螺仪)

| 引脚 | 名称 | 类型 | 功能描述 |
|------|------|------|----------|
| 1 | VDD | P | 电源 (1.71V-3.6V) |
| 2 | GND | P | 电源地 |
| 3 | SCL | I | I2C 时钟 / SPI 时钟 |
| 4 | SDA | I/O | I2C 数据 / SPI 数据 |
| 5 | CSB | I | SPI 片选 |
| 6 | INT1 | O | 中断输出 1 |
| 7 | INT2 | O | 中断输出 2 |
| 8 | PS | I | 协议选择 (0=SPI, 1=I2C) |

### I2C 地址

| 设备 | SDO/PS | I2C 地址 |
|------|--------|----------|
| 加速度计 | GND | 0x18 |
| 加速度计 | VDD | 0x19 |
| 陀螺仪 | GND | 0x68 |
| 陀螺仪 | VDD | 0x69 |

### 典型电路 (SPI 模式)

```
         3.3V
           │
      ┌────┴────┐
      │         │
     ┌┴┐       ┌┴┐
     │ │ 100nF │ │ 100nF
     │ │       │ │
     └┬┘       └┬┘
      │         │
      │    ┌────┴────┐
      │    │         │
     ┌┴┐  ┌┴┐       ┌┴┐
     │ │  │ │ 10kΩ  │ │ 10kΩ
     │ │  │ │       │ │
     └┬┘  └┬┘       └┬┘
      │    │         │
      ├────┼────┬────┼─── SCK (PB3)
      │    │    │    │
      │   GND  │    ├─── MOSI (PB5)
      │         │    │
      │        GND   ├─── MISO (PB4)
      │              │
     ┌┴────────────────┴┐
     │     BMI088      │
     │  (Accel + Gyro) │
     │                 │
     │ ACC CSB → PA4   │
     │ GYRO CSB → PA3  │
     │ ACC INT1 → PA0  │
     │ GYRO INT1 → PA1 │
     │ GYRO PS → GND   │ (SPI 模式)
     └─────────────────┘
```

**设计要点:**
1. **独立去耦:** 加速度计和陀螺仪各需 100nF 去耦电容
2. **SPI 速度:** 加速度计支持 10MHz，陀螺仪支持 10MHz
3. **PCB 布局:** 
   - 两芯片尽量靠近放置
   - 远离振动源和热源
   - 对称布局减少机械应力
4. **接地:** 底部焊盘必须良好接地

---

## 💻 软件驱动 (STM32 HAL - SPI 模式)

### 寄存器定义

```c
#ifndef __BMI088_H
#define __BMI088_H

#include "main.h"

// BMI088 寄存器 (加速度计)
#define BMI088_ACCEL_CHIPID     0x00
#define BMI088_ACCEL_PWR_CNTRL  0x7D
#define BMI088_ACCEL_CONF       0x73
#define BMI088_ACCEL_RANGE      0x74
#define BMI088_ACCEL_XOUT_L     0x12
#define BMI088_ACCEL_TEMP       0x22

// BMI088 寄存器 (陀螺仪)
#define BMI088_GYRO_CHIPID      0x0F
#define BMI088_GYRO_PWR_CNTRL   0x11
#define BMI088_GYRO_RANGE       0x0F
#define BMI088_GYRO_XOUT_L      0x02
#define BMI088_GYRO_TEMP        0x20

// 芯片 ID
#define BMI088_ACCEL_CHIPID_VAL 0x1E
#define BMI088_GYRO_CHIPID_VAL  0x0F

// 加速度计量程
typedef enum {
    BMI088_ACCEL_RANGE_3G  = 0x00,  // ±3g
    BMI088_ACCEL_RANGE_6G  = 0x01,  // ±6g
    BMI088_ACCEL_RANGE_12G = 0x02,  // ±12g
    BMI088_ACCEL_RANGE_24G = 0x03   // ±24g
} BMI088_AccelRange_t;

// 陀螺仪量程
typedef enum {
    BMI088_GYRO_RANGE_2000  = 0x00,  // ±2000°/s
    BMI088_GYRO_RANGE_1000  = 0x01,  // ±1000°/s
    BMI088_GYRO_RANGE_500   = 0x02,  // ±500°/s
    BMI088_GYRO_RANGE_250   = 0x03,  // ±250°/s
    BMI088_GYRO_RANGE_125   = 0x04   // ±125°/s
} BMI088_GyroRange_t;

// 数据输出结构
typedef struct {
    float accel_x, accel_y, accel_z;    // g
    float gyro_x, gyro_y, gyro_z;       // °/s
    float temperature;                   // °C
} BMI088_Data_t;

// 句柄结构
typedef struct {
    SPI_HandleTypeDef *hspi;
    GPIO_TypeDef *accel_cs_port;
    uint16_t accel_cs_pin;
    GPIO_TypeDef *gyro_cs_port;
    uint16_t gyro_cs_pin;
    BMI088_AccelRange_t accel_range;
    BMI088_GyroRange_t gyro_range;
    float accel_scale;
    float gyro_scale;
} BMI088_Handle_t;

#endif
```

### SPI 读写函数

```c
/**
 * @brief BMI088 SPI 写寄存器
 * @param handle: 句柄
 * @param is_accel: 1=加速度计，0=陀螺仪
 * @param reg: 寄存器地址
 * @param data: 数据
 * @param len: 长度
 */
void BMI088_SPI_Write(BMI088_Handle_t *handle, uint8_t is_accel,
                       uint8_t reg, uint8_t *data, uint16_t len) {
    GPIO_TypeDef *cs_port = is_accel ? handle->accel_cs_port : handle->gyro_cs_port;
    uint16_t cs_pin = is_accel ? handle->accel_cs_pin : handle->gyro_cs_pin;
    
    uint8_t tx_buf[256];
    tx_buf[0] = reg | 0x80;  // 写操作 bit7=1
    memcpy(&tx_buf[1], data, len);
    
    HAL_GPIO_WritePin(cs_port, cs_pin, GPIO_PIN_RESET);
    HAL_SPI_Transmit(handle->hspi, tx_buf, len + 1, 100);
    HAL_GPIO_WritePin(cs_port, cs_pin, GPIO_PIN_SET);
}

/**
 * @brief BMI088 SPI 读寄存器
 * @param handle: 句柄
 * @param is_accel: 1=加速度计，0=陀螺仪
 * @param reg: 寄存器地址
 * @param data: 数据缓冲区
 * @param len: 长度
 */
void BMI088_SPI_Read(BMI088_Handle_t *handle, uint8_t is_accel,
                      uint8_t reg, uint8_t *data, uint16_t len) {
    GPIO_TypeDef *cs_port = is_accel ? handle->accel_cs_port : handle->gyro_cs_port;
    uint16_t cs_pin = is_accel ? handle->accel_cs_pin : handle->gyro_cs_pin;
    
    uint8_t tx_buf = reg & 0x7F;  // 读操作 bit7=0
    
    HAL_GPIO_WritePin(cs_port, cs_pin, GPIO_PIN_RESET);
    HAL_SPI_TransmitReceive(handle->hspi, &tx_buf, data, len + 1, 100);
    HAL_GPIO_WritePin(cs_port, cs_pin, GPIO_PIN_SET);
}
```

### 初始化函数

```c
/**
 * @brief BMI088 初始化
 * @param handle: 句柄
 * @param hspi: SPI 句柄
 * @param accel_cs_port: 加速度计 CS 端口
 * @param accel_cs_pin: 加速度计 CS 引脚
 * @param gyro_cs_port: 陀螺仪 CS 端口
 * @param gyro_cs_pin: 陀螺仪 CS 引脚
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef BMI088_Init(BMI088_Handle_t *handle,
                               SPI_HandleTypeDef *hspi,
                               GPIO_TypeDef *accel_cs_port, uint16_t accel_cs_pin,
                               GPIO_TypeDef *gyro_cs_port, uint16_t gyro_cs_pin) {
    uint8_t chip_id = 0;
    uint8_t temp = 0;
    
    handle->hspi = hspi;
    handle->accel_cs_port = accel_cs_port;
    handle->accel_cs_pin = accel_cs_pin;
    handle->gyro_cs_port = gyro_cs_port;
    handle->gyro_cs_pin = gyro_cs_pin;
    
    // 初始化 CS 引脚
    HAL_GPIO_WritePin(accel_cs_port, accel_cs_pin, GPIO_PIN_SET);
    HAL_GPIO_WritePin(gyro_cs_port, gyro_cs_pin, GPIO_PIN_SET);
    HAL_Delay(10);
    
    // ========== 加速度计初始化 ==========
    
    // 1. 读取加速度计芯片 ID
    BMI088_SPI_Read(handle, 1, BMI088_ACCEL_CHIPID, &chip_id, 1);
    if (chip_id != BMI088_ACCEL_CHIPID_VAL) {
        return HAL_ERROR;
    }
    
    // 2. 软复位
    temp = 0xB6;
    BMI088_SPI_Write(handle, 1, 0x7E, &temp, 1);
    HAL_Delay(10);
    
    // 3. 使能加速度计
    temp = 0x04;  // BIT_ACCEL_EN
    BMI088_SPI_Write(handle, 1, BMI088_ACCEL_PWR_CNTRL, &temp, 1);
    HAL_Delay(10);
    
    // 4. 配置量程 (±6g) 和带宽 (125Hz)
    handle->accel_range = BMI088_ACCEL_RANGE_6G;
    handle->accel_scale = 5461.0f;  // LSB/g
    temp = 0x03;  // ±6g, ODR 200Hz
    BMI088_SPI_Write(handle, 1, BMI088_ACCEL_RANGE, &temp, 1);
    
    temp = 0x02;  // 带宽 125Hz
    BMI088_SPI_Write(handle, 1, BMI088_ACCEL_CONF, &temp, 1);
    
    // ========== 陀螺仪初始化 ==========
    
    // 1. 读取陀螺仪芯片 ID
    BMI088_SPI_Read(handle, 0, BMI088_GYRO_CHIPID, &chip_id, 1);
    if (chip_id != BMI088_GYRO_CHIPID_VAL) {
        return HAL_ERROR;
    }
    
    // 2. 使能陀螺仪
    temp = 0x80;  // BIT_GYRO_EN
    BMI088_SPI_Write(handle, 0, BMI088_GYRO_PWR_CNTRL, &temp, 1);
    HAL_Delay(30);  // 陀螺仪启动需要 30ms
    
    // 3. 配置量程 (±500°/s) 和带宽 (230Hz)
    handle->gyro_range = BMI088_GYRO_RANGE_500;
    handle->gyro_scale = 65.6f;  // LSB/°/s
    temp = 0x02;  // ±500°/s
    BMI088_SPI_Write(handle, 0, BMI088_GYRO_RANGE, &temp, 1);
    
    temp = 0xA4;  // 带宽 230Hz, ODR 400Hz
    BMI088_SPI_Write(handle, 0, 0x10, &temp, 1);
    
    return HAL_OK;
}
```

### 数据读取函数

```c
/**
 * @brief 读取 BMI088 6 轴数据
 * @param handle: 句柄
 * @param data: 数据输出
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef BMI088_ReadData(BMI088_Handle_t *handle, BMI088_Data_t *data) {
    uint8_t buffer[6];
    
    // ========== 读取加速度计 ==========
    BMI088_SPI_Read(handle, 1, BMI088_ACCEL_XOUT_L, buffer, 6);
    
    int16_t ax = (int16_t)((buffer[1] << 8) | buffer[0]);
    int16_t ay = (int16_t)((buffer[3] << 8) | buffer[2]);
    int16_t az = (int16_t)((buffer[5] << 8) | buffer[4]);
    
    data->accel_x = ax / handle->accel_scale;
    data->accel_y = ay / handle->accel_scale;
    data->accel_z = az / handle->accel_scale;
    
    // 读取温度
    BMI088_SPI_Read(handle, 1, BMI088_ACCEL_TEMP, buffer, 2);
    int16_t temp_raw = (int16_t)((buffer[1] << 8) | buffer[0]);
    data->temperature = temp_raw / 512.0f + 23.0f;
    
    // ========== 读取陀螺仪 ==========
    BMI088_SPI_Read(handle, 0, BMI088_GYRO_XOUT_L, buffer, 6);
    
    int16_t gx = (int16_t)((buffer[1] << 8) | buffer[0]);
    int16_t gy = (int16_t)((buffer[3] << 8) | buffer[2]);
    int16_t gz = (int16_t)((buffer[5] << 8) | buffer[4]);
    
    data->gyro_x = gx / handle->gyro_scale;
    data->gyro_y = gy / handle->gyro_scale;
    data->gyro_z = gz / handle->gyro_scale;
    
    return HAL_OK;
}
```

---

## ⚡ 低功耗设计

### 功耗模式

| 模式 | 加速度计 | 陀螺仪 | 总电流 |
|------|----------|--------|--------|
| 睡眠 | 关 (2μA) | 关 (7μA) | 9μA |
| 待机 | 挂起 | 睡眠 | 60μA |
| 正常 | 160μA | 2mA | 2.16mA |
| 高性能 | 220μA | 3mA | 3.22mA |

### 低功耗配置

```c
/**
 * @brief 进入睡眠模式
 */
void BMI088_EnterSleep(BMI088_Handle_t *handle) {
    uint8_t temp;
    
    // 关闭加速度计
    temp = 0x00;
    BMI088_SPI_Write(handle, 1, BMI088_ACCEL_PWR_CNTRL, &temp, 1);
    
    // 关闭陀螺仪
    temp = 0x00;
    BMI088_SPI_Write(handle, 0, BMI088_GYRO_PWR_CNTRL, &temp, 1);
}

/**
 * @brief 配置加速度计低功耗模式
 * @param handle: 句柄
 * @param odr: 输出数据率 (1-1600Hz)
 */
void BMI088_SetAccelLowPower(BMI088_Handle_t *handle, uint8_t odr) {
    uint8_t config = 0;
    
    // 根据 ODR 配置带宽和功耗模式
    if (odr <= 12) config = 0x00;       // 12.5Hz
    else if (odr <= 25) config = 0x01;  // 25Hz
    else if (odr <= 50) config = 0x02;  // 50Hz
    else if (odr <= 100) config = 0x03; // 100Hz
    else if (odr <= 200) config = 0x04; // 200Hz
    else if (odr <= 400) config = 0x05; // 400Hz
    else config = 0x06;                  // 800Hz
    
    BMI088_SPI_Write(handle, 1, BMI088_ACCEL_CONF, &config, 1);
}
```

---

## 🔧 调试技巧

### 常见问题

| 问题 | 解决方案 |
|------|----------|
| 加速度计无响应 | 检查 CS 引脚，确认 SPI 时序 |
| 陀螺仪数据漂移 | 增加预热时间，校准零偏 |
| 噪声过大 | 降低带宽，检查电源噪声 |
| 温度异常 | 确认温度补偿公式正确 |

### 快速测试

```c
void BMI088_QuickTest(BMI088_Handle_t *handle) {
    BMI088_Data_t data;
    
    printf("=== BMI088 6-Axis Test ===\r\n");
    
    for (int i = 0; i < 10; i++) {
        if (BMI088_ReadData(handle, &data) == HAL_OK) {
            printf("Accel: %.3f, %.3f, %.3f g | ",
                   data.accel_x, data.accel_y, data.accel_z);
            printf("Gyro: %.2f, %.2f, %.2f °/s | ",
                   data.gyro_x, data.gyro_y, data.gyro_z);
            printf("Temp: %.1f °C\r\n", data.temperature);
        }
        HAL_Delay(100);
    }
}
```

---

## 🔗 相关链接

- [[MPU6050-6 轴 IMU]] - 经典集成方案
- [[ICM20948-9 轴 IMU]] - 9 轴方案
- [[BNO055-智能 IMU]] - 内置融合算法
- [[传感器融合与卡尔曼滤波]] - 姿态解算

---

*文档创建：2026-03-11 | 维护者：XinSor EE Team*
