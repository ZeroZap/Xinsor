# IMU (惯性测量单元) 学习

## 🧠 功能概述

惯性测量单元 (Inertial Measurement Unit, IMU) 是一种用于测量物体三轴姿态角 (或角速率) 和加速度的传感器装置。它广泛应用于无人机、机器人、智能手机、虚拟现实设备等领域的姿态检测和运动追踪。

## 📚 核心概念

### 1. IMU 组成

```
┌─────────────────────────────────────────────────────┐
│                  IMU 传感器                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐    ┌─────────────┐                │
│  │ 加速度计    │    │   陀螺仪    │                │
│  │ Accelerome  │    │  Gyroscope  │                │
│  │   3 轴       │    │    3 轴      │                │
│  └─────────────┘    └─────────────┘                │
│         │                  │                        │
│         └────────┬─────────┘                        │
│                  ▼                                  │
│         ┌─────────────┐                             │
│         │  传感器融合  │                             │
│         │  Sensor     │                             │
│         │  Fusion     │                             │
│         └─────────────┘                             │
│                  │                                  │
│         ┌────────┴────────┐                         │
│         ▼                 ▼                         │
│  ┌─────────────┐   ┌─────────────┐                  │
│  │  磁力计     │   │  气压计     │                  │
│  │ Magnetome   │   │ Barometer   │                  │
│  │  (可选)     │   │  (可选)     │                  │
│  └─────────────┘   └─────────────┘                  │
│                                                     │
│  6 轴 IMU = 加速度计 (3) + 陀螺仪 (3)                │
│  9 轴 IMU = 6 轴 + 磁力计 (3)                         │
│  10 轴 IMU = 9 轴 + 气压计 (1)                        │
└─────────────────────────────────────────────────────┘
```

### 2. 坐标系定义

```
        Z (垂直)
        ▲
        │
        │
        │   Y (前方)
        │  ╱
        │ ╱
        │╱
        O────────────► X (右方)
       ╱
      ╱
     ▼
```

| 轴 | 方向 | 旋转名称 | 角度名称 |
|----|------|----------|----------|
| X | 右 → 左 | Roll | 横滚角 (φ) |
| Y | 后 → 前 | Pitch | 俯仰角 (θ) |
| Z | 下 → 上 | Yaw | 偏航角 (ψ) |

### 3. 欧拉角 vs 四元数

| 表示方法 | 优点 | 缺点 | 应用 |
|----------|------|------|------|
| 欧拉角 | 直观、易理解 | 万向节锁 | 显示、简单控制 |
| 四元数 | 无万向节锁、计算高效 | 不直观 | 姿态解算、插值 |
| 旋转矩阵 | 便于坐标变换 | 9 个参数、冗余 | 坐标变换 |

## 🔧 传感器原理

### 1. 加速度计 (Accelerometer)

**原理**: 基于牛顿第二定律 F = ma

```
┌─────────────────────────────────────────────────────┐
│              加速度计工作原理                        │
│                                                     │
│     固定端    弹簧    质量块    弹簧    固定端      │
│       │━━━━━━━▒▒▒━━━━━━━[■]━━━━━━━▒▒▒━━━━━━━│      │
│                                                     │
│  静止时:                                            │
│  ────────────────────────────────────────────────   │
│       │━━━━━━━▒▒▒━━━━━━━[■]━━━━━━━▒▒▒━━━━━━━│      │
│                    ▼                                │
│                  1g (重力)                          │
│                                                     │
│  加速时:                                            │
│  ────────────────────────────────────────────────   │
│       │━━━▒▒▒━━━[■]━━━━━━━▒▒▒━━━━━━━━━━━━━━━│      │
│              ◄────                                │
│                  惯性力                            │
│                                                     │
│  输出: Ax, Ay, Az (单位：g 或 m/s²)                 │
└─────────────────────────────────────────────────────┘
```

**角度计算**:
```python
# 从加速度计计算姿态角
pitch = atan2(Ax, sqrt(Ay² + Az²)) × 180/π
roll  = atan2(Ay, Az) × 180/π

# 注意：加速度计无法测量 yaw (偏航角)
```

### 2. 陀螺仪 (Gyroscope)

