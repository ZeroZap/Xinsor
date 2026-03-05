// 6 小时自主学习模式 - YOLO + 硬件联合学习
import { AgentRegistry } from "./agents/AgentRegistry.js";
import { AutoLearnScheduler } from "./utils/AutoLearnScheduler.js";
import { HardwareLearnScheduler } from "./utils/HardwareLearnScheduler.js";
import { yoloConfig } from "./config/yolo.config.js";
import { hardwareLearningConfig } from "./agents/embedded/HardwareLearningAgent.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 配置
const LEARNING_DURATION_HOURS = 6;
const YOLO_INTERVAL = 5;  // 分钟
const HARDWARE_INTERVAL = 5;  // 分钟

// 日志文件
const logFile = path.join(__dirname, "../logs/autonomous-6h.log");
const yoloProgressFile = path.join(__dirname, "../docs/yolo_progress.json");
const hardwareProgressFile = path.join(__dirname, "../docs/hardware_progress.json");

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
  const now = new Date();
  const endTime = new Date(now.getTime() + LEARNING_DURATION_HOURS * 3600000);
  
  console.log("");
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║        🚀 XinSor 6 小时自主学习模式                         ║");
  console.log("║           Autonomous Learning Mode                       ║");
  console.log("║                                                           ║");
  console.log(`║   开始时间：${now.toLocaleString('zh-CN').padEnd(20)}                   ║`);
  console.log(`║   结束时间：${endTime.toLocaleString('zh-CN').padEnd(20)}                   ║`);
  console.log(`║   学习时长：${LEARNING_DURATION_HOURS} 小时                                     ║");
  console.log("║                                                           ║");
  console.log("║   并行学习代理：                                          ║");
  console.log("║   🧠 YOLO Learning Agent    - 目标检测学习                 ║");
  console.log("║   📚 Hardware Learning Agent - 硬件技术学习                ║");
  console.log("║                                                           ║");
  console.log("║   学习间隔：5 分钟  |  自动保存  |  日志记录               ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log("");
}

function printLearningPlan() {
  const yoloTopics = yoloConfig.topics.length;
  const hardwareTopics = hardwareLearningConfig.topics.length;
  const totalTopics = yoloTopics + hardwareTopics;
  
  const sessionsPerHour = 60 / YOLO_INTERVAL * 2;  // 两个代理
  const totalSessions = sessionsPerHour * LEARNING_DURATION_HOURS;
  
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║                    📋 6 小时学习计划                       ║");
  console.log("╠═══════════════════════════════════════════════════════════╣");
  console.log(`║ 可用主题库：${totalTopics} 个`.padEnd(62) + "║");
  console.log(`║   - YOLO: ${yoloTopics} 个主题`.padEnd(62) + "║");
  console.log(`║   - 硬件：${hardwareTopics} 个主题`.padEnd(62) + "║");
  console.log("╠═══════════════════════════════════════════════════════════╣");
  console.log(`║ 预计会话数：${totalSessions} 次 (每 5 分钟×2 代理×${LEARNING_DURATION_HOURS}小时)`.padEnd(62) + "║");
  console.log("╠═══════════════════════════════════════════════════════════╣");
  console.log("║ 学习模式：".padEnd(62) + "║");
  console.log("║   • YOLO: 循环复习 + 深度学习                            ║");
  console.log("║   • 硬件：顺序学习 + 分类轮询                             ║");
  console.log("║   • 双代理并行运行                                        ║");
  console.log("╠═══════════════════════════════════════════════════════════╣");
  console.log("║ 时间线：".padEnd(62) + "║");
  
  for (let i = 1; i <= LEARNING_DURATION_HOURS; i++) {
    const hourTime = new Date(Date.now() + i * 3600000);
    console.log(`║   ${i.toString().padStart(2)} 小时后：${hourTime.toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit'})}`.padEnd(62) + "║");
  }
  
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log("");
}

// 初始化
printBanner();
printLearningPlan();

log("═══════════════════════════════════════════════════════════", "SYSTEM");
log("6 小时自主学习系统启动", "SYSTEM");
log(`学习时长：${LEARNING_DURATION_HOURS} 小时`, "CONFIG");
log(`YOLO 间隔：${YOLO_INTERVAL} 分钟`, "CONFIG");
log(`硬件间隔：${HARDWARE_INTERVAL} 分钟`, "CONFIG");
log(`日志文件：${logFile}`, "CONFIG");

