# 传感器融合与卡尔曼滤波

## 🧠 功能概述

传感器融合 (Sensor Fusion) 是将多个传感器的数据进行组合，以获得比单一传感器更准确、更可靠的姿态估计。本学习文档深入讲解互补滤波、卡尔曼滤波及其在 IMU 姿态解算中的实战应用。

## 📚 传感器融合层次

```
┌─────────────────────────────────────────────────────┐
│              传感器融合层次结构                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  数据级融合 (Data-Level Fusion)                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │加速度计 │  │ 陀螺仪  │  │ 磁力计  │            │
│  │ 原始数据│  │ 原始数据│  │ 原始数据│            │
│  └────┬────┘  └────┬────┘  └────┬────┘            │
│       └───────────┼─────────────┘                  │
│                   ▼                                 │
│         ┌─────────────────┐                         │
│         │   卡尔曼滤波    │                         │
│         └─────────────────┘                         │
│                                                     │
│  特征级融合 (Feature-Level Fusion)                  │
│  • 提取各传感器特征 (角速度、加速度、磁场)           │
│  • 特征向量组合                                      │
│  • 模式识别/分类                                     │
│                                                     │
│  决策级融合 (Decision-Level Fusion)                 │
│  • 各传感器独立判断                                  │
│  • 投票/加权决策                                     │
│  • 置信度评估                                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 🔧 姿态表示方法

### 1. 欧拉角 (Euler Angles)

```
┌─────────────────────────────────────────────────────┐
│              欧拉角定义                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  旋转顺序：Z-Y-X (yaw-pitch-roll)                   │
│                                                     │
│       Z                                             │
│       │      yaw (ψ)                                │
│       │     ╱                                       │
│       │   ╱                                         │
│       │ ╱                                           │
│       └─────────── Y                                │
│      ╱  ╲                                           │
│    ╱      ╲  pitch (θ)                              │
│  ╱          ╲                                       │
│ X            ╲                                      │
│               ╲                                     │
│                roll (φ)                             │
│                                                     │
│  范围：                                             │
│  • Roll (横滚角):   -180° ~ +180°                   │
│  • Pitch (俯仰角):  -90°  ~ +90°                    │
│  • Yaw (偏航角):    -180° ~ +180°                   │
│                                                     │
│  万向节死锁 (Gimbal Lock):                          │
│  当 Pitch = ±90° 时，Roll 和 Yaw 轴重合，丢失一个自由度  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2. 四元数 (Quaternion)

```
┌─────────────────────────────────────────────────────┐
│              四元数表示                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  q = w + xi + yj + zk                               │
│                                                     │
│  其中：                                             │
│  • w: 实部 (标量部分)                                │
│  • x, y, z: 虚部 (向量部分)                          │
│  • i² = j² = k² = ijk = -1                          │
│                                                     │
│  单位四元数 (用于旋转):                              │
│  q = cos(θ/2) + sin(θ/2)·(u_x·i + u_y·j + u_z·k)   │
│                                                     │
│  其中 u = (u_x, u_y, u_z) 是旋转轴单位向量           │
│        θ 是旋转角度                                  │
│                                                     │
│  性质：                                             │
│  • ||q|| = 1 (单位四元数)                           │
│  • q* = [w, -x, -y, -z] (共轭)                      │
│  • q⁻¹ = q* (单位四元数的逆=共轭)                    │
│                                                     │
│  优点：                                             │
│  • 无万向节死锁                                      │
│  • 插值平滑 (SLERP)                                  │
│  • 计算效率高                                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3. 旋转矩阵 (Rotation Matrix)

```
┌─────────────────────────────────────────────────────┐
│              旋转矩阵                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  R = R_z(ψ) · R_y(θ) · R_x(φ)                       │
│                                                     │
│       ┌                         ┐                   │
│       │ cosθ·cosψ  sinφ·sinθ·cosψ-cosφ·sinψ  cosφ·sinθ·cosψ+sinφ·sinψ │
│       │ cosθ·sinψ  sinφ·sinθ·sinψ+cosφ·cosψ  cosφ·sinθ·sinψ-sinφ·cosψ │
│       │   -sinθ            sinφ·cosθ          cosφ·cosθ         │     │
│       └                         ┘                   │
│                                                     │
│  从四元数到旋转矩阵:                                │
│                                                     │
│       ┌                                          ┐  │
│       │ 1-2(y²+z²)   2(xy-wz)     2(xz+wy)      │  │
│       │ 2(xy+wz)   1-2(x²+z²)     2(yz-wx)      │  │
│       │ 2(xz-wy)     2(yz+wx)   1-2(x²+y²)      │  │
│       └                                          ┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔵 互补滤波 (Complementary Filter)

