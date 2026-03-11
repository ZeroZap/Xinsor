# MPU6050 6 轴 IMU 传感器

> **一句话描述:** 经典的 6 轴惯性测量单元，集成 3 轴加速度计 +3 轴陀螺仪，I2C 接口，广泛应用于姿态检测和运动追踪  
> **标签:** `#sensor/imu` `#sensor/accelerometer` `#sensor/gyroscope` `#protocol/i2c` `#vendor/invensense` `#mcu/stm32`  
> **状态:** ✅ 完成  
> **最后更新:** 2026-03-11

---

## 🎯 概述

**MPU6050** 是 InvenSense（现 TDK）生产的一款经典 6 轴 IMU 传感器，于 2010 年发布，至今仍是嵌入式系统中最常用的运动传感器之一。

**核心特性:**
- ✨ **6 轴集成:** 3 轴加速度计 + 3 轴陀螺仪单芯片集成
- ✨ **数字输出:** 16 位 ADC 分辨率，I2C 数字接口
- ✨ **嵌入式 DMP:** 内置数字运动处理器，可硬件解算四元数
- ✨ **低功耗:** 睡眠模式仅 5μA 电流
- ✨ **可编程:** 多种量程和输出数据率可选

**典型应用:** 无人机飞控、自平衡车、智能手表、VR 设备、机器人姿态检测、运动手环

---

## 📊 技术规格

### 电气参数

| 参数 | 最小值 | 典型值 | 最大值 | 单位 |
|------|--------|--------|--------|------|
| 供电电压 VDD | 2.375 | 3.3 | 3.46 | V |
| 工作电流 (正常) | - | 3.9 | 4.5 | mA |
| 睡眠模式电流 | - | 0.005 | 0.01 | mA |
| 工作温度 | -40 | 25 | 85 | °C |
| I2C 速度 | - | 400 | 400 | kHz |

### 加速度计规格

| 参数 | 值 | 单位 | 说明 |
|------|-----|------|------|
| 量程 | ±2/±4/±8/±16 | g | 可编程 4 档 |
| 灵敏度 | 16384/8192/4096/2048 | LSB/g | 对应各量程 |
| 分辨率 | 16 | bit | 内置 ADC |
| 零偏稳定性 | ±2 | % | 出厂校准 |
| 噪声密度 | 400 | μg/√Hz | 典型值 |

### 陀螺仪规格

| 参数 | 值 | 单位 | 说明 |
|------|-----|------|------|
| 量程 | ±250/±500/±1000/±2000 | °/s | 可编程 4 档 |
| 灵敏度 | 131.0/65.5/32.8/16.4 | LSB/°/s | 对应各量程 |
| 分辨率 | 16 | bit | 内置 ADC |
| 零偏稳定性 | ±0.1 | °/s | 典型值 |
| 噪声密度 | 0.05 | °/s/√Hz | 典型值 |

### 封装信息

| 参数 | 值 |
|------|-----|
| 封装类型 | QFN |
| 尺寸 | 4.0 × 4.0 × 0.9 mm |
| 引脚数 | 24 |

---

## 🔌 硬件设计

### 引脚定义

```
        MPU6050 顶视图 (QFN-24)
        
    1  2  3  4  5  6
    ○ ○ ○ ○ ○ ○
    
    24 23 22 21 20
    ○  ○  ○  ○  ○
```

**关键引脚:**

| 引脚 | 名称 | 类型 | 功能描述 |
|------|------|------|----------|
| 1 | VDD | P | 电源正极 (3.3V) |
| 2 | GND | P | 电源地 |
| 3 | XCLKA | I | 辅助 I2C 时钟 (可选) |
| 4 | AD0 | I | I2C 地址选择 (0=0x68, 1=0x69) |
| 5 | XDA | I/O | 辅助 I2C 数据 (连接外部磁力计) |
| 6 | SCL | I | I2C 时钟线 |
| 7 | SDA | I/O | I2C 数据线 |
| 8 | VLOGIC | P | 数字 I/O 电源 (1.8V-3.3V) |
| 9 | INT | O | 中断输出 (可配置) |
| 10 | FSYNC | I | 帧同步输入 (可选) |
| 11 | REGOUT | O | 滤波器电容连接 (4.7μF) |
| 12 | VDD | P | 电源正极 |

### 典型电路

