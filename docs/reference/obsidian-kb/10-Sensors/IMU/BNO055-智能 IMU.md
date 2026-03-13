# BNO055 智能 IMU 传感器

> **一句话描述:** Bosch 智能 9 轴 IMU，内置传感器融合算法，直接输出四元数/欧拉角，免校准开箱即用  
> **标签:** `#sensor/imu` `#sensor/accelerometer` `#sensor/gyroscope` `#sensor/magnetometer` `#protocol/i2c` `#protocol/uart` `#vendor/bosch` `#app/robotics`  
> **状态:** ✅ 完成  
> **最后更新:** 2026-03-11

---

## 🎯 概述

**BNO055** 是 Bosch Sensortec 的智能 9 轴 IMU 传感器，最大特点是内置了传感器融合算法 (基于 Bosch 专利的 Sensor Fusion 技术)，可以直接输出融合后的姿态数据 (四元数、欧拉角)，无需 MCU 进行复杂的计算。

**核心特性:**
- ✨ **智能融合:** 内置 ARM Cortex-M0 处理器，运行传感器融合算法
- ✨ **直接输出:** 四元数、欧拉角、重力矢量、线性加速度
- ✨ **免校准:** 出厂校准，支持自校准
- ✨ **9 轴集成:** 加速度计 + 陀螺仪 + 磁力计
- ✨ **双接口:** I2C (400kHz) 或 UART (115200bps)
- ✨ **多模式:** 9 种工作模式可选 (IMU/MFG/NDT/IMU+/COMPASS/M4G/AMG/DOF)

**典型应用:** 机器人导航、VR/AR 设备、无人机姿态控制、智能穿戴、平衡车、相机云台

---

## 📊 技术规格

### 电气参数

| 参数 | 最小值 | 典型值 | 最大值 | 单位 |
|------|--------|--------|--------|------|
| 供电电压 VDD | 2.4 | 3.3 | 3.6 | V |
| VDDIO | 1.71 | 3.3 | 3.6 | V |
| 工作电流 (IMU) | - | 3.5 | 5 | mA |
| 工作电流 (NDOF) | - | 6.5 | 10 | mA |
| 睡眠模式电流 | - | 2 | 10 | μA |
| 工作温度 | -40 | 25 | 85 | °C |

### 加速度计规格

| 参数 | 值 | 单位 | 说明 |
|------|-----|------|------|
| 量程 | ±2/±4/±8/±16 | g | 可编程 |
| 分辨率 | 16 | bit | - |
| 带宽 | 7.81-250 | Hz | 可配置 |
| 噪声密度 | 150 | μg/√Hz | 典型值 |

### 陀螺仪规格

| 参数 | 值 | 单位 | 说明 |
|------|-----|------|------|
| 量程 | ±250/±500/±1000/±2000 | °/s | 可编程 |
| 分辨率 | 16 | bit | - |
| 带宽 | 12-230 | Hz | 可配置 |
| 零偏稳定性 | 0.03 | °/s | 典型值 |

### 磁力计规格

| 参数 | 值 | 单位 | 说明 |
|------|-----|------|------|
| 量程 | ±1300 | μT | 固定 (X/Y), ±2500 μT (Z) |
| 分辨率 | 16 | bit | - |
| 采样率 | 25 | Hz | 固定 |

### 姿态输出规格

| 参数 | 值 | 单位 | 说明 |
|------|-----|------|------|
| 四元数分辨率 | 16384 | LSB/W | 4 元数输出 |
| 欧拉角分辨率 | 16 | LSB/° | 航向/俯仰/横滚 |
| 欧拉角范围 | ±180 | ° | 航向 (Yaw) |
| 俯仰角范围 | ±90 | ° | Pitch |
| 横滚角范围 | ±180 | ° | Roll |

### 封装信息

| 参数 | 值 |
|------|-----|
| 封装类型 | LGA |
| 尺寸 | 5.2 × 5.2 × 1.9 mm |
| 引脚数 | 12 |

---

## 🔌 硬件设计

### 引脚定义

```
        BNO055 顶视图
        
    1  2  3  4  5  6
    ○ ○ ○ ○ ○ ○
    
    12 11 10 9  8  7
    ○  ○  ○  ○  ○  ○
```

