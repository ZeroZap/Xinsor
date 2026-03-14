# 传感器型号收集 - 来自 Zephyr / RT-Thread / Linux

**创建日期**: 2026-03-14  
**来源**: Zephyr RTOS v3.7+, RT-Thread v5.0+, Linux Kernel v6.x IIO Subsystem  
**目的**: 扩充 XinSor 传感器知识库，补充更多可选型号

---

## 📊 现有 XinYi 传感器驱动清单

| 型号 | 类型 | 接口 | 状态 |
|------|------|------|------|
| AHT20 | 温湿度 | I2C | ✅ 已实现 |
| BME280 | 温湿压 | I2C/SPI | ✅ 已实现 |
| BMP280 | 温压 | I2C/SPI | ✅ 已实现 |
| MPU6050 | 6 轴 IMU | I2C | ✅ 已实现 |
| ICM20608 | 6 轴 IMU | SPI | ✅ 已实现 |
| LIS2DH12 | 3 轴加速度 | I2C/SPI | ✅ 已实现 |
| SC7A20 | 3 轴加速度 | I2C | ✅ 已实现 |
| BMA400 | 3 轴加速度 | I2C/SPI | ✅ 已实现 |
| ADXL362 | 3 轴加速度 | SPI | ✅ 已实现 |
| QMC5883L | 3 轴磁力计 | I2C | ✅ 已实现 |
| CCS811 | 气体 (eCO2/TVOC) | I2C | ✅ 已实现 |
| AP3216C | 光学 (ALS+PS) | I2C | ✅ 已实现 |
| APDS9960 | 光学 (RGB+Gesture) | I2C | ✅ 已实现 |
| VL53L0X | ToF 测距 | I2C | ✅ 已实现 |
| KX023 | 3 轴加速度 | I2C | ⏳ 待实现 |
| ADT7420 | 温度 | I2C | ⏳ 待实现 |

---

## 🔵 Zephyr RTOS 支持传感器

### IMU (惯性测量单元)

| 型号 | 轴数 | 接口 | 厂商 | 备注 |
|------|------|------|------|------|
| BMI088 | 6 轴 (Accel+Gyro) | SPI | Bosch | 高性能，无人机常用 |
| BNO055 | 9 轴 (Accel+Gyro+Mag) | I2C/UART | Bosch | 内置传感器融合 |
| ICM42688 | 6 轴 | SPI | TDK InvenSense | 低功耗，可穿戴 |
| LSM6DSO | 6 轴 | I2C/SPI | ST | 机器学习核心 |
| LSM9DS1 | 9 轴 | I2C/SPI | ST | 含磁力计 |
| FXAS21002 | 3 轴陀螺 | I2C/SPI | NXP | 独立陀螺仪 |
| MAG3110 | 3 轴磁力计 | I2C | NXP | 独立磁力计 |

### 温湿度/环境

| 型号 | 类型 | 接口 | 厂商 | 备注 |
|------|------|------|------|------|
| SHT3x | 温湿度 | I2C | Sensirion | 高精度 |
| SHT4x | 温湿度 | I2C | Sensirion | 最新一代 |
| HDC1080 | 温湿度 | I2C | TI | 低功耗 |
| SI7005/SI7021 | 温湿度 | I2C | Silicon Labs | 工业级 |
| HTS221 | 温湿度 | I2C | ST | 小型化 |
| DPS310 | 气压 | I2C/SPI | Infineon | 高精度气压 |
| MPL3115A2 | 气压 | I2C | NXP | 海拔精度±1m |
| LPS22HB | 气压 | I2C/SPI | ST | 防水 |
| SGP30 | eCO2/TVOC | I2C | Sensirion | 空气质量 |
| SGP40 | VOC | I2C | Sensirion | SGP30 升级版 |
| ENS160 | eCO2/TVOC | I2C | ams OSRAM | 低成本 |

### 光学

| 型号 | 类型 | 接口 | 厂商 | 备注 |
|------|------|------|------|------|
| TSL2561 | ALS | I2C | ams | 经典光照 |
| TSL2591 | ALS | I2C | ams | 高动态范围 |
| OPT3001 | ALS | I2C | TI | 人眼响应 |
| BH1745 | RGB | I2C | ROHM | 颜色识别 |
| VEML6030 | ALS | I2C | Vishay | 低功耗 |
| VL53L1X | ToF | I2C | ST | 4m 测距 |
| VL6180X | ToF+ALS | I2C | ST | 近距离 |

### 气体

