// 硬件学习调度器 - 支持多主题轮询学习
import { EventEmitter } from "events";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class HardwareLearnScheduler extends EventEmitter {
  constructor(agent, intervalMinutes = 5) {
    super();
    
    this.agent = agent;
    this.intervalMinutes = intervalMinutes;
    this.intervalMs = intervalMinutes * 60 * 1000;
    this.timer = null;
    this.sessionCount = 0;
    this.startTime = null;
    this.isRunning = false;
    this.lastSessionTime = null;
    
    // 日志配置
    this.logFile = path.join(__dirname, "../../logs/hardware_learning.log");
    this.progressFile = path.join(__dirname, "../../docs/hardware_progress.json");
    
    // 确保日志目录存在
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(message, level = "INFO") {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] [${level}] ${message}\n`;
    fs.appendFileSync(this.logFile, logLine);
    console.log(`[${level}] ${message}`);
  }

  start() {
    if (this.isRunning) {
      this.log("调度器已在运行中", "WARN");
      return;
    }

    this.isRunning = true;
    this.startTime = new Date();
    this.log("═══════════════════════════════════════════════════════════", "SYSTEM");
    this.log("硬件学习调度器启动", "SYSTEM");
    this.log(`学习间隔：${this.intervalMinutes} 分钟`, "CONFIG");
    this.log(`日志文件：${this.logFile}`, "CONFIG");

    // 立即执行第一次学习
    this.runSession();
    
    // 设置定时器
    this.timer = setInterval(() => {
      this.runSession();
    }, this.intervalMs);
  }

  stop() {
    if (!this.isRunning) return;
    
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    
    this.emit("stop", {
      sessions: this.sessionCount,
      uptime: this.getUptime()
    });
    
    this.log("硬件学习调度器停止", "SYSTEM");
  }

  async runSession() {
    const sessionNumber = ++this.sessionCount;
    this.lastSessionTime = new Date();

    try {
      this.log(`开始会话 #${sessionNumber}`, "SESSION");
      
      const result = await this.agent.execute();
      
      if (result.status === "success") {
        this.log(`主题：${result.topic}`, "SUCCESS");
        this.log(`类别：${result.category}`, "INFO");
        this.log(`难度：${result.level}`, "INFO");
        this.log(`进度：${result.progress.toFixed(1)}%`, "INFO");
        
        // 保存进度
        await this.agent.saveProgress();
        
        // 发射会话完成事件
        this.emit("session", {
          count: sessionNumber,
          timestamp: this.lastSessionTime,
          result: result
        });
      } else if (result.status === "completed") {
        this.log("所有学习主题已完成，进入复习模式", "SUCCESS");
        this.emit("completed", {
          sessions: this.sessionCount,
          knowledgeBase: this.agent.learningState.knowledgeBase
        });
      }
      
    } catch (error) {
      this.log(`会话 #${sessionNumber} 失败：${error.message}`, "ERROR");
      this.emit("error", {
        session: sessionNumber,
        error: error
      });
    }
  }

  getUptime() {
    if (!this.startTime) return "N/A";
    const ms = Date.now() - this.startTime.getTime();
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}小时${minutes}分钟`;
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      sessionCount: this.sessionCount,
      uptime: this.getUptime(),
      nextSession: this.lastSessionTime 
        ? new Date(this.lastSessionTime.getTime() + this.intervalMs)
        : null,
      agentStatus: this.agent.getStatus()
    };
  }

  printStatus() {
    const status = this.getStatus();
    console.log("\n╔═══════════════════════════════════════════════════════════╗");
    console.log("║           硬件学习调度器状态                               ║");
    console.log("╠═══════════════════════════════════════════════════════════╣");
    console.log(`║ 状态：${status.isRunning ? "🟢 运行中" : "🔴 已停止"}`.padEnd(62) + "║");
    console.log(`║ 会话数：${status.sessionCount}`.padEnd(62) + "║");
    console.log(`║ 运行时长：${status.uptime}`.padEnd(62) + "║");
    console.log(`║ 下次学习：${status.nextSession?.toLocaleString('zh-CN') || 'N/A'}`.padEnd(62) + "║");
    console.log("╠═══════════════════════════════════════════════════════════╣");
    console.log(`║ 当前主题：${status.agentStatus.currentTopic}`.padEnd(62) + "║");
    console.log(`║ 总进度：${status.agentStatus.progress}%`.padEnd(62) + "║");
    console.log("╚═══════════════════════════════════════════════════════════╝");
  }
}
