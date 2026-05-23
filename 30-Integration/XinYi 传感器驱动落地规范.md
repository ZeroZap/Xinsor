# XinYi 传感器驱动落地规范

**定位**: 将 XinSor 的型号笔记转化为 XinYi 传感器驱动目录、README、接口和测试 checklist 的统一规范  
**来源样例**: BMP280、AHT20、MPU6050  
**状态**: 草案  
**最后更新**: 2026-05-20

---

## 目标

该规范用于把 XinSor 的知识条目稳定转化为 XinYi 可实现的驱动任务。它不替代 XinYi 的真实代码规范，而是在进入代码仓库前明确：目录怎么建、README 写什么、接口最少有哪些、bring-up 如何验收、验证结果如何回填 XinSor。

---

## 样例覆盖面

| 样例 | 类型 | 代表复杂度 | 可复用到 |
|------|------|------------|----------|
| [[10-Sensors/Pressure/BMP280-气压传感器|BMP280]] | 气压/补偿算法类 | 校准参数、补偿算法、配置项、低功耗 forced mode | BME280、DPS310、LPS22HB、MS5611 |
| [[10-Sensors/Temperature/AHT20-温湿度传感器|AHT20]] | 简单命令式温湿度类 | I2C 命令流、busy 轮询、20-bit 数据换算 | SHT30、SHT40、HDC1080、SI7021 |
| [[10-Sensors/IMU/MPU6050-6 轴 IMU|MPU6050]] | IMU 多轴运动类 | 多轴 burst 读取、量程、校准、中断、低功耗 | ICM20608、BMI088、ICM20948、BMI270 |

---

## 驱动落地阶段

| 阶段 | 目标 | 输入 | 输出 |
|------|------|------|------|
| L0 选型确认 | 确认是否值得进入 XinYi backlog | 分类索引、型号笔记 | backlog 条目 |
| L1 文档齐套 | 补齐选型、硬件、驱动要点 | 单型号笔记 | documented 型号 |
| L2 README 草案 | 明确 XinYi 驱动目录、接口、数据结构 | 型号笔记、模板 | 驱动 README 草案 |
| L3 Bring-up | 明确硬件上电、总线、身份识别、读数检查 | 集成测试指南 | bring-up checklist |
| L4 驱动实现 | 进入 XinYi 仓库实现代码 | README 草案、checklist | driver source |
| L5 验证回填 | 把硬件验证结果回写 XinSor | 测试记录 | verified/integrated 状态 |

---

## 推荐目录结构

```text
drivers/sensors/<model>/
├── <model>.h             # 公共接口、配置和数据结构
├── <model>.c             # 寄存器、转换算法、状态机
├── <model>_port.h        # XinYi 总线适配接口声明
├── <model>_port.c        # I2C/SPI/UART、delay、timestamp 适配
└── README.md             # 从 XinSor 的驱动 README 草案转写
```

### 目录边界

| 文件 | 应放内容 | 不应放内容 |
|------|----------|------------|
| `<model>.h` | 公共类型、枚举、API 声明 | 具体板级引脚 |
| `<model>.c` | 寄存器、初始化流程、读取和转换算法 | 平台私有 I2C/SPI 实现 |
| `<model>_port.h/c` | 总线读写、delay、时间戳适配 | 传感器算法细节 |
| `README.md` | 功能范围、接线、接口、bring-up、限制 | 大段无验证代码片段 |

---

## 最小公共接口

| 接口 | 必选 | 说明 |
|------|------|------|
| `<model>_init(config)` | 是 | 初始化总线参数、复位/唤醒、身份识别、默认配置 |
| `<model>_read(data)` | 是 | 输出带单位的物理量，保留 raw data 能力 |
| `<model>_configure(param, value)` | 是 | 量程、ODR、滤波、模式、阈值等配置入口 |
| `<model>_self_test()` | 是 | 最小自检，不一定依赖芯片官方 self-test |
| `<model>_deinit()` | 可选 | 释放资源、进入 sleep 或断开总线 |
| `<model>_calibrate()` | 按需 | IMU、气体、磁力计、压力高度类优先需要 |

---

## README 必备章节

1. 功能范围
2. 目录结构
3. 硬件连接
4. 默认配置
5. 公共接口
6. 数据结构
7. Bring-up 顺序
8. 最小验收标准
9. 常见问题
10. 与 XinSor 型号笔记的链接

---

## 数据结构约定

### 配置结构

```c
typedef struct {
    uint8_t bus_id;
    uint8_t address_or_cs;
    uint8_t mode;
    uint16_t sample_rate_hz;
    // sensor-specific config follows
} sensor_config_t;
```

