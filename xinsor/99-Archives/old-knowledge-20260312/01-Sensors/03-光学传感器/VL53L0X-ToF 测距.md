# VL53L0X ToF 激光测距传感器

> **一句话描述:** ST 微型 ToF (飞行时间) 激光测距传感器，2m 量程，毫米级精度，I2C 接口，小型化设计  
> **标签:** `#sensor/tof` `#sensor/distance` `#sensor/optical` `#protocol/i2c` `#vendor/st` `#app/robotics`  
> **状态:** ✅ 完成  
> **最后更新:** 2026-03-11

---

## 🎯 概述

**VL53L0X** 是 STMicroelectronics 生产的微型 ToF (Time of Flight) 激光测距传感器，通过测量激光脉冲的飞行时间来计算距离，具有小型化、高精度、快速响应的特点。

**核心特性:**
- ✨ **ToF 技术:** 飞行时间测距，不受目标反射率影响
- ✨ **长量程:** 0-2000mm 测量范围
- ✨ **高精度:** ±3% 精度，最小可测 30mm
- ✨ **快速响应:** 最高 50Hz 采样率
- ✨ **小型化:** 4.4 × 2.4 × 1.0 mm 封装
- ✨ **眼安全:** Class 1 激光安全标准

**典型应用:** 机器人避障、无人机定高、手势识别、自动对焦、液位检测、智能家居

---

## 📊 技术规格

### 电气参数

| 参数 | 最小值 | 典型值 | 最大值 | 单位 |
|------|--------|--------|--------|------|
| 供电电压 VDD | 2.6 | 3.3 | 3.6 | V |
| VDDIO | 1.62 | 3.3 | 3.6 | V |
| 工作电流 | - | 13 | 20 | mA |
| 睡眠模式电流 | - | 0.5 | 5 | μA |
| 工作温度 | -20 | 25 | 70 | °C |

### 测距规格

| 参数 | 值 | 单位 | 说明 |
|------|-----|------|------|
| 测量范围 | 0-2000 | mm | 典型环境 |
| 最小距离 | 30 | mm | 取决于目标 |
| 精度 | ±3 | % | 典型值 |
| 分辨率 | 1 | mm | - |
| 最大采样率 | 50 | Hz | 连续测量 |
| FOV 视场角 | 25 | ° | 典型值 |

### 激光规格

| 参数 | 值 |
|------|-----|
| 激光类型 | VCSEL (垂直腔面发射激光器) |
| 波长 | 940 nm |
| 安全等级 | Class 1 (IEC 60825-1) |

### 封装信息

| 参数 | 值 |
|------|-----|
| 封装类型 | LGA |
| 尺寸 | 4.4 × 2.4 × 1.0 mm |
| 引脚数 | 10 |

---

## 🔌 硬件设计

### 引脚定义

```
        VL53L0X 顶视图
        
    1  2  3  4  5
    ○ ○ ○ ○ ○
    
    10 9  8  7  6
    ○  ○ ○  ○  ○
```

| 引脚 | 名称 | 类型 | 功能描述 |
|------|------|------|----------|
| 1 | VDD | P | 电源 (2.6V-3.6V) |
| 2 | GPIO1 | I/O | 通用 IO / 中断输出 |
| 3 | GPIO0/SPAD | I/O | 通用 IO / SPAD 使能 |
| 4 | XSHUT | I | 关断控制 (低电平关断) |
| 5 | VDDIO | P | 数字 I/O 电源 |
| 6 | NC | - | 不连接 |
| 7 | SDA | I/O | I2C 数据线 |
| 8 | SCL | I | I2C 时钟线 |
| 9 | NC | - | 不连接 |
| 10 | GND | P | 电源地 |

### 典型电路

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
     │   VL53L0X   │
     │             │
     │ XSHUT→3.3V  │  (常开)
     │ GPIO1→PA0   │  (中断)
     └─────────────┘
```

**设计要点:**
1. **去耦电容:** 1μF 陶瓷电容，尽量靠近 VDD 引脚
2. **I2C 上拉:** 4.7kΩ (3.3V 系统)
3. **XSHUT 引脚:** 
   - 接 VDD: 传感器常开
   - 接 MCU GPIO: 可控制多个传感器
4. **光学窗口:** 
   - 保持清洁，避免遮挡
   - 可使用红外透光窗口保护
5. **避免干扰:** 远离其他红外光源

---

## 💻 软件驱动 (STM32 HAL)

### 寄存器定义

```c
#ifndef __VL53L0X_H
#define __VL53L0X_H

#include "main.h"

// VL53L0X I2C 地址 (默认)
#define VL53L0X_ADDR        0x52