| 引脚 | 名称 | 类型 | 功能描述 |
|------|------|------|----------|
| 1 | VDD | P | 电源 (2.4V-3.6V) |
| 2 | GND | P | 电源地 |
| 3 | PS0 | I | 协议选择 0 |
| 4 | PS1 | I | 协议选择 1 |
| 5 | INT | O | 中断输出 |
| 6 | ADR/COM3 | I/O | I2C 地址选择 / UART TX |
| 7 | GND | P | 电源地 |
| 8 | GND | P | 电源地 |
| 9 | SCL/COM2 | I | I2C 时钟 / UART RX |
| 10 | SDA/COM1 | I/O | I2C 数据 / UART TX |
| 11 | RST | I | 复位 (低有效) |
| 12 | VDDIO | P | 数字 I/O 电源 |

### 接口选择 (PS0/PS1)

| PS1 | PS0 | 接口 | 说明 |
|-----|-----|------|------|
| 0 | 0 | I2C | 默认模式 |
| 0 | 1 | UART | 串口模式 |
| 1 | 0 | I2C | 备用模式 |
| 1 | 1 | 保留 | 不使用 |

### I2C 地址选择

| ADR 引脚 | I2C 地址 |
|----------|----------|
| GND | 0x28 |
| VDD | 0x29 |

### 典型电路 (I2C 模式)

```
         3.3V
           │
      ┌────┴────┐
      │         │
     ┌┴┐       ┌┴┐
     │ │ 1μF   │ │ 4.7kΩ
     │ │       │ │ (上拉)
     └┬┘       └┬┘
      │         │
      ├────┬────┼─── SCL (PB6)
      │    │    │
      │   GND   ├─── SDA (PB7)
      │         │
     ┌┴───────────┴┐
     │    BNO055   │
     │             │
     │ PS0 → GND   │  (I2C 模式)
     │ PS1 → GND   │
     │ ADR → GND   │  (地址 0x28)
     │ INT → PA0   │  (中断)
     │ RST → PA1   │  (复位)
     └─────────────┘
```

**设计要点:**
1. **去耦电容:** 1μF 陶瓷电容，尽量靠近 VDD 引脚
2. **I2C 上拉:** 4.7kΩ (3.3V 系统)
3. **PS 引脚:** 必须正确配置选择接口模式
4. **RST 引脚:** 建议接 MCU GPIO，便于软复位
5. **PCB 布局:** 
   - 远离磁场干扰源
   - 底部焊盘良好接地
   - 避免机械应力

---

## 💻 软件驱动 (STM32 HAL - I2C 模式)

### 寄存器定义