**原理**: 基于科里奥利力或角动量守恒

```
┌─────────────────────────────────────────────────────┐
│              陀螺仪工作原理 (MEMS)                   │
│                                                     │
│          振动质量块                                  │
│              ▲                                      │
│              │ 振动方向                             │
│         ┌────┴────┐                                 │
│         │  ■   ■  │                                 │
│         │    ●    │  ◄── 旋转 (角速度 ω)            │
│         │  ■   ■  │                                 │
│         └─────────┘                                 │
│              │                                      │
│              ▼                                      │
│         科里奥利力                                  │
│                                                     │
│  输出: Gx, Gy, Gz (单位：°/s 或 rad/s)              │
│                                                     │
│  角度 = ∫角速度 dt (积分得到角度)                   │
└─────────────────────────────────────────────────────┘
```

**角度计算**:
```python
# 从陀螺仪积分计算角度
angle_x = angle_x_prev + Gx × dt
angle_y = angle_y_prev + Gy × dt
angle_z = angle_z_prev + Gz × dt

# 缺点：存在积分漂移
```

### 3. 磁力计 (Magnetometer)

**原理**: 测量地球磁场方向

```
┌─────────────────────────────────────────────────────┐
│              磁力计工作原理                          │
│                                                     │
│              地磁北极                                │
│                  ▲                                  │
│                  │                                  │
│                  │ 磁感线                            │
│             ┌────┴────┐                             │
│             │   IMU   │                             │
│             └────┬────┘                             │
│                  │                                  │
│                  ▼                                  │
│              地磁南极                                │
│                                                     │
│  输出: Mx, My, Mz (单位：μT 或 mG)                  │
│                                                     │
│  Yaw = atan2(-My, Mx) × 180/π                      │
└─────────────────────────────────────────────────────┘
```

## 🔌 常用 IMU 芯片

### InvenSense (TDK)

| 型号 | 轴数 | 通信接口 | 加速度计量程 | 陀螺仪量程 | 应用 |
|------|------|----------|--------------|------------|------|
| MPU6050 | 6 | I2C | ±2/4/8/16g | ±250/500/1000/2000°/s | 通用 |
| MPU9250 | 9 | I2C/SPI | ±2/4/8/16g | ±250/500/1000/2000°/s | 无人机 |
| ICM20948 | 9 | I2C/SPI | ±2/4/8/16g | ±250/500/1000/2000°/s | 高端应用 |
| ICM42688 | 6 | I2C/SPI | ±2/4/8/16/32g | ±125~32768°/s | 高性能 |

### Bosch Sensortec

| 型号 | 轴数 | 通信接口 | 加速度计量程 | 陀螺仪量程 | 应用 |
|------|------|----------|--------------|------------|------|
| BMI088 | 6 | I2C/SPI | ±3/6/12/24g | ±125/250/500/1000/2000°/s | 机器人 |
| BNO055 | 9 | I2C/UART | ±2/4/8/16g | ±125/250/500/1000/2000°/s | 智能硬件 |
| BMI270 | 6 | I2C/SPI | ±2/4/8/16g | ±125/250/500/1000/2000°/s | 可穿戴 |

### STMicroelectronics

| 型号 | 轴数 | 通信接口 | 加速度计量程 | 陀螺仪量程 | 应用 |
|------|------|----------|--------------|------------|------|
| LSM6DS3 | 6 | I2C/SPI | ±2/4/8/16g | ±125/245/500/1000/2000°/s | IoT |
| LSM9DS1 | 9 | I2C/SPI | ±2/4/8/16g | ±245/500/2000°/s | 通用 |

## 📐 传感器融合算法

### 1. 互补滤波 (Complementary Filter)

```
┌─────────────────────────────────────────────────────┐
│              互补滤波原理                            │
│                                                     │
│  陀螺仪角度                                          │
│      │                                              │
│      ├───────────┐                                  │
│      │   高通    │                                  │
│      │  滤波器   │                                  │
│      │   (0.98)  │     ┌───────────┐               │
│      └───────────┼────►│    +      │───► 融合角度  │
│                  │     └───────────┘               │
│      ┌───────────┼────►│    +      │               │
│      │   低通    │     └───────────┘               │
│      │  滤波器   │                                  │
│      │   (0.02)  │                                  │
│      │           │                                  │
│  加速度计角度                                         │
│                                                     │
│  公式:                                               │
│  angle = 0.98 × (angle + gyro × dt) + 0.02 × accel │
└─────────────────────────────────────────────────────┘
```