### 1. 基本原理

```
┌─────────────────────────────────────────────────────┐
│              互补滤波框图                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐                                    │
│  │   陀螺仪    │                                    │
│  │  (角速度)   │                                    │
│  └──────┬──────┘                                    │
│         │ ω                                          │
│         ▼                                            │
│  ┌─────────────┐     ┌─────────────┐               │
│  │    积分     │────→│   高通滤波   │               │
│  │  θ_gyro=∫ω  │     │  HPF: τ₁   │───┐           │
│  └─────────────┘     └─────────────┘   │           │
│                                        │ +         │
│                                        ▼           │
│                                   ┌─────────┐      │
│                                   │  输出   │──→ θ │
│                                   │  θ_est  │      │
│                                   └─────────┘      │
│                                        ▲           │
│                                        │ +         │
│  ┌─────────────┐     ┌─────────────┐   │           │
│  │  加速度计   │────→│   低通滤波   │───┘           │
│  │  (角度)     │     │  LPF: τ₂   │               │
│  └─────────────┘     └─────────────┘               │
│         θ_acc                                       │
│                                                     │
│  离散形式：                                         │
│  θ_est[k] = α·(θ_est[k-1] + ω·dt) + (1-α)·θ_acc   │
│                                                     │
│  其中：α = τ/(τ+dt), 典型值 0.93~0.98              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2. 互补滤波代码实现

```c
// 互补滤波实现
typedef struct {
  float alpha;      // 滤波系数 (0.93~0.98)
  float dt;         // 时间间隔
  float angle;      // 估计角度
  float gyro_bias;  // 陀螺仪零偏
} ComplementaryFilter;

void CF_Init(ComplementaryFilter *cf, float alpha, float dt) {
  cf->alpha = alpha;
  cf->dt = dt;
  cf->angle = 0.0f;
  cf->gyro_bias = 0.0f;
}

float CF_Update(ComplementaryFilter *cf, float gyro_rate, float acc_angle) {
  // 陀螺仪积分 (高通滤波)
  float gyro_angle = cf->angle + (gyro_rate - cf->gyro_bias) * cf->dt;
  
  // 与加速度计融合 (低通滤波)
  cf->angle = cf->alpha * gyro_angle + (1.0f - cf->alpha) * acc_angle;
  
  return cf->angle;
}

// 从加速度计计算角度
float Accel_GetAngle(float ax, float ay, float az) {
  // Pitch: 绕 Y 轴旋转
  float pitch = atan2f(-ax, sqrtf(ay*ay + az*az)) * 180.0f / M_PI;
  
  // Roll: 绕 X 轴旋转
  float roll = atan2f(ay, az) * 180.0f / M_PI;
  
  return pitch;  // 或 roll
}

// 使用示例
ComplementaryFilter cf_pitch, cf_roll;
float dt = 0.01f;  // 100Hz

CF_Init(&cf_pitch, 0.96f, dt);
CF_Init(&cf_roll, 0.96f, dt);

// 在主循环中
float ax, ay, az;  // 加速度计原始数据
float gx, gy, gz;  // 陀螺仪原始数据

// 从加速度计计算角度
float acc_pitch = Accel_GetAngle(ax, ay, az);
float acc_roll = Accel_GetAngle(ay, ax, az);

// 互补滤波融合
float pitch = CF_Update(&cf_pitch, gy, acc_pitch);
float roll = CF_Update(&cf_roll, gx, acc_roll);
```

### 3. 滤波系数选择

```
┌─────────────────────────────────────────────────────┐
│              互补滤波系数选择                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  α 值的影响：                                       │
│  • α 越大 (接近 1): 更信任陀螺仪，响应快，有漂移     │
│  • α 越小 (接近 0): 更信任加速度计，响应慢，稳定    │
│                                                     │
│  时间常数 τ 与 α 的关系:                             │
│  α = τ / (τ + dt)                                   │
│                                                     │
│  推荐值 (100Hz 采样):                                │
│  • τ = 0.5s → α = 0.98  (平衡机器人)               │
│  • τ = 1.0s → α = 0.96  (无人机姿态)               │
│  • τ = 2.0s → α = 0.93  (手持设备)                 │
│                                                     │
│  频率响应：                                         │
│  • 截止频率 f_c = 1 / (2πτ)                         │
│  • τ=1s → f_c ≈ 0.16Hz                              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🟢 卡尔曼滤波 (Kalman Filter)

