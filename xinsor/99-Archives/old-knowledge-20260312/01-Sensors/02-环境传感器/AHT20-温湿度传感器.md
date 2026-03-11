# AHT20 温湿度传感器

> **一句话描述:** 奥松电子低成本数字温湿度传感器，±2% RH 湿度精度，I2C 接口，SHT30 经济替代方案  
> **标签:** `#sensor/humidity` `#sensor/temperature` `#protocol/i2c` `#vendor/asair` `#mcu/stm32` `#app/iot`  
> **状态:** ✅ 完成  
> **最后更新:** 2026-03-11

---

## 🎯 概述

**AHT20** 是广州奥松电子 (ASAIR) 生产的新一代数字温湿度传感器，在保持较低成本的同时提供了接近 SHT30 的精度，是 IoT 设备、智能家居等成本敏感应用的理想选择。

**核心特性:**
- ✨ **高性价比:** 价格仅为 SHT30 的 1/3-1/2
- ✨ **良好精度:** ±2% RH 湿度精度，±0.3°C 温度精度
- ✨ **快速响应:** 湿度响应时间 5s (63%)
- ✨ **宽量程:** -40°C~85°C，0-100% RH
- ✨ **低功耗:** 平均电流 30μA@1Hz
- ✨ **小封装:** 2.0 × 2.0 × 0.75 mm DFN

**典型应用:** 智能家居、IoT 设备、除湿机、加湿器、气象站、可穿戴设备、消费电子

---

## 📊 技术规格

### 电气参数

| 参数 | 最小值 | 典型值 | 最大值 | 单位 |
|------|--------|--------|--------|------|
| 供电电压 VDD | 1.8 | 3.3 | 5.5 | V |
| 平均电流 (1Hz) | - | 30 | 50 | μA |
| 测量时电流 | - | 0.8 | 1.2 | mA |
| 睡眠模式电流 | - | 1 | 10 | μA |
| 工作温度 | -40 | 25 | 85 | °C |
| I2C 速度 | - | 400 | 400 | kHz |

### 湿度规格

| 参数 | 值 | 单位 | 说明 |
|------|-----|------|------|
| 测量范围 | 0-100 | %RH | 全量程 |
| 精度 (20-80% RH) | ±2 | %RH | 25°C 典型 |
| 精度 (全量程) | ±5 | %RH | 0-100% RH |
| 分辨率 | 0.024 | %RH | 20-bit |
| 响应时间 (63%) | 5 | s | 静止空气 |
| 迟滞 | ±1 | %RH | 典型值 |

### 温度规格

| 参数 | 值 | 单位 | 说明 |
|------|-----|------|------|
| 测量范围 | -40~85 | °C | 全量程 |
| 精度 | ±0.3 | °C | 25°C 典型 |
| 精度 (全量程) | ±0.5 | °C | -20~60°C |
| 分辨率 | 0.01 | °C | 20-bit |

### 封装信息

| 参数 | 值 |
|------|-----|
| 封装类型 | DFN |
| 尺寸 | 2.0 × 2.0 × 0.75 mm |
| 引脚数 | 6 |

---

## 🔌 硬件设计

### 引脚定义

```
        AHT20 顶视图 (DFN-6)
        
    VDD  1 ○ ○ 2 SDA
         
    NC   3 ○ ○ 4 SCL
         
    NC   5 ○ ○ 6 GND
```

| 引脚 | 名称 | 类型 | 功能描述 |
|------|------|------|----------|
| 1 | VDD | P | 电源正极 (1.8V-5.5V) |
| 2 | SDA | I/O | I2C 数据线 |
| 3 | NC | - | 不连接 |
| 4 | SCL | I | I2C 时钟线 |
| 5 | NC | - | 不连接 |
| 6 | GND | P | 电源地 |

### 典型电路

```
         3.3V
           │
      ┌────┴────┐
      │         │
     ┌┴┐       ┌┴┐
     │ │ 100nF │ │ 4.7kΩ
     │ │       │ │ (上拉)
     └┬┘       └┬┘
      │         │
      ├────┬────┼─── SCL (PB6)
      │    │    │
      │   GND   ├─── SDA (PB7)
      │         │
     ┌┴───────────┴┐
     │    AHT20    │
     │             │
     └─────────────┘
```

