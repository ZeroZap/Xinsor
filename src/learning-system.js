#!/usr/bin/env node
// XinSor 综合学习系统 - 主程序
// 整合 YOLO 学习、硬件学习、项目学习、进度追踪

import { AgentRegistry } from "./agents/AgentRegistry.js";
import { AutoLearnScheduler } from "./utils/AutoLearnScheduler.js";
import { LearningProgressTracker } from "./utils/LearningProgressTracker.js";
import { yoloConfig } from "./config/yolo.config.js";
import { hardwareLearningConfig } from "./agents/embedded/HardwareLearningAgent.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 配置
const config = {
  yolo: {
    enabled: true,
    intervalMinutes: 5
  },
  hardware: {
    enabled: true,
    intervalMinutes: 10,
    categories: ["fuel_gauge", "current_sensor", "charger_ic", "adc", "dac", "imu", "bms", "comm_protocols", "mcu_dev", "sensor_fusion", "edge_ai", "pcb_design"]
  },
  project: {
    enabled: true
  },
  logging: {
    enabled: true,
    dir: "./logs/learning"
  }
};

// 日志文件
const logFile = path.join(__dirname, "../logs/learning_system.log");
const logDir = path.dirname(logFile);

// 确保日志目录存在
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 日志函数
function log(message, level = "INFO") {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] [${level}] ${message}\n`;
  if (config.logging.enabled) {
    fs.appendFileSync(logFile, logLine);
  }
  console.log(message);
}

// 打印横幅
function printBanner() {
  console.log("");
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║        🎓 XinSor 综合学习系统                              ║");
  console.log("║           XinSor Integrated Learning System               ║");
  console.log("║                                                           ║");
  console.log("║   学习模块：YOLO | 硬件 | 项目 | 进度追踪                  ║");
  console.log("║   领域数量：13 个                                         ║");
  console.log("║   文档数量：13 个                                         ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log("");
}

// 打印配置
function printConfig() {
  console.log("┌───────────────────────────────────────────────────────────┐");
  console.log("│  系统配置                                                 │");
  console.log("├───────────────────────────────────────────────────────────┤");
  console.log(`│  🧠 YOLO 学习：     ${config.yolo.enabled ? '✅ 启用' : '❌ 禁用'} (${config.yolo.intervalMinutes}分钟)` .padEnd(60) + "│");
  console.log(`│  🔧 硬件学习：   ${config.hardware.enabled ? '✅ 启用' : '❌ 禁用'} (${config.hardware.intervalMinutes}分钟)` .padEnd(60) + "│");
  console.log(`│  🛠️  项目学习：   ${config.project.enabled ? '✅ 启用' : '❌ 禁用'}` .padEnd(60) + "│");
  console.log(`│  📊 进度追踪：   ✅ 启用` .padEnd(60) + "│");
  console.log("├───────────────────────────────────────────────────────────┤");
  console.log("│  硬件学习领域 (12):                                       │");
  console.log("│    🔋 电量计 | 🔬 电流计 | ⚡ 充电 IC | 📊 ADC | 📈 DAC   │");
  console.log("│    📡 IMU | 🔋 BMS | 📡 通信协议 | 💻 MCU 开发            │");
  console.log("│    🧠 传感器融合 | 🤖 边缘 AI | 🔌 PCB 设计               │");
  console.log("└───────────────────────────────────────────────────────────┘");
  console.log("");
}

// 初始化
printBanner();
log("═══════════════════════════════════════════════════════════", "SYSTEM");
log("XinSor 综合学习系统启动", "SYSTEM");
log(`日志文件：${logFile}`, "CONFIG");
printConfig();

// 创建 Agent 注册表
const agentRegistry = new AgentRegistry();

// 创建进度追踪器
const tracker = new LearningProgressTracker();

// 获取初始报告
const initialReport = tracker.getProgressReport();
log(`加载历史进度：${initialReport.overview.totalSessions} 次学习会话`, "INFO");
log(`连续学习：${initialReport.overview.streakDays} 天`, "INFO");

// YOLO 学习调度器
let yoloScheduler = null;
if (config.yolo.enabled) {
  const yoloAgent = agentRegistry.get("YOLOLearningAgent");
  if (yoloAgent) {
    yoloScheduler = new AutoLearnScheduler(yoloAgent, config.yolo.intervalMinutes);
    
    yoloScheduler.on("session", (data) => {
      log(`🧠 [YOLO] 会话 #${data.count} 完成`, "SUCCESS");
      log(`   主题：${yoloAgent.learningState.currentTopic?.name || 'N/A'}`, "INFO");
      
      // 记录到进度追踪器
      tracker.recordYoloSession({
        topic: yoloAgent.learningState.currentTopic?.name,
        level: yoloAgent.learningState.currentTopic?.level,
        cycle: yoloAgent.learningState.currentCycle,
        duration: config.yolo.intervalMinutes,
        content: {}
      });
    });
    
    log("🧠 YOLO 学习调度器已启动", "SUCCESS");
  } else {
    log("YOLOLearningAgent 未找到!", "ERROR");
  }
}