| 型号 | 检测 | 接口 | 厂商 | 备注 |
|------|------|------|------|------|
| BME680 | VOC+ 温湿压 | I2C/SPI | Bosch | 四合一 |
| BME688 | VOC+AI | I2C/SPI | Bosch | 气体识别 AI |
| SCD30 | CO2 | I2C | Sensirion | NDIR 原理 |
| SCD40/SCD41 | CO2 | I2C | Sensirion | 小型化 |
| IAQ-Core | CO2/TVOC | UART | Cubic | 国产 |

### 其他

| 型号 | 类型 | 接口 | 厂商 | 备注 |
|------|------|------|------|------|
| MAX30101 | 心率/血氧 | I2C | Maxim | 医疗级 |
| ADPD188BI | 烟雾检测 | I2C | ADI | 光电烟雾 |
| HDC3020 | 温湿度 | I2C | TI | 高精度 |
| AHT10/AHT15 | 温湿度 | I2C | 奥松 | 低成本 |

---

## 🟢 RT-Thread 支持传感器

RT-Thread 的传感器框架 (sensor framework) 支持以下类型：

### 加速度计
- ADXL345, ADXL362, ADXL372
- BMA2x2, BMA400, BMA421, BMA456
- KX022, KX023, KXTJ3
- LIS2DH, LIS2DH12, LIS3DH
- MMA8451, MMA8652
- SC7A20, SC7A30 (国产)
- LIS2DE12, LIS3DSH

### 陀螺仪
- L3GD20, L3GD20H
- LSM6DS3, LSM6DSM, LSM6DSL, LSM6DSO
- BMI160, BMI270 (Bosch)
- ICM20602, ICM20608, ICM42688
- FXAS21002

### 磁力计
- HMC5883L, QMC5883L
- LIS2MDL, LIS3MDL
- MAG3110
- BMM150 (Bosch)
- AK8963, AK8975 (AKM)

### 温湿度
- AHT10, AHT20, AHT21
- SHT20, SHT21, SHT25, SHT30, SHT31, SHT35
- SHT40, SHT45
- HDC1000, HDC1080
- SI7005, SI7013, SI7020, SI7021
- HTU21D, HTU31D
- TH06 (国产)

### 气压
- BMP085, BMP180, BMP280, BMP388
- BME280, BME680
- LPS22HB, LPS33HW
- MPL3115A2
- DPS310, DPS368
- SPL06, SPL110

### 光学/距离
- BH1750 (光照)
- TSL2561, TSL2591
- VL53L0X, VL53L1X
- GP2Y0A02YK0F (夏普红外)
- US-100 (超声波)

### 气体
- CCS811
- SGP30, SGP40
- SCD30, SCD40
- MQ 系列 (MQ2, MQ3, MQ135 - ADC)
- PMS5003, PMS7003 (PM2.5)

### 心率/生物
- MAX30102
- HX711 (称重传感器 ADC)

---

## 🐧 Linux IIO (Industrial I/O) 支持

Linux 内核 IIO 子系统支持数百种传感器，部分主流型号：

### 加速度计 (Accelerometers)
```
ADXL345, ADXL346, ADXL355, ADXL362, ADXL367, ADXL372
BMA180, BMA220, BMA250, BMA400
BMI088, BMI160, BMI270
DA280, DA311
FXLS8471, FXLS8962
H3LIS200DL, H3LIS331DL
KX022A, KX023, KXTJ3
LIS2DH, LIS2MDL, LIS3DH, LIS3DSH, LIS3LV02DL
MMA7455, MMA7660, MMA8452
MC3230, MC3479
SC7A20, SC7A30, SC7B20
STK8312, STK8BA50
```

### 陀螺仪 (Gyroscopes)
```
ADXRS290, ADXRS450
BMI088, BMI160, BMI270
FXAS21002
HID 传感器陀螺仪
ITG3200
L3GD20, L3GD20H
LSM330, LSM6DS3, LSM6DSM, LSM6DSL, LSM6DSO, LSM6DSOX
STK8B50
```

### 磁力计 (Magnetometers)
```
AK8974, AK8975, AK8990
BMM150
HMC5843, HMC5883L
LIS2MDL, LIS3MDL
MAG3110
MMC35240
RM3100
```

### 气压 (Pressure)
```
ABP060, ABP070
BMP085, BMP180, BMP280, BMP380, BMP384, BMP388
BME280, BME680
DPS310, DPS368
HP206C, HP303B
LPS22HB, LPS22HH, LPS33HW, LPS35HW
MPL115, MPL3115A2
MS5611, MS5637, MS5803
SPL06-001, SPL110
```

