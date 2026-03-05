// 硬件自主学习 - 支持电量计、充电 IC、IMU 学习到天亮
import { AgentRegistry } from "./agents/AgentRegistry.js";
import { HardwareLearnScheduler } from "./utils/HardwareLearnScheduler.js";
import { hardwareLearningConfig } from "./agents/embedded/HardwareLearningAgent.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 日志文件
const logFile = path.join(__dirname, "../logs/hardware_learning.log");
const progressFile = path.join(__dirname, "../docs/hardware_progress.json");

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
  console.log("║        📚 硬件自主学习模式 - 学习到天亮                     ║");
  console.log("║           XinSor - Hardware Learning                     ║");
  console.log("║                                                           ║");
  console.log("║   学习主题：                                              ║");
  console.log("║   🔋 电量计 (Fuel Gauge)    - 7 个主题                     ║");
  console.log("║   🔬 电流计 (Current Sensor)- 5 个主题                     ║");
  console.log("║   ⚡ 充电 IC (Charger IC)   - 6 个主题                     ║");
  console.log("║   📊 ADC (模数转换器)      - 7 个主题                     ║");
  console.log("║   📈 DAC (数模转换器)      - 7 个主题                     ║");
  console.log("║   📡 IMU (惯性测量单元)     - 8 个主题                     ║");
  console.log("║                                                           ║");
  console.log("║   学习间隔：5 分钟  |  自动保存  |  日志记录               ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log("");
}

function printLearningPlan() {
  const totalTopics = hardwareLearningConfig.topics.length;
  const interval = hardwareLearningConfig.intervalMinutes;
  const totalMinutes = totalTopics * interval;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║                    📋 学习计划                            ║");
  console.log("╠═══════════════════════════════════════════════════════════╣");
  console.log(`║ 总主题数：${totalTopics}`.padEnd(62) + "║");
  console.log(`║ 学习间隔：${interval} 分钟`.padEnd(62) + "║");
  console.log(`║ 预计时长：${hours}小时${mins}分钟 (完整周期)`.padEnd(62) + "║");
  console.log("╠═══════════════════════════════════════════════════════════╣");
  console.log("║ 主题分布：".padEnd(62) + "║");
  console.log("║   🔋 电量计：7 主题 (35 分钟)".padEnd(62) + "║");
  console.log("║   🔬 电流计：5 主题 (25 分钟)".padEnd(62) + "║");
  console.log("║   ⚡ 充电 IC: 6 主题 (30 分钟)".padEnd(62) + "║");
  console.log("║   📊 ADC: 7 主题 (35 分钟)".padEnd(62) + "║");
  console.log("║   📈 DAC: 7 主题 (35 分钟)".padEnd(62) + "║");
  console.log("║   📡 IMU: 8 主题 (40 分钟)".padEnd(62) + "║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log("");
}

// 初始化
printBanner();
printLearningPlan();

log("═══════════════════════════════════════════════════════════", "SYSTEM");
log("硬件自主学习系统启动", "SYSTEM");
log(`学习间隔：${hardwareLearningConfig.intervalMinutes} 分钟`, "CONFIG");
log(`日志文件：${logFile}`, "CONFIG");
log(`进度文件：${progressFile}`, "CONFIG");

// 注册硬件学习代理
const agentRegistry = new AgentRegistry();
const hardwareAgent = agentRegistry.get("HardwareLearningAgent");

if (!hardwareAgent) {
  log("HardwareLearningAgent 未找到，尝试注册...", "WARN");
  // 动态导入并注册
  import("./agents/embedded/HardwareLearningAgent.js").then(({ HardwareLearningAgent }) => {
    const agent = new HardwareLearningAgent();
    agentRegistry.register(agent);
    startScheduler(agent);
  });
} else {
  startScheduler(hardwareAgent);
}

function startScheduler(agent) {
  // 创建调度器
  const scheduler = new HardwareLearnScheduler(agent, hardwareLearningConfig.intervalMinutes);

  // 会话完成事件
  scheduler.on("session", (data) => {
    log(`═══════════════════════════════════════════════════════════`, "SESSION");
    log(`会话 #${data.count} 完成`, "SUCCESS");
    log(`时间：${data.timestamp.toLocaleString('zh-CN')}`, "INFO");
    log(`主题：${data.result.topic}`, "INFO");
    log(`类别：${data.result.category}`, "INFO");
    log(`难度：${data.result.level}`, "INFO");
    log(`进度：${data.result.progress.toFixed(1)}%`, "INFO");
    
    if (data.result.subtopics && data.result.subtopics.length > 0) {
      log(`知识点：${data.result.subtopics.join(", ")}`, "INFO");
    }
    
    log(`═══════════════════════════════════════════════════════════`, "SESSION");
  });

  // 停止事件
  scheduler.on("stop", (data) => {
    log(`学习已停止。总会话数：${data.sessions}`, "SYSTEM");
    log(`运行时长：${data.uptime}`, "SYSTEM");
  });

  // 错误处理
  scheduler.on("error", (data) => {
    log(`会话 #${data.session} 失败：${data.error.message}`, "ERROR");
  });

  // 完成事件
  scheduler.on("completed", (data) => {
    log(`🎉 所有学习主题已完成！`, "SUCCESS");
    log(`总会话数：${data.sessions}`, "INFO");
    log(`进入复习模式...`, "INFO");
  });

  // 优雅退出
  process.on("SIGINT", () => {
    log("\n⚠️  收到退出信号，正在保存进度...", "WARN");
    scheduler.stop();
    agent.saveProgress();
    
    // 打印最终报告
    printFinalReport(scheduler, agent);
    
    log("═══════════════════════════════════════════════════════════", "SYSTEM");
    log("硬件自主学习系统退出", "SYSTEM");
    log(`总会话数：${scheduler.sessionCount}`, "SYSTEM");
    log(`运行时长：${scheduler.getUptime()}`, "SYSTEM");
    log("═══════════════════════════════════════════════════════════", "SYSTEM");
    process.exit(0);
  });

  // 延迟启动
  setTimeout(() => {
    scheduler.start();
    log("调度器已启动，第一次学习将立即开始...", "SUCCESS");
  }, 1000);
}

function printFinalReport(scheduler, agent) {
  const now = new Date();
  const sunrise = new Date();
  sunrise.setHours(6, 0, 0, 0); // 假设早上 6 点天亮
  
  if (now > sunrise) {
    sunrise.setDate(sunrise.getDate() + 1); // 明天的日出
  }
  
  const msToSunrise = sunrise.getTime() - now.getTime();
  const hoursToSunrise = Math.floor(msToSunrise / 3600000);
  const minsToSunrise = Math.floor((msToSunrise % 3600000) / 60000);
  
  console.log("\n╔═══════════════════════════════════════════════════════════╗");
  console.log("║                    📊 学习报告                            ║");
  console.log("╠═══════════════════════════════════════════════════════════╣");
  console.log(`║ 当前时间：${now.toLocaleString('zh-CN')}`.padEnd(62) + "║");
  console.log(`║ 距离天亮：约${hoursToSunrise}小时${minsToSunrise}分钟`.padEnd(62) + "║");
  console.log("╠═══════════════════════════════════════════════════════════╣");
  console.log(agent.getProgressReport().split("\n").slice(1, -1).join("\n║ ") + "║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
}