// 关键寄存器
#define VL53L0X_SYSRANGE_START          0x00
#define VL53L0X_SYSTEM_THRESH_HIGH      0x0C
#define VL53L0X_SYSTEM_THRESH_LOW       0x0E
#define VL53L0X_SYSTEM_SEQUENCE_CONFIG  0x01
#define VL53L0X_SYSTEM_RANGE_CONFIG     0x09
#define VL53L0X_SYSTEM_INTERRUPT_CLEAR  0x0B
#define VL53L0X_RESULT_INTERRUPT_STATUS 0x13
#define VL53L0X_RESULT_RANGE_STATUS     0x14
#define VL53L0X_RESULT_CORE_AMPLITUDE   0x1E
#define VL53L0X_RESULT_CORE_FINAL       0x10
#define VL53L0X_RESULT_PEAK_SIGNAL_RATE 0xB6
#define VL53L0X_RESULT_AMBIENT_RATE     0xCB
#define VL53L0X_RESULT_SIGMA_ESTIMATE   0xD0
#define VL53L0X_RESULT_PHASE_HIGH       0xD4
#define VL53L0X_RESULT_PHASE_LOW        0xD6

// 测量模式
#define VL53L0X_SINGLE_MODE      0x00
#define VL53L0X_CONTINUOUS_MODE  0x02
#define VL53L0X_TIMEOUT_MODE     0x03

// 状态定义
#define VL53L0X_RANGE_VALID       0x05
#define VL53L0X_RANGE_OUT_OF_BOUNDS 0x07

// 数据输出结构
typedef struct {
    uint16_t distance_mm;     // 距离 (mm)
    uint8_t status;           // 测量状态
    float signal_rate;        // 信号率
    float ambient_rate;       // 环境光率
    uint16_t sigma;           // 估计误差
} VL53L0X_Data_t;

// 句柄结构
typedef struct {
    I2C_HandleTypeDef *hi2c;
    uint8_t address;
    uint8_t measurement_mode;
} VL53L0X_Handle_t;

