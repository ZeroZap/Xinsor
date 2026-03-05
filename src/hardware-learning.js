#!/usr/bin/env node
// 硬件学习独立运行脚本

import { AgentRegistry } from "./agents/AgentRegistry.js";
import { AutoLearnScheduler } from "./utils/AutoLearnScheduler.js";
import { LearningProgressTracker } from "./utils/LearningProgressTracker.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 配置
const config = {
  intervalMinutes: 10,
  logging: {
    enabled: true,
    dir: "./logs/learning"
  }
};

// 日志文件
const logFile = path.join(__dirname, "../logs/hardware_learning.log");
const logDir = path.dirname(logFile);

// 确保日志目录存在
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function log(message, level = "INFO") {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] [${level}] ${message}\n`;
  if (config.logging.enabled) {
    fs.appendFileSync(logFile, logLine);
  }
  console.log(message);
}

function printBanner() {
  console.log("");
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║        🔧 硬件学习系统                                     ║");
  console.log("║           Hardware Learning System                        ║");
  console.log("║                                                           ║");
  console.log("║   学习领域 (12):                                           ║");
  console.log("║   🔋 电量计 | 🔬 电流计 | ⚡ 充电 IC | 📊 ADC | 📈 DAC   ║");
  console.log("║   📡 IMU | 🔋 BMS | 📡 通信协议 | 💻 MCU 开发            ║");
  console.log("║   🧠 传感器融合 | 🤖 边缘 AI | 🔌 PCB 设计               ║");
  console.log("║                                                           ║");
  console.log(`║   学习间隔：${config.intervalMinutes} 分钟                                        ║`);
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log("");
}

// 初始化
printBanner();
log("═══════════════════════════════════════════════════════════", "SYSTEM");
log("硬件学习系统启动", "SYSTEM");

const agentRegistry = new AgentRegistry();
const tracker = new LearningProgressTracker();

const hardwareAgent = agentRegistry.get("HardwareLearningAgent");

if (!hardwareAgent) {
  log("HardwareLearningAgent 未找到!", "ERROR");
  process.exit(1);
}

// 初始化代理
hardwareAgent.initialize().then(() => {
  log("硬件学习代理初始化完成", "SUCCESS");
  
  // 创建调度器
  const scheduler = new AutoLearnScheduler(hardwareAgent, config.intervalMinutes);
  
  // 会话完成事件
  scheduler.on("session", async (data) => {
    log(`═══════════════════════════════════════════════════════════`, "SESSION");
    log(`会话 #${data.count} 完成`, "SUCCESS");
    log(`时间：${data.timestamp.toLocaleString('zh-CN')}`, "INFO");
    
    const topic = hardwareAgent.learningState.currentTopic;
    const category = hardwareAgent.learningState.currentCategory;
    
    if (topic) {
      log(`主题：${topic.name}`, "INFO");
      log(`类别：${category}`, "INFO");
      log(`难度：${topic.level}`, "INFO");
      
      // 获取学习结果
      const result = await hardwareAgent.execute({}, {});
      
      if (result.knowledge) {
        log(`知识点：${result.knowledge.keyPoints?.length || 0} 个`, "INFO");
        log(`代码示例：${result.knowledge.codeExamples?.length || 0} 个`, "INFO");
        
        // 记录到进度追踪器
        tracker.recordHardwareSession({
          topicId: topic.id,
          topicName: topic.name,
          category: category,
          level: topic.level,
          duration: config.intervalMinutes,
          keyPoints: result.knowledge.keyPoints || [],
          formulas: result.knowledge.formulas || [],
          codeExamples: result.knowledge.codeExamples || []
        });
      }
    }
    
    // 打印进度报告
    const report = tracker.getProgressReport();
    log(`总进度：${report.overview.totalSessions} 次会话`, "INFO");
    log(`═══════════════════════════════════════════════════════════`, "SESSION");
  });
  
  // 启动调度器
  setTimeout(() => {
    scheduler.start();
    log("调度器已启动，第一次学习将立即开始...", "SUCCESS");
  }, 1000);
  
  // 优雅退出
  process.on("SIGINT", () => {
    log("\n⚠️  收到退出信号，正在保存进度...", "WARN");
    scheduler.stop();
    
    const report = tracker.getProgressReport();
    log("═══════════════════════════════════════════════════════════", "SYSTEM");
    log("📊 最终学习报告", "SYSTEM");
    log(`   总会话数：${report.overview.totalSessions}`, "INFO");
    log(`   硬件会话：${report.hardware.sessionsCompleted}`, "INFO");
    log(`   成就数量：${report.achievements.length}`, "INFO");
    log("═══════════════════════════════════════════════════════════", "SYSTEM");
    
    console.log("");
    console.log(tracker.generateVisualReport());
    console.log("");
    
    process.exit(0);
  });
  
}).catch(err => {
  log(`初始化失败：${err.message}`, "ERROR");
  process.exit(1);
});