**代码实现**:
```cpp
// 互补滤波示例
float complementaryFilter(float accelAngle, float gyroRate, 
                          float prevAngle, float dt) {
    float alpha = 0.98;  // 滤波系数
    float angle = alpha * (prevAngle + gyroRate * dt) + 
                  (1 - alpha) * accelAngle;
    return angle;
}

// 使用示例
float pitch = 0;
void updatePitch(float ax, float ay, float az, float gy, float dt) {
    float accelPitch = atan2(ax, sqrt(ay*ay + az*az)) * 180 / PI;
    pitch = complementaryFilter(accelPitch, gy, pitch, dt);
}
```

### 2. 卡尔曼滤波 (Kalman Filter)

```
┌─────────────────────────────────────────────────────┐
│              卡尔曼滤波流程                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────┐      ┌─────────┐      ┌─────────┐     │
│  │ 预测    │      │ 更新    │      │ 输出    │     │
│  │ State   │─────►│ Measure │─────►│ Result  │     │
│  │ Predict │      │ Update  │      │         │     │
│  └─────────┘      └─────────┘      └─────────┘     │
│       ▲                │                            │
│       │                │                            │
│       └────────────────┘                            │
│            反馈                                      │
│                                                     │
│  预测步骤:                                          │
│  x̂ₖ⁻ = F × xₖ₋₁ + B × uₖ                           │
│  Pₖ⁻ = F × Pₖ₋₁ × Fᵀ + Q                           │
│                                                     │
│  更新步骤:                                          │
│  Kₖ = Pₖ⁻ × Hᵀ × (H × Pₖ⁻ × Hᵀ + R)⁻¹             │
│  x̂ₖ = x̂ₖ⁻ + Kₖ × (zₖ - H × x̂ₖ⁻)                  │
│  Pₖ = (I - Kₖ × H) × Pₖ⁻                          │
│                                                     │
│  其中:                                              │
│  x: 状态向量   P: 协方差矩阵   K: 卡尔曼增益       │
│  F: 状态转移   Q: 过程噪声     R: 测量噪声         │
│  H: 观测矩阵   z: 测量值       u: 控制输入         │
└─────────────────────────────────────────────────────┘
```

**简化卡尔曼滤波实现**:
```cpp
class SimpleKalmanFilter {
private:
    float Q;  // 过程噪声协方差
    float R;  // 测量噪声协方差
    float P;  // 估计误差协方差
    float X;  // 估计值
    float K;  // 卡尔曼增益
    
public:
    SimpleKalmanFilter(float q, float r, float p, float initVal) {
        Q = q;
        R = r;
        P = p;
        X = initVal;
    }
    
    float update(float measurement) {
        // 预测
        P = P + Q;
        
        // 更新
        K = P / (P + R);
        X = X + K * (measurement - X);
        P = (1 - K) * P;
        
        return X;
    }
};

// 使用示例
SimpleKalmanFilter kalmanPitch(0.001, 0.003, 0.03, 0);

void loop() {
    float accelPitch = atan2(ax, sqrt(ay*ay + az*az)) * 180 / PI;
    float filteredPitch = kalmanPitch.update(accelPitch);
}
```

### 3. 四元数姿态解算

