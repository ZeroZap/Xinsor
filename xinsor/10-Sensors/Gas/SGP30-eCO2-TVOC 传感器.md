# SGP30 eCO2/TVOC 空气质量传感器

> **一句话描述:** Sensirion 多像素气体传感器，检测 eCO2 和 TVOC，I2C 接口，低功耗，适用于室内空气质量监测  
> **标签:** `#sensor/gas` `#sensor/air-quality` `#protocol/i2c` `#vendor/sensirion` `#app/iot` `#app/smart-home`  
> **状态:** ✅ 完成  
> **最后更新:** 2026-03-11

---

## 🎯 概述

**SGP30** 是瑞士 Sensirion 公司生产的多像素气体传感器，采用先进的 MOX (金属氧化物) 技术，可以检测等效二氧化碳 (eCO2) 和总挥发性有机化合物 (TVOC)，是室内空气质量监测的理想选择。

**核心特性:**
- ✨ **双输出:** eCO2 (400-60000ppm) + TVOC (0-60000ppb)
- ✨ **多像素技术:** 4 个独立传感单元，提高选择性
- ✨ **低功耗:** 测量模式 48mA，睡眠模式<20μA
- ✨ **长寿命:** >10 年使用寿命
- ✨ **出厂校准:** 每颗传感器单独校准
- ✨ **小封装:** 2.45 × 2.45 × 0.75 mm DFN

**典型应用:** 智能家居、新风系统、空气净化器、HVAC 控制、可穿戴设备、IoT 空气质量监测

---

## 📊 技术规格

### 电气参数

| 参数 | 最小值 | 典型值 | 最大值 | 单位 |
|------|--------|--------|--------|------|
| 供电电压 VDD | 1.71 | 3.3 | 3.6 | V |
| 工作电流 (测量) | - | 48 | 60 | mA |
| 睡眠模式电流 | - | 15 | 20 | μA |
| 工作温度 | -20 | 25 | 50 | °C |
| 工作湿度 | 5 | 95 | 95 | %RH |
| I2C 速度 | - | 100 | 100 | kHz |

### eCO2 规格

| 参数 | 值 | 单位 | 说明 |
|------|-----|------|------|
| 测量范围 | 400-60000 | ppm | 等效 CO2 |
| 分辨率 | 1 | ppm | - |
| 精度 | ±(40+5%) | ppm | 400-2000ppm 范围 |
| 响应时间 | 60 | s | 典型值 |

### TVOC 规格

| 参数 | 值 | 单位 | 说明 |
|------|-----|------|------|
| 测量范围 | 0-60000 | ppb | 总挥发性有机物 |
| 分辨率 | 1 | ppb | - |
| 精度 | ±(15+5%) | ppb | 0-500ppb 范围 |
| 响应时间 | 60 | s | 典型值 |

### 封装信息

| 参数 | 值 |
|------|-----|
| 封装类型 | DFN |
| 尺寸 | 2.45 × 2.45 × 0.75 mm |
| 引脚数 | 6 |

---

## 🔌 硬件设计

### 引脚定义

```
        SGP30 顶视图 (DFN-6)
        
    VDD  1 ○ ○ 2 SCL
         
    NC   3 ○ ○ 4 SDA
         
    GND  5 ○ ○ 6 NC
```

| 引脚 | 名称 | 类型 | 功能描述 |
|------|------|------|----------|
| 1 | VDD | P | 电源正极 (1.71V-3.6V) |
| 2 | SCL | I | I2C 时钟线 |
| 3 | NC | - | 不连接 |
| 4 | SDA | I/O | I2C 数据线 |
| 5 | GND | P | 电源地 |
| 6 | NC | - | 不连接 |

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
     │    SGP30    │
     │             │
     └─────────────┘
```

**设计要点:**
1. **去耦电容:** 100nF 陶瓷电容，尽量靠近 VDD 引脚
2. **I2C 上拉:** 4.7kΩ (3.3V 系统)
3. **PCB 布局:** 
   - 底部焊盘必须接地
   - 远离热源和气流
   - 避免有机溶剂污染
4. **使用环境:** 
   - 避免硅蒸汽 (会导致传感器中毒)
   - 避免高浓度溶剂
   - 保持适当湿度 (10-90% RH)

---

## 💻 软件驱动 (STM32 HAL)

### 寄存器定义

```c
#ifndef __SGP30_H
#define __SGP30_H

#include "main.h"

// SGP30 I2C 地址
#define SGP30_ADDR          0x58

