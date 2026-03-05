// Hardware Learning Agent - 硬件学习代理
// 支持电量计、充电 IC、IMU、BMS、通信协议、MCU、传感器融合、边缘 AI、PCB 设计等硬件技术学习

import { BaseAgent } from "../BaseAgent.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.join(__dirname, "../../../docs");

// 硬件学习主题配置 (扩展版)
export const hardwareLearningConfig = {
  intervalMinutes: 5,
  autoStart: true,
  saveProgress: true,
  progressFile: "./docs/hardware_progress.json",

  categories: {
    fuel_gauge: { name: "🔋 电量计", icon: "🔋", doc: "FUEL_GAUGE.md" },
    current_sensor: { name: "🔬 电流计", icon: "🔬", doc: "CURRENT_SENSOR.md" },
    charger_ic: { name: "⚡ 充电 IC", icon: "⚡", doc: "CHARGER_IC.md" },
    adc: { name: "📊 ADC", icon: "📊", doc: "ADC.md" },
    dac: { name: "📈 DAC", icon: "📈", doc: "DAC.md" },
    imu: { name: "📡 IMU", icon: "📡", doc: "IMU.md" },
    bms: { name: "🔋 BMS", icon: "🔋", doc: "BMS.md" },
    comm_protocols: { name: "📡 通信协议", icon: "📡", doc: "COMM_PROTOCOLS.md" },
    mcu_dev: { name: "💻 MCU 开发", icon: "💻", doc: "MCU_DEVELOPMENT.md" },
    sensor_fusion: { name: "🧠 传感器融合", icon: "🧠", doc: "SENSOR_FUSION.md" },
    edge_ai: { name: "🤖 边缘 AI", icon: "🤖", doc: "EDGE_AI.md" },
    pcb_design: { name: "🔌 PCB 设计", icon: "🔌", doc: "PCB_DESIGN.md" }
  },

  topics: [
    // 电量计系列
    {
      id: "fg-1",
      category: "fuel_gauge",
      name: "Fuel Gauge Basics",
      level: "basic",
      duration: 5,
      doc: "./docs/FUEL_GAUGE.md",
      subtopics: ["SoC 概念", "SoH 概念", "测量方法"],
      keywords: ["SoC", "SoH", "电量计", "库仑计数", "阻抗追踪"]
    },
    { 
      id: "fg-2", 
      category: "fuel_gauge",
      name: "Coulomb Counting Method", 
      level: "basic", 
      duration: 5,
      doc: "./docs/FUEL_GAUGE.md",
      subtopics: ["库仑计数原理", "积分计算", "误差来源"]
    },
    { 
      id: "fg-3", 
      category: "fuel_gauge",
      name: "Impedance Tracking", 
      level: "intermediate", 
      duration: 5,
      doc: "./docs/FUEL_GAUGE.md",
      subtopics: ["阻抗追踪原理", "OCV 曲线", "电池模型"]
    },
    { 
      id: "fg-4", 
      category: "fuel_gauge",
      name: "Fuel Gauge IC Selection", 
      level: "intermediate", 
      duration: 5,
      doc: "./docs/FUEL_GAUGE.md",
      subtopics: ["TI BQ 系列", "Maxim MAX 系列", "选型指南"]
    },
    { 
      id: "fg-5", 
      category: "fuel_gauge",
      name: "Hardware Design", 
      level: "advanced", 
      duration: 5,
      doc: "./docs/FUEL_GAUGE.md",
      subtopics: ["典型电路", "元件选择", "PCB 布局"]
    },
    { 
      id: "fg-6", 
      category: "fuel_gauge",
      name: "Driver Development", 
      level: "advanced", 
      duration: 5,
      doc: "./docs/FUEL_GAUGE.md",
      subtopics: ["I2C 驱动", "Arduino 示例", "Python 示例"]
    },
    { 
      id: "fg-7", 
      category: "fuel_gauge",
      name: "Calibration & Learning Cycle", 
      level: "advanced", 
      duration: 5,
      doc: "./docs/FUEL_GAUGE.md",
      subtopics: ["学习周期", "校准流程", "精度优化"]
    },
    
    // 电流计系列
    { 
      id: "cs-1", 
      category: "current_sensor",
      name: "Current Sensing Fundamentals", 
      level: "basic", 
      duration: 5,
      doc: "./docs/CURRENT_SENSOR.md",
      subtopics: ["分流电阻法", "霍尔效应", "电流互感器"]
    },
    { 
      id: "cs-2", 
      category: "current_sensor",
      name: "Shunt Resistor Design", 
      level: "basic", 
      duration: 5,
      doc: "./docs/CURRENT_SENSOR.md",
      subtopics: ["分流电阻计算", "功耗分析", "开尔文连接"]
    },
    { 
      id: "cs-3", 
      category: "current_sensor",
      name: "Hall Effect Sensors", 
      level: "intermediate", 
      duration: 5,
      doc: "./docs/CURRENT_SENSOR.md",
      subtopics: ["霍尔原理", "ACS712/ACS723", "隔离测量"]
    },
    { 
      id: "cs-4", 
      category: "current_sensor",
      name: "Current Sense Amplifiers", 
      level: "intermediate", 
      duration: 5,
      doc: "./docs/CURRENT_SENSOR.md",
      subtopics: ["INA219/INA226", "双向检测", "I2C 读取"]
    },
    { 
      id: "cs-5", 
      category: "current_sensor",
      name: "Current Sensing Applications", 
      level: "advanced", 
      duration: 5,
      doc: "./docs/CURRENT_SENSOR.md",
      subtopics: ["过流保护", "电量累计", "电机控制"]
    },
    
    // 充电 IC 系列
    { 
      id: "ci-1", 
      category: "charger_ic",
      name: "Charging Fundamentals", 
      level: "basic", 
      duration: 5,
      doc: "./docs/CHARGER_IC.md",
      subtopics: ["CC/CV 曲线", "C-Rate", "充电阶段"]
    },
    { 
      id: "ci-2", 
      category: "charger_ic",
      name: "Charger Topologies", 
      level: "basic", 
      duration: 5,
      doc: "./docs/CHARGER_IC.md",
      subtopics: ["线性充电器", "开关充电器", "电荷泵"]
    },
    { 
      id: "ci-3", 
      category: "charger_ic",
      name: "Charger IC Selection", 
      level: "intermediate", 
      duration: 5,
      doc: "./docs/CHARGER_IC.md",
      subtopics: ["TI BQ 系列", "TP4056", "选型指南"]
    },
    { 
      id: "ci-4", 
      category: "charger_ic",
      name: "Charge Control Algorithm", 
      level: "intermediate", 
      duration: 5,
      doc: "./docs/CHARGER_IC.md",
      subtopics: ["状态机设计", "预充电", "终止条件"]
    },
    { 
      id: "ci-5", 
      category: "charger_ic",
      name: "Safety Protection", 
      level: "advanced", 
      duration: 5,
      doc: "./docs/CHARGER_IC.md",
      subtopics: ["过压保护", "过流保护", "过热保护"]
    },
    { 
      id: "ci-6", 
      category: "charger_ic",
      name: "Thermal Management", 
      level: "advanced", 
      duration: 5,
      doc: "./docs/CHARGER_IC.md",
      subtopics: ["热降额", "散热设计", "PCB 布局"]
    },
    
    // ADC 系列
    { 
      id: "adc-1", 
      category: "adc",
      name: "ADC Fundamentals", 
      level: "basic", 
      duration: 5,
      doc: "./docs/ADC.md",
      subtopics: ["采样定理", "量化误差", "分辨率计算"]
    },
    { 
      id: "adc-2", 
      category: "adc",
      name: "ADC Architectures", 
      level: "intermediate", 
      duration: 5,
      doc: "./docs/ADC.md",
      subtopics: ["SAR ADC", "Δ-Σ ADC", "Pipeline ADC"]
    },
    { 
      id: "adc-3", 
      category: "adc",
      name: "ADC Performance Parameters", 
      level: "intermediate", 
      duration: 5,
      doc: "./docs/ADC.md",
      subtopics: ["SNR", "ENOB", "INL/DNL", "SFDR"]
    },
    { 
      id: "adc-4", 
      category: "adc",
      name: "ADC IC Selection", 
      level: "intermediate", 
      duration: 5,
      doc: "./docs/ADC.md",
      subtopics: ["ADS1115", "HX711", "MCP3008", "选型指南"]
    },
    { 
      id: "adc-5", 
      category: "adc",
      name: "ADC Driver Development", 
      level: "advanced", 
      duration: 5,
      doc: "./docs/ADC.md",
      subtopics: ["I2C 驱动", "SPI 驱动", "DMA 采集"]
    },
    { 
      id: "adc-6", 
      category: "adc",
      name: "Precision ADC Design", 
      level: "advanced", 
      duration: 5,
      doc: "./docs/ADC.md",
      subtopics: ["参考电压", "输入滤波", "PCB 布局"]
    },
    { 
      id: "adc-7", 
      category: "adc",
      name: "ADC Signal Processing", 
      level: "advanced", 
      duration: 5,
      doc: "./docs/ADC.md",
      subtopics: ["过采样", "数字滤波", "噪声抑制"]
    },
    
    // DAC 系列
    { 
      id: "dac-1", 
      category: "dac",
      name: "DAC Fundamentals", 
      level: "basic", 
      duration: 5,
      doc: "./docs/DAC.md",
      subtopics: ["转换原理", "输出电压计算", "分辨率"]
    },
    { 
      id: "dac-2", 
      category: "dac",
      name: "DAC Architectures", 
      level: "intermediate", 
      duration: 5,
      doc: "./docs/DAC.md",
      subtopics: ["R-2R 梯形", "电流舵", "Δ-Σ DAC"]
    },
    { 
      id: "dac-3", 
      category: "dac",
      name: "DAC Performance Parameters", 
      level: "intermediate", 
      duration: 5,
      doc: "./docs/DAC.md",
      subtopics: ["建立时间", "转换速率", "INL/DNL"]
    },
    { 
      id: "dac-4", 
      category: "dac",
      name: "DAC IC Selection", 
      level: "intermediate", 
      duration: 5,
      doc: "./docs/DAC.md",
      subtopics: ["MCP4725", "DAC8560", "PCM5102", "选型指南"]
    },
    { 
      id: "dac-5", 
      category: "dac",
      name: "DAC Driver Development", 
      level: "advanced", 
      duration: 5,
      doc: "./docs/DAC.md",
      subtopics: ["I2C 驱动", "SPI 驱动", "I2S 音频"]
    },
    { 
      id: "dac-6", 
      category: "dac",
      name: "Waveform Generation", 
      level: "advanced", 
      duration: 5,
      doc: "./docs/DAC.md",
      subtopics: ["正弦波", "三角波", "任意波形"]
    },
    { 
      id: "dac-7", 
      category: "dac",
      name: "DAC Applications", 
      level: "advanced", 
      duration: 5,
      doc: "./docs/DAC.md",
      subtopics: ["可编程电源", "电机控制", "音频播放"]
    },
    
    // IMU 系列
    { 
      id: "imu-1", 
      category: "imu",
      name: "IMU Fundamentals", 
      level: "basic", 
      duration: 5,
      doc: "./docs/IMU.md",
      subtopics: ["加速度计原理", "陀螺仪原理", "坐标系"]
    },
    { 
      id: "imu-2", 
      category: "imu",
      name: "Euler Angles & Quaternions", 
      level: "basic", 
      duration: 5,
      doc: "./docs/IMU.md",
      subtopics: ["欧拉角", "四元数", "旋转矩阵"]
    },
    { 
      id: "imu-3", 
      category: "imu",
      name: "Complementary Filter", 
      level: "intermediate", 
      duration: 5,
      doc: "./docs/IMU.md",
      subtopics: ["互补滤波原理", "滤波系数", "实现方法"]
    },
    { 
      id: "imu-4", 
      category: "imu",
      name: "Kalman Filter", 
      level: "advanced", 
      duration: 5,
      doc: "./docs/IMU.md",
      subtopics: ["卡尔曼滤波原理", "预测更新", "参数 tuning"]
    },
    { 
      id: "imu-5", 
      category: "imu",
      name: "IMU Sensor Fusion", 
      level: "advanced", 
      duration: 5,
      doc: "./docs/IMU.md",
      subtopics: ["传感器融合", "四元数解算", "姿态估计"]
    },
    { 
      id: "imu-6", 
      category: "imu",
      name: "IMU Driver Development", 
      level: "advanced", 
      duration: 5,
      doc: "./docs/IMU.md",
      subtopics: ["MPU6050 驱动", "I2C 通信", "数据读取"]
    },
    { 
      id: "imu-7", 
      category: "imu",
      name: "IMU Calibration", 
      level: "advanced", 
      duration: 5,
      doc: "./docs/IMU.md",
      subtopics: ["加速度计校准", "陀螺仪校准", "磁力计校准"]
    },
    { 
      id: "imu-8", 
      category: "imu",
      name: "Applications", 
      level: "expert", 
      duration: 5,
      doc: "./docs/IMU.md",
      subtopics: ["自平衡小车", "无人机姿态", "运动追踪"]
    }
  ]
};

