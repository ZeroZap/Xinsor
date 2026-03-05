// YOLO Auto-Learn Standalone Mode (without Discord)
// Run: node src/auto-learn.js

import { AgentRegistry } from "./agents/AgentRegistry.js";
import { AutoLearnScheduler } from "./utils/AutoLearnScheduler.js";
import { yoloConfig } from "./config/yolo.config.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("╔═══════════════════════════════════════════════════════════╗");
console.log("║        🧠 YOLO Autonomous Learning Mode                  ║");
console.log("║           XinSor - Sensor Integration                    ║");
console.log("╚═══════════════════════════════════════════════════════════╝");
console.log("");

// Initialize agent registry
const agentRegistry = new AgentRegistry();
const yoloAgent = agentRegistry.get("YOLOLearningAgent");

if (!yoloAgent) {
  console.error("❌ YOLOLearningAgent not found!");
  process.exit(1);
}

// Create scheduler
const scheduler = new AutoLearnScheduler(yoloAgent, yoloConfig.intervalMinutes);

// Load previous progress
const progressFile = path.join(__dirname, "../docs/yolo_progress.json");
if (fs.existsSync(progressFile)) {
  try {
    const progress = JSON.parse(fs.readFileSync(progressFile, "utf-8"));
    console.log(`📂 Loaded previous progress: ${progress.sessionsCompleted} sessions`);
  } catch (e) {
    console.log("📂 No previous progress found, starting fresh");
  }
}

// Event handlers
scheduler.on("session", (data) => {
  console.log(`\n📝 ═══════════════════════════════════════════════════`);
  console.log(`   Session #${data.count} completed`);
  console.log(`   Time: ${data.timestamp.toLocaleString()}`);
  
  // Save progress
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
    console.log(`   💾 Progress saved to: ${progressFile}`);
  }
  console.log(`   ═══════════════════════════════════════════════════`);
});

scheduler.on("report", (report) => {
  console.log(`\n📊 ═══════════════════════════════════════════════════`);
  console.log(`   AUTO-LEARN REPORT`);
  console.log(`   Status: ${report.status}`);
  console.log(`   Uptime: ${report.uptime}`);
  console.log(`   Sessions: ${report.sessions}`);
  console.log(`   Next: ${report.nextSession.toLocaleString()}`);
  console.log(`   ═══════════════════════════════════════════════════`);
});

scheduler.on("stop", (data) => {
  console.log(`\n🛑 Learning stopped. Total sessions: ${data.sessions}`);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\n⚠️  Received SIGINT, stopping scheduler...");
  scheduler.stop();
  
  // Final save
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
    console.log(`💾 Final progress saved`);
  }
  
  process.exit(0);
});

// Start learning
console.log(`⚙️  Configuration:`);
console.log(`   Interval: ${yoloConfig.intervalMinutes} minutes`);
console.log(`   Auto-start: ${yoloConfig.autoStart}`);
console.log(`   Save progress: ${yoloConfig.saveProgress}`);
console.log("");

setTimeout(() => {
  scheduler.start();
}, 1000);