// 命令定义
#define SGP30_CMD_INIT_AIR_QUALITY    0x2003
#define SGP30_CMD_MEASURE_AIR_QUALITY 0x2008
#define SGP30_CMD_SET_HUMIDITY        0x2061
#define SGP30_CMD_GET_FEATURESET      0x202F
#define SGP30_CMD_GET_SERIAL_ID       0x3682
#define SGP30_CMD_MEASURE_TEST        0x2032
#define SGP30_CMD_GET_BASELINE        0x2015
#define SGP30_CMD_SET_BASELINE        0x201E
#define SGP30_CMD_SOFT_RESET          0x0006

// 数据输出结构
typedef struct {
    uint16_t eco2;        // eCO2 浓度 (ppm)
    uint16_t tvoc;        // TVOC 浓度 (ppb)
    HAL_StatusTypeDef last_status;
} SGP30_Data_t;

// 句柄结构
typedef struct {
    I2C_HandleTypeDef *hi2c;
    uint8_t address;
    uint8_t initialized;
    uint16_t baseline_eco2;
    uint16_t baseline_tvoc;
} SGP30_Handle_t;

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
uint8_t SGP30_CalculateCRC8(const uint8_t *data, uint16_t length) {
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
uint8_t SGP30_VerifyCRC(const uint8_t *data, uint16_t length) {
    uint8_t crc = SGP30_CalculateCRC8(data, length - 1);
    return (crc == data[length - 1]) ? 0 : 1;
}
```

### 初始化函数

```c
/**
 * @brief SGP30 初始化
 * @param handle: 句柄
 * @param hi2c: I2C 句柄
 * @param address: I2C 地址
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef SGP30_Init(SGP30_Handle_t *handle,
                              I2C_HandleTypeDef *hi2c,
                              uint8_t address) {
    uint8_t cmd[2];
    uint8_t response[3];
    
    handle->hi2c = hi2c;
    handle->address = address;
    handle->initialized = 0;
    handle->baseline_eco2 = 0;
    handle->baseline_tvoc = 0;
    
    // 1. 软复位
    cmd[0] = 0x00;
    cmd[1] = 0x06;
    HAL_I2C_Master_Transmit(hi2c, address << 1, cmd, 2, 100);
    HAL_Delay(15);  // 复位需要 15ms
    
    // 2. 读取序列号 (验证通信)
    cmd[0] = 0x36;
    cmd[1] = 0x82;
    if (HAL_I2C_Master_Transmit(hi2c, address << 1, cmd, 2, 100) != HAL_OK) {
        return HAL_ERROR;
    }
    HAL_Delay(1);
    if (HAL_I2C_Master_Receive(hi2c, address << 1, response, 3, 100) != HAL_OK) {
        return HAL_ERROR;
    }
    if (SGP30_VerifyCRC(response, 3) != 0) {
        return HAL_ERROR;
    }
    
    // 3. 初始化空气质量测量
    cmd[0] = 0x20;
    cmd[1] = 0x03;
    if (HAL_I2C_Master_Transmit(hi2c, address << 1, cmd, 2, 100) != HAL_OK) {
        return HAL_ERROR;
    }
    HAL_Delay(10);
    
    // 4. 等待初始化完成 (约 15 秒)
    // 实际应用中可以使用非阻塞方式
    
    handle->initialized = 1;
    return HAL_OK;
}

/**
 * @brief 读取传感器序列号
 * @param handle: 句柄
 * @param serial_id: 序列号输出 (6 字节)
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef SGP30_ReadSerialID(SGP30_Handle_t *handle, uint8_t *serial_id) {
    uint8_t cmd[2];
    uint8_t response[9];  // 6 字节 ID + 3 字节 CRC
    
    cmd[0] = 0x36;
    cmd[1] = 0x82;
    
    HAL_StatusTypeDef status = HAL_I2C_Master_Transmit(handle->hi2c,
                                                        handle->address << 1,
                                                        cmd, 2, 100);
    if (status != HAL_OK) return status;
    
    HAL_Delay(1);
    
    status = HAL_I2C_Master_Receive(handle->hi2c,
                                     handle->address << 1,
                                     response, 9, 100);
    if (status != HAL_OK) return status;
    
    // 验证 CRC (每 2 字节数据 +1 字节 CRC)
    if (SGP30_VerifyCRC(&response[0], 3) != 0 ||
        SGP30_VerifyCRC(&response[3], 3) != 0 ||
        SGP30_VerifyCRC(&response[6], 3) != 0) {
        return HAL_ERROR;
    }
    
    // 复制序列号
    memcpy(serial_id, response, 6);
    
    return HAL_OK;
}
```

### 数据读取函数

```c
/**
 * @brief 测量空气质量 (eCO2 + TVOC)
 * @param handle: 句柄
 * @param data: 数据输出
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef SGP30_MeasureAirQuality(SGP30_Handle_t *handle,
                                           SGP30_Data_t *data) {
    uint8_t cmd[2];
    uint8_t response[6];
    
    // 1. 发送测量命令
    cmd[0] = 0x20;
    cmd[1] = 0x08;
    data->last_status = HAL_I2C_Master_Transmit(handle->hi2c,
                                                 handle->address << 1,
                                                 cmd, 2, 100);
    if (data->last_status != HAL_OK) {
        return data->last_status;
    }
    
    // 2. 等待测量完成
    HAL_Delay(50);
    
    // 3. 读取数据 (6 字节：2 字节 eCO2+CRC + 2 字节 TVOC+CRC)
    data->last_status = HAL_I2C_Master_Receive(handle->hi2c,
                                                handle->address << 1,
                                                response, 6, 100);
    if (data->last_status != HAL_OK) {
        return data->last_status;
    }
    
    // 4. 验证 CRC
    if (SGP30_VerifyCRC(&response[0], 3) != 0 ||
        SGP30_VerifyCRC(&response[3], 3) != 0) {
        data->last_status = HAL_ERROR;
        return HAL_ERROR;
    }
    
    // 5. 解析数据
    data->eco2 = (response[0] << 8) | response[1];
    data->tvoc = (response[3] << 8) | response[4];
    
    return HAL_OK;
}

/**
 * @brief 设置湿度补偿 (提高精度)
 * @param handle: 句柄
 * @param humidity: 相对湿度 (0.0-100.0 %RH)
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef SGP30_SetHumidity(SGP30_Handle_t *handle, float humidity) {
    uint8_t cmd[4];
    
    // 将湿度转换为 SGP30 格式 (humidity * 256)
    uint16_t hum_value = (uint16_t)(humidity * 256.0f);
    
    cmd[0] = 0x20;
    cmd[1] = 0x61;
    cmd[2] = (hum_value >> 8) & 0xFF;
    cmd[3] = hum_value & 0xFF;
    
    // 计算 CRC
    uint8_t crc = SGP30_CalculateCRC8(&cmd[2], 2);
    
    return HAL_I2C_Master_Transmit(handle->hi2c,
                                    handle->address << 1,
                                    cmd, 4, 100);
}
```

### Baseline 管理 (重要!)

```c
/**
 * @brief 获取 Baseline 值 (用于长期稳定性)
 * @param handle: 句柄
 * @param eco2_baseline: eCO2 baseline 指针
 * @param tvoc_baseline: TVOC baseline 指针
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef SGP30_GetBaseline(SGP30_Handle_t *handle,
                                     uint16_t *eco2_baseline,
                                     uint16_t *tvoc_baseline) {
    uint8_t cmd[2];
    uint8_t response[6];
    
    cmd[0] = 0x20;
    cmd[1] = 0x15;
    
    HAL_StatusTypeDef status = HAL_I2C_Master_Transmit(handle->hi2c,
                                                        handle->address << 1,
                                                        cmd, 2, 100);
    if (status != HAL_OK) return status;
    
    HAL_Delay(10);
    
    status = HAL_I2C_Master_Receive(handle->hi2c,
                                     handle->address << 1,
                                     response, 6, 100);
    if (status != HAL_OK) return status;
    
    if (SGP30_VerifyCRC(&response[0], 3) != 0 ||
        SGP30_VerifyCRC(&response[3], 3) != 0) {
        return HAL_ERROR;
    }
    
    *eco2_baseline = (response[0] << 8) | response[1];
    *tvoc_baseline = (response[3] << 8) | response[4];
    
    // 保存到 handle
    handle->baseline_eco2 = *eco2_baseline;
    handle->baseline_tvoc = *tvoc_baseline;
    
    return HAL_OK;
}

/**
 * @brief 设置 Baseline 值 (上电后恢复)
 * @param handle: 句柄
 * @param eco2_baseline: eCO2 baseline 值
 * @param tvoc_baseline: TVOC baseline 值
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef SGP30_SetBaseline(SGP30_Handle_t *handle,
                                     uint16_t eco2_baseline,
                                     uint16_t tvoc_baseline) {
    uint8_t cmd[6];
    
    cmd[0] = 0x20;
    cmd[1] = 0x1E;
    cmd[2] = (eco2_baseline >> 8) & 0xFF;
    cmd[3] = eco2_baseline & 0xFF;
    
    // 计算 CRC
    cmd[4] = SGP30_CalculateCRC8(&cmd[2], 2);
    
    // 发送 eCO2 baseline
    HAL_StatusTypeDef status = HAL_I2C_Master_Transmit(handle->hi2c,
                                                        handle->address << 1,
                                                        cmd, 5, 100);
    if (status != HAL_OK) return status;
    
    HAL_Delay(1);
    
    // 设置 TVOC baseline
    cmd[2] = (tvoc_baseline >> 8) & 0xFF;
    cmd[3] = tvoc_baseline & 0xFF;
    cmd[4] = SGP30_CalculateCRC8(&cmd[2], 2);
    
    return HAL_I2C_Master_Transmit(handle->hi2c,
                                    handle->address << 1,
                                    cmd, 5, 100);
}
```

---

## ⚡ 低功耗设计

### 功耗模式

| 模式 | 电流 | 说明 |
|------|------|------|
| 睡眠 | 15μA | 最低功耗 |
| 测量 | 48mA | 测量期间 (约 60ms) |
| 平均 (1Hz) | 3mA | 每秒测量一次 |

### 低功耗测量策略

```c
/**
 * @brief 低功耗测量 (间歇测量)
 * @param handle: 句柄
 * @param data: 数据输出
 * @param interval_ms: 测量间隔
 */
void SGP30_LowPowerMeasure(SGP30_Handle_t *handle,
                            SGP30_Data_t *data,
                            uint32_t interval_ms) {
    // 注意：SGP30 需要持续供电以保持 baseline
    // 不建议频繁开关电源
    
    // 1. 测量空气质量
    SGP30_MeasureAirQuality(handle, data);
    
    // 2. MCU 进入睡眠
    // __WFI();
}

/**
 * @brief Baseline 保存策略
 * 
 * SGP30 的 baseline 值会随时间学习，断电后需要恢复
 * 建议每 12 小时保存一次 baseline 到 Flash/EEPROM
 * 
 * 保存时机:
 * 1. 系统关机前
 * 2. 每 12 小时定期保存
 * 3. 当 baseline 变化较大时
 */
```

---

## 🔧 调试技巧

### 常见问题

| 问题 | 解决方案 |
|------|----------|
| I2C 无响应 | 检查供电电压，确认上拉电阻 |
| eCO2 始终 400ppm | 传感器需要 15 秒初始化，等待后再读取 |
| 读数漂移 | 恢复保存的 baseline 值，确保适当通风 |
| CRC 错误 | 检查 I2C 时序，降低速度到 50kHz |

### 快速测试

```c
void SGP30_QuickTest(SGP30_Handle_t *handle) {
    SGP30_Data_t data;
    uint8_t serial_id[6];
    
    printf("\r\n=== SGP30 Air Quality Test ===\r\n");
    
    // 初始化
    if (SGP30_Init(handle, handle->hi2c, SGP30_ADDR) != HAL_OK) {
        printf("❌ SGP30 初始化失败!\r\n");
        return;
    }
    printf("✅ SGP30 初始化成功\r\n");
    
    // 读取序列号
    if (SGP30_ReadSerialID(handle, serial_id) == HAL_OK) {
        printf("Serial ID: %02X%02X%02X%02X%02X%02X\r\n",
               serial_id[0], serial_id[1], serial_id[2],
               serial_id[3], serial_id[4], serial_id[5]);
    }
    
    // 等待初始化完成
    printf("等待传感器初始化 (15 秒)...\r\n");
    for (int i = 15; i > 0; i--) {
        printf("%d ", i);
        HAL_Delay(1000);
    }
    printf("\r\n");
    
    // 读取 10 次数据
    for (int i = 0; i < 10; i++) {
        if (SGP30_MeasureAirQuality(handle, &data) == HAL_OK) {
            printf("[%d] eCO2: %d ppm | TVOC: %d ppb\r\n", 
                   i, data.eco2, data.tvoc);
        } else {
            printf("❌ 读取失败 (Status: %d)\r\n", data.last_status);
        }
        HAL_Delay(1000);
    }
}
```

### 空气质量等级参考

| eCO2 (ppm) | 空气质量 | 建议 |
|------------|----------|------|
| 400-600 | 优秀 | 正常通风 |
| 600-800 | 良好 | 适当通风 |
| 800-1000 | 一般 | 建议通风 |
| 1000-1500 | 较差 | 需要通风 |
| >1500 | 差 | 立即通风 |

| TVOC (ppb) | 空气质量 | 建议 |
|------------|----------|------|
| 0-220 | 优秀 | 正常 |
| 220-660 | 良好 | 正常 |
| 660-2200 | 一般 | 注意通风 |
| 2200-6600 | 较差 | 查找污染源 |
| >6600 | 差 | 立即处理 |

---

## 🔗 相关链接

- [[CCS811-eCO2 传感器]] - 竞品对比
- [[MH-Z19-CO2 传感器]] - 红外 CO2 方案
- [[BME680-气体传感器]] - 四合一方案
- [[SHT30-温湿度传感器]] - 湿度补偿配合

---

*文档创建：2026-03-11 | 维护者：XinSor EE Team*
