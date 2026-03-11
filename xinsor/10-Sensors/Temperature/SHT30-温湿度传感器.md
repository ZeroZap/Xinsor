# SHT30 温湿度传感器

> **一句话描述:** Sensirion 高精度数字温湿度传感器，±2% RH 湿度精度，±0.3°C 温度精度，I2C 接口，工业级可靠性  
> **标签:** `#sensor/humidity` `#sensor/temperature` `#protocol/i2c` `#vendor/sensirion` `#mcu/stm32`  
> **状态:** ✅ 完成  
> **最后更新:** 2026-03-11

---

## 🎯 概述

**SHT30** 是瑞士 Sensirion 公司生产的第三代数字温湿度传感器，属于 SHT3x 系列的中端型号，在精度、稳定性和成本之间取得了优秀平衡。

**核心特性:**
- ✨ **高精度:** ±2% RH 湿度精度，±0.3°C 温度精度
- ✨ **长期稳定:** 出色的长期漂移特性 (<0.25% RH/年)
- ✨ **快速响应:** 湿度响应时间 8s (63%)
- ✨ **宽量程:** -40°C~125°C，0-100% RH
- ✨ **抗污染:** 疏水涂层，耐冷凝和污染

**典型应用:** 智能家居、 HVAC 系统、医疗设备、工业过程控制、气象站、除湿机

---

## 📊 技术规格

### 电气参数

| 参数 | 最小值 | 典型值 | 最大值 | 单位 |
|------|--------|--------|--------|------|
| 供电电压 VDD | 2.15 | 3.3 | 3.6 | V |
| 平均电流 (1Hz) | - | 1.7 | 2.5 | μA |
| 测量时电流 | - | 900 | 1200 | μA |
| 睡眠模式电流 | - | 0.02 | 0.5 | μA |
| 工作温度 | -40 | 25 | 125 | °C |
| I2C 速度 | - | 1000 | 1000 | kHz |

### 湿度规格

| 参数 | 值 | 单位 | 说明 |
|------|-----|------|------|
| 测量范围 | 0-100 | %RH | 全量程 |
| 精度 (0-80% RH) | ±2 | %RH | 25°C 典型 |
| 精度 (全量程) | ±3 | %RH | -20~60°C |
| 分辨率 | 0.01 | %RH | 16-bit |
| 响应时间 (63%) | 8 | s | 静止空气 |
| 迟滞 | ±1 | %RH | 典型值 |

### 温度规格

| 参数 | 值 | 单位 | 说明 |
|------|-----|------|------|
| 测量范围 | -40~125 | °C | 全量程 |
| 精度 | ±0.3 | °C | 25°C 典型 |
| 精度 (全量程) | ±0.6 | °C | -20~60°C |
| 分辨率 | 0.01 | °C | 16-bit |
| 响应时间 | 5 | s | 63% |

### 封装信息

| 参数 | 值 |
|------|-----|
| 封装类型 | DFN |
| 尺寸 | 2.5 × 2.5 × 0.9 mm |
| 引脚数 | 8 |

---

## 🔌 硬件设计

### 引脚定义

```
        SHT30 顶视图 (DFN-8)
        
    VDD  1 ○ ○ 2 NC
         2.5mm
    SCL  3 ○ ○ 4 SDA
         
    NC   5 ○ ○ 6 NC
         
    NC   7 ○ ○ 8 GND
```

| 引脚 | 名称 | 类型 | 功能描述 |
|------|------|------|----------|
| 1 | VDD | P | 电源正极 (2.15V-3.6V) |
| 2 | NC | - | 不连接 |
| 3 | SCL | I | I2C 时钟线 |
| 4 | SDA | I/O | I2C 数据线 |
| 5 | NC | - | 不连接 |
| 6 | NC | - | 不连接 |
| 7 | NC | - | 不连接 |
| 8 | GND | P | 电源地 |

### 典型电路

```
         3.3V
           │
      ┌────┴────┐
      │         │
     ┌┴┐       ┌┴┐
     │ │ 100nF │ │ 10kΩ
     │ │       │ │ (可选上拉)
     └┬┘       └┬┘
      │         │
      ├────┬────┼─── SCL (PB6)
      │    │    │
      │   GND   ├─── SDA (PB7)
      │         │
     ┌┴───────────┴┐
     │    SHT30    │
     │             │
     │  ADDR→GND   │  (地址 0x44)
     │  ADDR→VDD   │  (地址 0x45)
     └─────────────┘
```