#endif
```

### 初始化函数

```c
/**
 * @brief VL53L0X 初始化
 * @param handle: 句柄
 * @param hi2c: I2C 句柄
 * @param address: I2C 地址
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef VL53L0X_Init(VL53L0X_Handle_t *handle,
                                I2C_HandleTypeDef *hi2c,
                                uint8_t address) {
    uint8_t chip_id = 0;
    
    handle->hi2c = hi2c;
    handle->address = address;
    
    // 1. 读取芯片 ID (实际读取 device type)
    HAL_I2C_Mem_Read(hi2c, address << 1, 0xC0,
                     I2C_MEMADD_SIZE_8BIT, &chip_id, 1, 100);
    
    // 2. 软件复位
    uint8_t soft_reset = 0x00;
    HAL_I2C_Mem_Write(hi2c, address << 1, 0x8F,
                      I2C_MEMADD_SIZE_8BIT, &soft_reset, 1, 100);
    HAL_Delay(10);
    
    // 3. 写入默认配置 (简化版)
    // 实际应用中需要完整的配置序列
    const uint8_t default_config[][2] = {
        {0x80, 0x01},
        {0xFF, 0x01},
        {0x00, 0x00},
        {0x91, 0x00},
        {0x00, 0x01},
        {0xFF, 0x00},
        {0x80, 0x00},
    };
    
    for (int i = 0; i < 7; i++) {
        HAL_I2C_Mem_Write(hi2c, address << 1, default_config[i][0],
                          I2C_MEMADD_SIZE_8BIT, &default_config[i][1], 1, 100);
    }
    
    // 4. 配置测量模式 (单次)
    uint8_t mode = VL53L0X_SINGLE_MODE;
    HAL_I2C_Mem_Write(hi2c, address << 1, VL53L0X_SYSRANGE_START,
                      I2C_MEMADD_SIZE_8BIT, &mode, 1, 100);
    
    return HAL_OK;
}
```

### 单次测量函数

```c
/**
 * @brief 启动单次测量
 * @param handle: 句柄
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef VL53L0X_StartSingle(VL53L0X_Handle_t *handle) {
    uint8_t mode = VL53L0X_SINGLE_MODE;
    return HAL_I2C_Mem_Write(handle->hi2c, handle->address << 1,
                              VL53L0X_SYSRANGE_START,
                              I2C_MEMADD_SIZE_8BIT, &mode, 1, 100);
}

/**
 * @brief 读取测量结果
 * @param handle: 句柄
 * @param data: 数据输出
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef VL53L0X_ReadData(VL53L0X_Handle_t *handle,
                                    VL53L0X_Data_t *data) {
    uint8_t status = 0;
    
    // 1. 读取中断状态
    HAL_I2C_Mem_Read(handle->hi2c, handle->address << 1,
                     VL53L0X_RESULT_INTERRUPT_STATUS,
                     I2C_MEMADD_SIZE_8BIT, &status, 1, 100);
    
    // 检查数据是否就绪
    if ((status & 0x07) != 0x04) {
        return HAL_BUSY;  // 数据未就绪
    }
    
    // 2. 读取距离 (mm)
    uint8_t buffer[2];
    HAL_I2C_Mem_Read(handle->hi2c, handle->address << 1,
                     VL53L0X_RESULT_CORE_FINAL,
                     I2C_MEMADD_SIZE_8BIT, buffer, 2, 100);
    data->distance_mm = (buffer[0] << 8) | buffer[1];
    
    // 3. 读取范围状态
    HAL_I2C_Mem_Read(handle->hi2c, handle->address << 1,
                     VL53L0X_RESULT_RANGE_STATUS,
                     I2C_MEMADD_SIZE_8BIT, &data->status, 1, 100);
    data->status &= 0x1F;
    
    // 4. 清除中断
    uint8_t clear = 0xFF;
    HAL_I2C_Mem_Write(handle->hi2c, handle->address << 1,
                      VL53L0X_SYSTEM_INTERRUPT_CLEAR,
                      I2C_MEMADD_SIZE_8BIT, &clear, 1, 100);
    
    // 5. 读取信号率 (可选)
    HAL_I2C_Mem_Read(handle->hi2c, handle->address << 1,
                     VL53L0X_RESULT_PEAK_SIGNAL_RATE,
                     I2C_MEMADD_SIZE_8BIT, buffer, 2, 100);
    data->signal_rate = ((buffer[0] << 8) | buffer[1]) / 65536.0f;
    
    // 6. 读取环境光率 (可选)
    HAL_I2C_Mem_Read(handle->hi2c, handle->address << 1,
                     VL53L0X_RESULT_AMBIENT_RATE,
                     I2C_MEMADD_SIZE_8BIT, buffer, 2, 100);
    data->ambient_rate = ((buffer[0] << 8) | buffer[1]) / 65536.0f;
    
    // 7. 读取 Sigma 估计 (可选)
    HAL_I2C_Mem_Read(handle->hi2c, handle->address << 1,
                     VL53L0X_RESULT_SIGMA_ESTIMATE,
                     I2C_MEMADD_SIZE_8BIT, buffer, 2, 100);
    data->sigma = (buffer[0] << 8) | buffer[1];
    
    return HAL_OK;
}

/**
 * @brief 阻塞式单次测量
 * @param handle: 句柄
 * @param data: 数据输出
 * @param timeout_ms: 超时时间
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef VL53L0X_Measure(VL53L0X_Handle_t *handle,
                                   VL53L0X_Data_t *data,
                                   uint32_t timeout_ms) {
    uint32_t start = HAL_GetTicks();
    
    // 启动测量
    VL53L0X_StartSingle(handle);
    
    // 等待数据就绪
    while ((HAL_GetTicks() - start) < timeout_ms) {
        HAL_StatusTypeDef status = VL53L0X_ReadData(handle, data);
        if (status == HAL_OK) {
            return HAL_OK;
        }
        HAL_Delay(1);
    }
    
    return HAL_TIMEOUT;
}
```

### 连续测量模式

```c
/**
 * @brief 启动连续测量
 * @param handle: 句柄
 * @param period_ms: 测量周期 (ms)
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef VL53L0X_StartContinuous(VL53L0X_Handle_t *handle,
                                           uint8_t period_ms) {
    // 配置测量周期
    HAL_I2C_Mem_Write(handle->hi2c, handle->address << 1,
                      0x04, I2C_MEMADD_SIZE_8BIT, &period_ms, 1, 100);
    
    // 启动连续测量
    uint8_t mode = VL53L0X_CONTINUOUS_MODE;
    return HAL_I2C_Mem_Write(handle->hi2c, handle->address << 1,
                              VL53L0X_SYSRANGE_START,
                              I2C_MEMADD_SIZE_8BIT, &mode, 1, 100);
}

/**
 * @brief 停止测量
 * @param handle: 句柄
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef VL53L0X_StopMeasurement(VL53L0X_Handle_t *handle) {
    uint8_t stop = 0x01;
    return HAL_I2C_Mem_Write(handle->hi2c, handle->address << 1,
                              VL53L0X_SYSRANGE_START,
                              I2C_MEMADD_SIZE_8BIT, &stop, 1, 100);
}
```

### 多传感器支持 (XSHUT 控制)

```c
/**
 * @brief 更改传感器 I2C 地址
 * @param handle: 句柄
 * @param new_address: 新地址
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef VL53L0X_SetAddress(VL53L0X_Handle_t *handle,
                                      uint8_t new_address) {
    // 写入新地址 (7 位地址)
    return HAL_I2C_Mem_Write(handle->hi2c, handle->address << 1,
                              0x8A, I2C_MEMADD_SIZE_8BIT,
                              &new_address, 1, 100);
}

/**
 * @brief 初始化多个传感器
 * @param sensors: 传感器数组
 * @param count: 传感器数量
 * @param xshut_pins: XSHUT 引脚数组
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef VL53L0X_InitMultiple(VL53L0X_Handle_t *sensors,
                                        uint8_t count,
                                        GPIO_TypeDef **xshut_ports,
                                        uint16_t *xshut_pins) {
    // 1. 关闭所有传感器
    for (int i = 0; i < count; i++) {
        HAL_GPIO_WritePin(xshut_ports[i], xshut_pins[i], GPIO_PIN_RESET);
    }
    HAL_Delay(10);
    
    // 2. 逐个使能并配置
    uint8_t base_address = VL53L0X_ADDR;
    for (int i = 0; i < count; i++) {
        // 使能当前传感器
        HAL_GPIO_WritePin(xshut_ports[i], xshut_pins[i], GPIO_PIN_SET);
        HAL_Delay(10);
        
        // 初始化
        sensors[i].address = base_address;
        if (VL53L0X_Init(&sensors[i], sensors[i].hi2c, base_address) != HAL_OK) {
            return HAL_ERROR;
        }
        
        // 更改地址 (下一个传感器)
        if (i < count - 1) {
            base_address += 2;  // I2C 地址 +1 (7 位)
            VL53L0X_SetAddress(&sensors[i], base_address);
        }
    }
    
    return HAL_OK;
}
```

---

## ⚡ 低功耗设计

### 功耗模式

| 模式 | 电流 | 说明 |
|------|------|------|
| 睡眠 | 0.5μA | XSHUT 拉低 |
| 待机 | 5μA | 空闲状态 |
| 单次测量 | 13mA | 测量期间 |
| 连续测量 | 20mA | 50Hz 连续 |

### 低功耗测量策略

```c
/**
 * @brief 低功耗测量序列
 * @param handle: 句柄
 * @param data: 数据输出
 */
