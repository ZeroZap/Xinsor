// 自主工作任务模块
// 包含：传感器数据处理、代码生成、文档生成、数据分析等任务

import { AgentRegistry } from "../agents/AgentRegistry.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 获取 Agent 实例
const agentRegistry = new AgentRegistry();

// ==================== 传感器数据处理任务 ====================

// 传感器数据采集模拟任务
export async function sensorDataCollectionTask(context) {
  const sensorAgent = agentRegistry.get("SensorAgent");
  const dataAgent = agentRegistry.get("DataCollectionAgent");
  
  // 模拟传感器数据读取
  const sensorTypes = ['temperature', 'humidity', 'pressure', 'accelerometer'];
  const readings = [];
  
  for (const type of sensorTypes) {
    readings.push({
      type,
      value: generateSensorValue(type),
      timestamp: new Date().toISOString(),
      quality: Math.random() > 0.1 ? 'good' : 'noisy'
    });
  }
  
  // 保存到文件
  const outputFile = path.join(__dirname, "../data/sensor_readings.json");
  const dataDir = path.dirname(outputFile);
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const data = {
    collectedAt: new Date().toISOString(),
    runCount: context.runCount,
    readings
  };
  
  // 追加到文件
  let existingData = [];
  if (fs.existsSync(outputFile)) {
    try {
      existingData = JSON.parse(fs.readFileSync(outputFile, "utf-8"));
    } catch (e) {
      existingData = [];
    }
  }
  
  existingData.push(data);
  // 只保留最近 100 条记录
  if (existingData.length > 100) {
    existingData = existingData.slice(-100);
  }
  
  fs.writeFileSync(outputFile, JSON.stringify(existingData, null, 2));
  
  return {
    summary: `采集 ${readings.length} 个传感器数据点`,
    readings,
    savedTo: outputFile
  };
}

function generateSensorValue(type) {
  const generators = {
    temperature: () => (20 + Math.random() * 10).toFixed(2),
    humidity: () => (40 + Math.random() * 30).toFixed(1),
    pressure: () => (1000 + Math.random() * 50).toFixed(1),
    accelerometer: () => ({
      x: (Math.random() * 2 - 1).toFixed(3),
      y: (Math.random() * 2 - 1).toFixed(3),
      z: (9.8 + Math.random() * 0.5).toFixed(3)
    })
  };
  return generators[type] ? generators[type]() : 0;
}

// 传感器数据分析任务
export async function sensorDataAnalysisTask(context) {
  const dataFile = path.join(__dirname, "../data/sensor_readings.json");
  
  if (!fs.existsSync(dataFile)) {
    return {
      summary: "暂无数据可分析",
      status: "waiting"
    };
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    const allReadings = data.flatMap(d => d.readings || []);
    
    // 按类型分组统计
    const stats = {};
    const typeValues = {};
    
    for (const reading of allReadings) {
      const type = reading.type;
      if (!typeValues[type]) {
        typeValues[type] = [];
      }
      
      const value = typeof reading.value === 'number' ? reading.value : 
                   (typeof reading.value === 'object' ? 
                    (reading.value.z || 0) : parseFloat(reading.value) || 0);
      
      typeValues[type].push(value);
    }
    
    for (const [type, values] of Object.entries(typeValues)) {
      if (values.length > 0) {
        const sorted = [...values].sort((a, b) => a - b);
        stats[type] = {
          count: values.length,
          min: Math.min(...values).toFixed(3),
          max: Math.max(...values).toFixed(3),
          avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(3),
          median: sorted[Math.floor(sorted.length / 2)].toFixed(3)
        };
      }
    }
    
    // 保存分析结果
    const analysisFile = path.join(__dirname, "../data/sensor_analysis.json");
    fs.writeFileSync(analysisFile, JSON.stringify({
      analyzedAt: new Date().toISOString(),
      totalReadings: allReadings.length,
      statistics: stats
    }, null, 2));
    
    return {
      summary: `分析 ${allReadings.length} 条数据，${Object.keys(stats).length} 种传感器类型`,
      statistics: stats,
      savedTo: analysisFile
    };
    
  } catch (err) {
    return {
      summary: `分析失败：${err.message}`,
      status: "error"
    };
  }
}