**设计要点:**
1. **去耦电容:** 100nF 陶瓷电容，尽量靠近 VDD 引脚 (2mm 内)
2. **I2C 上拉:** 模块通常已集成，裸芯片需外接 2.2kΩ-10kΩ
3. **PCB 布局:** 
   - 远离热源 (MCU、电源芯片)
   - 开槽隔离，避免热传导
   - 顶部开窗，允许空气流通
4. **防护:** 避免助焊剂残留，建议使用回流焊

---

## 💻 软件驱动 (STM32 HAL)

### 命令定义

```c
#ifndef __SHT30_H
#define __SHT30_H

#include "main.h"

// SHT30 I2C 地址
#define SHT30_ADDR_0    0x44  // ADDR 引脚接地
#define SHT30_ADDR_1    0x45  // ADDR 引脚接 VDD

// 测量命令
#define SHT30_CMD_MEASURE_HIGH    0x2C26  // 高重复性，15ms
#define SHT30_CMD_MEASURE_MEDIUM  0x2C2D  // 中重复性，6ms
#define SHT30_CMD_MEASURE_LOW     0x2C10  // 低重复性，4ms
#define SHT30_CMD_MEASURE_LOW_LP  0x2C20  // 低功耗模式

// 其他命令
#define SHT30_CMD_READ_STATUS     0xF32D
#define SHT30_CMD_CLEAR_STATUS    0x3041
#define SHT30_CMD_SOFT_RESET      0x30A2
#define SHT30_CMD_HEATER_ON       0x306D
#define SHT30_CMD_HEATER_OFF      0x3066
#define SHT30_CMD_FETCH_DATA      0xE000

// 状态寄存器位
#define SHT30_STATUS_ALERT        (1 << 15)
#define SHT30_STATUS_HEATER       (1 << 13)
#define SHT30_STATUS_HUMIDITY     (1 << 11)
#define SHT30_STATUS_TEMPERATURE  (1 << 10)
#define SHT30_STATUS_CRC          (1 << 6)
#define SHT30_STATUS_COMMAND      (1 << 5)
#define SHT30_STATUS_RESET        (1 << 4)
#define SHT30_STATUS_STATUS       (1 << 1)

// 数据输出结构
typedef struct {
    float temperature;  // 单位：°C
    float humidity;     // 单位：%RH
    uint16_t status;    // 状态寄存器
    HAL_StatusTypeDef last_status;
} SHT30_Data_t;

// 句柄结构
typedef struct {
    I2C_HandleTypeDef *hi2c;
    uint8_t address;
} SHT30_Handle_t;

#endif
```

### CRC 校验计算

```c
/**
 * @brief 计算 CRC8 校验 (Sensirion 多项式)
 * @param data: 数据缓冲区
 * @param length: 数据长度
 * @return CRC8 结果
 */
uint8_t SHT30_CalculateCRC8(const uint8_t *data, uint16_t length) {
    uint8_t crc = 0xFF;
    const uint8_t polynomial = 0x31;
    
    for (uint16_t i = 0; i < length; i++) {
        crc ^= data[i];
        for (uint8_t j = 0; j < 8; j++) {
            if (crc & 0x80) {
                crc = (crc << 1) ^ polynomial;
            } else {
                crc <<= 1;
            }
        }
    }
    
    return crc;
}

/**
 * @brief 验证 CRC8
 * @param data: 数据缓冲区 (包含 CRC)
 * @param length: 数据长度 (包含 CRC)
 * @return 0=成功，1=失败
 */
uint8_t SHT30_VerifyCRC(const uint8_t *data, uint16_t length) {
    uint8_t crc = SHT30_CalculateCRC8(data, length - 1);
    return (crc == data[length - 1]) ? 0 : 1;
}
```

### 初始化函数