void VL53L0X_LowPowerMeasure(VL53L0X_Handle_t *handle,
                              VL53L0X_Data_t *data) {
    // 1. 唤醒 (XSHUT 拉高)
    HAL_GPIO_WritePin(XSHUT_PORT, XSHUT_PIN, GPIO_PIN_SET);
    HAL_Delay(5);
    
    // 2. 单次测量
    VL53L0X_Measure(handle, data, 100);
    
    // 3. 进入睡眠 (XSHUT 拉低)
    HAL_GPIO_WritePin(XSHUT_PORT, XSHUT_PIN, GPIO_PIN_RESET);
    
    // 4. MCU 进入睡眠
    // __WFI();
}
```

---

## 🔧 调试技巧

### 常见问题

| 问题 | 解决方案 |
|------|----------|
| 距离读数不变 | 检查目标反射率，确保在 FOV 内 |
| 读数跳动大 | 增加测量时间，使用多次平均 |
| I2C 无响应 | 检查 XSHUT 引脚状态 |
| 最大距离不足 | 清洁光学窗口，检查环境光干扰 |

### 快速测试

```c
void VL53L0X_QuickTest(VL53L0X_Handle_t *handle) {
    VL53L0X_Data_t data;
    
    printf("=== VL53L0X ToF Test ===\r\n");
    
    for (int i = 0; i < 10; i++) {
        if (VL53L0X_Measure(handle, &data, 100) == HAL_OK) {
            if (data.status == VL53L0X_RANGE_VALID) {
                printf("[%d] Distance: %d mm | ", i, data.distance_mm);
                printf("Signal: %.2f | Sigma: %d\r\n",
                       data.signal_rate, data.sigma);
            } else {
                printf("[%d] Out of range (Status: %d)\r\n", i, data.status);
            }
        } else {
            printf("[%d] Timeout\r\n", i);
        }
        HAL_Delay(100);
    }
}
```

---

## 🔗 相关链接

- [[VL53L1X-ToF 测距]] - 升级版，4m 量程
- [[APDS9960-手势传感器]] - 多合一光学传感器
- [[TCS34725-RGB 颜色]] - 颜色传感器
- [[I2C 协议深度解析]] - I2C 通信协议

---

*文档创建：2026-03-11 | 维护者：XinSor EE Team*