// ==================== 代码生成任务 ====================

// HAL 代码生成任务
export async function halCodeGenerationTask(context) {
  const halAgent = agentRegistry.get("MCUHALAgent");
  const driverAgent = agentRegistry.get("EmbeddedDriverAgent");
  
  if (!halAgent || !driverAgent) {
    return {
      summary: "HAL 或 Driver Agent 不可用",
      status: "unavailable"
    };
  }
  
  // 生成传感器 HAL 代码
  const sensors = ['temperature', 'humidity', 'pressure', 'imu'];
  const generatedFiles = [];
  
  const outputDir = path.join(__dirname, "../generated/hal");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  for (const sensor of sensors) {
    const halResult = await halAgent.execute(`generate ${sensor}_sensor`, {
      interface: 'I2C',
      peripheral: 'GPIO'
    });
    
    const driverResult = await driverAgent.execute(`generate ${sensor}_driver`, {
      interface: 'I2C'
    });
    
    const fileName = `${sensor}_sensor`;
    const headerContent = generateHeaderCode(fileName, halResult);
    const sourceContent = generateSourceContent(fileName, driverResult);
    
    fs.writeFileSync(path.join(outputDir, `${fileName}.h`), headerContent);
    fs.writeFileSync(path.join(outputDir, `${fileName}.c`), sourceContent);
    
    generatedFiles.push(`${fileName}.h`, `${fileName}.c`);
  }
  
  // 生成 Makefile
  const makefile = generateMakefile(sensors);
  fs.writeFileSync(path.join(outputDir, "Makefile"), makefile);
  generatedFiles.push("Makefile");
  
  return {
    summary: `生成 ${generatedFiles.length} 个 HAL 文件`,
    files: generatedFiles,
    outputDir
  };
}

function generateHeaderCode(name, halResult) {
  const guard = `__${name.toUpperCase()}_H__`;
  return `/**
 * @file ${name}.h
 * @brief Auto-generated HAL header for ${name}
 * @generated ${new Date().toISOString()}
 */

#ifndef ${guard}
#define ${guard}

#ifdef __cplusplus
extern "C" {
#endif

#include <stdint.h>
#include <stdbool.h>

// HAL Handle Definition
typedef struct {
  void *instance;
  uint8_t address;
  bool initialized;
} ${capitalize(name)}_Handle_t;

// Configuration Structure
typedef struct {
  uint8_t i2c_address;
  uint32_t sample_rate;
  uint8_t resolution;
} ${capitalize(name)}_Config_t;

// Function Prototypes
HAL_StatusTypeDef ${name}_Init(${capitalize(name)}_Handle_t *h, ${capitalize(name)}_Config_t *config);
HAL_StatusTypeDef ${name}_DeInit(${capitalize(name)}_Handle_t *h);
HAL_StatusTypeDef ${name}_Read(${capitalize(name)}_Handle_t *h, float *value);
HAL_StatusTypeDef ${name}_Write(${capitalize(name)}_Handle_t *h, uint8_t reg, uint8_t data);

#ifdef __cplusplus
}
#endif

#endif /* ${guard} */
`;
}