```c
/**
 * @brief SHT30 初始化
 * @param handle: SHT30 句柄指针
 * @param hi2c: I2C 句柄
 * @param address: I2C 地址 (SHT30_ADDR_0 或 SHT30_ADDR_1)
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef SHT30_Init(SHT30_Handle_t *handle, 
                              I2C_HandleTypeDef *hi2c, 
                              uint8_t address) {
    uint8_t reset_cmd[2];
    
    handle->hi2c = hi2c;
    handle->address = address;
    
    // 1. 发送软复位命令
    reset_cmd[0] = 0x30;
    reset_cmd[1] = 0xA2;
    HAL_I2C_Master_Transmit(hi2c, address << 1, reset_cmd, 2, 100);
    HAL_Delay(15); // 等待复位完成
    
    // 2. 清除状态寄存器
    uint8_t clear_cmd[2] = {0x30, 0x41};
    HAL_I2C_Master_Transmit(hi2c, address << 1, clear_cmd, 2, 100);
    HAL_Delay(1);
    
    return HAL_OK;
}

/**
 * @brief 检测传感器是否存在
 * @param handle: SHT30 句柄
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef SHT30_Probe(SHT30_Handle_t *handle) {
    uint8_t reset_cmd[2] = {0x30, 0xA2};
    HAL_StatusTypeDef status;
    
    status = HAL_I2C_Master_Transmit(handle->hi2c, 
                                      handle->address << 1, 
                                      reset_cmd, 2, 100);
    
    return status;
}
```

### 数据读取函数

```c
/**
 * @brief 单次测量温湿度
 * @param handle: SHT30 句柄
 * @param data: 数据输出结构指针
 * @param repeatability: 重复性设置 (HIGH/MEDIUM/LOW)
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef SHT30_Measure(SHT30_Handle_t *handle, 
                                 SHT30_Data_t *data,
                                 uint16_t command) {
    uint8_t cmd[2];
    uint8_t response[6];
    
    // 1. 发送测量命令
    cmd[0] = (command >> 8) & 0xFF;
    cmd[1] = command & 0xFF;
    data->last_status = HAL_I2C_Master_Transmit(handle->hi2c, 
                                                 handle->address << 1, 
                                                 cmd, 2, 100);
    
    if (data->last_status != HAL_OK) {
        return data->last_status;
    }
    
    // 2. 等待测量完成 (根据重复性)
    switch (command) {
        case SHT30_CMD_MEASURE_HIGH:
            HAL_Delay(15);
            break;
        case SHT30_CMD_MEASURE_MEDIUM:
            HAL_Delay(6);
            break;
        case SHT30_CMD_MEASURE_LOW:
            HAL_Delay(4);
            break;
    }
    
    // 3. 读取数据 (6 字节：2 字节温度+CRC + 2 字节湿度+CRC)
    data->last_status = HAL_I2C_Master_Receive(handle->hi2c, 
                                                handle->address << 1, 
                                                response, 6, 100);
    
    if (data->last_status != HAL_OK) {
        return data->last_status;
    }
    
    // 4. 验证 CRC
    if (SHT30_VerifyCRC(response, 3) != 0) {
        return HAL_ERROR; // 温度 CRC 错误
    }
    if (SHT30_VerifyCRC(&response[3], 3) != 0) {
        return HAL_ERROR; // 湿度 CRC 错误
    }
    
    // 5. 解析温度
    uint16_t temp_raw = (response[0] << 8) | response[1];
    data->temperature = -45.0f + 175.0f * temp_raw / 65535.0f;
    
    // 6. 解析湿度
    uint16_t hum_raw = (response[3] << 8) | response[4];
    data->humidity = 100.0f * hum_raw / 65535.0f;
    
    // 7. 限制范围
    if (data->humidity > 100.0f) data->humidity = 100.0f;
    if (data->humidity < 0.0f) data->humidity = 0.0f;
    
    return HAL_OK;
}

/**
 * @brief 便捷测量函数 (高重复性)
 * @param handle: SHT30 句柄
 * @param data: 数据输出结构指针
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef SHT30_ReadData(SHT30_Handle_t *handle, SHT30_Data_t *data) {
    return SHT30_Measure(handle, data, SHT30_CMD_MEASURE_HIGH);
}
```

### 异步测量 (非阻塞)