**设计要点:**
1. **去耦电容:** 100nF 陶瓷电容，尽量靠近 VDD 引脚
2. **I2C 上拉:** 模块通常已集成，裸芯片需外接 4.7kΩ
3. **宽电压支持:** 1.8V-5.5V 供电，兼容 3.3V 和 5V 系统
4. **PCB 布局:** 
   - 远离热源
   - 底部焊盘接地
   - 顶部开窗通气

---

## 💻 软件驱动 (STM32 HAL)

### 寄存器定义

```c
#ifndef __AHT20_H
#define __AHT20_H

#include "main.h"

// AHT20 I2C 地址
#define AHT20_ADDR          0x38

// 命令定义
#define AHT20_CMD_INIT      0xBE
#define AHT20_CMD_TRIGGER   0xAC
#define AHT20_CMD_STATUS    0x71
#define AHT20_CMD_RESET     0xBA

// 状态位
#define AHT20_STATUS_BUSY   (1 << 7)
#define AHT20_STATUS_CAL    (1 << 3)

// 数据输出结构
typedef struct {
    float temperature;  // 单位：°C
    float humidity;     // 单位：%RH
    uint8_t status;     // 状态字节
    HAL_StatusTypeDef last_status;
} AHT20_Data_t;

// 句柄结构
typedef struct {
    I2C_HandleTypeDef *hi2c;
    uint8_t address;
    uint8_t calibrated;
} AHT20_Handle_t;

#endif
```

### 初始化函数

```c
/**
 * @brief AHT20 初始化
 * @param handle: 句柄
 * @param hi2c: I2C 句柄
 * @param address: I2C 地址
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef AHT20_Init(AHT20_Handle_t *handle,
                              I2C_HandleTypeDef *hi2c,
                              uint8_t address) {
    uint8_t cmd[3];
    uint8_t status = 0;
    
    handle->hi2c = hi2c;
    handle->address = address;
    handle->calibrated = 0;
    
    // 1. 发送初始化命令
    cmd[0] = AHT20_CMD_INIT;
    cmd[1] = 0x08;
    cmd[2] = 0x00;
    HAL_StatusTypeDef status_ret = HAL_I2C_Master_Transmit(hi2c, 
                                                            address << 1, 
                                                            cmd, 3, 100);
    if (status_ret != HAL_OK) {
        return status_ret;
    }
    
    HAL_Delay(10);  // 等待初始化完成
    
    // 2. 检查校准状态
    cmd[0] = AHT20_CMD_STATUS;
    status_ret = HAL_I2C_Master_Transmit(hi2c, address << 1, cmd, 1, 100);
    if (status_ret != HAL_OK) {
        return status_ret;
    }
    
    HAL_Delay(1);
    status_ret = HAL_I2C_Master_Receive(hi2c, address << 1, &status, 1, 100);
    if (status_ret != HAL_OK) {
        return status_ret;
    }
    
    // 检查是否需要校准
    if (!(status & AHT20_STATUS_CAL)) {
        // 需要校准，重新发送初始化命令
        cmd[0] = AHT20_CMD_INIT;
        cmd[1] = 0x08;
        cmd[2] = 0x00;
        HAL_I2C_Master_Transmit(hi2c, address << 1, cmd, 3, 100);
        HAL_Delay(10);
    }
    
    handle->calibrated = 1;
    return HAL_OK;
}

/**
 * @brief 软复位
 * @param handle: 句柄
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef AHT20_SoftReset(AHT20_Handle_t *handle) {
    uint8_t cmd = AHT20_CMD_RESET;
    HAL_StatusTypeDef status = HAL_I2C_Master_Transmit(handle->hi2c,
                                                        handle->address << 1,
                                                        &cmd, 1, 100);
    HAL_Delay(20);  // 复位需要 20ms
    return status;
}
```

### 数据读取函数

