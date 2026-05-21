# XinYi 端到端样例探索计划

**定位**: 将 XinSor 的传感器知识条目转化为 XinYi 可落地驱动样例的执行计划  
**范围**: 先做 1 个最小闭环样例，再推广到同类传感器  
**状态**: 探索计划  
**最后更新**: 2026-05-20

---

## 目标

把 XinSor 从“传感器知识收集库”推进到“XinYi 驱动落地前置知识库”。本阶段不直接写 XinYi 代码，而是明确从文档到驱动目录的映射、样例型号、交付物和完成判据。

---

## 样例选择

### 首选: BMP280

| 维度 | 判断 |
|------|------|
| 文档状态 | 已有选型/驱动骨架，结构较清晰 |
| 驱动复杂度 | 中等，需要 chip id、校准参数、补偿算法 |
| 应用价值 | 气压、高度、环境监测，适合展示完整数据换算流程 |
| 复用价值 | 可复用到 BME280、DPS310、LPS22HB 等气压类传感器 |
| 风险 | 补偿算法较长，第一版 README 需要明确 t_fine/校准参数处理 |

### 备选: AHT20

| 维度 | 判断 |
|------|------|
| 文档状态 | 已有完整单型号文档 |
| 驱动复杂度 | 低，适合快速形成最小闭环 |
| 应用价值 | 温湿度传感器入门常用 |
| 复用价值 | 可复用到 SHT30/SHT40 等命令式温湿度传感器 |
| 风险 | 样例太简单，展示不出复杂驱动映射能力 |

### 当前建议

优先使用 **BMP280** 作为端到端样例；如果需要快速验证流程，再使用 **AHT20** 做轻量样例。

---

## 端到端闭环

```text
XinSor 型号笔记
  -> XinYi 驱动 README 草案
  -> XinYi 驱动目录结构
  -> 初始化/读取/配置/self_test 接口清单
  -> 集成测试 checklist
  -> 验证结果回填 XinSor
```

---

## 计划交付物

| 编号 | 交付物 | 放置位置 | 说明 |
|------|--------|----------|------|
| D1 | BMP280 XinYi 驱动 README 草案 | `30-Integration/` 或 `10-Sensors/Pressure/BMP280-气压传感器.md` | 先在 XinSor 内形成，不直接假设 XinYi 真实目录 |
| D2 | 驱动目录映射 | `30-Integration/XinSor 作为 XinYi 子目录.md` | 补充 `drivers/sensors/bmp280/` 示例 |
| D3 | 接口清单 | BMP280 型号笔记 | 列出 init/read/configure/self_test/deinit |
| D4 | Bring-up checklist | `30-Integration/集成测试指南.md` 或 BMP280 笔记 | 从通电、I2C 扫描、chip id 到数据合理性 |
| D5 | 推广模板 | `99-Templates/驱动开发笔记模板.md` | 把 BMP280 样例中可复用字段沉淀到模板 |

---

## BMP280 驱动 README 草案结构

```markdown
# BMP280 Driver for XinYi

## 功能范围
- 初始化 BMP280
- 读取温度和气压
- 支持 forced/normal 模式
- 支持 oversampling 和 IIR filter 配置

## 目录结构
drivers/sensors/bmp280/
├── bmp280.h
├── bmp280.c
├── bmp280_port.h
├── bmp280_port.c
└── README.md

## 公共接口
- bmp280_init(config)
- bmp280_read(data)
- bmp280_configure(param, value)
- bmp280_self_test()
- bmp280_deinit()

## Bring-up 顺序
1. I2C 扫描确认地址 0x76/0x77。
2. 读取 chip id，应为 0x58。
3. 读取校准参数。
4. 配置 oversampling 和模式。
5. 读取 raw temp/raw pressure。
6. 使用补偿算法输出 °C/hPa。
```

---

## 阶段计划

| 阶段 | 目标 | 完成判据 |
|------|------|----------|
| P0 | 确认样例型号和目录映射 | BMP280/AHT20 取舍明确，映射表更新 |
| P1 | 补 BMP280 XinYi 驱动 README 草案 | 已完成，见 [[10-Sensors/Pressure/BMP280-气压传感器|BMP280-气压传感器]] |
| P2 | 补 BMP280 bring-up checklist | 已完成，见 [[集成测试指南]] |
| P3 | 抽象同类模板 | 已完成，见 [[99-Templates/驱动开发笔记模板|驱动开发笔记模板]] |
| P4 | 扩展第二个样例 AHT20 | 已形成轻量闭环计划，见 [[10-Sensors/Temperature/AHT20-温湿度传感器|AHT20-温湿度传感器]] |
| P5 | 扩展第三个样例 MPU6050 | 已形成 IMU 样例计划，见 [[10-Sensors/IMU/MPU6050-6 轴 IMU|MPU6050-6 轴 IMU]] |
| P6 | 扩展气体类样例 SGP30/SCD40 | 已形成 MOX 与 NDIR 对照计划，见 [[10-Sensors/Gas/SGP30-eCO2-TVOC 传感器|SGP30]] / [[10-Sensors/Gas/SCD40-CO2 传感器|SCD40]] |

---

## 待确认问题

| 问题 | 当前判断 | 处理方式 |
|------|----------|----------|
| XinYi 真实驱动目录是否为 `drivers/sensors/` | 未确认 | 后续进入 XinYi 仓库核对后修正 |
| XinYi 使用 C、C++ 还是 JS/TS 组件层为主 | 当前文档混有 C 和 JS 示例 | 先以驱动 README 和接口清单表达，不绑定语言实现 |
| 子目录采用直接复制还是 submodule | 建议 submodule | 等 XinYi 仓库确认后落地 |
| 是否需要在 XinSor 存代码片段 | 需要克制 | 先存接口和流程，完整代码放 XinYi |

---

## 下一步动作

1. 已抽象 [[XinYi 传感器驱动落地规范]]。
2. 进入 XinYi 仓库后核对真实目录结构，再调整 `drivers/sensors/bmp280/`、`drivers/sensors/aht20/`、`drivers/sensors/mpu6050/` 映射。
3. 下一批探索可补 `VL53L0X/VL53L1X`，覆盖光学窗口、目标反射率、ROI 和多传感器地址管理。

---

## 相关文档

- [[XinSor 作为 XinYi 子目录]]
- [[XinYi 传感器驱动落地规范]]
- [[XinYi 传感器组件对接]]
- [[集成测试指南]]
- [[10-Sensors/Pressure/BMP280-气压传感器|BMP280-气压传感器]]
- [[10-Sensors/Temperature/AHT20-温湿度传感器|AHT20-温湿度传感器]]
- [[10-Sensors/IMU/MPU6050-6 轴 IMU|MPU6050-6 轴 IMU]]
- [[10-Sensors/Gas/SGP30-eCO2-TVOC 传感器|SGP30-eCO2-TVOC 传感器]]
- [[10-Sensors/Gas/SCD40-CO2 传感器|SCD40-CO2 传感器]]