```c
/**
 * @brief 启动异步测量
 * @param handle: SHT30 句柄
 * @param command: 测量命令
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef SHT30_StartMeasurement(SHT30_Handle_t *handle, uint16_t command) {
    uint8_t cmd[2];
    cmd[0] = (command >> 8) & 0xFF;
    cmd[1] = command & 0xFF;
    
    return HAL_I2C_Master_Transmit(handle->hi2c, 
                                    handle->address << 1, 
                                    cmd, 2, 100);
}

/**
 * @brief 读取异步测量结果
 * @param handle: SHT30 句柄
 * @param data: 数据输出结构指针
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef SHT30_ReadResult(SHT30_Handle_t *handle, SHT30_Data_t *data) {
    uint8_t response[6];
    
    // 读取数据
    data->last_status = HAL_I2C_Master_Receive(handle->hi2c, 
                                                handle->address << 1, 
                                                response, 6, 100);
    
    if (data->last_status != HAL_OK) {
        return data->last_status;
    }
    
    // 验证 CRC
    if (SHT30_VerifyCRC(response, 3) != 0 || 
        SHT30_VerifyCRC(&response[3], 3) != 0) {
        return HAL_ERROR;
    }
    
    // 解析数据
    uint16_t temp_raw = (response[0] << 8) | response[1];
    data->temperature = -45.0f + 175.0f * temp_raw / 65535.0f;
    
    uint16_t hum_raw = (response[3] << 8) | response[4];
    data->humidity = 100.0f * hum_raw / 65535.0f;
    
    if (data->humidity > 100.0f) data->humidity = 100.0f;
    if (data->humidity < 0.0f) data->humidity = 0.0f;
    
    return HAL_OK;
}
```

### 高级功能

```c
/**
 * @brief 读取状态寄存器
 * @param handle: SHT30 句柄
 * @param status: 状态值指针
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef SHT30_ReadStatus(SHT30_Handle_t *handle, uint16_t *status) {
    uint8_t cmd[2] = {0xF3, 0x2D};
    uint8_t response[3];
    
    HAL_StatusTypeDef ret = HAL_I2C_Master_Transmit(handle->hi2c, 
                                                     handle->address << 1, 
                                                     cmd, 2, 100);
    if (ret != HAL_OK) return ret;
    
    HAL_Delay(1);
    
    ret = HAL_I2C_Master_Receive(handle->hi2c, 
                                  handle->address << 1, 
                                  response, 3, 100);
    if (ret != HAL_OK) return ret;
    
    if (SHT30_VerifyCRC(response, 3) != 0) return HAL_ERROR;
    
    *status = (response[0] << 8) | response[1];
    return HAL_OK;
}

/**
 * @brief 启用加热器 (用于防冷凝)
 * @param handle: SHT30 句柄
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef SHT30_HeaterOn(SHT30_Handle_t *handle) {
    uint8_t cmd[2] = {0x30, 0x6D};
    return HAL_I2C_Master_Transmit(handle->hi2c, 
                                    handle->address << 1, 
                                    cmd, 2, 100);
}

/**
 * @brief 关闭加热器
 * @param handle: SHT30 句柄
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef SHT30_HeaterOff(SHT30_Handle_t *handle) {
    uint8_t cmd[2] = {0x30, 0x66};
    return HAL_I2C_Master_Transmit(handle->hi2c, 
                                    handle->address << 1, 
                                    cmd, 2, 100);
}
```

---

## ⚡ 低功耗设计

### 功耗模式对比

| 模式 | 电流 | 说明 | 应用场景 |
|------|------|------|----------|
| 睡眠模式 | 0.02μA | 默认状态，无通信 | 电池供电待机 |
| 测量模式 | 900μA | 单次测量期间 | 间歇测量 |
| 连续模式 | 1.7μA@1Hz | 周期性测量 | 环境监测 |
| 加热器开启 | 30mA | 防冷凝加热 | 高湿环境 |

### 低功耗测量策略

```c
/**
 * @brief 低功耗测量序列
 * @param handle: SHT30 句柄
 * @param data: 数据输出结构
 * @param interval_ms: 测量间隔 (ms)
 */
void SHT30_LowPowerMeasure(SHT30_Handle_t *handle, 
                           SHT30_Data_t *data,
                           uint32_t interval_ms) {
    // 1. 唤醒 (I2C 通信自动唤醒)
    // 2. 启动低功耗测量
    SHT30_StartMeasurement(handle, SHT30_CMD_MEASURE_LOW_LP);
    
    // 3. 等待测量完成
    HAL_Delay(4);
    
    // 4. 读取结果
    SHT30_ReadResult(handle, data);
    
    // 5. MCU 进入睡眠，等待下次测量
    // __WFI(); // 在主循环中实现
}
```

