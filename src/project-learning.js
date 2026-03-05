#!/usr/bin/env node
// 项目学习独立运行脚本

import { ProjectLearningAgent } from "./agents/embedded/ProjectLearningAgent.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 日志文件
const logFile = path.join(__dirname, "../logs/project_learning.log");
const logDir = path.dirname(logFile);

// 确保日志目录存在
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
  console.log("║        🛠️  项目学习系统                                    ║");
  console.log("║           Project-Based Learning System                   ║");
  console.log("║                                                           ║");
  console.log("║   可用项目 (6):                                            ║");
  console.log("║                                                           ║");
  console.log("║   🔋 BMS 电池管理系统设计 (advanced, 4 周)                  ║");
  console.log("║   📡 IMU 姿态解算与传感器融合 (intermediate, 2 周)         ║");
  console.log("║   🤖 TensorFlow Lite 边缘 AI 部署 (advanced, 3 周)         ║");
  console.log("║   ⚡ 高精度电源监测仪 (intermediate, 2 周)                 ║");
  console.log("║   📈 DDS 任意波形发生器 (advanced, 3 周)                  ║");
  console.log("║   📊 多通道数据采集记录仪 (intermediate, 2 周)           ║");
  console.log("║                                                           ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log("");
}

function printMenu() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("命令菜单:");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  list              - 列出所有项目");
  console.log("  start <project>   - 开始项目");
  console.log("  status            - 查看当前项目状态");
  console.log("  generate <phase>  - 生成代码 (phase: firmware/hardware)");
  console.log("  log <title>       - 记录实验");
  console.log("  report            - 生成项目报告");
  console.log("  help              - 显示帮助");
  console.log("  quit              - 退出程序");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("");
}

// 初始化
printBanner();
log("═══════════════════════════════════════════════════════════", "SYSTEM");
log("项目学习系统启动", "SYSTEM");

const agent = new ProjectLearningAgent();

// 初始化代理
agent.initialize().then(() => {
  log("项目学习代理初始化完成", "SUCCESS");
  printMenu();
  
  // 交互式命令行
  const readline = await import("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const prompt = () => {
    rl.question("\n🛠️  project> ", async (input) => {
      const parts = input.trim().split(" ");
      const command = parts[0]?.toLowerCase();
      const args = parts.slice(1);
      
      try {
        switch (command) {
          case "list": {
            const result = await agent.execute({ action: "list" });
            console.log("");
            console.log("可用项目:");
            for (const proj of result.projects) {
              console.log(`  ${proj.id.padEnd(20)} | ${proj.name}`);
              console.log(`  ${" ".repeat(20)}   难度：${proj.difficulty} | 周期：${proj.duration}`);
              console.log(`  ${" ".repeat(20)}   领域：${proj.knowledgePoints}`);
              console.log("");
            }
            break;
          }
          
          case "start": {
            const projectId = args[0];
            if (!projectId) {
              console.log("❌ 请指定项目 ID，例如：start imu_attitude");
              break;
            }
            const result = await agent.execute({ action: "start", projectId });
            if (result.error) {
              console.log(`❌ ${result.error}`);
            } else {
              console.log("");
              console.log(`✅ 项目已启动：${result.project.name}`);
              console.log(`📁 项目目录：${result.directory}`);
              console.log("");
              console.log("项目阶段:");
              for (const phase of result.phases) {
                console.log(`  ${phase.id}. ${phase.name}`);
                for (const task of phase.tasks) {
                  console.log(`      - ${task}`);
                }
              }
            }
            break;
          }
          
          case "status": {
            const result = await agent.execute({ action: "status" });
            console.log("");
            console.log("当前项目状态:");
            console.log(JSON.stringify(result, null, 2));
            break;
          }
          
          case "generate": {
            const phase = args[0] || "firmware";
            const projectId = agent.projectState.currentProject;
            if (!projectId) {
              console.log("❌ 请先启动一个项目");
              break;
            }
            const result = await agent.execute({ action: "generate", projectId, phase });
            console.log("");
            console.log("生成的代码模板:");
            for (const [name, template] of Object.entries(result.codeTemplates || {})) {
              console.log("");
              console.log(`📄 ${template.filename}:`);
              console.log("─".repeat(60));
              console.log(template.code.substring(0, 500) + "...");
            }
            break;
          }
          
          case "log": {
            const title = args.join(" ") || "实验记录";
            const projectId = agent.projectState.currentProject;
            if (!projectId) {
              console.log("❌ 请先启动一个项目");
              break;
            }
            const result = await agent.execute({ 
              action: "log", 
              projectId, 
              title,
              data: {},
              notes: title
            });
            console.log("");
            console.log(`✅ 实验已记录：${result.experiment.title}`);
            break;
          }
          
          case "report": {
            const result = await agent.execute({ action: "report" });
            console.log("");
            console.log("项目报告:");
            console.log(JSON.stringify(result, null, 2));
            break;
          }
          
          case "help": {
            printMenu();
            break;
          }
          
          case "quit":
          case "exit": {
            log("项目学习系统退出", "SYSTEM");
            rl.close();
            process.exit(0);
            break;
          }
          
          default:
            if (command) {
              console.log(`❌ 未知命令：${command}，输入 help 查看帮助`);
            }
        }
      } catch (err) {
        console.log(`❌ 错误：${err.message}`);
        log(`错误：${err.message}`, "ERROR");
      }
      
      prompt();
    });
  };
  
  prompt();
  
}).catch(err => {
  log(`初始化失败：${err.message}`, "ERROR");
  process.exit(1);
});