```c
#ifndef __BNO055_H
#define __BNO055_H

#include "main.h"

// BNO055 I2C 地址
#define BNO055_ADDR_0   0x28
#define BNO055_ADDR_1   0x29

// 页面 0 寄存器
#define BNO055_PAGE_ID          0x07
#define BNO055_CHIP_ID          0x00
#define BNO055_ACCEL_REV_ID     0x01
#define BNO055_MAG_REV_ID       0x02
#define BNO055_GYRO_REV_ID      0x03
#define BNO055_SW_REV_ID_LSB    0x04
#define BNO055_SW_REV_ID_MSB    0x05
#define BNO055_BL_REV_ID        0x06
#define BNO055_PWR_MODE         0x3E
#define BNO055_OPR_MODE         0x3D
#define BNO055_SYS_TRIGGER      0x3F
#define BNO055_SYS_STATUS       0x39
#define BNO055_SYS_ERR          0x3A
#define BNO055_UNIT_SEL         0x3B
#define BNO055_DATA_SELECT      0x3C

// 输出数据寄存器
#define BNO055_ACCEL_DATA_X_LSB 0x08
#define BNO055_MAG_DATA_X_LSB   0x0E
#define BNO055_GYRO_DATA_X_LSB  0x14
#define BNO055_EULER_H_LSB      0x1A
#define BNO055_QUATERNION_W_LSB 0x20
#define BNO055_LINEAR_ACCEL_X   0x28
#define BNO055_GRAVITY_X_LSB    0x2E

// 校准寄存器
#define BNO055_CALIB_STAT       0x35
#define BNO055_ACCEL_OFFSET_X   0x55
#define BNO055_MAG_OFFSET_X     0x5B
#define BNO055_GYRO_OFFSET_X    0x61
#define BNO055_ACCEL_RADIUS     0x67
#define BNO055_MAG_RADIUS       0x69

// 工作模式
#define BNO055_OPR_MODE_CONFIG      0x00
#define BNO055_OPR_MODE_ACCONLY     0x01
#define BNO055_OPR_MODE_MAGONLY     0x02
#define BNO055_OPR_MODE_GYROONLY    0x03
#define BNO055_OPR_MODE_ACCMAG      0x04
#define BNO055_OPR_MODE_ACCGYRO     0x05
#define BNO055_OPR_MODE_MAGGYRO     0x06
#define BNO055_OPR_MODE_AMG         0x07
#define BNO055_OPR_MODE_IMUPLUS     0x08
#define BNO055_OPR_MODE_COMPASS     0x09
#define BNO055_OPR_MODE_M4G         0x0A
#define BNO055_OPR_MODE_NDOF_FMC_OFF 0x0B
#define BNO055_OPR_MODE_NDOF        0x0C

// 电源模式
#define BNO055_PWR_MODE_NORMAL  0x00
#define BNO055_PWR_MODE_LOW     0x01
#define BNO055_PWR_MODE_SUSPEND 0x02

// 单位选择
#define BNO055_UNIT_SEL_ORI_WINDOWS   (1 << 7)
#define BNO055_UNIT_SEL_ORI_ANDROID   (0 << 7)
#define BNO055_UNIT_SEL_DATA_FRAMES   (1 << 6)
#define BNO055_UNIT_SEL_EULER_DEG     (0 << 5)
#define BNO055_UNIT_SEL_TEMP_C        (0 << 4)
#define BNO055_UNIT_SEL_EULER_RAD     (1 << 5)
#define BNO055_UNIT_SEL_TEMP_F        (1 << 4)

// 芯片 ID
#define BNO055_CHIP_ID_VALUE  0xA0

// 四元数结构
typedef struct {
    int16_t w, x, y, z;
} BNO055_Quaternion_t;

// 欧拉角结构 (度)
typedef struct {
    float heading;    // Yaw (Z 轴), -180~+180
    float roll;       // Roll (X 轴), -180~+180
    float pitch;      // Pitch (Y 轴), -90~+90
} BNO055_Euler_t;

// 校准状态结构
typedef struct {
    uint8_t system;   // 0-3, 3=完全校准
    uint8_t gyro;     // 0-3
    uint8_t accel;    // 0-3
    uint8_t mag;      // 0-3
} BNO055_CalibStat_t;

// 数据输出结构
typedef struct {
    // 原始数据
    float accel_x, accel_y, accel_z;    // m/s²
    float gyro_x, gyro_y, gyro_z;       // rad/s
    float mag_x, mag_y, mag_z;          // μT
    
    // 融合数据
    BNO055_Euler_t euler;
    BNO055_Quaternion_t quaternion;
    float linear_accel_x, linear_accel_y, linear_accel_z;  // m/s²
    float gravity_x, gravity_y, gravity_z;                  // m/s²
    
    // 校准状态
    BNO055_CalibStat_t calib;
    
    // 温度
    int8_t temperature;
} BNO055_Data_t;

// 句柄结构
typedef struct {
    I2C_HandleTypeDef *hi2c;
    uint8_t address;
    uint8_t operation_mode;
} BNO055_Handle_t;

#endif
```

### 初始化函数

```c
/**
 * @brief BNO055 初始化
 * @param handle: 句柄
 * @param hi2c: I2C 句柄
 * @param address: I2C 地址
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef BNO055_Init(BNO055_Handle_t *handle,
                               I2C_HandleTypeDef *hi2c,
                               uint8_t address) {
    uint8_t chip_id = 0;
    uint8_t temp = 0;
    
    handle->hi2c = hi2c;
    handle->address = address;
    
    // 1. 读取芯片 ID
    HAL_I2C_Mem_Read(hi2c, address << 1, BNO055_CHIP_ID,
                     I2C_MEMADD_SIZE_8BIT, &chip_id, 1, 100);
    
    if (chip_id != BNO055_CHIP_ID_VALUE) {
        return HAL_ERROR;
    }
    
    // 2. 软复位
    temp = 0x20;  // BIT_SYS_RST
    HAL_I2C_Mem_Write(hi2c, address << 1, BNO055_SYS_TRIGGER,
                      I2C_MEMADD_SIZE_8BIT, &temp, 1, 100);
    HAL_Delay(650);  // 复位需要 650ms
    
    // 3. 切换到配置模式
    temp = BNO055_OPR_MODE_CONFIG;
    HAL_I2C_Mem_Write(hi2c, address << 1, BNO055_OPR_MODE,
                      I2C_MEMADD_SIZE_8BIT, &temp, 1, 100);
    HAL_Delay(25);
    
    // 4. 使用外部晶振 (如果有)
    // temp = 0x80;  // BIT_CLK_SRC
    // HAL_I2C_Mem_Write(hi2c, address << 1, BNO055_SYS_TRIGGER,
    //                   I2C_MEMADD_SIZE_8BIT, &temp, 1, 100);
    
    // 5. 配置单位 (欧拉角：度，温度：摄氏度)
    temp = BNO055_UNIT_SEL_EULER_DEG | BNO055_UNIT_SEL_TEMP_C;
    HAL_I2C_Mem_Write(hi2c, address << 1, BNO055_UNIT_SEL,
                      I2C_MEMADD_SIZE_8BIT, &temp, 1, 100);
    
    // 6. 切换到 NDOF 模式 (9 轴融合)
    temp = BNO055_OPR_MODE_NDOF;
    HAL_I2C_Mem_Write(hi2c, address << 1, BNO055_OPR_MODE,
                      I2C_MEMADD_SIZE_8BIT, &temp, 1, 100);
    HAL_Delay(25);
    
    handle->operation_mode = BNO055_OPR_MODE_NDOF;
    
    return HAL_OK;
}
```