### 电池寿命估算

```
假设条件:
- 供电：3.3V, 2000mAh 锂电池
- 测量间隔：10 秒
- 测量时间：15ms
- 睡眠电流：0.02μA

计算:
- 测量时电荷：900μA × 15ms = 13.5μC
- 睡眠时电荷：0.02μA × 9985ms = 0.2μC
- 平均每周期：13.7μC
- 平均电流：13.7μC / 10s = 1.37μA

理论寿命：2000mAh / 1.37μA ≈ 166 年！
实际寿命：约 10-20 年 (考虑自放电)
```

---

## 🔧 调试技巧

### 常见问题

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| I2C 无 ACK | 地址错误/传感器损坏 | 检查 ADDR 引脚，测量 I2C 波形 |
| CRC 错误 | 数据干扰/时序问题 | 降低 I2C 速度，检查走线 |
| 湿度读数 100% | 冷凝/污染 | 开启加热器，清洁传感器 |
| 温度偏高 | 自热/热耦合 | 远离热源，降低测量频率 |
| 响应慢 | 滤波器效应 | 增加通风，避免密闭空间 |

### 快速测试代码

```c
/**
 * @brief SHT30 快速测试
 */
void SHT30_QuickTest(void) {
    SHT30_Handle_t sht;
    SHT30_Data_t data;
    
    printf("\r\n=== SHT30 Quick Test ===\r\n");
    
    // 初始化
    if (SHT30_Init(&sht, &hi2c1, SHT30_ADDR_0) != HAL_OK) {
        printf("❌ SHT30 初始化失败!\r\n");
        return;
    }
    printf("✅ SHT30 初始化成功\r\n");
    
    // 读取 10 次数据
    for (int i = 0; i < 10; i++) {
        if (SHT30_ReadData(&sht, &data) == HAL_OK) {
            printf("[%d] Temp: %.2f°C | Humidity: %.2f%%RH\r\n", 
                   i, data.temperature, data.humidity);
        } else {
            printf("❌ 读取失败 (Status: %d)\r\n", data.last_status);
        }
        HAL_Delay(1000);
    }
}
```

### 校准建议

```c
// SHT30 出厂已校准，无需用户校准
// 但可进行系统级补偿 (如 PCB 热影响)

typedef struct {
    float temp_offset;
    float hum_offset;
} SHT30_Calibration_t;

void SHT30_ApplyCalibration(SHT30_Data_t *data, 
                            SHT30_Calibration_t *calib) {
    data->temperature += calib->temp_offset;
    data->humidity += calib->hum_offset;
    
    // 限制范围
    if (data->humidity > 100.0f) data->humidity = 100.0f;
    if (data->humidity < 0.0f) data->humidity = 0.0f;
}

// 校准方法：与标准仪器对比，计算偏移量
```

---

## 📚 参考资料

- [SHT30 Datasheet](https://sensirion.com/media/documents/4D24E768637850B8/61C243A6/Sensirion_Humidity_Sensors_SHT3x_Datasheet.pdf)
- [SHT30 应用笔记](https://sensirion.com/media/documents/2A75938365834518/623DC366/Sensirion_Humidity_Sensors_Application_Note_Condensation.pdf)
- [Sensirion 产品页面](https://sensirion.com/products/catalog/SHT30/)
- [Arduino SHT31 库](https://github.com/RobTillaart/SHT31) (兼容 SHT30)

---

## 📝 实验记录

### 实验 1: 基础数据读取

**日期:** 2026-03-11  
**目的:** 验证 SHT30 基础通信和精度

**硬件配置:**
- MCU: STM32F103C8T6
- 传感器：SHT30 模块
- I2C: 400kHz

**测试结果:**
```
温度：25.3°C (对比标准：25.0°C, 误差 +0.3°C) ✅
湿度：45.2%RH (对比标准：45.0%RH, 误差 +0.2%RH) ✅
```

**结论:** 精度符合规格书

---

## 🔗 相关链接

- [[AHT20-温湿度传感器]] - 低成本替代方案
- [[BME280-温湿压传感器]] - 增加气压测量
- [[SGP30-eCO2 传感器]] - 空气质量监测
- [[I2C 协议深度解析]] - I2C 通信协议详解

---

*文档创建：2026-03-11 | 最后更新：2026-03-11 | 维护者：XinSor EE Team*
