// YOLO 自主学习到天亮 - 深度学习模式
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
  const now = new Date();
  const sunrise = new Date();
  sunrise.setHours(6, 0, 0, 0);
  if (now > sunrise) sunrise.setDate(sunrise.getDate() + 1);
  const hoursToSunrise = Math.floor((sunrise.getTime() - now.getTime()) / 3600000);
  const minsToSunrise = Math.floor(((sunrise.getTime() - now.getTime()) % 3600000) / 60000);

  console.log("");
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║        🧠 YOLO 深度学习模式 - 学习到天亮                   ║");
  console.log("║           XinSor - AI Learning                           ║");
  console.log("║                                                           ║");
  console.log(`║   当前时间：${now.toLocaleString('zh-CN').padEnd(20)}                   ║`);
  console.log(`║   距离天亮：约${hoursToSunrise}小时${minsToSunrise}分钟                                   ║`);
  console.log("║                                                           ║");
  console.log("║   学习模式：深度复习 + 扩展学习                            ║");
  console.log("║   学习间隔：5 分钟  |  自动保存  |  日志记录               ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log("");
}

function printLearningPlan() {
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║                    📋 YOLO 学习计划                        ║");
  console.log("╠═══════════════════════════════════════════════════════════╣");
  console.log("║ 基础主题 (已完成 → 深度复习):                             ║");
  console.log("║   1. YOLO Architecture         [复习]                     ║");
  console.log("║   2. Anchor Boxes & IoU        [复习]                     ║");
  console.log("║   3. Loss Functions            [复习]                     ║");
  console.log("║   4. Data Augmentation         [复习]                     ║");
  console.log("║                                                           ║");
  console.log("║ 进阶主题 (已完成 → 扩展学习):                             ║");
  console.log("║   5. Model Optimization        [扩展]                     ║");
  console.log("║   6. Custom Dataset Training   [扩展]                     ║");
  console.log("║   7. Real-time Deployment      [扩展]                     ║");
  console.log("║   8. YOLOv8/v9/v10 Features    [深度]                     ║");
  console.log("╠═══════════════════════════════════════════════════════════╣");
  console.log("║ 扩展主题 (新学习):                                        ║");
  console.log("║   9. YOLO for Small Objects                               ║");
  console.log("║   10. YOLO for Video Analysis                             ║");
  console.log("║   11. YOLO Model Compression                              ║");
  console.log("║   12. YOLO Edge Deployment                                ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log("");
}

// 扩展学习主题
const extendedTopics = [
  { id: 9, name: "YOLO for Small Objects", level: "advanced", duration: 5,
    content: {
      keyPoints: [
        "Small object detection challenges",
        "Feature pyramid improvements",
        "Attention mechanisms for small objects",
        "Multi-scale training strategies"
      ],
      techniques: [
        "SAHI (Slicing Aided Hyper Inference)",
        "Mosaic augmentation tuning",
        "Higher resolution input"
      ]
    }
  },
  { id: 10, name: "YOLO for Video Analysis", level: "advanced", duration: 5,
    content: {
      keyPoints: [
        "Temporal consistency",
        "Object tracking integration",
        "Video-specific augmentations",
        "Frame sampling strategies"
      ],
      integrations: [
        "ByteTrack for tracking",
        "DeepSORT integration",
        "OC-SORT for occlusion handling"
      ]
    }
  },
  { id: 11, name: "YOLO Model Compression", level: "expert", duration: 5,
    content: {
      keyPoints: [
        "Pruning techniques",
        "Quantization (INT8/FP16)",
        "Knowledge distillation",
        "Neural architecture search"
      ],
      tools: [
        "NNCF (Neural Network Compression Framework)",
        "TensorRT quantization",
        "ONNX Runtime optimization"
      ]
    }
  },
  { id: 12, name: "YOLO Edge Deployment", level: "expert", duration: 5,
    content: {
      keyPoints: [
        "Edge device constraints",
        "Hardware-aware optimization",
        "Power efficiency",
        "Real-time performance tuning"
      ],
      platforms: [
        "NVIDIA Jetson (Nano/Xavier/Orin)",
        "Google Coral TPU",
        "Intel NCS2 / OpenVINO",
        "Qualcomm SNPE"
      ]
    }
  }
];

// 初始化
printBanner();
printLearningPlan();

log("═══════════════════════════════════════════════════════════", "SYSTEM");
log("YOLO 深度学习系统启动", "SYSTEM");
log(`学习间隔：${yoloConfig.intervalMinutes} 分钟`, "CONFIG");
log(`日志文件：${logFile}`, "CONFIG");
log(`模式：深度学习到天亮`, "CONFIG");

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
    log(`当前进度：${previousProgress.progress?.toFixed(1) || 0}%`, "INFO");
    
    // 合并扩展主题
    if (previousProgress.knowledgeBase) {
      yoloAgent.learningState.knowledgeBase = previousProgress.knowledgeBase;
    }
  } catch (e) {
    log("无法加载之前的进度，从头开始", "WARN");
  }
}