### 读取欧拉角

```c
/**
 * @brief 读取欧拉角 (航向/横滚/俯仰)
 * @param handle: 句柄
 * @param euler: 欧拉角输出
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef BNO055_ReadEuler(BNO055_Handle_t *handle,
                                    BNO055_Euler_t *euler) {
    uint8_t buffer[6];
    
    HAL_I2C_Mem_Read(handle->hi2c, handle->address << 1,
                     BNO055_EULER_H_LSB,
                     I2C_MEMADD_SIZE_8BIT, buffer, 6, 100);
    
    // 解析航向 (Heading/Yaw)
    int16_t h = (int16_t)((buffer[1] << 8) | buffer[0]);
    euler->heading = h / 16.0f;  // 转换为度
    
    // 解析横滚 (Roll)
    int16_t r = (int16_t)((buffer[3] << 8) | buffer[2]);
    euler->roll = r / 16.0f;
    
    // 解析俯仰 (Pitch)
    int16_t p = (int16_t)((buffer[5] << 8) | buffer[4]);
    euler->pitch = p / 16.0f;
    
    return HAL_OK;
}
```

### 读取四元数

```c
/**
 * @brief 读取四元数
 * @param handle: 句柄
 * @param quat: 四元数输出
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef BNO055_ReadQuaternion(BNO055_Handle_t *handle,
                                         BNO055_Quaternion_t *quat) {
    uint8_t buffer[8];
    
    HAL_I2C_Mem_Read(handle->hi2c, handle->address << 1,
                     BNO055_QUATERNION_W_LSB,
                     I2C_MEMADD_SIZE_8BIT, buffer, 8, 100);
    
    quat->w = (int16_t)((buffer[1] << 8) | buffer[0]);
    quat->x = (int16_t)((buffer[3] << 8) | buffer[2]);
    quat->y = (int16_t)((buffer[5] << 8) | buffer[4]);
    quat->z = (int16_t)((buffer[7] << 8) | buffer[6]);
    
    // 归一化 (可选)
    float norm = sqrtf(quat->w * quat->w + 
                       quat->x * quat->x + 
                       quat->y * quat->y + 
                       quat->z * quat->z);
    if (norm > 0) {
        quat->w = (int16_t)(quat->w / norm);
        quat->x = (int16_t)(quat->x / norm);
        quat->y = (int16_t)(quat->y / norm);
        quat->z = (int16_t)(quat->z / norm);
    }
    
    return HAL_OK;
}
```

### 读取校准状态

```c
/**
 * @brief 读取校准状态
 * @param handle: 句柄
 * @param calib: 校准状态输出
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef BNO055_ReadCalibStatus(BNO055_Handle_t *handle,
                                          BNO055_CalibStat_t *calib) {
    uint8_t calib_data = 0;
    
    HAL_I2C_Mem_Read(handle->hi2c, handle->address << 1,
                     BNO055_CALIB_STAT,
                     I2C_MEMADD_SIZE_8BIT, &calib_data, 1, 100);
    
    calib->system = (calib_data >> 6) & 0x03;
    calib->gyro = (calib_data >> 4) & 0x03;
    calib->accel = (calib_data >> 2) & 0x03;
    calib->mag = calib_data & 0x03;
    
    return HAL_OK;
}
```