```cpp
// 四元数更新
struct Quaternion {
    float w, x, y, z;
    
    void update(float gx, float gy, float gz, 
                float ax, float ay, float az,
                float dt) {
        // 归一化加速度计数据
        float norm = sqrt(ax*ax + ay*ay + az*az);
        ax /= norm; ay /= norm; az /= norm;
        
        // 计算重力方向的四元数
        float qx = ay/2 - az * (3.14159/4);
        float qy = -ax/2;
        float qz = 0;
        float qw = 1;
        
        // 陀螺仪积分
        float gxRad = gx * 3.14159/180;
        float gyRad = gy * 3.14159/180;
        float gzRad = gz * 3.14159/180;
        
        float qwDot = 0.5f * (-gxRad*x - gyRad*y - gzRad*z);
        float qxDot = 0.5f * ( gxRad*w + gyRad*z - gzRad*y);
        float qyDot = 0.5f * (-gxRad*z + gyRad*w + gzRad*x);
        float qzDot = 0.5f * ( gxRad*y - gyRad*x + gzRad*w);
        
        w += qwDot * dt;
        x += qxDot * dt;
        y += qyDot * dt;
        z += qzDot * dt;
        
        // 归一化
        norm = sqrt(w*w + x*x + y*y + z*z);
        w /= norm; x /= norm; y /= norm; z /= norm;
    }
    
    // 从四元数提取欧拉角
    void toEuler(float &roll, float &pitch, float &yaw) {
        roll  = atan2(2*(w*x + y*z), 1 - 2*(x*x + y*y));
        pitch = asin(2*(w*y - z*x));
        yaw   = atan2(2*(w*z + x*y), 1 - 2*(y*y + z*z));
        
        roll  *= 180 / 3.14159;
        pitch *= 180 / 3.14159;
        yaw   *= 180 / 3.14159;
    }
};
```

## 💻 驱动示例

### MPU6050 Arduino 驱动

```cpp
#include <Wire.h>

#define MPU_ADDR 0x68

// MPU6050 寄存器
#define SMPLRT_DIV   0x19
#define CONFIG       0x1A
#define GYRO_CONFIG  0x1B
#define ACCEL_CONFIG 0x1C
#define ACCEL_XOUT   0x3B
#define GYRO_XOUT    0x43
#define PWR_MGMT_1   0x6B

class MPU6050 {
private:
    int16_t rawAx, rawAy, rawAz;
    int16_t rawGx, rawGy, rawGz;
    float ax, ay, az;
    float gx, gy, gz;
    float accelScale = 16384.0;  // ±2g
    float gyroScale = 131.0;     // ±250°/s
    
public:
    bool begin() {
        Wire.begin();
        Wire.beginTransmission(MPU_ADDR);
        Wire.write(PWR_MGMT_1);
        Wire.write(0x00);  // 唤醒 MPU6050
        Wire.endTransmission(true);
        
        // 配置
        writeRegister(CONFIG, 0x03);      // DLPF = 3
        writeRegister(GYRO_CONFIG, 0x00); // ±250°/s
        writeRegister(ACCEL_CONFIG, 0x00);// ±2g
        
        return true;
    }
    
    void writeRegister(uint8_t reg, uint8_t value) {
        Wire.beginTransmission(MPU_ADDR);
        Wire.write(reg);
        Wire.write(value);
        Wire.endTransmission(true);
    }
    
    void readRawData() {
        Wire.beginTransmission(MPU_ADDR);
        Wire.write(ACCEL_XOUT);
        Wire.endTransmission(false);
        Wire.requestFrom(MPU_ADDR, 14);
        
        rawAx = Wire.read() << 8 | Wire.read();
        rawAy = Wire.read() << 8 | Wire.read();
        rawAz = Wire.read() << 8 | Wire.read();
        Wire.read(); Wire.read();  // 温度
        rawGx = Wire.read() << 8 | Wire.read();
        rawGy = Wire.read() << 8 | Wire.read();
        rawGz = Wire.read() << 8 | Wire.read();
    }
    
    void update() {
        readRawData();
        ax = rawAx / accelScale;
        ay = rawAy / accelScale;
        az = rawAz / accelScale;
        gx = rawGx / gyroScale;
        gy = rawGy / gyroScale;
        gz = rawGz / gyroScale;
    }
    
    float getPitch() {
        return atan2(ax, sqrt(ay*ay + az*az)) * 180 / PI;
    }
    
    float getRoll() {
        return atan2(ay, az) * 180 / PI;
    }
    
    void printData() {
        Serial.print("Accel: ");
        Serial.print(ax); Serial.print(", ");
        Serial.print(ay); Serial.print(", ");
        Serial.println(az);
        Serial.print("Gyro: ");
        Serial.print(gx); Serial.print(", ");
        Serial.print(gy); Serial.print(", ");
        Serial.println(gz);
    }
};

MPU6050 mpu;
unsigned long prevTime;

void setup() {
    Serial.begin(115200);
    mpu.begin();
    prevTime = millis();
}

void loop() {
    unsigned long currTime = millis();
    float dt = (currTime - prevTime) / 1000.0;
    prevTime = currTime;
    
    mpu.update();
    mpu.printData();
    
    Serial.print("Pitch: ");
    Serial.println(mpu.getPitch());
    Serial.print("Roll: ");
    Serial.println(mpu.getRoll());
    
    delay(100);
}
```