```
         3.3V
           │
      ┌────┴────┐
      │         │
     ┌┴┐       ┌┴┐
     │ │ 4.7μF │ │ 100nF
     │ │       │ │ (去耦)
     └┬┘       └┬┘
      │         │
      ├────┬────┼─── SCL (PB6)
      │    │    │     (4.7kΩ上拉)
      │   GND   ├─── SDA (PB7)
      │         │     (4.7kΩ上拉)
      │        GND
     ┌┴───────────┴┐
     │   MPU6050   │
     │             │
     │  AD0 → GND  │  (地址 0x68)
     │  INT → PA0  │  (中断)
     └─────────────┘
```

**设计要点:**
1. **去耦电容:** 4.7μF 钽电容 + 100nF 陶瓷电容，尽量靠近 VDD 引脚
2. **I2C 上拉:** 4.7kΩ上拉电阻，3.3V 系统可用 2.2kΩ-10kΩ
3. **REGOUT 引脚:** 必须接 4.7μF 电容到地，稳定内部 LDO
4. **PCB 布局:** 传感器远离电机、高频信号线，避免机械应力

---

## 💻 软件驱动 (STM32 HAL)

### 寄存器映射 (关键寄存器)

| 地址 | 寄存器名 | 位宽 | 说明 |
|------|----------|------|------|
| 0x6B | PWR_MGMT_1 | 8-bit | 电源管理 1 |
| 0x6C | PWR_MGMT_2 | 8-bit | 电源管理 2 |
| 0x1A | CONFIG | 8-bit | 配置寄存器 |
| 0x1B | GYRO_CONFIG | 8-bit | 陀螺仪配置 |
| 0x1C | ACCEL_CONFIG | 8-bit | 加速度计配置 |
| 0x3B-0x40 | ACCEL_XOUT | 16-bit | 加速度计 X 轴输出 |
| 0x43-0x48 | GYRO_XOUT | 16-bit | 陀螺仪 X 轴输出 |
| 0x75 | WHO_AM_I | 8-bit | 芯片 ID (应为 0x68) |

### 数据结构定义

```c
#ifndef __MPU6050_H
#define __MPU6050_H

#include "main.h"

// MPU6050 寄存器地址
#define MPU6050_ADDR        0x68
#define MPU6050_WHO_AM_I    0x75
#define MPU6050_PWR_MGMT_1  0x6B
#define MPU6050_PWR_MGMT_2  0x6C
#define MPU6050_CONFIG      0x1A
#define MPU6050_GYRO_CONFIG 0x1B
#define MPU6050_ACCEL_CONFIG 0x1C
#define MPU6050_ACCEL_XOUT  0x3B
#define MPU6050_GYRO_XOUT   0x43

// 加速度计量程
typedef enum {
    ACCEL_RANGE_2G  = 0,  // ±2g,  灵敏度 16384 LSB/g
    ACCEL_RANGE_4G  = 1,  // ±4g,  灵敏度 8192 LSB/g
    ACCEL_RANGE_8G  = 2,  // ±8g,  灵敏度 4096 LSB/g
    ACCEL_RANGE_16G = 3   // ±16g, 灵敏度 2048 LSB/g
} MPU6050_AccelRange_t;

// 陀螺仪量程
typedef enum {
    GYRO_RANGE_250  = 0,  // ±250°/s,  灵敏度 131.0 LSB/°/s
    GYRO_RANGE_500  = 1,  // ±500°/s,  灵敏度 65.5 LSB/°/s
    GYRO_RANGE_1000 = 2,  // ±1000°/s, 灵敏度 32.8 LSB/°/s
    GYRO_RANGE_2000 = 3   // ±2000°/s, 灵敏度 16.4 LSB/°/s
} MPU6050_GyroRange_t;

// 数据输出结构
typedef struct {
    int16_t accel_raw_x;
    int16_t accel_raw_y;
    int16_t accel_raw_z;
    int16_t gyro_raw_x;
    int16_t gyro_raw_y;
    int16_t gyro_raw_z;
    float accel_x;    // 单位：g
    float accel_y;    // 单位：g
    float accel_z;    // 单位：g
    float gyro_x;     // 单位：°/s
    float gyro_y;     // 单位：°/s
    float gyro_z;     // 单位：°/s
    float temperature;// 单位：°C
} MPU6050_Data_t;

// 句柄结构
typedef struct {
    I2C_HandleTypeDef *hi2c;
    uint8_t address;
    MPU6050_AccelRange_t accel_range;
    MPU6050_GyroRange_t gyro_range;
    float accel_sensitivity;
    float gyro_sensitivity;
} MPU6050_Handle_t;

#endif
```