### 1. 卡尔曼滤波原理

```
┌─────────────────────────────────────────────────────┐
│              卡尔曼滤波流程                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│       ┌─────────────────────────────────┐          │
│       │      预测步骤 (Prediction)       │          │
│       │                                 │          │
│       │  x̂_k|k-1 = F·x̂_k-1|k-1 + B·u   │          │
│       │  P_k|k-1 = F·P·Fᵀ + Q          │          │
│       │                                 │          │
│       └──────────────┬──────────────────┘          │
│                      │                              │
│                      ▼                              │
│       ┌─────────────────────────────────┐          │
│       │      更新步骤 (Update)           │          │
│       │                                 │          │
│       │  y_k = z_k - H·x̂_k|k-1         │  新息     │
│       │  S_k = H·P·Hᵀ + R              │  新息协方差│
│       │  K_k = P·Hᵀ·S⁻¹                │  卡尔曼增益│
│       │                                 │          │
│       │  x̂_k|k = x̂_k|k-1 + K·y        │          │
│       │  P_k|k = (I - K·H)·P           │          │
│       │                                 │          │
│       └─────────────────────────────────┘          │
│                                                     │
│  符号说明：                                         │
│  • x: 状态向量                                      │
│  • P: 状态协方差矩阵                                │
│  • F: 状态转移矩阵                                  │
│  • Q: 过程噪声协方差                                │
│  • R: 测量噪声协方差                                │
│  • H: 观测矩阵                                      │
│  • K: 卡尔曼增益                                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2. 一维卡尔曼滤波 (简单示例)

```c
// 一维卡尔曼滤波 (用于温度测量等)
typedef struct {
  float x;  // 估计值
  float P;  // 估计误差协方差
  float Q;  // 过程噪声
  float R;  // 测量噪声
} KalmanFilter1D;

void KF1D_Init(KalmanFilter1D *kf, float init_val, float Q, float R) {
  kf->x = init_val;
  kf->P = 1.0f;
  kf->Q = Q;  // 典型值：0.001
  kf->R = R;  // 典型值：0.1
}

float KF1D_Update(KalmanFilter1D *kf, float measurement) {
  // 预测
  float P_pred = kf->P + kf->Q;
  
  // 更新
  float K = P_pred / (P_pred + kf->R);  // 卡尔曼增益
  kf->x = kf->x + K * (measurement - kf->x);
  kf->P = (1 - K) * P_pred;
  
  return kf->x;
}

// 使用示例
KalmanFilter1D kf_temp;
KF1D_Init(&kf_temp, 25.0f, 0.001f, 0.1f);

// 在主循环中
float raw_temp = ReadTemperatureSensor();
float filtered_temp = KF1D_Update(&kf_temp, raw_temp);
```

### 3. 扩展卡尔曼滤波 (EKF) - IMU 姿态解算

```c
// EKF 用于 IMU 姿态解算 (四元数)
typedef struct {
  float q[4];     // 四元数 [w, x, y, z]
  float P[7][7];  // 协方差矩阵 (4 四元数 +3 陀螺零偏)
  float Q[7][7];  // 过程噪声
  float R[3][3];  // 测量噪声
  float gyro_bias[3];  // 陀螺零偏
} EKFilter;

void EKF_Init(EKFilter *ekf) {
  // 初始四元数 (无旋转)
  ekf->q[0] = 1.0f;
  ekf->q[1] = 0.0f;
  ekf->q[2] = 0.0f;
  ekf->q[3] = 0.0f;
  
  // 初始化协方差
  for (int i = 0; i < 7; i++) {
    for (int j = 0; j < 7; j++) {
      ekf->P[i][j] = (i == j) ? 0.1f : 0.0f;
    }
  }
  
  // 过程噪声
  ekf->Q[0][0] = ekf->Q[1][1] = ekf->Q[2][2] = ekf->Q[3][3] = 0.001f;
  ekf->Q[4][4] = ekf->Q[5][5] = ekf->Q[6][6] = 0.0001f;
  
  // 测量噪声 (加速度计)
  ekf->R[0][0] = ekf->R[1][1] = ekf->R[2][2] = 0.1f;
}