### Python Raspberry Pi 驱动

```python
import smbus2
import time
import math

class MPU6050:
    # 寄存器地址
    SMPLRT_DIV = 0x19
    CONFIG = 0x1A
    GYRO_CONFIG = 0x1B
    ACCEL_CONFIG = 0x1C
    ACCEL_XOUT = 0x3B
    GYRO_XOUT = 0x43
    PWR_MGMT_1 = 0x6B
    ADDRESS = 0x68
    
    def __init__(self, i2c_bus=1):
        self.bus = smbus2.SMBus(i2c_bus)
        self.accel_scale = 16384.0  # ±2g
        self.gyro_scale = 131.0     # ±250°/s
        
    def write_byte(self, reg, value):
        self.bus.write_byte_data(self.ADDRESS, reg, value)
        
    def read_word_2c(self, reg):
        high = self.bus.read_byte_data(self.ADDRESS, reg)
        low = self.bus.read_byte_data(self.ADDRESS, reg + 1)
        value = (high << 8) | low
        if value >= 0x8000:
            return -((65535 - value) + 1)
        return value
    
    def begin(self):
        # 唤醒
        self.write_byte(self.PWR_MGMT_1, 0x00)
        time.sleep(0.1)
        
        # 配置
        self.write_byte(self.CONFIG, 0x03)
        self.write_byte(self.GYRO_CONFIG, 0x00)
        self.write_byte(self.ACCEL_CONFIG, 0x00)
        
    def read_raw_data(self):
        return {
            'ax': self.read_word_2c(self.ACCEL_XOUT) / self.accel_scale,
            'ay': self.read_word_2c(self.ACCEL_XOUT + 2) / self.accel_scale,
            'az': self.read_word_2c(self.ACCEL_XOUT + 4) / self.accel_scale,
            'gx': self.read_word_2c(self.GYRO_XOUT) / self.gyro_scale,
            'gy': self.read_word_2c(self.GYRO_XOUT + 2) / self.gyro_scale,
            'gz': self.read_word_2c(self.GYRO_XOUT + 4) / self.gyro_scale,
        }
    
    def get_pitch(self, ax, ay, az):
        return math.degrees(math.atan2(ax, math.sqrt(ay**2 + az**2)))
    
    def get_roll(self, ay, az):
        return math.degrees(math.atan2(ay, az))

# 使用示例
mpu = MPU6050()
mpu.begin()

prev_time = time.time()

while True:
    curr_time = time.time()
    dt = curr_time - prev_time
    prev_time = curr_time
    
    data = mpu.read_raw_data()
    print(f"Accel: {data['ax']:.2f}, {data['ay']:.2f}, {data['az']:.2f}")
    print(f"Gyro: {data['gx']:.2f}, {data['gy']:.2f}, {data['gz']:.2f}")
    
    pitch = mpu.get_pitch(data['ax'], data['ay'], data['az'])
    roll = mpu.get_roll(data['ay'], data['az'])
    print(f"Pitch: {pitch:.2f}°, Roll: {roll:.2f}°")
    
    time.sleep(0.1)
```

## ⚠️ 校准与误差

### 1. 加速度计校准

```python
def calibrate_accel(mpu, samples=1000):
    """加速度计零偏校准"""
    bias_x, bias_y, bias_z = 0, 0, 0
    
    for _ in range(samples):
        data = mpu.read_raw_data()
        bias_x += data['ax']
        bias_y += data['ay']
        bias_z += data['az']
    
    bias_x /= samples
    bias_y /= samples
    bias_z /= samples
    
    # Z 轴应该为 1g (当水平放置时)
    bias_z -= 1.0
    
    return {'ax': bias_x, 'ay': bias_y, 'az': bias_z}
```