export class HardwareLearningAgent extends BaseAgent {
  constructor() {
    super(
      "HardwareLearningAgent",
      "硬件技术学习代理 - 学习电量计、充电 IC、IMU 等硬件知识",
      "embedded"
    );
    
    this.capabilities = [
      "hardware_learning",
      "topic_scheduling",
      "progress_tracking",
      "knowledge_base"
    ];
    
    this.learningState = {
      currentTopic: null,
      currentCategory: null,
      progress: 0,
      sessionsCompleted: 0,
      knowledgeBase: {},
      lastSessionTime: null
    };

    // 初始化所有类别的进度
    this.categoryProgress = {};
    for (const key of Object.keys(hardwareLearningConfig.categories)) {
      this.categoryProgress[key] = 0;
    }
  }

  async initialize() {
    console.log(`[${this.name}] 初始化硬件学习代理...`);
    await this.loadProgress();
    console.log(`[${this.name}] 初始化完成`);
  }

  async execute(input = {}, context = {}) {
    const topic = this.getNextTopic();
    
    if (!topic) {
      return {
        status: "completed",
        message: "所有硬件学习主题已完成！",
        state: this.learningState
      };
    }

    this.learningState.currentTopic = topic;
    this.learningState.currentCategory = topic.category;

    // 模拟学习过程
    const learningResult = await this.learnTopic(topic);

    // 更新进度
    this.updateProgress(topic);
    this.learningState.sessionsCompleted++;

    return {
      status: "success",
      topic: topic.name,
      category: topic.category,
      level: topic.level,
      duration: topic.duration,
      subtopics: topic.subtopics,
      knowledge: learningResult,
      progress: this.learningState.progress,
      state: this.learningState
    };
  }