// 创建调度器
const scheduler = new AutoLearnScheduler(yoloAgent, yoloConfig.intervalMinutes);

// 会话完成事件
scheduler.on("session", (data) => {
  const topic = yoloAgent.learningState.currentTopic;
  
  log(`═══════════════════════════════════════════════════════════`, "SESSION");
  log(`会话 #${data.count} 完成`, "SUCCESS");
  log(`时间：${data.timestamp.toLocaleString('zh-CN')}`, "INFO");
  
  if (topic) {
    log(`主题：${topic.name}`, "INFO");
    log(`难度：${topic.level}`, "INFO");
  }
  
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
      lastSaved: new Date().toISOString(),
      mode: "deep_learning_until_dawn"
    };

    fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
    log(`进度已保存：${progressFile}`, "SUCCESS");
  }
  log(`═══════════════════════════════════════════════════════════`, "SESSION");
});

// 报告事件
scheduler.on("report", (report) => {
  log(`═══════════════════════════════════════════════════════════`, "REPORT");
  log(`📊 YOLO 深度学习报告`, "INFO");
  log(`状态：${report.status === 'running' ? '🟢 运行中' : '🔴 已停止'}`, "INFO");
  log(`运行时长：${report.uptime}`, "INFO");
  log(`会话数：${report.sessions}`, "INFO");
  log(`下次学习：${report.nextSession.toLocaleString('zh-CN')}`, "INFO");
  log(`═══════════════════════════════════════════════════════════`, "REPORT");
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
      lastSaved: new Date().toISOString(),
      mode: "deep_learning_until_dawn"
    };
    fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
    log(`最终进度已保存`, "SUCCESS");
  }

  printFinalReport(scheduler, yoloAgent);
  
  log("═══════════════════════════════════════════════════════════", "SYSTEM");
  log("YOLO 深度学习系统退出", "SYSTEM");
  log(`总会话数：${scheduler.sessionCount}`, "SYSTEM");
  log(`运行时长：${scheduler.isRunning ? Math.round((new Date() - scheduler.startTime) / 60000) + '分钟' : 'N/A'}`, "SYSTEM");
  log("═══════════════════════════════════════════════════════════", "SYSTEM");
  process.exit(0);
});

function printFinalReport(scheduler, agent) {
  const now = new Date();
  const sunrise = new Date();
  sunrise.setHours(6, 0, 0, 0);
  if (now > sunrise) sunrise.setDate(sunrise.getDate() + 1);
  const msToSunrise = sunrise.getTime() - now.getTime();
  const hoursToSunrise = Math.floor(msToSunrise / 3600000);
  const minsToSunrise = Math.floor((msToSunrise % 3600000) / 60000);

  console.log("\n╔═══════════════════════════════════════════════════════════╗");
  console.log("║                    📊 YOLO 学习报告                        ║");
  console.log("╠═══════════════════════════════════════════════════════════╣");
  console.log(`║ 当前时间：${now.toLocaleString('zh-CN')}`.padEnd(62) + "║");
  console.log(`║ 距离天亮：约${hoursToSunrise}小时${minsToSunrise}分钟`.padEnd(62) + "║");
  console.log("╠═══════════════════════════════════════════════════════════╣");
  console.log(`║ 总会话数：${scheduler.sessionCount}`.padEnd(62) + "║");
  console.log(`║ 运行时长：${scheduler.getUptime()}`.padEnd(62) + "║");
  console.log(`║ 学习进度：${agent.learningState.progress.toFixed(1)}%`.padEnd(62) + "║");
  console.log("╠═══════════════════════════════════════════════════════════╣");
  console.log("║ 已学习主题：".padEnd(62) + "║");
  
  const topics = agent.learningState.knowledgeBase || [];
  const uniqueTopics = [...new Map(topics.map(t => [t.id, t])).values()];
  
  uniqueTopics.slice(-5).forEach(t => {
    const line = `  • ${t.name} (${t.level})`;
    console.log(line.padEnd(61) + "║");
  });
  
  console.log("╚═══════════════════════════════════════════════════════════╝");
}

// 延迟启动
setTimeout(() => {
  scheduler.start();
  log("调度器已启动，深度学习开始...", "SUCCESS");
}, 1000);