### 数据结构

```c
typedef struct {
    uint32_t timestamp_ms;
    uint8_t quality;
    int32_t status;
    // physical values with explicit units
    // optional raw values for debug/calibration
} sensor_data_t;
```

### 字段原则

| 原则 | 说明 |
|------|------|
| 物理量带单位 | 字段名体现单位，如 `temperature_c`、`pressure_hpa`、`gyro_dps` |
| 保留 raw data | 调试、校准和算法复现需要原始值 |
| 保留 timestamp | 多传感器融合和采样率验证需要时间戳 |
| 保留 quality/status | 上层应用需要判断数据可用性 |

---

## Bring-up 通用顺序

1. 确认电源、电平、去耦、上拉/片选。
2. 扫描总线或确认 UART/SPI 基础通信。
3. 读取 chip id、status 或确认 ack。
4. 复位/唤醒设备。
5. 写入默认配置。
6. 读取原始数据。
7. 转换为物理量。
8. 验证读数合理性。
9. 验证配置切换。
10. 验证异常恢复。
11. 验证低功耗或停止测量。
12. 记录测试结果并回填 XinSor。

---

## 类型差异处理

| 类型 | 额外关注点 | 样例 |
|------|------------|------|
| 补偿算法类 | NVM 校准参数、整数/浮点补偿、溢出风险 | BMP280 |
| 命令式测量类 | trigger、busy、timeout、CRC/状态位 | AHT20 |
| 多轴 IMU 类 | burst read、坐标系、量程、零偏、中断 | MPU6050 |
| 气体/空气质量类 | 预热、baseline、温湿度补偿、寿命、漂移、ASC/FRC | SGP30/SCD40 |
| 光学/距离类 | 光学窗口、环境光、目标反射率、多传感器地址、ROI、crosstalk | VL53L0X/VL53L1X |
| 电源监测类 | 分流电阻、Kelvin 连接、校准寄存器、电流方向、功耗统计 | INA219 |

---

## 验证等级

| 等级 | 说明 | 进入条件 |
|------|------|----------|
| V0 文档可实现 | README 和 checklist 足以指导开发 | L2 完成 |
| V1 通信通过 | 能识别设备或稳定 ack | bring-up 前半段通过 |
| V2 数据合理 | 能输出合理物理量 | 原始值和物理量验证通过 |
| V3 配置可控 | 量程、模式、滤波等配置生效 | configure 验证通过 |
| V4 长稳通过 | 长时间运行无异常 | 稳定性测试通过 |
| V5 已集成 | 进入 XinYi 驱动目录并通过框架测试 | XinYi 集成测试通过 |

---

## 回填规则

| XinYi 进展 | XinSor 回填位置 | 回填内容 |
|------------|----------------|----------|
| 建立驱动目录 | 型号笔记 `框架适配记录` | 标记 documented/candidate |
| 通信通过 | 型号笔记 `验证记录` | 地址、chip id、硬件平台 |
| 数据合理 | 型号笔记 `实验记录` | 样本数据、误差、环境条件 |
| 长稳通过 | 型号笔记 `实验记录` | 时长、采样率、异常统计 |
| 已集成 | 总目录、分类索引、集成文档 | 状态改为 integrated |

---

## 下一步探索

1. 已补 `SGP30` 气体类样例计划和 `SCD40` NDIR CO2 对照计划。
2. 已将气体类 checklist 合并到 `集成测试指南.md`。
3. 已补 `VL53L0X` 基础 ToF 样例计划和 `VL53L1X` 长距离/ROI 对照计划。
4. 已补 `INA219` 电源监测类样例计划。
5. 下一步可收敛为阶段总结，形成 XinSor -> XinYi 驱动落地路线图。

---

## 相关文档

- [[XinYi 端到端样例探索计划]]
- [[XinSor 作为 XinYi 子目录]]
- [[集成测试指南]]
- [[99-Templates/驱动开发笔记模板|驱动开发笔记模板]]
- [[10-Sensors/Gas/SGP30-eCO2-TVOC 传感器|SGP30-eCO2-TVOC 传感器]]
- [[10-Sensors/Gas/SCD40-CO2 传感器|SCD40-CO2 传感器]]
- [[10-Sensors/Optical/VL53L0X-ToF 测距|VL53L0X-ToF 测距]]
- [[10-Sensors/Optical/VL53L1X-ToF 测距|VL53L1X-ToF 测距]]
- [[10-Sensors/Power/INA219-电流电压传感器|INA219-电流电压传感器]]