### 初始化函数

```c
/**
 * @brief MPU6050 初始化
 * @param handle: MPU6050 句柄指针
 * @param hi2c: I2C 句柄
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef MPU6050_Init(MPU6050_Handle_t *handle, I2C_HandleTypeDef *hi2c) {
    uint8_t chip_id = 0;
    uint8_t temp = 0;
    
    handle->hi2c = hi2c;
    handle->address = MPU6050_ADDR;
    
    // 1. 读取 WHO_AM_I 验证芯片
    HAL_I2C_Mem_Read(hi2c, MPU6050_ADDR, MPU6050_WHO_AM_I, 
                     I2C_MEMADD_SIZE_8BIT, &chip_id, 1, 100);
    
    if (chip_id != 0x68) {
        return HAL_ERROR; // 芯片 ID 不匹配
    }
    
    // 2. 唤醒传感器 (清除 PWR_MGMT_1 的 SLEEP 位)
    temp = 0x00;
    HAL_I2C_Mem_Write(hi2c, MPU6050_ADDR, MPU6050_PWR_MGMT_1, 
                      I2C_MEMADD_SIZE_8BIT, &temp, 1, 100);
    HAL_Delay(100); // 等待唤醒
    
    // 3. 配置时钟源 (使用 X 轴陀螺仪 PLL)
    temp = 0x01;
    HAL_I2C_Mem_Write(hi2c, MPU6050_ADDR, MPU6050_PWR_MGMT_1, 
                      I2C_MEMADD_SIZE_8BIT, &temp, 1, 100);
    
    // 4. 配置加速度计量程 (±2g)
    handle->accel_range = ACCEL_RANGE_2G;
    handle->accel_sensitivity = 16384.0f;
    temp = 0x00;
    HAL_I2C_Mem_Write(hi2c, MPU6050_ADDR, MPU6050_ACCEL_CONFIG, 
                      I2C_MEMADD_SIZE_8BIT, &temp, 1, 100);
    
    // 5. 配置陀螺仪量程 (±250°/s)
    handle->gyro_range = GYRO_RANGE_250;
    handle->gyro_sensitivity = 131.0f;
    temp = 0x00;
    HAL_I2C_Mem_Write(hi2c, MPU6050_ADDR, MPU6050_GYRO_CONFIG, 
                      I2C_MEMADD_SIZE_8BIT, &temp, 1, 100);
    
    // 6. 配置数字低通滤波器 (184Hz)
    temp = 0x03;
    HAL_I2C_Mem_Write(hi2c, MPU6050_ADDR, MPU6050_CONFIG, 
                      I2C_MEMADD_SIZE_8BIT, &temp, 1, 100);
    
    // 7. 配置采样率 (1kHz / (1+SMPLRT_DIV))
    temp = 0x00; // 1kHz 输出
    HAL_I2C_Mem_Write(hi2c, MPU6050_ADDR, 0x19, 
                      I2C_MEMADD_SIZE_8BIT, &temp, 1, 100);
    
    return HAL_OK;
}
```

### 数据读取函数

