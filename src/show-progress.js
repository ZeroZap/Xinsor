#!/usr/bin/env node
// 显示学习进度

import { LearningProgressTracker } from "./utils/LearningProgressTracker.js";

const tracker = new LearningProgressTracker();

console.log("");
console.log(tracker.generateVisualReport());
console.log("");

// 显示详细统计
const report = tracker.getProgressReport();

console.log("═══════════════════════════════════════════════════════════");
console.log("📊 详细统计");
console.log("═══════════════════════════════════════════════════════════");
console.log(`创建时间：${report.generatedAt}`);
console.log(`总学习时长：${report.overview.totalLearningTime}`);
console.log(`YOLO 会话：${report.yolo.sessionsCompleted}`);
console.log(`硬件会话：${report.hardware.sessionsCompleted}`);
console.log(`实验次数：${report.projects.experiments}`);
console.log(`代码片段：${report.projects.codeSnippets}`);
console.log("");

// 显示成就
console.log("═══════════════════════════════════════════════════════════");
console.log("🏆 成就墙");
console.log("═══════════════════════════════════════════════════════════");

const achievements = report.achievements;
if (achievements.length > 0) {
  for (const ach of achievements) {
    console.log(`  ${ach.icon} ${ach.name}: ${ach.description}`);
  }
} else {
  console.log("  暂无成就，继续加油！");
}
console.log("");

// 显示硬件学习详情
console.log("═══════════════════════════════════════════════════════════");
console.log("🔧 硬件学习详情");
console.log("═══════════════════════════════════════════════════════════");

const categoryNames = {
  fuel_gauge: { name: "电量计", icon: "🔋" },
  current_sensor: { name: "电流计", icon: "🔬" },
  charger_ic: { name: "充电 IC", icon: "⚡" },
  adc: { name: "ADC", icon: "📊" },
  dac: { name: "DAC", icon: "📈" },
  imu: { name: "IMU", icon: "📡" },
  bms: { name: "BMS", icon: "🔋" },
  comm_protocols: { name: "通信协议", icon: "📡" },
  mcu_dev: { name: "MCU 开发", icon: "💻" },
  sensor_fusion: { name: "传感器融合", icon: "🧠" },
  edge_ai: { name: "边缘 AI", icon: "🤖" },
  pcb_design: { name: "PCB 设计", icon: "🔌" }
};

for (const [key, cat] of Object.entries(report.hardware.categoryProgress)) {
  const info = categoryNames[key] || { name: key, icon: "📌" };
  console.log(`  ${info.icon} ${info.name}: ${cat.completed} 主题`);
}
console.log("");
