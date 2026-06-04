# LSM6DSL 6 轴 IMU

> **一句话描述:** ST 经典低功耗 6 轴 IMU，I2C/SPI 接口，适合可穿戴、IoT 运动检测和姿态采集  
> **标签:** `#sensor/imu` `#sensor/accelerometer` `#sensor/gyroscope` `#protocol/i2c` `#protocol/spi` `#vendor/st`  
> **状态:** 选型骨架，待硬件验证  
> **最后更新:** 2026-05-23

---

## 概述

**LSM6DSL** 是 ST 经典低功耗 6 轴 IMU，资料和生态成熟，适合可穿戴、IoT 运动检测和常规姿态数据采集。相对 LSM6DSO/LSM6DSOX，它缺少新一代 MLC/FSM 能力，但基础驱动更适合学习。

---

## 快速参数

| 参数 | 值 | 备注 |
|------|----|------|
| 接口 | I2C / SPI | ST MEMS 常见接口 |
| 轴数 | 6 轴 | accel + gyro |
| 典型应用 | 可穿戴、IoT、机器人姿态采集 | 低功耗 6 轴 |
| 关键特性 | FIFO、中断、低功耗模式 | 适合通用 IMU 驱动样例 |

---

## 选型结论

| 维度 | 结论 |
|------|------|
| 适合场景 | 低功耗 6 轴 IMU、ST 生态、常规姿态/运动采集 |
| 不适合场景 | 需要 MLC/FSM 边缘动作识别的新项目 |
| 主要优势 | 资料成熟、低功耗、寄存器模型清晰、I2C/SPI |
| 主要风险 | 新项目可能更适合 LSM6DSO/LSM6DSOX/LSM6DSV 系列 |
| 替代型号 | LSM6DSO、LSM6DSOX、LSM6DS3、BMI270 |

---

## 驱动关注点

| 阶段 | 要点 |
|------|------|
| 探测 | 读取 WHO_AM_I |
| 配置 | 设置 ODR、FS、BDU、LPF 和功耗模式 |
| 读取 | 输出 accel_g 和 gyro_dps |
| FIFO | 支持批量采样和 timestamp 估算 |
| 中断 | 配置 data ready、wake-up、tap/free-fall 等事件 |

---

## 相关链接

- [[IMU 传感器索引]]
- [[LSM6DSO-6 轴 IMU]]
- [[LSM6DS3-6 轴 IMU]]
- [[10-Sensors/传感器总目录|传感器总目录]]