  getNextTopic() {
    // 按类别轮询，确保均衡学习
    const categories = Object.keys(hardwareLearningConfig.categories);

    // 找到进度最低的类别
    let minCategory = categories[0];
    let minProgress = this.categoryProgress[minCategory];

    for (const cat of categories) {
      if (this.categoryProgress[cat] < minProgress) {
        minProgress = this.categoryProgress[cat];
        minCategory = cat;
      }
    }

    // 在该类别中找到下一个未完成的主题
    const categoryTopics = hardwareLearningConfig.topics.filter(
      t => t.category === minCategory
    );

    for (const topic of categoryTopics) {
      if (!this.learningState.knowledgeBase[topic.id]) {
        return topic;
      }
    }

    // 如果当前类别都完成了，找其他类别
    for (const cat of categories) {
      if (cat !== minCategory) {
        const catTopics = hardwareLearningConfig.topics.filter(
          t => t.category === cat
        );
        for (const topic of catTopics) {
          if (!this.learningState.knowledgeBase[topic.id]) {
            return topic;
          }
        }
      }
    }

    // 所有主题都完成了，重新开始（复习模式）
    return hardwareLearningConfig.topics[0];
  }

  async learnTopic(topic) {
    // 读取文档内容
    const docContent = await this.readDocument(topic.doc);
    
    // 解析文档，提取关键知识点
    const extractedKnowledge = await this.extractKnowledge(docContent, topic);
    
    // 生成知识点
    const knowledge = {
      topicId: topic.id,
      topicName: topic.name,
      category: topic.category,
      level: topic.level,
      learnedAt: new Date().toISOString(),
      docContent: docContent,
      keyPoints: extractedKnowledge.keyPoints,
      formulas: extractedKnowledge.formulas || [],
      codeExamples: extractedKnowledge.codeExamples || [],
      designGuidelines: extractedKnowledge.designGuidelines || [],
      summary: extractedKnowledge.summary
    };

    // 存储到知识库
    this.learningState.knowledgeBase[topic.id] = knowledge;

    return knowledge;
  }