// 硬件学习调度器
let hardwareScheduler = null;
if (config.hardware.enabled) {
  const hardwareAgent = agentRegistry.get("HardwareLearningAgent");
  if (hardwareAgent) {
    // 初始化硬件学习代理
    hardwareAgent.initialize().then(() => {
      log("🔧 硬件学习代理初始化完成", "SUCCESS");
    });
    
    hardwareScheduler = new AutoLearnScheduler(hardwareAgent, config.hardware.intervalMinutes);
    
    hardwareScheduler.on("session", async (data) => {
      log(`🔧 [硬件] 会话 #${data.count} 完成`, "SUCCESS");
      
      const topic = hardwareAgent.learningState.currentTopic;
      const category = hardwareAgent.learningState.currentCategory;
      
      if (topic) {
        log(`   主题：${topic.name}`, "INFO");
        log(`   类别：${category}`, "INFO");
        
        // 获取学习结果
        const result = await hardwareAgent.execute({}, {});
        
        // 记录到进度追踪器
        if (result.knowledge) {
          tracker.recordHardwareSession({
            topicId: topic.id,
            topicName: topic.name,
            category: category,
            level: topic.level,
            duration: config.hardware.intervalMinutes,
            keyPoints: result.knowledge.keyPoints || [],
            formulas: result.knowledge.formulas || [],
            codeExamples: result.knowledge.codeExamples || []
          });
        }
      }
    });
    
    log("🔧 硬件学习调度器已启动", "SUCCESS");
  } else {
    log("HardwareLearningAgent 未找到!", "ERROR");
  }
}

// 定期生成报告 (每小时)
setInterval(() => {
  const report = tracker.getProgressReport();
  log("═══════════════════════════════════════════════════════════", "REPORT");
  log("📊 学习进度报告", "INFO");
  log(`   总会话数：${report.overview.totalSessions}`, "INFO");
  log(`   总学习时长：${report.overview.totalLearningTime}`, "INFO");
  log(`   连续学习：${report.overview.streakDays} 天`, "INFO");
  log(`   YOLO 会话：${report.yolo.sessionsCompleted}`, "INFO");
  log(`   硬件会话：${report.hardware.sessionsCompleted}`, "INFO");
  log("═══════════════════════════════════════════════════════════", "REPORT");
}, 3600000); // 每小时

// 启动调度器
setTimeout(() => {
  if (yoloScheduler) {
    yoloScheduler.start();
    log("🚀 YOLO 调度器已启动，第一次学习将立即开始...", "SUCCESS");
  }
  
  if (hardwareScheduler) {
    setTimeout(() => {
      hardwareScheduler.start();
      log("🚀 硬件学习调度器已启动，第一次学习将在 10 秒后开始...", "SUCCESS");
    }, 10000); // 延迟 10 秒，避免同时学习
  }
  
  log("═══════════════════════════════════════════════════════════", "SYSTEM");
  log("✅ 所有学习模块已启动", "SUCCESS");
  log("ℹ️  按 Ctrl+C 停止学习并保存进度", "INFO");
  log("═══════════════════════════════════════════════════════════", "SYSTEM");
}, 1000);

// 优雅退出
process.on("SIGINT", () => {
  log("\n⚠️  收到退出信号，正在保存进度...", "WARN");
  
  if (yoloScheduler) {
    yoloScheduler.stop();
  }
  
  if (hardwareScheduler) {
    hardwareScheduler.stop();
  }
  
  // 生成最终报告
  const finalReport = tracker.getProgressReport();
  log("═══════════════════════════════════════════════════════════", "SYSTEM");
  log("📊 最终学习报告", "SYSTEM");
  log(`   总会话数：${finalReport.overview.totalSessions}`, "INFO");
  log(`   总学习时长：${finalReport.overview.totalLearningTime} 分钟`, "INFO");
  log(`   连续学习：${finalReport.overview.streakDays} 天`, "INFO");
  log(`   成就数量：${finalReport.achievements.length}`, "INFO");
  log("═══════════════════════════════════════════════════════════", "SYSTEM");
  
  // 打印可视化报告
  console.log("");
  console.log(tracker.generateVisualReport());
  console.log("");
  
  log("XinSor 综合学习系统退出", "SYSTEM");
  process.exit(0);
});

// 错误处理
process.on("unhandledRejection", (error) => {
  log(`未处理的错误：${error.message}`, "ERROR");
  console.error(error);
});