// 四元数微分方程 (预测)
void EKF_Predict(EKFilter *ekf, float gx, float gy, float gz, float dt) {
  // 减去零偏
  gx -= ekf->gyro_bias[0];
  gy -= ekf->gyro_bias[1];
  gz -= ekf->gyro_bias[2];
  
  // 四元数微分
  float dq[4];
  dq[0] = 0.5f * (-ekf->q[1]*gx - ekf->q[2]*gy - ekf->q[3]*gz);
  dq[1] = 0.5f * ( ekf->q[0]*gx + ekf->q[2]*gz - ekf->q[3]*gy);
  dq[2] = 0.5f * ( ekf->q[0]*gy - ekf->q[1]*gz + ekf->q[3]*gx);
  dq[3] = 0.5f * ( ekf->q[0]*gz + ekf->q[1]*gy - ekf->q[2]*gx);
  
  // 更新四元数
  for (int i = 0; i < 4; i++) {
    ekf->q[i] += dq[i] * dt;
  }
  
  // 归一化
  float norm = sqrtf(ekf->q[0]*ekf->q[0] + ekf->q[1]*ekf->q[1] +
                     ekf->q[2]*ekf->q[2] + ekf->q[3]*ekf->q[3]);
  for (int i = 0; i < 4; i++) {
    ekf->q[i] /= norm;
  }
}

// 加速度计更新
void EKF_Update_Accel(EKFilter *ekf, float ax, float ay, float az) {
  // 从四元数计算重力向量
  float g[3];
  g[0] = 2.0f * (ekf->q[1]*ekf->q[3] - ekf->q[0]*ekf->q[2]);
  g[1] = 2.0f * (ekf->q[0]*ekf->q[1] + ekf->q[2]*ekf->q[3]);
  g[2] = ekf->q[0]*ekf->q[0] - ekf->q[1]*ekf->q[1] - 
         ekf->q[2]*ekf->q[2] + ekf->q[3]*ekf->q[3];
  
  // 归一化测量
  float norm = sqrtf(ax*ax + ay*ay + az*az);
  ax /= norm; ay /= norm; az /= norm;
  
  // 新息
  float y[3] = {ax - g[0], ay - g[1], az - g[2]};
  
  // 简化的卡尔曼增益 (固定增益)
  float K = 0.1f;
  
  // 更新四元数 (简化版)
  ekf->q[0] += K * y[2] * ekf->q[2];
  ekf->q[1] += K * (y[0]*ekf->q[2] - y[1]*ekf->q[3]);
  ekf->q[2] += K * (y[0]*ekf->q[1] + y[1]*ekf->q[0] - y[2]*ekf->q[3]);
  ekf->q[3] += K * (y[1]*ekf->q[2] + y[2]*ekf->q[1]);
  
  // 重新归一化
  float norm_q = sqrtf(ekf->q[0]*ekf->q[0] + ekf->q[1]*ekf->q[1] +
                       ekf->q[2]*ekf->q[2] + ekf->q[3]*ekf->q[3]);
  for (int i = 0; i < 4; i++) {
    ekf->q[i] /= norm_q;
  }
}

// 从四元数提取欧拉角
void EKF_GetEuler(EKFilter *ekf, float *roll, float *pitch, float *yaw) {
  float q0 = ekf->q[0], q1 = ekf->q[1], q2 = ekf->q[2], q3 = ekf->q[3];
  
  *roll  = atan2f(2.0f*(q0*q1 + q2*q3), 1.0f - 2.0f*(q1*q1 + q2*q2));
  *pitch = asinf(2.0f*(q0*q2 - q3*q1));
  *yaw   = atan2f(2.0f*(q0*q3 + q1*q2), 1.0f - 2.0f*(q2*q2 + q3*q3));
  
  // 转换为角度
  *roll  *= 180.0f / M_PI;
  *pitch *= 180.0f / M_PI;
  *yaw   *= 180.0f / M_PI;
}
```

---

## 📊 算法对比

| 算法 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| 互补滤波 | 简单、计算量小 | 固定增益，不能自适应 | 平衡小车、简单姿态 |
| 一维 KF | 最优估计、自适应 | 仅适用于线性系统 | 温度、电压滤波 |
| EKF | 处理非线性、最优 | 计算复杂、需要调参 | 无人机、机器人 |
| Mahony | 计算量小、稳定 | 精度略低 | 低成本 IMU |
| Madgwick | 精度高、开源 | 计算量较大 | 动作捕捉、VR |

---

## 📊 学习检查清单

- [ ] 理解三种姿态表示方法
- [ ] 掌握互补滤波原理和实现
- [ ] 理解卡尔曼滤波预测/更新步骤
- [ ] 能够实现一维卡尔曼滤波
- [ ] 理解 EKF 在 IMU 中的应用
- [ ] 能够调参优化滤波效果
- [ ] 完成一个姿态解算项目

---

*最后更新：2026 年 3 月 4 日*