```c
/**
 * @brief 读取 MPU6050 原始数据
 * @param handle: MPU6050 句柄
 * @param data: 数据输出结构指针
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef MPU6050_ReadRaw(MPU6050_Handle_t *handle, MPU6050_Data_t *data) {
    uint8_t buffer[14];
    
    // 读取 14 字节数据 (加速度计 + 陀螺仪 + 温度)
    HAL_I2C_Mem_Read(handle->hi2c, handle->address, MPU6050_ACCEL_XOUT, 
                     I2C_MEMADD_SIZE_8BIT, buffer, 14, 100);
    
    // 解析加速度计数据 (高字节在前)
    data->accel_raw_x = (int16_t)((buffer[0] << 8) | buffer[1]);
    data->accel_raw_y = (int16_t)((buffer[2] << 8) | buffer[3]);
    data->accel_raw_z = (int16_t)((buffer[4] << 8) | buffer[5]);
    
    // 解析温度数据
    int16_t temp_raw = (int16_t)((buffer[6] << 8) | buffer[7]);
    data->temperature = temp_raw / 340.0f + 36.53f; // 转换为摄氏度
    
    // 解析陀螺仪数据
    data->gyro_raw_x = (int16_t)((buffer[8] << 8) | buffer[9]);
    data->gyro_raw_y = (int16_t)((buffer[10] << 8) | buffer[11]);
    data->gyro_raw_z = (int16_t)((buffer[12] << 8) | buffer[13]);
    
    return HAL_OK;
}

/**
 * @brief 读取并转换物理量
 * @param handle: MPU6050 句柄
 * @param data: 数据输出结构指针
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef MPU6050_ReadData(MPU6050_Handle_t *handle, MPU6050_Data_t *data) {
    HAL_StatusTypeDef status = MPU6050_ReadRaw(handle, data);
    
    if (status != HAL_OK) {
        return status;
    }
    
    // 转换为物理量
    data->accel_x = data->accel_raw_x / handle->accel_sensitivity;
    data->accel_y = data->accel_raw_y / handle->accel_sensitivity;
    data->accel_z = data->accel_raw_z / handle->accel_sensitivity;
    
    data->gyro_x = data->gyro_raw_x / handle->gyro_sensitivity;
    data->gyro_y = data->gyro_raw_y / handle->gyro_sensitivity;
    data->gyro_z = data->gyro_raw_z / handle->gyro_sensitivity;
    
    return HAL_OK;
}
```

### 量程配置函数

```c
/**
 * @brief 配置加速度计量程
 * @param handle: MPU6050 句柄
 * @param range: 量程选择
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef MPU6050_SetAccelRange(MPU6050_Handle_t *handle, 
                                         MPU6050_AccelRange_t range) {
    uint8_t config = range << 3;
    HAL_StatusTypeDef status = HAL_I2C_Mem_Write(handle->hi2c, handle->address, 
                                                  MPU6050_ACCEL_CONFIG, 
                                                  I2C_MEMADD_SIZE_8BIT, 
                                                  &config, 1, 100);
    
    if (status == HAL_OK) {
        handle->accel_range = range;
        // 更新灵敏度
        float sensitivities[] = {16384.0f, 8192.0f, 4096.0f, 2048.0f};
        handle->accel_sensitivity = sensitivities[range];
    }
    
    return status;
}

/**
 * @brief 配置陀螺仪量程
 * @param handle: MPU6050 句柄
 * @param range: 量程选择
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef MPU6050_SetGyroRange(MPU6050_Handle_t *handle, 
                                        MPU6050_GyroRange_t range) {
    uint8_t config = range << 3;
    HAL_StatusTypeDef status = HAL_I2C_Mem_Write(handle->hi2c, handle->address, 
                                                  MPU6050_GYRO_CONFIG, 
                                                  I2C_MEMADD_SIZE_8BIT, 
                                                  &config, 1, 100);
    
    if (status == HAL_OK) {
        handle->gyro_range = range;
        // 更新灵敏度
        float sensitivities[] = {131.0f, 65.5f, 32.8f, 16.4f};
        handle->gyro_sensitivity = sensitivities[range];
    }
    
    return status;
}
```

---

## ⚡ 低功耗设计

### 功耗模式对比

| 模式 | 配置 | 电流 | 唤醒时间 | 应用场景 |
|------|------|------|----------|----------|
| 睡眠模式 | PWR_MGMT_1[6]=1 | 5μA | 100ms | 长期待机 |
| 待机模式 | 周期唤醒 | 100μA | 快速 | 间歇测量 |
| 正常模式 | 全功能运行 | 3.9mA | - | 连续测量 |
| 循环模式 | 自动唤醒 | 200μA | 快速 | 运动检测 |

### 低功耗配置示例

