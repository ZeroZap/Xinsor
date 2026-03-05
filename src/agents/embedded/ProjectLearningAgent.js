// 实战项目学习模块 - Project-Based Learning
// 提供完整的项目驱动学习体验，包含代码生成、实验记录、项目模板

import { BaseAgent } from "../BaseAgent.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectsDir = path.join(__dirname, "../../../projects");
const experimentsDir = path.join(__dirname, "../../../experiments");

// 实战项目库
export const projectTemplates = {
  // 电源管理项目
  bms_design: {
    name: "13S BMS 电池管理系统设计",
    category: "bms",
    difficulty: "advanced",
    duration: "4 weeks",
    description: "设计并实现一个 13S 电动自行车 BMS 系统",
    requirements: [
      "BQ76952 AFE 芯片选型与电路设计",
      "STM32F103 主控程序开发",
      "SOC 估算算法实现",
      "CAN 通信协议栈",
      "保护功能实现（过充/过放/过流/温度）"
    ],
    deliverables: [
      "原理图设计",
      "PCB 布局",
      "固件代码",
      "测试报告"
    ],
    knowledgePoints: ["bms", "adc", "comm_protocols", "mcu_dev"]
  },

  // IMU 姿态解算项目
  imu_attitude: {
    name: "IMU 姿态解算与传感器融合",
    category: "sensor_fusion",
    difficulty: "intermediate",
    duration: "2 weeks",
    description: "基于 MPU6050 实现姿态解算算法",
    requirements: [
      "MPU6050 驱动开发（I2C）",
      "互补滤波实现",
      "卡尔曼滤波实现",
      "四元数姿态解算",
      "实时数据可视化"
    ],
    deliverables: [
      "IMU 驱动代码",
      "滤波算法实现",
      "姿态解算模块",
      "实验数据记录"
    ],
    knowledgePoints: ["imu", "sensor_fusion", "comm_protocols", "mcu_dev"]
  },

  // 边缘 AI 部署项目
  edge_ai_deploy: {
    name: "TensorFlow Lite 边缘 AI 部署",
    category: "edge_ai",
    difficulty: "advanced",
    duration: "3 weeks",
    description: "在 STM32 上部署 YOLO 目标检测模型",
    requirements: [
      "模型训练与量化（FP32→INT8）",
      "TFLite Micro 环境搭建",
      "模型转换与优化",
      "嵌入式推理引擎",
      "性能 benchmark"
    ],
    deliverables: [
      "量化模型文件",
      "推理引擎代码",
      "性能测试报告",
      "优化方案文档"
    ],
    knowledgePoints: ["edge_ai", "mcu_dev", "adc"]
  },

  // 电源监测项目
  power_monitor: {
    name: "高精度电源监测仪",
    category: "current_sensor",
    difficulty: "intermediate",
    duration: "2 weeks",
    description: "基于 INA226 的电压电流功率监测仪",
    requirements: [
      "INA226 电流传感器应用",
      "OLED 显示驱动",
      "数据记录与统计",
      "报警功能",
      "校准算法"
    ],
    deliverables: [
      "硬件设计",
      "固件代码",
      "校准流程",
      "用户手册"
    ],
    knowledgePoints: ["current_sensor", "adc", "comm_protocols", "pcb_design"]
  },

  // 信号发生器项目
  signal_generator: {
    name: "DDS 任意波形发生器",
    category: "dac",
    difficulty: "advanced",
    duration: "3 weeks",
    description: "基于 AD9833 的 DDS 信号发生器",
    requirements: [
      "AD9833 DDS 芯片驱动",
      "波形表生成算法",
      "频率精确控制",
      "幅度调节",
      "用户界面"
    ],
    deliverables: [
      "硬件电路",
      "波形生成算法",
      "控制程序",
      "测试数据"
    ],
    knowledgePoints: ["dac", "comm_protocols", "mcu_dev", "pcb_design"]
  },

  // 数据采集系统
  data_logger: {
    name: "多通道数据采集记录仪",
    category: "adc",
    difficulty: "intermediate",
    duration: "2 weeks",
    description: "8 通道同步数据采集与 SD 卡存储",
    requirements: [
      "ADS1115 多通道 ADC 应用",
      "SD 卡文件系统",
      "DMA 数据传输",
      "时间戳记录",
      "数据回放分析"
    ],
    deliverables: [
      "采集硬件",
      "固件程序",
      "数据格式定义",
      "分析工具"
    ],
    knowledgePoints: ["adc", "comm_protocols", "mcu_dev", "pcb_design"]
  }
};