  /**
   * 读取 Markdown 文档
   */
  async readDocument(docPath) {
    const fullPath = path.join(__dirname, "../../../", docPath.replace("./docs/", ""));
    
    try {
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf-8");
        return content;
      }
    } catch (e) {
      console.error(`[${this.name}] 读取文档失败：${fullPath}`, e.message);
    }
    
    return null;
  }

  /**
   * 从文档中提取知识点
   */
  async extractKnowledge(content, topic) {
    if (!content) {
      return {
        keyPoints: topic.subtopics.map(sub => ({ name: sub, understood: false, notes: "文档未找到" })),
        summary: "文档内容不可用"
      };
    }

    const knowledge = {
      keyPoints: [],
      formulas: [],
      codeExamples: [],
      designGuidelines: [],
      summary: ""
    };

    // 提取章节标题
    const sections = this.extractSections(content);
    
    // 根据主题 subtopics 匹配相关章节
    for (const subtopic of topic.subtopics) {
      const relatedSection = sections.find(s => 
        s.title.toLowerCase().includes(subtopic.toLowerCase()) ||
        subtopic.toLowerCase().includes(s.title.toLowerCase())
      );
      
      if (relatedSection) {
        knowledge.keyPoints.push({
          name: subtopic,
          understood: true,
          content: relatedSection.content.substring(0, 500),
          section: relatedSection.title
        });
      } else {
        knowledge.keyPoints.push({
          name: subtopic,
          understood: true,
          notes: `已学习：${subtopic}`
        });
      }
    }

    // 提取公式 (``` 或 $$ 包裹的内容)
    const formulaRegex = /```([\s\S]*?)```|\$\$([\s\S]*?)\$\$/g;
    let match;
    while ((match = formulaRegex.exec(content)) !== null) {
      const formula = match[1] || match[2];
      if (formula.trim().includes("=") || formula.trim().includes("∫") || formula.trim().includes("Σ")) {
        knowledge.formulas.push(formula.trim());
      }
    }

    // 提取代码示例
    const codeRegex = /```(?:c|cpp|python|js|javascript|html)?\n([\s\S]*?)```/g;
    while ((match = codeRegex.exec(content)) !== null) {
      knowledge.codeExamples.push(match[1].trim());
    }

    // 提取表格中的关键参数
    const tableRows = content.match(/\|[^|\n]+\|[^|\n]+\|[^|\n]+\|/g) || [];
    for (const row of tableRows.slice(0, 10)) {  // 限制数量
      const cells = row.split("|").map(c => c.trim()).filter(c => c);
      if (cells.length >= 3) {
        knowledge.designGuidelines.push(cells.join(": "));
      }
    }

    // 生成摘要
    const firstSection = sections[0];
    if (firstSection) {
      knowledge.summary = firstSection.content.substring(0, 200).replace(/\n/g, " ") + "...";
    } else {
      knowledge.summary = `已学习 ${topic.name} - ${topic.category}`;
    }

    return knowledge;
  }

  /**
   * 提取 Markdown 章节
   */
  extractSections(content) {
    const sections = [];
    const lines = content.split("\n");
    let currentSection = { title: "", content: "" };
    let inSection = false;

    for (const line of lines) {
      // 检测章节标题 (## 或 ###)
      const headingMatch = line.match(/^#{2,3}\s+(.+)/);
      
      if (headingMatch) {
        // 保存之前的章节
        if (inSection && currentSection.title) {
          sections.push({ ...currentSection });
        }
        // 开始新章节
        currentSection = { title: headingMatch[1].trim(), content: "" };
        inSection = true;
      } else if (inSection) {
        currentSection.content += line + "\n";
      }
    }

    // 添加最后一个章节
    if (inSection && currentSection.title) {
      sections.push(currentSection);
    }

    return sections;
  }

  updateProgress(topic) {
    // 更新类别进度
    const categoryTopics = hardwareLearningConfig.topics.filter(
      t => t.category === topic.category
    );
    const completedInCategory = categoryTopics.filter(
      t => this.learningState.knowledgeBase[t.id]
    ).length;
    
    this.categoryProgress[topic.category] = 
      (completedInCategory / categoryTopics.length) * 100;

    // 更新总进度
    const totalTopics = hardwareLearningConfig.topics.length;
    const totalCompleted = Object.keys(this.learningState.knowledgeBase).length;
    this.learningState.progress = (totalCompleted / totalTopics) * 100;
  }

  async saveProgress() {
    const progressFile = path.join(
      __dirname, 
      "../../docs/hardware_progress.json"
    );
    
    const progressData = {
      agent: this.name,
      startedAt: this.learningState.startedAt,
      lastSessionTime: this.learningState.lastSessionTime,
      sessionsCompleted: this.learningState.sessionsCompleted,
      currentTopic: this.learningState.currentTopic,
      currentCategory: this.learningState.currentCategory,
      categoryProgress: this.categoryProgress,
      knowledgeBase: this.learningState.knowledgeBase,
      progress: this.learningState.progress,
      savedAt: new Date().toISOString()
    };

    try {
      fs.writeFileSync(progressFile, JSON.stringify(progressData, null, 2));
      console.log(`[${this.name}] 进度已保存：${progressFile}`);
    } catch (e) {
      console.error(`[${this.name}] 保存进度失败:`, e.message);
    }
  }

  async loadProgress() {
    const progressFile = path.join(
      __dirname, 
      "../../docs/hardware_progress.json"
    );

    try {
      if (fs.existsSync(progressFile)) {
        const data = JSON.parse(fs.readFileSync(progressFile, "utf-8"));
        this.learningState = { ...this.learningState, ...data };
        this.categoryProgress = data.categoryProgress || this.categoryProgress;
        console.log(`[${this.name}] 加载进度：${this.learningState.progress.toFixed(1)}%`);
      }
    } catch (e) {
      console.warn(`[${this.name}] 加载进度失败:`, e.message);
    }
  }

  getStatus() {
    return {
      agent: this.name,
      currentTopic: this.learningState.currentTopic?.name || "无",
      currentCategory: this.learningState.currentCategory || "无",
      progress: this.learningState.progress.toFixed(1),
      sessionsCompleted: this.learningState.sessionsCompleted,
      categoryProgress: this.categoryProgress
    };
  }

  getProgressReport() {
    const totalTopics = hardwareLearningConfig.topics.length;
    const completedTopics = Object.keys(this.learningState.knowledgeBase).length;

    let report = "╔═══════════════════════════════════════════════════════════╗\n";
    report += "║         📚 硬件学习进度报告                                   ║\n";
    report += "╠═══════════════════════════════════════════════════════════╣\n";
    report += `║ 总进度：${this.learningState.progress.toFixed(1)}% (${completedTopics}/${totalTopics} 主题)`.padEnd(62) + "║\n";
    report += `║ 已完成会话：${this.learningState.sessionsCompleted}`.padEnd(62) + "║\n";
    report += "╠═══════════════════════════════════════════════════════════╣\n";
    report += "║ 分类进度：".padEnd(62) + "║\n";

    // 使用配置中的分类名称
    const categoryNames = hardwareLearningConfig.categories;

    for (const [cat, progress] of Object.entries(this.categoryProgress)) {
      const bar = this.getProgressBar(progress);
      const catInfo = categoryNames[cat] || { name: cat, icon: "📌" };
      const line = `  ${catInfo.icon} ${catInfo.name}: ${bar} ${progress.toFixed(0)}%`;
      report += line.padEnd(61) + "║\n";
    }

    report += "╚═══════════════════════════════════════════════════════════╝";
    return report;
  }

  getProgressBar(progress) {
    const width = 20;
    const filled = Math.round(progress / 100 * width);
    const empty = width - filled;
    return "█".repeat(filled) + "░".repeat(empty);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      state: this.learningState,
      categoryProgress: this.categoryProgress
    };
  }
}
