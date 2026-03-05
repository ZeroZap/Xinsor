// 综合学习进度追踪系统 - Learning Progress Tracker
// 整合 YOLO、硬件学习、项目学习的所有进度，提供统一的学习仪表板

import { EventEmitter } from "events";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "../../../logs/learning");
const progressFile = path.join(__dirname, "../../../docs/learning_progress.json");

// 确保目录存在
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * 学习进度追踪器
 */
export class LearningProgressTracker extends EventEmitter {
  constructor() {
    super();
    
    this.state = {
      // YOLO 学习进度
      yolo: {
        enabled: true,
        sessionsCompleted: 0,
        currentCycle: 1,
        currentTopic: null,
        knowledgeBase: [],
        lastSession: null,
        totalLearningTime: 0
      },
      
      // 硬件学习进度
      hardware: {
        enabled: true,
        sessionsCompleted: 0,
        categoryProgress: {},
        knowledgeBase: {},
        lastSession: null,
        totalLearningTime: 0
      },
      
      // 项目学习进度
      projects: {
        activeProject: null,
        completedProjects: [],
        experiments: 0,
        codeSnippets: 0,
        lastActivity: null
      },
      
      // 总体统计
      statistics: {
        totalSessions: 0,
        totalLearningTime: 0,
        streakDays: 0,
        lastLearningDate: null,
        createdAt: new Date().toISOString()
      }
    };
    
    this.loadProgress();
  }

  /**
   * 记录 YOLO 学习会话
   */
  recordYoloSession(sessionData) {
    const session = {
      type: "yolo",
      timestamp: new Date().toISOString(),
      topic: sessionData.topic,
      level: sessionData.level,
      cycle: sessionData.cycle,
      duration: sessionData.duration || 5,
      content: sessionData.content
    };

    this.state.yolo.sessionsCompleted++;
    this.state.yolo.currentCycle = sessionData.cycle || 1;
    this.state.yolo.currentTopic = sessionData.topic;
    this.state.yolo.knowledgeBase.push(session);
    this.state.yolo.lastSession = session.timestamp;
    this.state.yolo.totalLearningTime += session.duration;

    this.state.statistics.totalSessions++;
    this.state.statistics.totalLearningTime += session.duration;
    this.state.statistics.lastLearningDate = session.timestamp;

    this._updateStreak();
    this._saveProgress();
    this.emit("session", { type: "yolo", ...session });

    return session;
  }

  /**
   * 记录硬件学习会话
   */
  recordHardwareSession(sessionData) {
    const session = {
      type: "hardware",
      timestamp: new Date().toISOString(),
      topicId: sessionData.topicId,
      topicName: sessionData.topicName,
      category: sessionData.category,
      level: sessionData.level,
      duration: sessionData.duration || 5,
      keyPoints: sessionData.keyPoints,
      formulas: sessionData.formulas || [],
      codeExamples: sessionData.codeExamples || []
    };

    this.state.hardware.sessionsCompleted++;
    this.state.hardware.knowledgeBase[sessionData.topicId] = session;
    this.state.hardware.lastSession = session.timestamp;
    this.state.hardware.totalLearningTime += session.duration;

    // 更新类别进度
    if (!this.state.hardware.categoryProgress[sessionData.category]) {
      this.state.hardware.categoryProgress[sessionData.category] = {
        completed: 0,
        total: 0
      };
    }
    this.state.hardware.categoryProgress[sessionData.category].completed++;

    this.state.statistics.totalSessions++;
    this.state.statistics.totalLearningTime += session.duration;
    this.state.statistics.lastLearningDate = session.timestamp;

    this._updateStreak();
    this._saveProgress();
    this.emit("session", { type: "hardware", ...session });

    return session;
  }

  /**
   * 记录项目活动
   */
  recordProjectActivity(activityData) {
    const activity = {
      type: "project",
      timestamp: new Date().toISOString(),
      projectId: activityData.projectId,
      phase: activityData.phase,
      action: activityData.action,
      description: activityData.description
    };

    if (activityData.action === "start") {
      this.state.projects.activeProject = activityData.projectId;
    } else if (activityData.action === "complete") {
      this.state.projects.completedProjects.push({
        id: activityData.projectId,
        completedAt: activity.timestamp
      });
      this.state.projects.activeProject = null;
    } else if (activityData.action === "experiment") {
      this.state.projects.experiments++;
    } else if (activityData.action === "code") {
      this.state.projects.codeSnippets++;
    }

    this.state.projects.lastActivity = activity.timestamp;
    this.state.statistics.lastLearningDate = activity.timestamp;

    this._saveProgress();
    this.emit("activity", activity);

    return activity;
  }