export class ProjectLearningAgent extends BaseAgent {
  constructor() {
    super("ProjectLearningAgent", "实战项目学习代理 - 项目驱动式学习", "embedded");

    this.capabilities = [
      "project_management",
      "code_generation",
      "experiment_tracking",
      "progress_tracking",
      "report_generation"
    ];

    this.projectState = {
      currentProject: null,
      currentPhase: null,
      progress: 0,
      experiments: [],
      codeSnippets: [],
      notes: [],
      startedAt: null,
      lastActivity: null
    };

    this.initializeProjectDirectory();
  }

  async initialize() {
    console.log(`[${this.name}] 初始化实战项目学习代理...`);
    await this.loadProjectState();
    console.log(`[${this.name}] 初始化完成`);
  }

  /**
   * 执行项目相关命令
   */
  async execute(input = {}, context = {}) {
    const { action, projectId, phase } = input;

    switch (action) {
      case "list":
        return this.listProjects();
      case "start":
        return this.startProject(projectId);
      case "status":
        return this.getProjectStatus();
      case "generate":
        return this.generateCode(projectId, phase);
      case "log":
        return this.logExperiment(input);
      case "report":
        return this.generateReport();
      case "template":
        return this.getProjectTemplate(projectId);
      default:
        return this.listProjects();
    }
  }

  /**
   * 列出所有可用项目
   */
  listProjects() {
    const list = Object.entries(projectTemplates).map(([key, proj]) => ({
      id: key,
      name: proj.name,
      category: proj.category,
      difficulty: proj.difficulty,
      duration: proj.duration,
      knowledgePoints: proj.knowledgePoints.join(", ")
    }));

    return {
      agent: this.name,
      action: "list",
      projects: list,
      total: list.length
    };
  }

  /**
   * 获取项目模板
   */
  getProjectTemplate(projectId) {
    const project = projectTemplates[projectId];
    if (!project) {
      return { error: `项目 ${projectId} 不存在` };
    }

    return {
      agent: this.name,
      action: "template",
      project: {
        ...project,
        phases: this.getProjectPhases(project)
      }
    };
  }

  /**
   * 获取项目阶段
   */
  getProjectPhases(project) {
    return [
      {
        id: 1,
        name: "需求分析",
        tasks: [
          "阅读相关文档",
          "确定技术选型",
          "制定开发计划"
        ]
      },
      {
        id: 2,
        name: "硬件设计",
        tasks: [
          "原理图设计",
          "PCB 布局",
          "BOM 整理"
        ]
      },
      {
        id: 3,
        name: "固件开发",
        tasks: [
          "驱动开发",
          "算法实现",
          "系统集成"
        ]
      },
      {
        id: 4,
        name: "测试验证",
        tasks: [
          "功能测试",
          "性能测试",
          "问题修复"
        ]
      },
      {
        id: 5,
        name: "文档总结",
        tasks: [
          "编写技术文档",
          "整理代码",
          "项目展示"
        ]
      }
    ];
  }