### 温湿度 (Humidity)
```
AM2315, AM2320 (Aosong)
AHT10, AHT20, AHT21
DHT11, DHT21, DHT22 (Aosong)
HDC100X, HDC1080, HDC2010, HDC2080
HTS221
HUMIDITY_SENSOR (generic)
SHT15, SHT21, SHT25, SHT31, SHT35, SHT4X
SI7005, SI7020, SI7021
```

### 光学/ALS (Light)
```
ADJD_S311
ADUX1020
ALS31520
BH1750, BH1780
CM32181, CM3232
EM28562
GP2AP002, GP2AP020A00F
HID 环境光传感器
ISL29018, ISL29020, ISL29028, ISL29030
JS002
LTR501, LTR891
LUX01
MAX44000
OPT3001
STK3310
TSL2563, TSL2580, TSL2583, TSL2591
TSL2671, TSL2771
VEML6030, VEML6035, VEML6040, VEML6070, VEML6075
```

### ToF/距离 (Distance)
```
ADPD188
GP2AP020A00F
HID 距离传感器
SR04 (超声波)
VL53L0X, VL53L1X, VL53L4CX
VL6180
```

### 气体/环境 (Gas/Air Quality)
```
BME680 (VOC)
CCS811 (eCO2/TVOC)
ENS160
PMS5003, PMS7003 (PM2.5)
SCD30, SCD40 (CO2)
SGP30, SGP40 (VOC)
```

### 接近传感器 (Proximity)
```
APDS9960
HID 接近传感器
MB1232
RPR0521
SX9310, SX9324
```

### 心率/生物 (Heart Rate/Bio)
```
ADPD188
AFEC9110
HID 心率传感器
MAX30102
Pulse Oximeter (generic)
```

---

## 📋 优先级推荐 (建议添加到 XinYi/XinSor)

### 🔥 高优先级 (常用/高性价比)

| 型号 | 类型 | 价格 | 推荐理由 |
|------|------|------|----------|
| **BMI088** | 6 轴 IMU | ¥35-50 | 无人机/机器人标配，高性能 |
| **BNO055** | 9 轴 IMU | ¥60-80 | 内置融合算法，免校准 |
| **SHT40** | 温湿度 | ¥15-25 | Sensirion 最新，精度高 |
| **BME688** | 气体 + 环境 | ¥80-100 | AI 气体识别，高端应用 |
| **SCD40** | CO2 | ¥120-150 | 小型 NDIR，精准 CO2 |
| **VL53L1X** | ToF | ¥15-20 | 4m 测距，升级 VL53L0X |
| **BMI270** | 6 轴 IMU | ¥20-30 | 可穿戴专用，低功耗 |
| **LPS22HB** | 气压 | ¥12-18 | 防水，户外应用 |

### 💰 中优先级 (低成本替代)

| 型号 | 类型 | 价格 | 推荐理由 |
|------|------|------|----------|
| **AHT10** | 温湿度 | ¥5-8 | AHT20 更便宜 |
| **SC7A30** | 加速度 | ¥8-12 | 国产，性价比 |
| **QMC5883L** | 磁力计 | ¥3-5 | HMC5883L 国产替代 |
| **BH1750** | 光照 | ¥3-5 | 经典，简单 |
| **DHT22** | 温湿度 | ¥8-12 | 经典，单总线 |
| **MQ 系列** | 气体 | ¥10-20 | 传统气体检测 |

### 🎯 特定应用

| 型号 | 类型 | 应用 | 备注 |
|------|------|------|------|
| **MAX30102** | 心率血氧 | 可穿戴 | 医疗健康 |
| **PMS5003** | PM2.5 | 空气质量 | 激光散射 |
| **ADPD188BI** | 烟雾 | 消防 | 光电式 |
| **HX711** | 称重 ADC | 电子秤 | 24 位高精度 |

---

## 📝 下一步行动

### 1. 更新 XinSor 索引
- [ ] 为每个分类添加价格等级列
- [ ] 补充新型号到对应分类
- [ ] 创建价格选型指南文档

### 2. XinYi 驱动开发优先级
- [ ] BMI088 (6 轴 IMU)
- [ ] SHT40 (温湿度)
- [ ] BME688 (气体 + 环境)
- [ ] VL53L1X (ToF)
- [ ] SCD40 (CO2)
- [ ] LPS22HB (气压)

### 3. 文档完善
- [ ] 创建传感器选型决策树
- [ ] 添加电路设计参考
- [ ] 补充调试笔记模板

---

**参考资料**:
- Zephyr Sensor API: https://docs.zephyrproject.org/latest/reference/peripherals/sensor.html
- RT-Thread Sensor Framework: https://www.rt-thread.io/document/site/
- Linux IIO: https://www.kernel.org/doc/html/latest/driver-api/iio/

**最后更新**: 2026-03-14
