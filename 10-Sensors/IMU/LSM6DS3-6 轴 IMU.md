# LSM6DS3 6 轴 IMU

> **一句话描述:** ST 经典 6 轴 IMU，I2C/SPI 接口，适合低功耗运动检测、可穿戴和通用姿态采集  
> **标签:** `#sensor/imu` `#sensor/accelerometer` `#sensor/gyroscope` `#protocol/i2c` `#protocol/spi` `#vendor/st`  
> **状态:** 选型骨架，待硬件验证  
> **最后更新:** 2026-05-23

---

## 概述

**LSM6DS3** 是 ST 经典 6 轴 IMU，常见于可穿戴和开发板生态。它适合学习 ST MEMS 6 轴驱动结构，也可作为 LSM6DSL/LSM6DSO 的前代对照。

---

## 快速参数

| 参数 | 值 | 备注 |
|------|----|------|
| 接口 | I2C / SPI | 常见 IMU 接口 |
| 轴数 | 6 轴 | accel + gyro |
| 典型应用 | 可穿戴、开发板、运动采集 | 资料多 |
| 关键特性 | FIFO、中断、低功耗模式 | 通用 6 轴 IMU 样例 |

---

## 选型结论

| 维度 | 结论 |
|------|------|
| 适合场景 | 学习 ST 6 轴 IMU、开发板原型、普通运动采集 |
| 不适合场景 | 新项目要求 MLC/FSM 或最新低功耗规格 |
| 主要优势 | 模组/开发板资料多、I2C/SPI、FIFO 和中断功能完整 |
| 主要风险 | 新项目需确认供货和是否被 LSM6DSO/LSM6DSOX 替代 |
| 替代型号 | LSM6DSL、LSM6DSO、LSM6DSOX、BMI160 |

---

## 驱动关注点

| 阶段 | 要点 |
|------|------|
| 探测 | 读取 WHO_AM_I |
| 配置 | 设置 ODR、量程、BDU 和滤波 |
| 读取 | burst 读取 accel/gyro 原始数据并换算 |
| FIFO | 验证 FIFO watermark 和数据帧解析 |
| 校准 | 记录静止零偏和坐标轴方向 |

---

## 相关链接

- [[IMU 传感器索引]]
- [[LSM6DSL-6 轴 IMU]]
- [[LSM6DSO-6 轴 IMU]]
- [[10-Sensors/传感器总目录|传感器总目录]]