  /**
   * 更新连续学习天数
   */
  _updateStreak() {
    const today = new Date().toDateString();
    const lastDate = this.state.statistics.lastLearningDate 
      ? new Date(this.state.statistics.lastLearningDate).toDateString()
      : null;

    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastDate === yesterday.toDateString()) {
        this.state.statistics.streakDays++;
      } else {
        this.state.statistics.streakDays = 1;
      }
    }
  }

  /**
   * 获取综合进度报告
   */
  getProgressReport() {
    const report = {
      generatedAt: new Date().toISOString(),
      overview: {
        totalSessions: this.state.statistics.totalSessions,
        totalLearningTime: `${this.state.statistics.totalLearningTime} 分钟`,
        streakDays: this.state.statistics.streakDays,
        activeProjects: this.state.projects.activeProject ? 1 : 0,
        completedProjects: this.state.projects.completedProjects.length
      },
      yolo: {
        sessionsCompleted: this.state.yolo.sessionsCompleted,
        currentCycle: this.state.yolo.currentCycle,
        currentTopic: this.state.yolo.currentTopic,
        totalLearningTime: `${this.state.yolo.totalLearningTime} 分钟`
      },
      hardware: {
        sessionsCompleted: this.state.hardware.sessionsCompleted,
        totalLearningTime: `${this.state.hardware.totalLearningTime} 分钟`,
        categoryProgress: this._getCategoryProgressReport()
      },
      projects: {
        activeProject: this.state.projects.activeProject,
        completedProjects: this.state.projects.completedProjects.length,
        experiments: this.state.projects.experiments,
        codeSnippets: this.state.projects.codeSnippets
      },
      achievements: this._calculateAchievements()
    };

    return report;
  }

  /**
   * 获取类别进度报告
   */
  _getCategoryProgressReport() {
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

    const report = {};
    for (const [key, value] of Object.entries(this.state.hardware.categoryProgress)) {
      const info = categoryNames[key] || { name: key, icon: "📌" };
      report[key] = {
        ...info,
        completed: value.completed,
        total: value.total
      };
    }
    return report;
  }

  /**
   * 计算成就
   */
  _calculateAchievements() {
    const achievements = [];

    // 学习会话成就
    if (this.state.statistics.totalSessions >= 1) {
      achievements.push({ id: "first_session", name: "第一步", icon: "🎯", description: "完成第一次学习" });
    }
    if (this.state.statistics.totalSessions >= 10) {
      achievements.push({ id: "dedicated", name: "坚持不懈", icon: "💪", description: "完成 10 次学习" });
    }
    if (this.state.statistics.totalSessions >= 50) {
      achievements.push({ id: "master", name: "学习大师", icon: "🏆", description: "完成 50 次学习" });
    }
    if (this.state.statistics.totalSessions >= 100) {
      achievements.push({ id: "legend", name: "传奇学者", icon: "👑", description: "完成 100 次学习" });
    }

    // 连续学习成就
    if (this.state.statistics.streakDays >= 1) {
      achievements.push({ id: "hot_streak_1", name: "初露锋芒", icon: "🔥", description: "连续学习 1 天" });
    }
    if (this.state.statistics.streakDays >= 7) {
      achievements.push({ id: "hot_streak_7", name: "持之以恒", icon: "🔥🔥", description: "连续学习 7 天" });
    }
    if (this.state.statistics.streakDays >= 30) {
      achievements.push({ id: "hot_streak_30", name: "日复一日", icon: "🔥🔥🔥", description: "连续学习 30 天" });
    }

    // 项目成就
    if (this.state.projects.experiments >= 1) {
      achievements.push({ id: "experimenter", name: "实验家", icon: "🧪", description: "完成第一次实验" });
    }
    if (this.state.projects.codeSnippets >= 1) {
      achievements.push({ id: "coder", name: "程序员", icon: "💻", description: "生成第一段代码" });
    }
    if (this.state.projects.completedProjects.length >= 1) {
      achievements.push({ id: "project_complete", name: "项目完成", icon: "✅", description: "完成第一个项目" });
    }

    // 学习时长成就
    if (this.state.statistics.totalLearningTime >= 60) {
      achievements.push({ id: "time_1h", name: "小时突破", icon: "⏱️", description: "累计学习 1 小时" });
    }
    if (this.state.statistics.totalLearningTime >= 600) {
      achievements.push({ id: "time_10h", name: "十小时挑战", icon: "⏱️⏱️", description: "累计学习 10 小时" });
    }

    return achievements;
  }

  /**
   * 保存进度
   */
  _saveProgress() {
    try {
      fs.writeFileSync(progressFile, JSON.stringify(this.state, null, 2));
      
      // 同时保存会话日志
      const logFile = path.join(dataDir, `session_${new Date().toISOString().split('T')[0]}.json`);
      const todaySessions = this._getTodaySessions();
      fs.writeFileSync(logFile, JSON.stringify(todaySessions, null, 2));
      
      this.emit("saved", { timestamp: new Date().toISOString() });
    } catch (e) {
      console.error("保存学习进度失败:", e.message);
    }
  }

  /**
   * 获取今日会话
   */
  _getTodaySessions() {
    const today = new Date().toDateString();
    const allSessions = [
      ...this.state.yolo.knowledgeBase,
      ...Object.values(this.state.hardware.knowledgeBase)
    ];
    
    return allSessions.filter(s => 
      new Date(s.timestamp).toDateString() === today
    );
  }

  /**
   * 加载进度
   */
  loadProgress() {
    try {
      if (fs.existsSync(progressFile)) {
        const data = JSON.parse(fs.readFileSync(progressFile, "utf-8"));
        this.state = { ...this.state, ...data };
        console.log(`[LearningProgressTracker] 加载进度：${this.state.statistics.totalSessions} 次会话`);
      }
    } catch (e) {
      console.warn("加载学习进度失败:", e.message);
    }
  }

  /**
   * 生成可视化报告（文本格式）
   */
  generateVisualReport() {
    const report = this.getProgressReport();
    
    let output = "";
    output += "╔═══════════════════════════════════════════════════════════╗\n";
    output += "║           📊 综合学习进度报告                              ║\n";
    output += "╠═══════════════════════════════════════════════════════════╣\n";
    output += `║ 生成时间：${report.generatedAt.split('T')[0]}`.padEnd(62) + "║\n";
    output += "╠═══════════════════════════════════════════════════════════╣\n";
    output += "║ 总体概览                                                  ║\n";
    output += `║   总会话数：${report.overview.totalSessions}`.padEnd(62) + "║\n";
    output += `║   总学习时长：${report.overview.totalLearningTime}`.padEnd(62) + "║\n";
    output += `║   连续学习：${report.overview.streakDays} 天`.padEnd(62) + "║\n";
    output += `║   完成项目：${report.overview.completedProjects}`.padEnd(62) + "║\n";
    output += "╠═══════════════════════════════════════════════════════════╣\n";
    output += "║ 🧠 YOLO 学习                                               ║\n";
    output += `║   会话数：${report.yolo.sessionsCompleted}`.padEnd(62) + "║\n";
    output += `║   当前周期：第${report.yolo.currentCycle} 轮`.padEnd(62) + "║\n";
    output += `║   当前主题：${report.yolo.currentTopic || '无'}`.padEnd(62) + "║\n";
    output += "╠═══════════════════════════════════════════════════════════╣\n";
    output += "║ 🔧 硬件学习                                               ║\n";
    output += `║   会话数：${report.hardware.sessionsCompleted}`.padEnd(62) + "║\n";
    output += `║   学习时长：${report.hardware.totalLearningTime}`.padEnd(62) + "║\n";
    
    // 类别进度条
    for (const [key, cat] of Object.entries(report.hardware.categoryProgress)) {
      const bar = this._getProgressBar(cat.completed, Math.max(cat.total, cat.completed));
      output += `║   ${cat.icon} ${cat.name}: ${bar}`.padEnd(61) + "║\n";
    }
    
    output += "╠═══════════════════════════════════════════════════════════╣\n";
    output += "║ 🏆 成就墙                                                 ║\n";
    
    const achievements = report.achievements;
    if (achievements.length > 0) {
      for (const ach of achievements.slice(0, 6)) {
        output += `║   ${ach.icon} ${ach.name}`.padEnd(61) + "║\n";
      }
    } else {
      output += "║   暂无成就，继续加油！".padEnd(61) + "║\n";
    }
    
    output += "╚═══════════════════════════════════════════════════════════╝";
    
    return output;
  }

  /**
   * 生成进度条
   */
  _getProgressBar(current, total) {
    const width = 20;
    const percentage = total > 0 ? (current / total) * 100 : 0;
    const filled = Math.round(percentage / 100 * width);
    const empty = width - filled;
    return "█".repeat(filled) + "░".repeat(empty) + ` ${Math.round(percentage)}%`;
  }

  /**
   * 导出学习数据
   */
  exportData(format = "json") {
    if (format === "json") {
      return JSON.stringify(this.getProgressReport(), null, 2);
    }
    
    // 可以添加 Markdown、CSV 等格式导出
    return this.generateVisualReport();
  }

  /**
   * 重置进度（谨慎使用）
   */
  resetProgress(confirm = false) {
    if (!confirm) {
      return { error: "需要确认重置" };
    }

    this.state = {
      yolo: { enabled: true, sessionsCompleted: 0, currentCycle: 1, currentTopic: null, knowledgeBase: [], lastSession: null, totalLearningTime: 0 },
      hardware: { enabled: true, sessionsCompleted: 0, categoryProgress: {}, knowledgeBase: {}, lastSession: null, totalLearningTime: 0 },
      projects: { activeProject: null, completedProjects: [], experiments: 0, codeSnippets: 0, lastActivity: null },
      statistics: { totalSessions: 0, totalLearningTime: 0, streakDays: 0, lastLearningDate: null, createdAt: new Date().toISOString() }
    };

    this._saveProgress();
    return { success: true, message: "进度已重置" };
  }
}

// 导出单例
export const tracker = new LearningProgressTracker();