function generateSourceContent(name, driverResult) {
  return `/**
 * @file ${name}.c
 * @brief Auto-generated HAL source for ${name}
 * @generated ${new Date().toISOString()}
 */

#include "${name}.h"
#include <string.h>

/**
 * @brief Initialize ${name} sensor
 * @param h Pointer to handle structure
 * @param config Pointer to configuration
 * @return HAL_StatusTypeDef HAL_OK on success
 */
HAL_StatusTypeDef ${name}_Init(${capitalize(name)}_Handle_t *h, ${capitalize(name)}_Config_t *config) {
  if (!h || !config) {
    return HAL_ERROR;
  }
  
  // Initialize hardware
  // TODO: Implement I2C initialization
  
  h->initialized = true;
  return HAL_OK;
}

/**
 * @brief Deinitialize ${name} sensor
 * @param h Pointer to handle structure
 * @return HAL_StatusTypeDef HAL_OK on success
 */
HAL_StatusTypeDef ${name}_DeInit(${capitalize(name)}_Handle_t *h) {
  if (!h) {
    return HAL_ERROR;
  }
  
  // Cleanup resources
  h->initialized = false;
  return HAL_OK;
}

/**
 * @brief Read sensor value
 * @param h Pointer to handle structure
 * @param value Pointer to store reading
 * @return HAL_StatusTypeDef HAL_OK on success
 */
HAL_StatusTypeDef ${name}_Read(${capitalize(name)}_Handle_t *h, float *value) {
  if (!h || !h->initialized || !value) {
    return HAL_ERROR;
  }
  
  // TODO: Implement sensor read operation
  *value = 0.0f;
  return HAL_OK;
}

/**
 * @brief Write to sensor register
 * @param h Pointer to handle structure
 * @param reg Register address
 * @param data Data to write
 * @return HAL_StatusTypeDef HAL_OK on success
 */
HAL_StatusTypeDef ${name}_Write(${capitalize(name)}_Handle_t *h, uint8_t reg, uint8_t data) {
  if (!h || !h->initialized) {
    return HAL_ERROR;
  }
  
  // TODO: Implement register write
  return HAL_OK;
}
`;
}

function generateMakefile(sensors) {
  const sources = sensors.map(s => `${s}_sensor.c`).join(' ');
  const objects = sensors.map(s => `${s}_sensor.o`).join(' ');
  
  return `# Auto-generated Makefile for XinSor HAL
# Generated: ${new Date().toISOString()}

CC = arm-none-eabi-gcc
AS = arm-none-eabi-as
LD = arm-none-eabi-ld

CFLAGS = -mcpu=cortex-m3 -mthumb -O2 -Wall -Wextra
LDFLAGS = -T stm32f103c8.ld

SOURCES = ${sources}
OBJECTS = ${objects}

TARGET = xinsor_hal.elf

all: $(TARGET)

$(TARGET): $(OBJECTS)
\t$(LD) $(LDFLAGS) -o $@ $^

%.o: %.c
\t$(CC) $(CFLAGS) -c -o $@ $<

clean:
\trm -f $(OBJECTS) $(TARGET)

.PHONY: all clean
`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==================== 文档生成任务 ====================

// API 文档生成任务
export async function apiDocumentationTask(context) {
  const docAgent = agentRegistry.get("DocAgent");
  
  if (!docAgent) {
    return {
      summary: "DocAgent 不可用",
      status: "unavailable"
    };
  }
  
  const outputDir = path.join(__dirname, "../generated/docs");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 扫描源代码文件
  const srcDir = path.join(__dirname, "../agents");
  const files = scanFiles(srcDir, '.js');
  
  const docs = [];
  
  for (const file of files.slice(0, 10)) { // 限制处理文件数
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const docResult = await docAgent.execute(content, { format: 'markdown' });
      
      const relativePath = path.relative(srcDir, file);
      const docName = relativePath.replace(/\.js$/, '.md').replace(/\\/g, '-');
      
      const docContent = generateMarkdownDoc(file, docResult);
      fs.writeFileSync(path.join(outputDir, docName), docContent);
      
      docs.push(docName);
    } catch (err) {
      console.error(`  文档生成失败：${file} - ${err.message}`);
    }
  }
  
  // 生成索引
  const indexContent = generateDocIndex(docs);
  fs.writeFileSync(path.join(outputDir, "INDEX.md"), indexContent);
  docs.push("INDEX.md");
  
  return {
    summary: `生成 ${docs.length} 个文档文件`,
    files: docs,
    outputDir
  };
}

function scanFiles(dir, extension, files = []) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        scanFiles(fullPath, extension, files);
      } else if (entry.isFile() && entry.name.endsWith(extension)) {
        files.push(fullPath);
      }
    }
  } catch (err) {
    // 忽略错误
  }
  
  return files;
}