const agentRegistry = new AgentRegistry();
const yoloAgent = agentRegistry.get("YOLOLearningAgent");
const hardwareAgent = agentRegistry.get("HardwareLearningAgent");

if (!yoloAgent || !hardwareAgent) {
  log("学习代理未找到!", "ERROR");
  process.exit(1);
}

// 加载进度
function loadProgress() {
  if (fs.existsSync(yoloProgressFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(yoloProgressFile, "utf-8"));
      log(`YOLO 进度：已完成 ${data.sessionsCompleted || 0} 个会话`, "INFO");
    } catch (e) {
      log("无法加载 YOLO 进度", "WARN");
    }
  }
  
  if (fs.existsSync(hardwareProgressFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(hardwareProgressFile, "utf-8"));
      log(`硬件进度：已完成 ${data.sessionsCompleted || 0} 个会话`, "INFO");
    } catch (e) {
      log("无法加载硬件进度", "WARN");
    }
  }
}

loadProgress();

// 创建调度器
const yoloScheduler = new AutoLearnScheduler(yoloAgent, YOLO_INTERVAL);
const hardwareScheduler = new HardwareLearnScheduler(hardwareAgent, HARDWARE_INTERVAL);

let yoloSessions = 0;
let hardwareSessions = 0;
const startTime = Date.now();

// YOLO 会话完成事件
yoloScheduler.on("session", (data) => {
  yoloSessions++;
  const topic = yoloAgent.learningState.currentTopic;
  
  log(`═══════════════════════════════════════════════════════════`, "YOLO");
  log(`🧠 YOLO 会话 #${yoloSessions} 完成`, "SUCCESS");
  log(`主题：${topic?.name || 'N/A'}`, "INFO");
  log(`进度：${yoloAgent.learningState.progress.toFixed(1)}%`, "INFO");
  
  // 保存 YOLO 进度
  if (yoloConfig.saveProgress) {
    const progress = {
      agent: "YOLOLearningAgent",
      startedAt: yoloScheduler.startTime.toISOString(),
      intervalMinutes: YOLO_INTERVAL,
      sessionsCompleted: yoloSessions,
      currentTopic: yoloAgent.learningState.currentTopic,
      knowledgeBase: yoloAgent.learningState.knowledgeBase,
      progress: yoloAgent.learningState.progress,
      lastSaved: new Date().toISOString(),
      mode: "6h_autonomous"
    };
    fs.writeFileSync(yoloProgressFile, JSON.stringify(progress, null, 2));
  }
  log(`═══════════════════════════════════════════════════════════`, "YOLO");
});

// 硬件会话完成事件
hardwareScheduler.on("session", (data) => {
  hardwareSessions++;
  const result = data.result;
  
  log(`═══════════════════════════════════════════════════════════`, "HARDWARE");
  log(`📚 硬件会话 #${hardwareSessions} 完成`, "SUCCESS");
  log(`主题：${result?.topic || 'N/A'}`, "INFO");
  log(`类别：${result?.category || 'N/A'}`, "INFO");
  log(`进度：${result?.progress?.toFixed(1) || 0}%`, "INFO");
  
  // 保存硬件进度
  hardwareAgent.saveProgress();
  log(`═══════════════════════════════════════════════════════════`, "HARDWARE");
});

// 错误处理
yoloScheduler.on("error", (data) => {
  log(`YOLO 会话 #${data.session} 失败：${data.error.message}`, "ERROR");
});

hardwareScheduler.on("error", (data) => {
  log(`硬件会话 #${data.session} 失败：${data.error.message}`, "ERROR");
});