```c
/**
 * @brief 进入睡眠模式
 */
HAL_StatusTypeDef MPU6050_EnterSleep(MPU6050_Handle_t *handle) {
    uint8_t config = 0x40; // 设置 SLEEP 位
    return HAL_I2C_Mem_Write(handle->hi2c, handle->address, 
                              MPU6050_PWR_MGMT_1, 
                              I2C_MEMADD_SIZE_8BIT, &config, 1, 100);
}

/**
 * @brief 唤醒传感器
 */
HAL_StatusTypeDef MPU6050_WakeUp(MPU6050_Handle_t *handle) {
    uint8_t config = 0x01; // 清除 SLEEP 位，使用 PLL
    return HAL_I2C_Mem_Write(handle->hi2c, handle->address, 
                              MPU6050_PWR_MGMT_1, 
                              I2C_MEMADD_SIZE_8BIT, &config, 1, 100);
}

/**
 * @brief 配置周期唤醒模式
 * @param wake_freq: 唤醒频率 (1.25Hz, 5Hz, 20Hz, 40Hz)
 */
HAL_StatusTypeDef MPU6050_SetCycleMode(MPU6050_Handle_t *handle, uint8_t wake_freq) {
    uint8_t config = 0x20 | (wake_freq & 0x03); // CYCLE 位 + 频率选择
    return HAL_I2C_Mem_Write(handle->hi2c, handle->address, 
                              MPU6050_PWR_MGMT_2, 
                              I2C_MEMADD_SIZE_8BIT, &config, 1, 100);
}
```

### 功耗优化技巧

1. **按需唤醒:** 使用中断唤醒代替轮询，MCU 可深度睡眠
2. **降低 ODR:** 非高速应用降低输出数据率 (如 50Hz 代替 1kHz)
3. **关闭未用轴:** 禁用不需要的轴可降低功耗
4. **使用 DMP:** 硬件解算比软件更高效

```c
// 优化配置示例：低功耗姿态检测
void MPU6050_LowPowerConfig(MPU6050_Handle_t *handle) {
    uint8_t temp;
    
    // 1. 降低 ODR 到 50Hz
    temp = 19; // 1kHz / (1+19) = 50Hz
    HAL_I2C_Mem_Write(handle->hi2c, handle->address, 0x19, 
                      I2C_MEMADD_SIZE_8BIT, &temp, 1, 100);
    
    // 2. 降低陀螺仪量程 (姿态检测不需要大量程)
    MPU6050_SetGyroRange(handle, GYRO_RANGE_250);
    
    // 3. 启用运动检测中断
    temp = 0x01; // MOTION_EN 位
    HAL_I2C_Mem_Write(handle->hi2c, handle->address, 0x69, 
                      I2C_MEMADD_SIZE_8BIT, &temp, 1, 100);
    
    // 4. 配置运动阈值
    temp = 0x10; // 阈值 (根据应用调整)
    HAL_I2C_Mem_Write(handle->hi2c, handle->address, 0x1F, 
                      I2C_MEMADD_SIZE_8BIT, &temp, 1, 100);
}
```

---

## 🔧 调试技巧

### 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| I2C 无响应 | 地址错误/上拉缺失 | 检查 AD0 引脚，测量上拉电阻 |
| WHO_AM_I 读取失败 | 电源不稳定/时序问题 | 检查 VDD 波形，降低 I2C 速度 |
| 数据全为 0 | 传感器未唤醒 | 检查 PWR_MGMT_1 配置 |
| 数据跳变严重 | 机械振动/滤波不足 | 增加 DLPF 配置，检查安装 |
| 温度读数异常 | 公式错误 | 使用正确转换公式：temp/340+36.53 |

### 快速测试代码

```c
/**
 * @brief MPU6050 快速测试
 */
void MPU6050_QuickTest(void) {
    MPU6050_Handle_t mpu;
    MPU6050_Data_t data;
    
    printf("\r\n=== MPU6050 Quick Test ===\r\n");
    
    // 初始化
    if (MPU6050_Init(&mpu, &hi2c1) != HAL_OK) {
        printf("❌ MPU6050 初始化失败!\r\n");
        return;
    }
    printf("✅ MPU6050 初始化成功\r\n");
    
    // 读取 10 次数据
    for (int i = 0; i < 10; i++) {
        if (MPU6050_ReadData(&mpu, &data) == HAL_OK) {
            printf("[%d] Accel: %.2f, %.2f, %.2f g | ", 
                   i, data.accel_x, data.accel_y, data.accel_z);
            printf("Gyro: %.2f, %.2f, %.2f °/s | ", 
                   data.gyro_x, data.gyro_y, data.gyro_z);
            printf("Temp: %.1f °C\r\n", data.temperature);
        } else {
            printf("❌ 读取失败\r\n");
        }
        HAL_Delay(100);
    }
}
```

### 校准方法

