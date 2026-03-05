// XinSor 自主工作模式主程序
// 启动所有自主任务：YOLO 学习、传感器数据处理、代码生成、文档生成等

import { AutonomousTaskScheduler } from "./utils/AutonomousTaskScheduler.js";
import { 
  sensorDataCollectionTask,
  sensorDataAnalysisTask,
  halCodeGenerationTask,
  apiDocumentationTask,
  learningReportTask,
  healthCheckTask
} from "./tasks/autonomous_tasks.js";
import { AgentRegistry } from "./agents/AgentRegistry.js";
import { AutoLearnScheduler } from "./utils/AutoLearnScheduler.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 日志配置
const logFile = path.join(__dirname, "../logs/autonomous_work.log");
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

// 打印横幅
function printBanner() {
  console.log("");
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║        🤖 XinSor 自主工作模式 - SOLO到天亮                ║");
  console.log("║           Autonomous Working Mode                         ║");
  console.log("║                                                           ║");
  console.log("║   任务列表：                                              ║");
  console.log("║   • YOLO 学习 (每 5 分钟)                                    ║");
  console.log("║   • 传感器数据采集 (每 3 分钟)                               ║");
  console.log("║   • 传感器数据分析 (每 10 分钟)                              ║");
  console.log("║   • HAL 代码生成 (每 15 分钟)                                ║");
  console.log("║   • API 文档生成 (每 20 分钟)                                ║");
  console.log("║   • 学习报告生成 (每 30 分钟)                                ║");
  console.log("║   • 系统健康检查 (每 5 分钟)                                 ║");
  console.log("║                                                           ║");
  console.log("║   按 Ctrl+C 停止                                          ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log("");
}

// 主函数
async function main() {
  printBanner();
  log("═══════════════════════════════════════════════════════════", "SYSTEM");
  log("XinSor 自主工作系统启动", "SYSTEM");
  log(`日志文件：${logFile}`, "CONFIG");

  // 初始化 Agent 注册表
  const agentRegistry = new AgentRegistry();
  log(`已加载 ${agentRegistry.agents.size} 个 Agents`, "INFO");

  // 创建自主任务调度器
  const scheduler = new AutonomousTaskScheduler({
    logEnabled: true,
    saveState: true,
    stateFile: path.join(__dirname, "../docs/autonomous_state.json")
  });

  // 注册任务
  scheduler
    .registerTask("yolo_learning", async (ctx) => {
      const yoloAgent = agentRegistry.get("YOLOLearningAgent");
      if (!yoloAgent) return { summary: "YOLO Agent 不可用" };
      
      const result = await yoloAgent.execute("learn");
      yoloAgent.completeSession(result.session?.content);
      
      return {
        summary: `学习：${result.session?.topic || 'N/A'}`,
        progress: result.progress
      };
    }, 5, { priority: 1 })
    
    .registerTask("sensor_collection", sensorDataCollectionTask, 3, { priority: 2 })
    .registerTask("sensor_analysis", sensorDataAnalysisTask, 10, { priority: 3 })
    .registerTask("hal_generation", halCodeGenerationTask, 15, { priority: 4 })
    .registerTask("api_documentation", apiDocumentationTask, 20, { priority: 5 })
    .registerTask("learning_report", learningReportTask, 30, { priority: 6 })
    .registerTask("health_check", healthCheckTask, 5, { priority: 7 });

  // 事件处理
  scheduler.on('start', (data) => {
    log(`调度器启动：${data.taskCount} 个任务`, "SUCCESS");
  });

  scheduler.on('taskComplete', (data) => {
    log(`✅ ${data.name}: ${data.result?.summary || '完成'}`, "TASK");
  });

  scheduler.on('taskError', (data) => {
    log(`❌ ${data.name}: ${data.error?.message}`, "ERROR");
  });

  scheduler.on('stop', (data) => {
    log(`调度器停止：完成 ${data.completed} 个任务，运行 ${data.duration} 分钟`, "SYSTEM");
  });

  // 优雅退出处理
  process.on("SIGINT", () => {
    log("\n⚠️  收到退出信号，正在保存状态...", "WARN");
    
    // 保存最终状态
    const status = scheduler.getStatus();
    const stateFile = path.join(__dirname, "../docs/autonomous_state.json");
    fs.writeFileSync(stateFile, JSON.stringify({
      savedAt: new Date().toISOString(),
      status
    }, null, 2));
    
    scheduler.stop();
    log("═══════════════════════════════════════════════════════════", "SYSTEM");
    log("XinSor 自主工作系统退出", "SYSTEM");
    log(`状态已保存：${stateFile}`, "INFO");
    log("═══════════════════════════════════════════════════════════", "SYSTEM");
    process.exit(0);
  });

  // 错误处理
  process.on("unhandledRejection", (err) => {
    log(`未处理的 Promise 拒绝：${err.message}`, "ERROR");
  });

  // 启动调度器
  setTimeout(() => {
    scheduler.start();
    log("所有自主任务已启动", "SUCCESS");
  }, 1000);
}

// 运行
main().catch(err => {
  console.error("启动失败:", err);
  log(`启动失败：${err.message}`, "ERROR");
  process.exit(1);
});