### 完整数据读取

```c
/**
 * @brief 读取所有传感器数据
 * @param handle: 句柄
 * @param data: 数据输出
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef BNO055_ReadAllData(BNO055_Handle_t *handle,
                                      BNO055_Data_t *data) {
    uint8_t buffer[22];
    
    // 读取加速度计 (6 字节)
    HAL_I2C_Mem_Read(handle->hi2c, handle->address << 1,
                     BNO055_ACCEL_DATA_X_LSB,
                     I2C_MEMADD_SIZE_8BIT, buffer, 6, 100);
    data->accel_x = ((int16_t)((buffer[1] << 8) | buffer[0])) / 100.0f;
    data->accel_y = ((int16_t)((buffer[3] << 8) | buffer[2])) / 100.0f;
    data->accel_z = ((int16_t)((buffer[5] << 8) | buffer[4])) / 100.0f;
    
    // 读取磁力计 (6 字节)
    HAL_I2C_Mem_Read(handle->hi2c, handle->address << 1,
                     BNO055_MAG_DATA_X_LSB,
                     I2C_MEMADD_SIZE_8BIT, buffer, 6, 100);
    data->mag_x = ((int16_t)((buffer[1] << 8) | buffer[0])) / 16.0f;
    data->mag_y = ((int16_t)((buffer[3] << 8) | buffer[2])) / 16.0f;
    data->mag_z = ((int16_t)((buffer[5] << 8) | buffer[4])) / 16.0f;
    
    // 读取陀螺仪 (6 字节)
    HAL_I2C_Mem_Read(handle->hi2c, handle->address << 1,
                     BNO055_GYRO_DATA_X_LSB,
                     I2C_MEMADD_SIZE_8BIT, buffer, 6, 100);
    data->gyro_x = ((int16_t)((buffer[1] << 8) | buffer[0])) / 16.0f;
    data->gyro_y = ((int16_t)((buffer[3] << 8) | buffer[2])) / 16.0f;
    data->gyro_z = ((int16_t)((buffer[5] << 8) | buffer[4])) / 16.0f;
    
    // 读取欧拉角
    BNO055_ReadEuler(handle, &data->euler);
    
    // 读取四元数
    BNO055_ReadQuaternion(handle, &data->quaternion);
    
    // 读取校准状态
    BNO055_ReadCalibStatus(handle, &data->calib);
    
    // 读取温度
    HAL_I2C_Mem_Read(handle->hi2c, handle->address << 1,
                     0x34, I2C_MEMADD_SIZE_8BIT,
                     (uint8_t*)&data->temperature, 1, 100);
    
    return HAL_OK;
}
```

---

## ⚡ 工作模式详解

### 9 种工作模式

| 模式 | 传感器 | 输出 | 电流 | 应用 |
|------|--------|------|------|------|
| CONFIG | 无 | 无 | - | 配置模式 |
| ACCONLY | 加速度计 | 原始数据 | 3.5mA | 计步器 |
| MAGONLY | 磁力计 | 原始数据 | 3.5mA | 电子罗盘 |
| GYROONLY | 陀螺仪 | 原始数据 | 4.5mA | 角速度检测 |
| ACCMAG | 加速度计 + 磁力计 | 2 轴姿态 | 4.0mA | 简单罗盘 |
| ACCGYRO | 加速度计 + 陀螺仪 | 2 轴姿态 | 5.0mA | IMU+ |
| MAGGYRO | 磁力计 + 陀螺仪 | 2 轴姿态 | 5.0mA | M4G |
| AMG | 3 轴全开 | 原始数据 | 5.5mA | 数据采集 |
| IMUPLUS | 加速度计 + 陀螺仪 | 融合姿态 | 5.0mA | 快速启动 |
| COMPASS | 加速度计 + 磁力计 | 融合航向 | 4.0mA | 电子罗盘 |
| M4G | 加速度计 + 磁力计 + 陀螺仪 | 融合姿态 (无陀螺漂移) | 5.0mA | 4 轴融合 |
| NDOF_FMC_OFF | 9 轴 | 融合姿态 (无磁场校准) | 6.0mA | 快速 9 轴 |
| NDOF | 9 轴 | 融合姿态 (完全校准) | 6.5mA | 完整 9 轴 |

### 模式切换代码

