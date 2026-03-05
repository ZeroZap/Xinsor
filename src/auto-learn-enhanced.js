// YOLO 定时学习 - 增强版 (支持后台运行和日志)
import { AgentRegistry } from "./agents/AgentRegistry.js";
import { AutoLearnScheduler } from "./utils/AutoLearnScheduler.js";
import { yoloConfig } from "./config/yolo.config.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 日志文件
const logFile = path.join(__dirname, "../logs/yolo_learning.log");
const progressFile = path.join(__dirname, "../docs/yolo_progress.json");

// 确保日志目录存在
const logDir = path.dirname(logFile);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function log(message, level = "INFO") {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] [${level}] ${message}\n`;
  fs.appendFileSync(logFile, logLine);
  console.log(message);
}

function printBanner() {
  console.log("");
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║        🧠 YOLO 自主学习模式 - 定时学习                     ║");
  console.log("║           XinSor - Sensor Integration                    ║");
  console.log("║                                                           ║");
  console.log("║   学习间隔：5 分钟  |  自动保存  |  日志记录               ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log("");
}

// 初始化
printBanner();
log("═══════════════════════════════════════════════════════════", "SYSTEM");
log("YOLO 自主学习系统启动", "SYSTEM");
log(`学习间隔：${yoloConfig.intervalMinutes} 分钟`, "CONFIG");
log(`日志文件：${logFile}`, "CONFIG");

const agentRegistry = new AgentRegistry();
const yoloAgent = agentRegistry.get("YOLOLearningAgent");

if (!yoloAgent) {
  log("YOLOLearningAgent 未找到!", "ERROR");
  process.exit(1);
}

// 加载之前的进度
let previousProgress = null;
if (fs.existsSync(progressFile)) {
  try {
    previousProgress = JSON.parse(fs.readFileSync(progressFile, "utf-8"));
    log(`加载进度：已完成 ${previousProgress.sessionsCompleted || 0} 个会话`, "INFO");
  } catch (e) {
    log("无法加载之前的进度，从头开始", "WARN");
  }
}

// 创建调度器
const scheduler = new AutoLearnScheduler(yoloAgent, yoloConfig.intervalMinutes);

// 会话完成事件
scheduler.on("session", (data) => {
  log(`═══════════════════════════════════════════════════════════`, "SESSION");
  log(`会话 #${data.count} 完成`, "SUCCESS");
  log(`时间：${data.timestamp.toLocaleString('zh-CN')}`, "INFO");
  log(`主题：${yoloAgent.learningState.currentTopic?.name || 'N/A'}`, "INFO");
  log(`进度：${yoloAgent.learningState.progress.toFixed(1)}%`, "INFO");
  
  // 保存进度
  if (yoloConfig.saveProgress) {
    const progress = {
      agent: "YOLOLearningAgent",
      startedAt: scheduler.startTime.toISOString(),
      intervalMinutes: yoloConfig.intervalMinutes,
      sessionsCompleted: data.count,
      currentTopic: yoloAgent.learningState.currentTopic,
      knowledgeBase: yoloAgent.learningState.knowledgeBase,
      progress: yoloAgent.learningState.progress,
      lastSaved: new Date().toISOString()
    };
    
    fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
    log(`进度已保存：${progressFile}`, "SUCCESS");
  }
  log(`═══════════════════════════════════════════════════════════`, "SESSION");
});

// 报告事件
scheduler.on("report", (report) => {
  log(`═══════════════════════════════════════════════════════════`, "REPORT");
  log(`自动学习报告`, "INFO");
  log(`状态：${report.status === 'running' ? '🟢 运行中' : '🔴 已停止'}`, "INFO");
  log(`运行时长：${report.uptime}`, "INFO");
  log(`会话数：${report.sessions}`, "INFO");
  log(`下次学习：${report.nextSession.toLocaleString('zh-CN')}`, "INFO");
  log(`═══════════════════════════════════════════════════════════`, "REPORT");
});

// 停止事件
scheduler.on("stop", (data) => {
  log(`学习已停止。总会话数：${data.sessions}`, "SYSTEM");
});

// 错误处理
scheduler.on("error", (data) => {
  log(`会话 #${data.session} 失败：${data.error.message}`, "ERROR");
});

// 优雅退出
process.on("SIGINT", () => {
  log("\n⚠️  收到退出信号，正在保存进度...", "WARN");
  scheduler.stop();
  
  if (yoloConfig.saveProgress) {
    const progress = {
      agent: "YOLOLearningAgent",
      startedAt: scheduler.startTime?.toISOString(),
      intervalMinutes: yoloConfig.intervalMinutes,
      sessionsCompleted: scheduler.sessionCount,
      currentTopic: yoloAgent.learningState.currentTopic,
      knowledgeBase: yoloAgent.learningState.knowledgeBase,
      progress: yoloAgent.learningState.progress,
      lastSaved: new Date().toISOString()
    };
    fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
    log(`最终进度已保存`, "SUCCESS");
  }
  
  log("═══════════════════════════════════════════════════════════", "SYSTEM");
  log("YOLO 自主学习系统退出", "SYSTEM");
  log(`总会话数：${scheduler.sessionCount}`, "SYSTEM");
  log(`运行时长：${scheduler.isRunning ? Math.round((new Date() - scheduler.startTime) / 60000) + '分钟' : 'N/A'}`, "SYSTEM");
  log("═══════════════════════════════════════════════════════════", "SYSTEM");
  process.exit(0);
});

// 延迟启动
setTimeout(() => {
  scheduler.start();
  log("调度器已启动，第一次学习将立即开始...", "SUCCESS");
}, 1000);