### 2. 陀螺仪校准

```python
def calibrate_gyro(mpu, samples=1000):
    """陀螺仪零偏校准 (静止状态)"""
    bias_x, bias_y, bias_z = 0, 0, 0
    
    for _ in range(samples):
        data = mpu.read_raw_data()
        bias_x += data['gx']
        bias_y += data['gy']
        bias_z += data['gz']
        time.sleep(0.001)
    
    return {
        'gx': bias_x / samples,
        'gy': bias_y / samples,
        'gz': bias_z / samples
    }
```

### 3. 磁力计校准 (椭球拟合)

```
┌─────────────────────────────────────────────────────┐
│              磁力计校准                              │
│                                                     │
│  原始数据 (未校准):          校准后数据:             │
│                                                     │
│       ╭─────╮                     ○                 │
│     ╱       ╰╮                  ╱│╲                │
│    │   ●    │     ────►        ──┼──               │
│     ╰╮       ╱                  ╲│╱                │
│       ╰─────╯                     ○                 │
│     椭球 (有偏)                圆 (无偏)            │
│                                                     │
│  校准步骤:                                          │
│  1. 采集各方向磁力计数据                            │
│  2. 拟合椭球方程                                    │
│  3. 计算偏移和缩放因子                              │
│  4. 应用校准变换                                    │
└─────────────────────────────────────────────────────┘
```

## 🎯 应用实例

### 自平衡小车

```cpp
// PID 控制自平衡
class BalanceBot {
private:
    float Kp = 35.0, Ki = 0.0, Kd = 0.7;
    float targetAngle = 0.0;
    float integral = 0;
    float prevError = 0;
    MPU6050 mpu;
    
public:
    float calculatePID(float currentAngle) {
        float error = targetAngle - currentAngle;
        integral += error;
        float derivative = error - prevError;
        prevError = error;
        
        float output = Kp * error + Ki * integral + Kd * derivative;
        return constrain(output, -255, 255);
    }
    
    void loop() {
        mpu.update();
        float angle = mpu.getPitch();
        float motorSpeed = calculatePID(angle);
        setMotorSpeed(motorSpeed);
    }
};
```

### 无人机姿态控制

```cpp
// 无人机姿态控制
class DroneController {
private:
    float targetRoll = 0, targetPitch = 0, targetYaw = 0;
    float currentRoll, currentPitch, currentYaw;
    
public:
    void stabilize() {
        // 读取当前姿态
        readIMU();
        
        // 计算姿态误差
        float rollError = targetRoll - currentRoll;
        float pitchError = targetPitch - currentPitch;
        float yawError = targetYaw - currentYaw;
        
        // PID 控制
        float motorAdjust[4];
        calculateMotorOutput(rollError, pitchError, yawError, motorAdjust);
        
        // 应用至电机
        applyMotorAdjustment(motorAdjust);
    }
    
    void calculateMotorOutput(float rErr, float pErr, float yErr, 
                              float* output) {
        // 四旋翼混合器
        output[0] = +pErr -rErr -yErr;  // 前右
        output[1] = -pErr -rErr +yErr;  // 前左
        output[2] = -pErr +rErr -yErr;  // 后右
        output[3] = +pErr +rErr +yErr;  // 后左
    }
};
```

## 📖 参考资源

- [InvenSense MPU6050 数据手册](https://invensense.tdk.com/wp-content/uploads/2015/02/MPU-6000-Datasheet1.pdf)
- [卡尔曼滤波教程](http://www.bzarg.com/p/how-a-kalman-filter-works-in-pictures/)
- [传感器融合算法](https://www.nxp.com/docs/en/application-note/AN4246.pdf)
- [BNO055 数据手册](https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bno055-ds000.pdf)

## 🔗 相关主题

- [传感器融合 (Sensor Fusion)](./SENSOR_FUSION.md)
- [机器人控制 (Robot Control)](./ROBOT_CONTROL.md)
- [无人机系统 (Drone System)](./DRONE_SYSTEM.md)
