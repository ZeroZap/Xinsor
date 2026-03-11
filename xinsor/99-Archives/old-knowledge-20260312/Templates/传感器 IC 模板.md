# {{传感器名称}} {{型号}}

> **一句话描述:** {{简短描述传感器功能和特点}}  
> **标签:** `#sensor/{{类型}}` `#protocol/{{接口}}` `#mcu/stm32` `#vendor/{{厂商}}`  
> **状态:** 📝 草稿 | ✅ 完成 | 🔄 更新中  
> **最后更新:** {{YYYY-MM-DD}}

---

## 🎯 概述

{{传感器名称}} ({{型号}}) 是{{厂商}}生产的一款{{类型}}传感器，具有以下特点:

- ✨ **核心特性 1:** {{描述}}
- ✨ **核心特性 2:** {{描述}}
- ✨ **核心特性 3:** {{描述}}

**典型应用:** {{应用场景 1}}、{{应用场景 2}}、{{应用场景 3}}

---

## 📊 技术规格

### 电气参数

| 参数 | 最小值 | 典型值 | 最大值 | 单位 |
|------|--------|--------|--------|------|
| 供电电压 | {{}} | {{}} | {{}} | V |
| 工作电流 | {{}} | {{}} | {{}} | μA |
| 待机电流 | {{}} | {{}} | {{}} | μA |
| 工作温度 | {{}} | - | {{}} | °C |

### 性能参数

| 参数 | 值 | 单位 | 说明 |
|------|-----|------|------|
| 测量范围 | {{}} | {{}} | {{}} |
| 分辨率 | {{}} | {{}} | {{}} |
| 精度 | {{}} | {{}} | {{}} |
| 输出数据率 | {{}} | Hz | {{}} |

### 封装信息

| 参数 | 值 |
|------|-----|
| 封装类型 | {{LGA/QFN/BGA}} |
| 尺寸 | {{x.x × x.x × x.x mm}} |
| 引脚数 | {{}} |

---

## 🔌 硬件设计

### 引脚定义

```
┌─────────────────────────────────┐
│        {{型号}} 顶视图           │
│                                 │
│   1  2  3  4                    │
│   ○  ○  ○  ○                    │
│                                 │
│   8  7  6  5                    │
│   ○  ○  ○  ○                    │
└─────────────────────────────────┘
```

| 引脚 | 名称 | 类型 | 功能描述 |
|------|------|------|----------|
| 1 | VDD | P | 电源正极 (1.8V-3.6V) |
| 2 | GND | P | 电源地 |
| 3 | SCL | I | I2C 时钟线 |
| 4 | SDA | I/O | I2C 数据线 |
| 5 | ADDR | I | 地址选择 |
| 6 | INT | O | 中断输出 |
| 7 | {{}} | {{}} | {{}} |
| 8 | {{}} | {{}} | {{}} |

### 典型电路

```
        VDD (3.3V)
          │
     ┌────┴────┐
     │         │
    ┌┴┐       ┌┴┐
    │ │ 100nF │ │ 10kΩ
    │ │       │ │ (上拉)
    └┬┘       └┬┘
     │         │
     ├────┬────┼─── SCL
     │    │    │
     │   GND   ├─── SDA
     │         │
    ┌┴───────────┴┐
    │   {{型号}}   │
    │             │
    └─────────────┘
```

**设计要点:**
1. {{去耦电容尽量靠近 VDD 引脚}}
2. {{I2C 上拉电阻推荐值}}
3. {{PCB 布局注意事项}}

---

## 💻 软件驱动

### 寄存器映射

| 地址 | 寄存器名 | 位宽 | 说明 |
|------|----------|------|------|
| 0x{{}} | {{REG_NAME}} | 8-bit | {{描述}} |
| 0x{{}} | {{}} | {{}} | {{}} |

### 初始化流程

```c
/**
 * @brief {{型号}} 初始化
 * @param hi2c: I2C 句柄
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef {{MODEL}}_Init(I2C_HandleTypeDef *hi2c) {
    uint8_t chip_id = 0;
    
    // 1. 读取芯片 ID 验证
    HAL_I2C_Mem_Read(hi2c, {{ADDR}}, {{ID_REG}}, 
                     I2C_MEMADD_SIZE_8BIT, &chip_id, 1, 100);
    
    if (chip_id != {{EXPECTED_ID}}) {
        return HAL_ERROR; // 芯片 ID 不匹配
    }
    
    // 2. 软件复位
    HAL_I2C_Mem_Write(hi2c, {{ADDR}}, {{CTRL_REG}}, 
                      I2C_MEMADD_SIZE_8BIT, &{{RESET_VAL}}, 1, 100);
    HAL_Delay(10);
    
    // 3. 配置测量模式
    uint8_t config = {{CONFIG_VALUE}};
    HAL_I2C_Mem_Write(hi2c, {{ADDR}}, {{CFG_REG}}, 
                      I2C_MEMADD_SIZE_8BIT, &config, 1, 100);
    
    return HAL_OK;
}
```