```c
// 加速度计零偏校准 (静止时 Z 轴应为 1g，X/Y 为 0)
typedef struct {
    float accel_offset_x;
    float accel_offset_y;
    float accel_offset_z;
    float gyro_offset_x;
    float gyro_offset_y;
    float gyro_offset_z;
} MPU6050_Calibration_t;

void MPU6050_Calibrate(MPU6050_Handle_t *handle, 
                       MPU6050_Calibration_t *calib, 
                       int samples) {
    MPU6050_Data_t data;
    float sum_ax = 0, sum_ay = 0, sum_az = 0;
    float sum_gx = 0, sum_gy = 0, sum_gz = 0;
    
    printf("开始校准，请保持传感器静止...\r\n");
    HAL_Delay(1000);
    
    // 采集样本
    for (int i = 0; i < samples; i++) {
        MPU6050_ReadData(handle, &data);
        sum_ax += data.accel_x;
        sum_ay += data.accel_y;
        sum_az += data.accel_z;
        sum_gx += data.gyro_x;
        sum_gy += data.gyro_y;
        sum_gz += data.gyro_z;
        HAL_Delay(10);
    }
    
    // 计算平均值
    calib->accel_offset_x = sum_ax / samples;
    calib->accel_offset_y = sum_ay / samples;
    calib->accel_offset_z = (sum_az / samples) - 1.0f; // Z 轴应减去 1g
    calib->gyro_offset_x = sum_gx / samples;
    calib->gyro_offset_y = sum_gy / samples;
    calib->gyro_offset_z = sum_gz / samples;
    
    printf("校准完成:\r\n");
    printf("Accel Offset: %.3f, %.3f, %.3f\r\n", 
           calib->accel_offset_x, calib->accel_offset_y, calib->accel_offset_z);
    printf("Gyro Offset: %.3f, %.3f, %.3f\r\n", 
           calib->gyro_offset_x, calib->gyro_offset_y, calib->gyro_offset_z);
}
```

---

## 📚 参考资料

- [MPU6050 Datasheet](https://invensense.tdk.com/wp-content/uploads/2015/02/MPU-6000-Datasheet1.pdf)
- [MPU6050 Register Map](https://invensense.tdk.com/wp-content/uploads/2015/02/MPU-6000-Register-Map1.pdf)
- [TDK 产品页面](https://invensense.tdk.com/products/motion-tracking/6-axis/mpu-6050/)
- [Arduino MPU6050 库](https://github.com/electroniccats/MPU6050)
- [STM32 MPU6050 驱动示例](https://github.com/STMicroelectronics/STM32CubeF4/tree/master/Projects/STM324xG_EVAL/Applications/FPDM)

---

## 📝 实验记录

### 实验 1: 基础数据读取测试

**日期:** 2026-03-11  
**目的:** 验证 MPU6050 基础通信和数据读取

**硬件配置:**
- MCU: STM32F103C8T6 (Blue Pill)
- 传感器：MPU6050 模块
- 供电：3.3V LDO
- I2C: PB6(SCL), PB7(SDA), 4.7kΩ上拉

**测试结果:**
```
WHO_AM_I: 0x68 ✅
加速度计静止读数:
  X: 0.02g
  Y: -0.01g
  Z: 1.00g ✅
陀螺仪静止读数:
  X: 0.05°/s
  Y: -0.03°/s
  Z: 0.02°/s
温度：28.5°C
```

**结论:** 传感器工作正常，零偏在合理范围内

### 实验 2: 低功耗模式测试

**日期:** 2026-03-11  
**目的:** 测试睡眠模式和唤醒时间

**测试结果:**
| 模式 | 实测电流 | 规格值 | 唤醒时间 |
|------|----------|--------|----------|
| 正常 | 4.1mA | 3.9mA | - |
| 睡眠 | 6μA | 5μA | 98ms |

**结论:** 功耗符合规格，唤醒时间满足应用需求

---

## 🔗 相关链接

- [[ICM20948-9 轴 IMU]] - MPU6050 升级版，增加磁力计
- [[BMI088-6 轴 IMU]] - Bosch 高性能 IMU，适用于无人机
- [[BNO055-智能 IMU]] - 内置传感器融合，直接输出姿态
- [[I2C 协议深度解析]] - I2C 通信协议详解
- [[传感器融合与卡尔曼滤波]] - 多传感器数据融合算法

---

*文档创建：2026-03-11 | 最后更新：2026-03-11 | 维护者：XinSor EE Team*