```c
/**
 * @brief 切换工作模式
 * @param handle: 句柄
 * @param mode: 目标模式
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef BNO055_SetMode(BNO055_Handle_t *handle, uint8_t mode) {
    // 先切换到配置模式
    uint8_t config = BNO055_OPR_MODE_CONFIG;
    HAL_I2C_Mem_Write(handle->hi2c, handle->address << 1,
                      BNO055_OPR_MODE, I2C_MEMADD_SIZE_8BIT,
                      &config, 1, 100);
    HAL_Delay(25);
    
    // 切换到目标模式
    HAL_I2C_Mem_Write(handle->hi2c, handle->address << 1,
                      BNO055_OPR_MODE, I2C_MEMADD_SIZE_8BIT,
                      &mode, 1, 100);
    HAL_Delay(25);
    
    handle->operation_mode = mode;
    return HAL_OK;
}

/**
 * @brief 进入低功耗模式
 */
HAL_StatusTypeDef BNO055_EnterLowPower(BNO055_Handle_t *handle) {
    // 切换到配置模式
    BNO055_SetMode(handle, BNO055_OPR_MODE_CONFIG);
    
    // 进入睡眠模式
    uint8_t sleep = BNO055_PWR_MODE_SUSPEND;
    return HAL_I2C_Mem_Write(handle->hi2c, handle->address << 1,
                              BNO055_PWR_MODE,
                              I2C_MEMADD_SIZE_8BIT, &sleep, 1, 100);
}
```

---

## 🔧 调试技巧

### 校准流程

BNO055 支持自校准，校准状态分 4 级 (0-3):

| 等级 | 说明 |
|------|------|
| 0 | 未校准 |
| 1 | 部分校准 |
| 2 | 基本校准 |
| 3 | 完全校准 |

**校准方法:**
1. **加速度计:** 静止放置，6 个面朝下各保持几秒
2. **磁力计:** 在空中画"8"字
3. **陀螺仪:** 静止放置即可自动校准

```c
/**
 * @brief 等待完全校准
 * @param handle: 句柄
 * @param timeout_ms: 超时时间
 * @return 0=成功，1=超时
 */
uint8_t BNO055_WaitCalibration(BNO055_Handle_t *handle, uint32_t timeout_ms) {
    BNO055_CalibStat_t calib;
    uint32_t start = HAL_GetTicks();
    
    printf("开始校准，请按要求移动传感器...\r\n");
    
    while ((HAL_GetTicks() - start) < timeout_ms) {
        BNO055_ReadCalibStatus(handle, &calib);
        
        printf("校准状态：Sys=%d, Gyro=%d, Accel=%d, Mag=%d\r\n",
               calib.system, calib.gyro, calib.accel, calib.mag);
        
        if (calib.system == 3 && calib.gyro == 3 && 
            calib.accel == 3 && calib.mag == 3) {
            printf("校准完成!\r\n");
            return 0;
        }
        
        HAL_Delay(1000);
    }
    
    printf("校准超时!\r\n");
    return 1;
}
```

### 常见问题

| 问题 | 解决方案 |
|------|----------|
| 芯片 ID 读取失败 | 检查 I2C 地址 (0x28 vs 0x29) |
| 模式切换失败 | 确保先切换到 CONFIG 模式 |
| 欧拉角不变化 | 检查是否处于融合模式 (NDOF/IMUPLUS) |
| 校准状态不提升 | 按要求移动传感器，远离磁场干扰 |

### 快速测试

```c
void BNO055_QuickTest(BNO055_Handle_t *handle) {
    BNO055_Data_t data;
    
    printf("=== BNO055 9-Axis Smart IMU Test ===\r\n");
    
    for (int i = 0; i < 10; i++) {
        if (BNO055_ReadAllData(handle, &data) == HAL_OK) {
            printf("[%d] Euler: H=%.1f R=%.1f P=%.1f deg | ",
                   i, data.euler.heading, data.euler.roll, data.euler.pitch);
            printf("Calib: S=%d G=%d A=%d M=%d\r\n",
                   data.calib.system, data.calib.gyro, 
                   data.calib.accel, data.calib.mag);
        }
        HAL_Delay(100);
    }
}
```

---

## 🔗 相关链接

- [[MPU6050-6 轴 IMU]] - 需软件融合
- [[ICM20948-9 轴 IMU]] - 需软件融合
- [[BMI088-6 轴 IMU]] - 高性能 IMU
- [[传感器融合与卡尔曼滤波]] - 软件融合算法

---

*文档创建：2026-03-11 | 维护者：XinSor EE Team*