### 数据读取

```c
/**
 * @brief 读取传感器数据
 * @param hi2c: I2C 句柄
 * @param data: 数据缓冲区
 * @return HAL_StatusTypeDef
 */
HAL_StatusTypeDef {{MODEL}}_ReadData(I2C_HandleTypeDef *hi2c, 
                                      {{TYPE}}_Data_t *data) {
    uint8_t buffer[{{SIZE}}];
    
    // 读取数据寄存器
    HAL_I2C_Mem_Read(hi2c, {{ADDR}}, {{DATA_REG}}, 
                     I2C_MEMADD_SIZE_8BIT, buffer, {{SIZE}}, 100);
    
    // 解析数据
    data->{{field1}} = (int16_t)((buffer[1] << 8) | buffer[0]);
    data->{{field2}} = (int16_t)((buffer[3] << 8) | buffer[2]);
    data->{{field3}} = (int16_t)((buffer[5] << 8) | buffer[4]);
    
    return HAL_OK;
}
```

### 中断处理

```c
// 中断服务函数
void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin) {
    if (GPIO_Pin == {{SENSOR_INT_PIN}}) {
        // 读取中断状态寄存器
        uint8_t int_status;
        HAL_I2C_Mem_Read(&hi2c1, {{ADDR}}, {{INT_REG}}, 
                         I2C_MEMADD_SIZE_8BIT, &int_status, 1, 100);
        
        // 处理中断事件
        if (int_status & {{INT_MASK}}) {
            // {{中断处理逻辑}}
        }
    }
}
```

---

## ⚡ 低功耗设计

### 功耗模式

| 模式 | 电流 | 说明 | 应用场景 |
|------|------|------|----------|
| 睡眠模式 | {{}} μA | 最低功耗，寄存器保持 | 长期待机 |
| 待机模式 | {{}} μA | 快速唤醒 | 间歇测量 |
| 正常模式 | {{}} μA | 连续测量 | 实时监测 |
| 高性能模式 | {{}} μA | 最高精度 | 关键测量 |

### 功耗优化技巧

1. **占空比控制:** {{描述}}
2. **中断唤醒:** {{描述}}
3. **FIFO 缓冲:** {{描述}}
4. **动态 ODR 调整:** {{描述}}

**示例代码:**
```c
// 进入低功耗模式
uint8_t low_power_config = {{LOW_POWER_VALUE}};
HAL_I2C_Mem_Write(&hi2c1, {{ADDR}}, {{PWR_REG}}, 
                  I2C_MEMADD_SIZE_8BIT, &low_power_config, 1, 100);
```

---

## 🔧 调试技巧

### 常见问题

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 无法读取芯片 ID | I2C 地址错误/上拉电阻缺失 | 检查地址配置和硬件连接 |
| 数据异常 | 寄存器配置错误 | 检查初始化序列 |
| 功耗过高 | 未进入低功耗模式 | 检查模式配置 |
| 中断不触发 | 中断配置错误 | 检查中断使能和极性 |

### 测试代码

```c
// 快速测试函数
void {{MODEL}}_QuickTest(void) {
    printf("{{型号}} Quick Test\r\n");
    
    // 读取 WHO_AM_I
    uint8_t id;
    if ({{MODEL}}_ReadID(&id) == HAL_OK) {
        printf("Chip ID: 0x%02X\r\n", id);
    } else {
        printf("Failed to read Chip ID\r\n");
    }
    
    // 读取数据
    {{TYPE}}_Data_t data;
    if ({{MODEL}}_ReadData(&data) == HAL_OK) {
        printf("Data: %d, %d, %d\r\n", data.x, data.y, data.z);
    }
}
```

---

## 📚 参考资料

- [{{型号}} Datasheet]({{链接}})
- [{{型号}} Application Note]({{链接}})
- [厂商产品页面]({{链接}})
- [参考设计]({{链接}})

---

## 📝 实验记录

### 实验 1: {{实验名称}}

**日期:** {{YYYY-MM-DD}}  
**目的:** {{实验目的}}

**硬件配置:**
- MCU: {{型号}}
- 传感器：{{型号}}
- 供电：{{电压}}

**测试结果:**
{{记录测试数据}}

**结论:**
{{实验结论}}

---

## 🔗 相关链接

- [[{{相关传感器 1}}]] - {{描述}}
- [[{{相关传感器 2}}]] - {{描述}}
- [[{{通信协议}}]] - {{描述}}

---

*文档创建：{{日期}} | 最后更新：{{日期}} | 维护者：XinSor Team*