```c
/**
 * @brief 触发测量
 * @param handle: 句柄
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef AHT20_StartMeasure(AHT20_Handle_t *handle) {
    uint8_t cmd[3];
    
    cmd[0] = AHT20_CMD_TRIGGER;
    cmd[1] = 0x33;
    cmd[2] = 0x00;
    
    return HAL_I2C_Master_Transmit(handle->hi2c, 
                                    handle->address << 1, 
                                    cmd, 3, 100);
}

/**
 * @brief 检查测量是否完成
 * @param handle: 句柄
 * @return 0=完成，1=忙
 */
uint8_t AHT20_IsBusy(AHT20_Handle_t *handle) {
    uint8_t status = 0;
    uint8_t cmd = AHT20_CMD_STATUS;
    
    HAL_I2C_Master_Transmit(handle->hi2c, handle->address << 1, &cmd, 1, 100);
    HAL_Delay(1);
    HAL_I2C_Master_Receive(handle->hi2c, handle->address << 1, &status, 1, 100);
    
    return (status & AHT20_STATUS_BUSY) ? 1 : 0;
}

/**
 * @brief 读取测量数据
 * @param handle: 句柄
 * @param data: 数据输出
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef AHT20_ReadData(AHT20_Handle_t *handle, AHT20_Data_t *data) {
    uint8_t buffer[7];
    
    // 1. 触发测量
    data->last_status = AHT20_StartMeasure(handle);
    if (data->last_status != HAL_OK) {
        return data->last_status;
    }
    
    // 2. 等待测量完成 (最多 80ms)
    uint32_t timeout = HAL_GetTicks() + 100;
    while (AHT20_IsBusy(handle) && (HAL_GetTicks() < timeout)) {
        HAL_Delay(5);
    }
    
    if (HAL_GetTicks() >= timeout) {
        data->last_status = HAL_TIMEOUT;
        return HAL_TIMEOUT;
    }
    
    // 3. 读取数据 (7 字节：状态 + 3 字节湿度 + 3 字节温度 + CRC)
    data->last_status = HAL_I2C_Master_Receive(handle->hi2c,
                                                handle->address << 1,
                                                buffer, 7, 100);
    if (data->last_status != HAL_OK) {
        return data->last_status;
    }
    
    // 4. 验证 CRC (可选，AHT20 不支持 CRC，跳过)
    
    // 5. 解析湿度 (20-bit)
    uint32_t hum_raw = ((uint32_t)buffer[1] << 12) | 
                       ((uint32_t)buffer[2] << 4) | 
                       ((uint32_t)buffer[3] >> 4);
    data->humidity = (hum_raw * 100.0f) / 1048576.0f;  // 2^20 = 1048576
    
    // 6. 解析温度 (20-bit)
    uint32_t temp_raw = (((uint32_t)buffer[3] & 0x0F) << 16) | 
                        ((uint32_t)buffer[4] << 8) | 
                        (uint32_t)buffer[5];
    data->temperature = (temp_raw * 200.0f / 1048576.0f) - 50.0f;
    
    // 7. 限制范围
    if (data->humidity > 100.0f) data->humidity = 100.0f;
    if (data->humidity < 0.0f) data->humidity = 0.0f;
    if (data->temperature > 85.0f) data->temperature = 85.0f;
    if (data->temperature < -40.0f) data->temperature = -40.0f;
    
    return HAL_OK;
}

/**
 * @brief 阻塞式单次测量
 * @param handle: 句柄
 * @param data: 数据输出
 * @param timeout_ms: 超时时间
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef AHT20_Measure(AHT20_Handle_t *handle,
                                 AHT20_Data_t *data,
                                 uint32_t timeout_ms) {
    uint32_t start = HAL_GetTicks();
    
    // 触发测量
    data->last_status = AHT20_StartMeasure(handle);
    if (data->last_status != HAL_OK) {
        return data->last_status;
    }
    
    // 等待完成
    while (AHT20_IsBusy(handle) && ((HAL_GetTicks() - start) < timeout_ms)) {
        HAL_Delay(5);
    }
    
    if ((HAL_GetTicks() - start) >= timeout_ms) {
        data->last_status = HAL_TIMEOUT;
        return HAL_TIMEOUT;
    }
    
    // 读取数据
    return AHT20_ReadData(handle, data);
}
```