  /**
   * 启动项目
   */
  async startProject(projectId) {
    const project = projectTemplates[projectId];
    if (!project) {
      return { error: `项目 ${projectId} 不存在` };
    }

    this.projectState = {
      currentProject: projectId,
      currentPhase: 1,
      progress: 0,
      experiments: [],
      codeSnippets: [],
      notes: [],
      startedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    // 创建项目目录
    const projectDir = path.join(projectsDir, projectId);
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    // 生成项目框架
    await this.generateProjectStructure(projectId, project);

    return {
      agent: this.name,
      action: "start",
      project: {
        id: projectId,
        name: project.name,
        difficulty: project.difficulty,
        duration: project.duration
      },
      phases: this.getProjectPhases(project),
      message: `项目已启动：${project.name}`,
      directory: projectDir
    };
  }

  /**
   * 生成项目结构
   */
  async generateProjectStructure(projectId, project) {
    const projectDir = path.join(projectsDir, projectId);

    // 创建目录结构
    const dirs = ["src", "hardware", "docs", "tests", "experiments"];
    for (const dir of dirs) {
      const dirPath = path.join(projectDir, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    }

    // 生成 README
    const readme = `# ${project.name}

## 项目描述
${project.description}

## 技术栈
- 难度：${project.difficulty}
- 预计周期：${project.duration}

## 需求列表
${project.requirements.map((r, i) => `- [ ] ${r}`).join("\n")}

## 交付物
${project.deliverables.map((d, i) => `- [ ] ${d}`).join("\n")}

## 相关知识领域
${project.knowledgePoints.map(k => `- ${k}`).join("\n")}

## 项目结构
\`\`\`
${projectId}/
├── src/          # 源代码
├── hardware/     # 硬件设计
├── docs/         # 文档
├── tests/        # 测试
└── experiments/  # 实验记录
\`\`\`

## 进度
- [ ] 需求分析
- [ ] 硬件设计
- [ ] 固件开发
- [ ] 测试验证
- [ ] 文档总结
\`\`\`
`;

    fs.writeFileSync(path.join(projectDir, "README.md"), readme);

    // 生成项目配置文件
    const config = {
      projectId: projectId,
      name: project.name,
      startedAt: new Date().toISOString(),
      phases: this.getProjectPhases(project),
      requirements: project.requirements,
      deliverables: project.deliverables
    };
    fs.writeFileSync(
      path.join(projectDir, "project.json"),
      JSON.stringify(config, null, 2)
    );
  }

  /**
   * 生成代码
   */
  async generateCode(projectId, phase) {
    const project = projectTemplates[projectId];
    if (!project) {
      return { error: `项目 ${projectId} 不存在` };
    }

    const codeTemplates = this.getCodeTemplates(projectId, phase);

    return {
      agent: this.name,
      action: "generate",
      project: projectId,
      phase: phase,
      codeTemplates: codeTemplates
    };
  }

  /**
   * 获取代码模板
   */
  getCodeTemplates(projectId, phase) {
    const templates = {};

    if (projectId === "imu_attitude") {
      if (phase === "firmware" || phase === 3) {
        templates.mpu6050_driver = this.getMPU6050Driver();
        templates.complementary_filter = this.getComplementaryFilter();
        templates.main = this.getIMUMain();
      }
    }

    if (projectId === "power_monitor") {
      if (phase === "firmware" || phase === 3) {
        templates.ina226_driver = this.getINA226Driver();
        templates.main = this.getPowerMonitorMain();
      }
    }

    return templates;
  }

  /**
   * MPU6050 驱动代码模板
   */
  getMPU6050Driver() {
    return {
      filename: "mpu6050.c",
      language: "c",
      code: `/**
 * MPU6050 驱动 - I2C 接口
 * 支持加速度计和陀螺仪数据读取
 */

#include "mpu6050.h"
#include "i2c.h"

#define MPU6050_ADDR        0x68
#define MPU6050_SMPLRT_DIV  0x19
#define MPU6050_CONFIG      0x1A
#define MPU6050_GYRO_CONFIG 0x1B
#define MPU6050_ACCEL_CONFIG 0x1C
#define MPU6050_PWR_MGMT_1  0x6B
#define MPU6050_ACCEL_XOUT_H 0x3B
#define MPU6050_GYRO_XOUT_H 0x43

typedef struct {
  I2C_HandleTypeDef* hi2c;
  int16_t ax, ay, az;
  int16_t gx, gy, gz;
  float accel_scale;
  float gyro_scale;
} MPU6050_Handle;

// 初始化 MPU6050
HAL_StatusTypeDef MPU6050_Init(MPU6050_Handle* mpu, I2C_HandleTypeDef* hi2c) {
  mpu->hi2c = hi2c;
  mpu->accel_scale = 2.0f;  // ±2g
  mpu->gyro_scale = 250.0f; // ±250°/s
  
  uint8_t data;
  
  // 唤醒 MPU6050
  data = 0x00;
  HAL_I2C_Mem_Write(hi2c, MPU6050_ADDR, MPU6050_PWR_MGMT_1, 1, &data, 1, 100);
  HAL_Delay(100);
  
  // 配置采样率 (1kHz)
  data = 0x07;  // 8kHz / (1+7) = 1kHz
  HAL_I2C_Mem_Write(hi2c, MPU6050_ADDR, MPU6050_SMPLRT_DIV, 1, &data, 1, 100);
  
  // 配置 DLPF (低通滤波)
  data = 0x03;  // 44Hz
  HAL_I2C_Mem_Write(hi2c, MPU6050_ADDR, MPU6050_CONFIG, 1, &data, 1, 100);
  
  // 配置陀螺仪量程 (±250°/s)
  data = 0x00;
  HAL_I2C_Mem_Write(hi2c, MPU6050_ADDR, MPU6050_GYRO_CONFIG, 1, &data, 1, 100);
  
  // 配置加速度计量程 (±2g)
  data = 0x00;
  HAL_I2C_Mem_Write(hi2c, MPU6050_ADDR, MPU6050_ACCEL_CONFIG, 1, &data, 1, 100);
  
  return HAL_OK;
}

// 读取原始数据
HAL_StatusTypeDef MPU6050_ReadRaw(MPU6050_Handle* mpu) {
  uint8_t buffer[14];
  
  // 读取 14 字节数据 (加速度 + 温度 + 陀螺仪)
  HAL_I2C_Mem_Read(mpu->hi2c, MPU6050_ADDR, MPU6050_ACCEL_XOUT_H, 1, buffer, 14, 100);
  
  // 组合数据 (高字节在前)
  mpu->ax = (buffer[0] << 8) | buffer[1];
  mpu->ay = (buffer[2] << 8) | buffer[3];
  mpu->az = (buffer[4] << 8) | buffer[5];
  mpu->gx = (buffer[8] << 8) | buffer[9];
  mpu->gy = (buffer[10] << 8) | buffer[11];
  mpu->gz = (buffer[12] << 8) | buffer[13];
  
  return HAL_OK;
}

// 转换为物理量
void MPU6050_Convert(MPU6050_Handle* mpu, float* accel, float* gyro) {
  // 加速度：转换为 g
  accel[0] = (float)mpu->ax / 16384.0f * mpu->accel_scale;
  accel[1] = (float)mpu->ay / 16384.0f * mpu->accel_scale;
  accel[2] = (float)mpu->az / 16384.0f * mpu->accel_scale;
  
  // 陀螺仪：转换为 °/s
  gyro[0] = (float)mpu->gx / 131.0f * mpu->gyro_scale / 250.0f;
  gyro[1] = (float)mpu->gy / 131.0f * mpu->gyro_scale / 250.0f;
  gyro[2] = (float)mpu->gz / 131.0f * mpu->gyro_scale / 250.0f;
}`
    };
  }

  /**
   * 互补滤波代码模板
   */
  getComplementaryFilter() {
    return {
      filename: "filter.c",
      language: "c",
      code: `/**
 * 互补滤波器 - 姿态解算
 * 融合加速度计和陀螺仪数据
 */

#include "filter.h"
#include <math.h>

typedef struct {
  float alpha;      // 滤波系数
  float dt;         // 时间间隔
  float pitch;      // 俯仰角
  float roll;       // 横滚角
  float gyro_bias[3];
} ComplementaryFilter;

// 初始化滤波器
void CF_Init(ComplementaryFilter* cf, float alpha, float dt) {
  cf->alpha = alpha;  // 典型值：0.96
  cf->dt = dt;        // 典型值：0.01 (100Hz)
  cf->pitch = 0.0f;
  cf->roll = 0.0f;
  cf->gyro_bias[0] = 0.0f;
  cf->gyro_bias[1] = 0.0f;
  cf->gyro_bias[2] = 0.0f;
}

// 从加速度计计算角度
void CF_CalcAccelAngle(float ax, float ay, float az, float* pitch, float* roll) {
  // Pitch: 绕 Y 轴旋转
  *pitch = atan2f(-ax, sqrtf(ay*ay + az*az)) * 180.0f / M_PI;
  
  // Roll: 绕 X 轴旋转
  *roll = atan2f(ay, az) * 180.0f / M_PI;
}

// 更新滤波器
void CF_Update(ComplementaryFilter* cf, float gx, float gy, float gz,
               float ax, float ay, float az) {
  // 从加速度计计算角度
  float accel_pitch, accel_roll;
  CF_CalcAccelAngle(ax, ay, az, &accel_pitch, &accel_roll);
  
  // 互补滤波融合
  // 陀螺仪积分 (高通滤波) + 加速度计 (低通滤波)
  cf->pitch = cf->alpha * (cf->pitch + (gy - cf->gyro_bias[1]) * cf->dt) +
              (1.0f - cf->alpha) * accel_pitch;
  
  cf->roll = cf->alpha * (cf->roll + (gx - cf->gyro_bias[0]) * cf->dt) +
             (1.0f - cf->alpha) * accel_roll;
}

// 获取姿态角
void CF_GetAngle(ComplementaryFilter* cf, float* pitch, float* roll) {
  *pitch = cf->pitch;
  *roll = cf->roll;
}`
    };
  }

  /**
   * IMU 主程序模板
   */
  getIMUMain() {
    return {
      filename: "main.c",
      language: "c",
      code: `/**
 * IMU 姿态解算主程序
 */

#include "main.h"
#include "mpu6050.h"
#include "filter.h"
#include <stdio.h>

MPU6050_Handle mpu;
ComplementaryFilter cf;
float accel[3], gyro[3];
float pitch, roll;

int main(void) {
  HAL_Init();
  SystemClock_Config();
  MX_I2C1_Init();
  MX_USART1_UART_Init();
  
  // 初始化 MPU6050
  if (MPU6050_Init(&mpu, &hi2c1) != HAL_OK) {
    Error_Handler();
  }
  
  // 初始化互补滤波器
  CF_Init(&cf, 0.96f, 0.01f);  // 100Hz
  
  printf("\\r\\nIMU Attitude Estimation Started\\r\\n");
  
  while (1) {
    // 读取 MPU6050 数据
    MPU6050_ReadRaw(&mpu);
    
    // 转换为物理量
    accel[0] = (float)mpu.ax / 16384.0f;
    accel[1] = (float)mpu.ay / 16384.0f;
    accel[2] = (float)mpu.az / 16384.0f;
    gyro[0] = (float)mpu.gx / 131.0f;
    gyro[1] = (float)mpu.gy / 131.0f;
    gyro[2] = (float)mpu.gz / 131.0f;
    
    // 更新滤波器
    CF_Update(&cf, gyro[0], gyro[1], gyro[2], accel[0], accel[1], accel[2]);
    
    // 获取姿态角
    CF_GetAngle(&cf, &pitch, &roll);
    
    // 输出结果
    printf("Pitch: %6.2f°, Roll: %6.2f°\\r\\n", pitch, roll);
    
    HAL_Delay(10);  // 100Hz
  }
}`
    };
  }

  /**
   * INA226 驱动代码模板
   */
  getINA226Driver() {
    return {
      filename: "ina226.c",
      language: "c",
      code: `/**
 * INA226 电流传感器驱动
 * 支持电压、电流、功率测量
 */

#include "ina226.h"
#include "i2c.h"

#define INA226_ADDR         0x40
#define INA226_CONFIG       0x00
#define INA226_SHUNT_CAL    0x05
#define INA226_BUS_VOLTAGE  0x02
#define INA226_CURRENT      0x04
#define INA226_POWER        0x03

typedef struct {
  I2C_HandleTypeDef* hi2c;
  float shunt_resistor;  // 分流电阻 (Ω)
  float current_lsb;     // 电流 LSB (A)
} INA226_Handle;

// 初始化 INA226
HAL_StatusTypeDef INA226_Init(INA226_Handle* ina, I2C_HandleTypeDef* hi2c, float shunt_ohm) {
  ina->hi2c = hi2c;
  ina->shunt_resistor = shunt_ohm;
  
  // 计算电流 LSB (假设最大电流 3A, 15 位)
  ina->current_lsb = 3.0f / 32768.0f;  // ≈91.5uA
  
  // 配置寄存器
  // 平均 16 次，转换时间 1.1ms
  uint16_t config = 0x4127;
  uint8_t buf[2] = {config >> 8, config & 0xFF};
  HAL_I2C_Mem_Write(hi2c, INA226_ADDR, INA226_CONFIG, 1, buf, 2, 100);
  
  // 校准寄存器
  // CAL = 0.00512 / (current_lsb * shunt_resistor)
  uint16_t cal = (uint16_t)(0.00512f / (ina->current_lsb * shunt_ohm));
  buf[0] = cal >> 8;
  buf[1] = cal & 0xFF;
  HAL_I2C_Mem_Write(hi2c, INA226_ADDR, INA226_SHUNT_CAL, 1, buf, 2, 100);
  
  return HAL_OK;
}

// 读取总线电压 (mV)
HAL_StatusTypeDef INA226_ReadVoltage(INA226_Handle* ina, float* voltage_mv) {
  uint8_t buf[2];
  HAL_I2C_Mem_Read(ina->hi2c, INA226_ADDR, INA226_BUS_VOLTAGE, 1, buf, 2, 100);
  
  uint16_t raw = (buf[0] << 8) | buf[1];
  *voltage_mv = raw * 1.25f;  // 1.25mV/LSB
  
  return HAL_OK;
}

// 读取电流 (mA)
HAL_StatusTypeDef INA226_ReadCurrent(INA226_Handle* ina, float* current_ma) {
  uint8_t buf[2];
  HAL_I2C_Mem_Read(ina->hi2c, INA226_ADDR, INA226_CURRENT, 1, buf, 2, 100);
  
  int16_t raw = (buf[0] << 8) | buf[1];
  *current_ma = raw * ina->current_lsb * 1000.0f;
  
  return HAL_OK;
}

// 读取功率 (mW)
HAL_StatusTypeDef INA226_ReadPower(INA226_Handle* ina, float* power_mw) {
  uint8_t buf[2];
  HAL_I2C_Mem_Read(ina->hi2c, INA226_ADDR, INA226_POWER, 1, buf, 2, 100);
  
  uint16_t raw = (buf[0] << 8) | buf[1];
  *power_mw = raw * 25.0f * ina->current_lsb;  // 25 * current_lsb
  
  return HAL_OK;
}`
    };
  }

  /**
   * 电源监测主程序模板
   */
  getPowerMonitorMain() {
    return {
      filename: "main.c",
      language: "c",
      code: `/**
 * 电源监测仪主程序
 * 基于 INA226 的电压电流功率监测
 */

#include "main.h"
#include "ina226.h"
#include <stdio.h>

INA226_Handle ina226;
float voltage_mv, current_ma, power_mw;

int main(void) {
  HAL_Init();
  SystemClock_Config();
  MX_I2C1_Init();
  MX_USART1_UART_Init();
  
  // 初始化 INA226 (分流电阻 0.01Ω)
  INA226_Init(&ina226, &hi2c1, 0.01f);
  
  printf("\\r\\nPower Monitor Started\\r\\n");
  printf("================================\\r\\n");
  
  while (1) {
    // 读取电压
    if (INA226_ReadVoltage(&ina226, &voltage_mv) == HAL_OK) {
      // 读取电流
      INA226_ReadCurrent(&ina226, &current_ma);
      
      // 读取功率
      INA226_ReadPower(&ina226, &power_mw);
      
      // 输出结果
      printf("V: %8.2f mV | I: %8.2f mA | P: %8.2f mW\\r\\n",
             voltage_mv, current_ma, power_mw);
    } else {
      printf("INA226 Read Error!\\r\\n");
    }
    
    HAL_Delay(500);  // 2Hz 更新
  }
}`
    };
  }

  /**
   * 记录实验
   */
  async logExperiment(input) {
    const { projectId, title, data, notes } = input;

    const experiment = {
      id: Date.now(),
      projectId: projectId,
      title: title,
      timestamp: new Date().toISOString(),
      data: data,
      notes: notes
    };

    this.projectState.experiments.push(experiment);

    // 保存到文件
    const expDir = path.join(experimentsDir, projectId);
    if (!fs.existsSync(expDir)) {
      fs.mkdirSync(expDir, { recursive: true });
    }

    const expFile = path.join(expDir, `exp_${experiment.id}.json`);
    fs.writeFileSync(expFile, JSON.stringify(experiment, null, 2));

    return {
      agent: this.name,
      action: "log",
      experiment: experiment,
      message: "实验已记录"
    };
  }

  /**
   * 生成项目报告
   */
  async generateReport() {
    if (!this.projectState.currentProject) {
      return { error: "当前没有活跃项目" };
    }

    const project = projectTemplates[this.projectState.currentProject];
    const report = {
      agent: this.name,
      action: "report",
      project: {
        id: this.projectState.currentProject,
        name: project.name,
        startedAt: this.projectState.startedAt,
        currentPhase: this.projectState.currentPhase,
        progress: this.projectState.progress
      },
      statistics: {
        experiments: this.projectState.experiments.length,
        codeSnippets: this.projectState.codeSnippets.length,
        notes: this.projectState.notes.length
      },
      experiments: this.projectState.experiments,
      summary: `项目 ${project.name} 已进行 ${this.projectState.experiments.length} 次实验`
    };

    return report;
  }

  /**
   * 初始化项目目录
   */
  initializeProjectDirectory() {
    if (!fs.existsSync(projectsDir)) {
      fs.mkdirSync(projectsDir, { recursive: true });
    }
    if (!fs.existsSync(experimentsDir)) {
      fs.mkdirSync(experimentsDir, { recursive: true });
    }
  }

  /**
   * 加载项目状态
   */
  async loadProjectState() {
    const stateFile = path.join(__dirname, "../../../.project_state.json");
    try {
      if (fs.existsSync(stateFile)) {
        const data = JSON.parse(fs.readFileSync(stateFile, "utf-8"));
        this.projectState = { ...this.projectState, ...data };
      }
    } catch (e) {
      console.warn(`[${this.name}] 加载项目状态失败:`, e.message);
    }
  }

  /**
   * 保存项目状态
   */
  async saveProjectState() {
    const stateFile = path.join(__dirname, "../../../.project_state.json");
    try {
      fs.writeFileSync(stateFile, JSON.stringify(this.projectState, null, 2));
    } catch (e) {
      console.error(`[${this.name}] 保存项目状态失败:`, e.message);
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      state: this.projectState
    };
  }
}