function generateMarkdownDoc(filePath, docResult) {
  const fileName = path.basename(filePath);
  
  return `# ${fileName} 文档

> 自动生成时间：${new Date().toISOString()}

## 概述

${docResult.documentation?.description || '自动生成的文档内容'}

## 使用方法

${docResult.documentation?.usage || '```javascript\n// 使用示例\n```'}

## API

${JSON.stringify(docResult.documentation?.api || {}, null, 2)}

## 示例

${docResult.documentation?.examples?.join('\n\n') || '无示例'}

---
*此文档由 XinSor DocAgent 自动生成*
`;
}

function generateDocIndex(docs) {
  return `# XinSor 自动文档索引

> 生成时间：${new Date().toISOString()}

## 文档列表

${docs.filter(d => d !== 'INDEX.md').map(d => `- [${d}](./${d})`).join('\n')}

## 更新历史

- ${new Date().toISOString()}: 初始生成

---
*XinSor Autonomous Documentation System*
`;
}

// ==================== 学习报告任务 ====================

// 生成学习报告
export async function learningReportTask(context) {
  const yoloAgent = agentRegistry.get("YOLOLearningAgent");
  
  const reportDir = path.join(__dirname, "../reports");
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const report = {
    generatedAt: new Date().toISOString(),
    runCount: context.runCount,
    yoloLearning: yoloAgent ? yoloAgent.learningState : null,
    systemStatus: {
      agents: agentRegistry.list().length,
      uptime: context.timestamp
    }
  };
  
  // 生成 Markdown 报告
  const mdReport = generateLearningReportMarkdown(report);
  const reportFile = path.join(reportDir, `learning_report_${context.runCount}.md`);
  fs.writeFileSync(reportFile, mdReport);
  
  // 生成 JSON 报告
  const jsonFile = path.join(reportDir, `learning_report_${context.runCount}.json`);
  fs.writeFileSync(jsonFile, JSON.stringify(report, null, 2));
  
  return {
    summary: `生成学习报告 (会话 ${context.runCount})`,
    reportFile,
    jsonFile
  };
}

function generateLearningReportMarkdown(report) {
  const yolo = report.yoloLearning;
  
  return `# XinSor 学习报告

> 生成时间：${report.generatedAt}

## YOLO 学习进度

${yolo ? `
- **当前主题**: ${yolo.currentTopic?.name || '无'}
- **完成会话**: ${yolo.sessionsCompleted || 0}
- **进度**: ${yolo.progress?.toFixed(1) || 0}%
- **知识库**: ${yolo.knowledgeBase?.length || 0} 个主题
` : 'YOLO 学习数据不可用'}

## 系统状态

- **注册 Agents**: ${report.systemStatus.agents}
- **报告生成**: ${report.runCount}

## 已完成主题

${yolo?.knowledgeBase?.map(k => `
### ${k.name}
- 完成时间：${k.completedAt}
- 知识点：${k.content?.keyPoints?.length || 0} 个
`).join('\n') || '暂无完成主题'}

---
*XinSor Autonomous Learning System*
`;
}

// ==================== 系统健康检查任务 ====================

export async function healthCheckTask(context) {
  const health = {
    timestamp: new Date().toISOString(),
    agents: [],
    files: {},
    memory: process.memoryUsage()
  };
  
  // 检查所有 Agent
  for (const agent of agentRegistry.list()) {
    health.agents.push({
      name: agent.name,
      status: 'ok'
    });
  }
  
  // 检查关键文件
  const keyFiles = [
    '../package.json',
    '../docs/yolo_progress.json',
    '../data/sensor_readings.json'
  ];
  
  for (const file of keyFiles) {
    const fullPath = path.join(__dirname, file);
    health.files[file] = fs.existsSync(fullPath) ? 'exists' : 'missing';
  }
  
  // 保存健康报告
  const healthFile = path.join(__dirname, "../reports/health_check.json");
  fs.writeFileSync(healthFile, JSON.stringify(health, null, 2));
  
  const status = Object.values(health.files).every(s => s === 'exists') ? 'healthy' : 'degraded';
  
  return {
    summary: `系统健康状态：${status}`,
    status,
    agents: health.agents.length,
    memoryMB: Math.round(health.memory.heapUsed / 1024 / 1024)
  };
}