---

## ⚡ 低功耗设计

### 功耗模式

| 模式 | 电流 | 说明 |
|------|------|------|
| 睡眠 | 1μA | 默认状态 |
| 测量 | 0.8mA | 测量期间 (75ms) |
| 平均 (1Hz) | 30μA | 每秒测量一次 |

### 低功耗测量策略

```c
/**
 * @brief 低功耗测量 (间歇测量)
 * @param handle: 句柄
 * @param data: 数据输出
 * @param interval_ms: 测量间隔
 */
void AHT20_LowPowerMeasure(AHT20_Handle_t *handle,
                            AHT20_Data_t *data,
                            uint32_t interval_ms) {
    // 1. 触发测量
    AHT20_StartMeasure(handle);
    
    // 2. 等待完成
    HAL_Delay(80);
    
    // 3. 读取数据
    AHT20_ReadData(handle, data);
    
    // 4. MCU 进入睡眠，等待下次测量
    // __WFI();
}

/**
 * @brief 电池寿命估算
 * 
 * 假设条件:
 * - 供电：3.3V, 2000mAh 锂电池
 * - 测量间隔：10 秒
 * - 测量时间：80ms
 * - 睡眠电流：1μA
 * 
 * 计算:
 * - 测量时电荷：0.8mA × 80ms = 64μC
 * - 睡眠时电荷：1μA × 9920ms = 9.92μC
 * - 平均每周期：73.92μC
 * - 平均电流：73.92μC / 10s = 7.4μA
 * 
 * 理论寿命：2000mAh / 7.4μA ≈ 31 年
 * 实际寿命：约 5-10 年 (考虑自放电)
 */
```

---

## 🔧 调试技巧

### 常见问题

| 问题 | 解决方案 |
|------|----------|
| I2C 无响应 | 检查供电电压 (1.8V-5.5V) |
| 湿度始终为 0 | 确认初始化命令正确发送 |
| 数据异常 | 检查 I2C 时序，降低速度到 100kHz |
| 测量超时 | 传感器可能损坏，尝试软复位 |

### 快速测试

```c
void AHT20_QuickTest(AHT20_Handle_t *handle) {
    AHT20_Data_t data;
    
    printf("\r\n=== AHT20 Quick Test ===\r\n");
    
    // 初始化
    if (AHT20_Init(handle, handle->hi2c, AHT20_ADDR) != HAL_OK) {
        printf("❌ AHT20 初始化失败!\r\n");
        return;
    }
    printf("✅ AHT20 初始化成功\r\n");
    
    // 读取 10 次数据
    for (int i = 0; i < 10; i++) {
        if (AHT20_Measure(handle, &data, 200) == HAL_OK) {
            printf("[%d] Temp: %.2f°C | Humidity: %.2f%%RH\r\n", 
                   i, data.temperature, data.humidity);
        } else {
            printf("❌ 读取失败 (Status: %d)\r\n", data.last_status);
        }
        HAL_Delay(1000);
    }
}
```

### 与 SHT30 对比

| 特性 | AHT20 | SHT30 | 说明 |
|------|-------|-------|------|
| 湿度精度 | ±2% RH | ±2% RH | 相同 |
| 温度精度 | ±0.3°C | ±0.3°C | 相同 |
| 供电电压 | 1.8-5.5V | 2.15-3.6V | AHT20 更宽 |
| 响应时间 | 5s | 8s | AHT20 更快 |
| 价格 | $ | $$ | AHT20 更便宜 |
| 长期稳定性 | 好 | 优秀 | SHT30 更优 |
| CRC 校验 | 无 | 有 | SHT30 更可靠 |

**选型建议:**
- **成本敏感:** 选 AHT20
- **工业应用:** 选 SHT30
- **电池供电:** 两者均可 (AHT20 略优)
- **高可靠性:** 选 SHT30

---

## 🔗 相关链接

- [[SHT30-温湿度传感器]] - 高精度方案
- [[BME280-温湿压传感器]] - 三合一方案
- [[AHT10-温湿度传感器]] - 前代产品

---

*文档创建：2026-03-11 | 维护者：XinSor EE Team*