// 定时状态报告
function printHourlyReport() {
  const elapsed = Date.now() - startTime;
  const hours = Math.floor(elapsed / 3600000);
  const minutes = Math.floor((elapsed % 3600000) / 60000);
  const remaining = LEARNING_DURATION_HOURS * 3600000 - elapsed;
  
  if (remaining <= 0) {
    return false;
  }
  
  const remainingHours = Math.floor(remaining / 3600000);
  const remainingMinutes = Math.floor((remaining % 3600000) / 60000);
  
  console.log("\n╔═══════════════════════════════════════════════════════════╗");
  console.log("║              ⏰ 学习进度报告                               ║");
  console.log("╠═══════════════════════════════════════════════════════════╣");
  console.log(`║ 已运行：${hours}小时${minutes}分钟`.padEnd(62) + "║");
  console.log(`║ 剩余：${remainingHours}小时${remainingMinutes}分钟`.padEnd(62) + "║");
  console.log("╠═══════════════════════════════════════════════════════════╣");
  console.log(`║ YOLO 会话：${yoloSessions} 次`.padEnd(62) + "║");
  console.log(`║ 硬件会话：${hardwareSessions} 次`.padEnd(62) + "║");
  console.log(`║ 总会话：${yoloSessions + hardwareSessions} 次`.padEnd(62) + "║");
  console.log("╠═══════════════════════════════════════════════════════════╣");
  console.log(`║ YOLO 进度：${yoloAgent.learningState.progress.toFixed(1)}%`.padEnd(62) + "║");
  console.log(`║ 硬件进度：${hardwareAgent.learningState.progress.toFixed(1)}%`.padEnd(62) + "║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log("");
  
  return true;
}

// 每小时报告
const reportInterval = setInterval(() => {
  if (!printHourlyReport()) {
    clearInterval(reportInterval);
  }
}, 3600000);

// 优雅退出
function shutdown() {
  log("\n⚠️  正在停止学习...", "WARN");
  
  yoloScheduler.stop();
  hardwareScheduler.stop();
  clearInterval(reportInterval);
  
  // 保存最终进度
  const yoloProgress = {
    agent: "YOLOLearningAgent",
    startedAt: yoloScheduler.startTime?.toISOString(),
    intervalMinutes: YOLO_INTERVAL,
    sessionsCompleted: yoloSessions,
    currentTopic: yoloAgent.learningState.currentTopic,
    knowledgeBase: yoloAgent.learningState.knowledgeBase,
    progress: yoloAgent.learningState.progress,
    lastSaved: new Date().toISOString(),
    mode: "6h_autonomous_final"
  };
  fs.writeFileSync(yoloProgressFile, JSON.stringify(yoloProgress, null, 2));
  
  hardwareAgent.saveProgress();
  
  // 打印最终报告
  const elapsed = Date.now() - startTime;
  const hours = Math.floor(elapsed / 3600000);
  const minutes = Math.floor((elapsed % 3600000) / 60000);
  
  console.log("\n╔═══════════════════════════════════════════════════════════╗");
  console.log("║              📊 6 小时学习最终报告                          ║");
  console.log("╠═══════════════════════════════════════════════════════════╣");
  console.log(`║ 实际运行：${hours}小时${minutes}分钟`.padEnd(62) + "║");
  console.log("╠═══════════════════════════════════════════════════════════╣");
  console.log(`║ YOLO 会话：${yoloSessions} 次`.padEnd(62) + "║");
  console.log(`║ 硬件会话：${hardwareSessions} 次`.padEnd(62) + "║");
  console.log(`║ 总会话：${yoloSessions + hardwareSessions} 次`.padEnd(62) + "║");
  console.log("╠═══════════════════════════════════════════════════════════╣");
  console.log(`║ YOLO 最终进度：${yoloAgent.learningState.progress.toFixed(1)}%`.padEnd(62) + "║");
  console.log(`║ 硬件最终进度：${hardwareAgent.learningState.progress.toFixed(1)}%`.padEnd(62) + "║");
  console.log("╠═══════════════════════════════════════════════════════════╣");
  console.log("║ 进度已保存：".padEnd(62) + "║");
  console.log(`║   - ${yoloProgressFile}`.padEnd(62) + "║");
  console.log(`║   - ${hardwareProgressFile}`.padEnd(62) + "║");
  console.log(`║   - ${logFile}`.padEnd(62) + "║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  
  log("═══════════════════════════════════════════════════════════", "SYSTEM");
  log("6 小时自主学习完成", "SYSTEM");
  log(`总会话数：${yoloSessions + hardwareSessions}`, "SYSTEM");
  log("═══════════════════════════════════════════════════════════", "SYSTEM");
}

// 设置 6 小时定时器
const shutdownTimer = setTimeout(() => {
  shutdown();
  process.exit(0);
}, LEARNING_DURATION_HOURS * 3600000);

// 处理退出信号
process.on("SIGINT", () => {
  console.log("\n⚠️  收到退出信号 (Ctrl+C)");
  clearTimeout(shutdownTimer);
  clearInterval(reportInterval);
  shutdown();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n⚠️  收到终止信号");
  clearTimeout(shutdownTimer);
  clearInterval(reportInterval);
  shutdown();
  process.exit(0);
});

// 延迟启动
setTimeout(() => {
  yoloScheduler.start();
  hardwareScheduler.start();
  log("双代理调度器已启动，6 小时自主学习开始...", "SUCCESS");
  
  // 立即打印初始报告
  printHourlyReport();
}, 1000);
