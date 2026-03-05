// YOLO Learning Agent - Autonomous YOLO object detection learning with Deep Knowledge Expansion
import { BaseAgent } from "../BaseAgent.js";

export class YOLOLearningAgent extends BaseAgent {
  constructor() {
    super("YOLOLearningAgent", "Autonomous YOLO object detection learning", "ai-vision");
    this.capabilities = ["learn", "train", "evaluate", "optimize", "report"];

    this.learningState = {
      currentTopic: null,
      progress: 0,
      sessionsCompleted: 0,
      knowledgeBase: [],
      lastLearned: null,
      currentCycle: 1,
      deepLearningMode: true
    };

    // 核心主题 (8 个)
    this.yoloTopics = [
      { id: 1, name: "YOLO Architecture", level: "basic", duration: 5 },
      { id: 2, name: "Anchor Boxes & IoU", level: "basic", duration: 5 },
      { id: 3, name: "Loss Functions", level: "intermediate", duration: 5 },
      { id: 4, name: "Data Augmentation", level: "intermediate", duration: 5 },
      { id: 5, name: "Model Optimization", level: "advanced", duration: 5 },
      { id: 6, name: "Custom Dataset Training", level: "advanced", duration: 5 },
      { id: 7, name: "Real-time Deployment", level: "advanced", duration: 5 },
      { id: 8, name: "YOLOv8/v9/v10 Features", level: "expert", duration: 5 }
    ];

    // 扩展深度学习主题 (每轮循环解锁新内容)
    this.deepLearningTopics = {
      1: this._getBasicContent(),
      2: this._getIntermediateContent(),
      3: this._getAdvancedContent(),
      4: this._getExpertContent(),
      5: this._getResearchContent()
    };
  }

  // 基础内容 (第 1 轮)
  _getBasicContent() {
    return {
      "YOLO Architecture": {
        keyPoints: [
          "Single-stage detector design",
          "Backbone (CSPDarknet) → Neck → Head",
          "Grid-based prediction system",
          "Multi-scale feature maps"
        ],
        codeExample: `# YOLO Model Structure
model = YOLO('yolov8n.pt')
results = model('image.jpg')
# Output: [boxes, confidences, class_ids]`,
        resources: ["https://docs.ultralytics.com", "YOLOv8 Paper"]
      },
      "Anchor Boxes & IoU": {
        keyPoints: [
          "Anchor box clustering (K-means)",
          "IoU (Intersection over Union)",
          "CIoU, DIoU, SIoU loss variants",
          "Anchor-free approaches in YOLOv8+"
        ],
        formula: "IoU = Area(Intersection) / Area(Union)",
        resources: ["IoU Loss Functions Paper"]
      }
    };
  }

  // 中级内容 (第 2 轮)
  _getIntermediateContent() {
    return {
      "Loss Functions": {
        keyPoints: [
          "Classification Loss (BCE with logits)",
          "Objectness Loss (BCE)",
          "Bounding Box Regression (CIoU Loss)",
          "Multi-task loss balancing weights"
        ],
        formula: "Loss = λ₁*cls + λ₂*obj + λ₃*box",
        deepDive: {
          "CIoU Loss": "CIoU = IoU - (ρ²(b,b_gt)/c²) - αν",
          "α": "Positive trade-off parameter",
          "ν": "Consistency of aspect ratio"
        },
        resources: ["YOLO Loss Analysis", "CIoU Paper"]
      },
      "Data Augmentation": {
        keyPoints: [
          "Mosaic augmentation (4-image拼接)",
          "MixUp blending strategy",
          "HSV color space jitter",
          "Random flip, scale, translate"
        ],
        codeExample: `# Albumentations pipeline
transform = A.Compose([
    A.Mosaic(p=0.5),
    A.RandomResizedCrop(640, 640),
    A.HorizontalFlip(p=0.5),
    A.HueSaturationValue(p=0.3)
])`,
        resources: ["Data Augmentation Guide"]
      }
    };
  }

  // 高级内容 (第 3 轮)
  _getAdvancedContent() {
    return {
      "Model Optimization": {
        keyPoints: [
          "Pruning techniques (structured/unstructured)",
          "Quantization (FP32→FP16/INT8)",
          "TensorRT acceleration pipeline",
          "ONNX export and optimization",
          "Knowledge distillation"
        ],
        codeExample: `# Export to TensorRT
model.export(format='engine', device=0, half=True)
# 3-5x speedup on GPU

# INT8 Quantization
model.export(format='engine', int8=True, calib_data='calib.zip')`,
        performanceComparison: {
          "FP32": "1x (baseline)",
          "FP16": "2-3x faster",
          "INT8": "4-6x faster (with calibration)"
        },
        resources: ["Optimization Guide", "TensorRT Docs"]
      },
      "Custom Dataset Training": {
        keyPoints: [
          "YOLO format annotations (class_id x_center y_center w h)",
          "Dataset YAML configuration",
          "Transfer learning from COCO weights",
          "Hyperparameter tuning (lr, epochs, batch)",
          "Validation and mAP evaluation"
        ],
        codeExample: `# Train custom model
model.train(
    data='custom.yaml',
    epochs=100,
    imgsz=640,
    batch=16,
    lr0=0.01,
    lrf=0.1,
    momentum=0.937,
    weight_decay=0.0005
)`,
        yamlExample: `# custom.yaml
path: datasets/custom
train: images/train
val: images/val
names: ['class1', 'class2']`,
        resources: ["Custom Training Tutorial"]
      }
    };
  }

  // 专家级内容 (第 4 轮)
  _getExpertContent() {
    return {
      "Real-time Deployment": {
        keyPoints: [
          "Edge device deployment (Jetson Nano/Xavier/Orin)",
          "OpenVINO optimization for Intel hardware",
          "TensorRT inference engine",
          "Pipeline optimization (pre/post-processing)",
          "Multi-stream processing"
        ],
        codeExample: `# Real-time inference with pipeline optimization
results = model(source=0, stream=True, imgsz=640, half=True)
for r in results:
    boxes = r.boxes  # GPU-accelerated post-processing
    process(boxes)`,
        deploymentGuide: {
          "Jetson": "Use TensorRT, FP16 mode, 30+ FPS",
          "OpenVINO": "INT8 quantization, 60+ FPS on CPU",
          "Desktop GPU": "TensorRT/ONNX Runtime, 100+ FPS"
        },
        resources: ["Deployment Guide"]
      },
      "YOLOv8/v9/v10 Features": {
        keyPoints: [
          "Anchor-free detection (v8+)",
          "C2f module improvements",
          "Task-aligned learning",
          "Efficient architecture design",
          "Dual label assignment (v10)"
        ],
        comparison: {
          "v8": "Anchor-free, C2f module, decoupled head",
          "v9": "Programmable gradient information (PGI)",
          "v10": "Dual label assignment, efficiency optimization"
        },
        architectureDetails: {
          "C2f": "Cross stage partial with 2 convolutions",
          "Decoupled Head": "Separate classification and regression"
        },
        resources: ["Latest YOLO Papers"]
      }
    };
  }

  // 研究级内容 (第 5 轮+)
  _getResearchContent() {
    return {
      "Advanced Topics": {
        keyPoints: [
          "Small object detection techniques",
          "Occluded object handling",
          "Multi-camera fusion",
          "Temporal consistency for video",
          "Self-supervised pre-training"
        ],
        researchPapers: [
          "YOLO for Small Objects: A Survey (2024)",
          "Temporal YOLO for Video Detection",
          "Self-supervised Learning for Object Detection"
        ],
        techniques: {
          "SAHI": "Slicing Aided Hyper Inference for small objects",
          "Tiling": "Multi-scale tiling for high-res images"
        }
      }
    };
  }

  async execute(command, options = {}) {
    const parts = command.split(" ");
    const action = parts[0]?.toLowerCase() || "learn";

    switch (action) {
      case "learn":
        return this._learn(options);
      case "status":
        return this._status();
      case "progress":
        return this._progress();
      case "topic":
        return this._getCurrentTopic();
      case "reset":
        return this._reset();
      default:
        return this._learn(options);
    }
  }

  async _learn(options = {}) {
    const topic = this._getNextTopic();
    
    if (!topic) {
      return {
        agent: this.name,
        status: "completed",
        message: "All YOLO topics covered!",
        summary: "Completed full YOLO learning cycle"
      };
    }

    this.learningState.currentTopic = topic;
    this.learningState.progress = ((this.learningState.sessionsCompleted) / this.yoloTopics.length) * 100;

    const learningContent = await this._fetchLearningContent(topic);

    return {
      agent: this.name,
      action: "learn",
      session: {
        topic: topic.name,
        level: topic.level,
        duration: `${topic.duration} minutes`,
        startTime: new Date().toISOString(),
        content: learningContent
      },
      progress: {
        current: this.learningState.sessionsCompleted + 1,
        total: this.yoloTopics.length,
        percentage: this.learningState.progress.toFixed(1) + "%"
      },
      summary: `Learning: ${topic.name} (${topic.level})`
    };
  }

  async _fetchLearningContent(topic) {
    // 计算当前学习轮次 (每 8 个会话为一轮)
    const currentCycle = Math.floor(this.learningState.sessionsCompleted / 8) + 1;
    this.learningState.currentCycle = currentCycle;

    // 根据轮次返回不同深度的内容
    let content = null;
    
    // 第 1 轮：基础内容
    if (currentCycle === 1) {
      content = this._getBasicContent()[topic.name];
    }
    // 第 2 轮：中级内容
    else if (currentCycle === 2) {
      content = this._getIntermediateContent()[topic.name];
    }
    // 第 3 轮：高级内容
    else if (currentCycle === 3) {
      content = this._getAdvancedContent()[topic.name];
    }
    // 第 4 轮：专家级内容
    else if (currentCycle === 4) {
      content = this._getExpertContent()[topic.name];
    }
    // 第 5 轮+：研究级内容 + 综合复习
    else {
      content = this._getResearchContent()[topic.name] || 
                this._getExpertContent()[topic.name] ||
                this._getAdvancedContent()[topic.name];
    }

    // 如果当前主题在本轮没有内容，返回基础内容
    if (!content) {
      content = this._getBasicContent()[topic.name] || {
        keyPoints: [`Reviewing ${topic.name} (Cycle ${currentCycle})`],
        deepLearningNote: `Cycle ${currentCycle}: Building on previous knowledge`,
        resources: ["YOLO Documentation"]
      };
    }

    // 添加轮次信息到内容
    content.learningCycle = currentCycle;
    content.sessionNumber = this.learningState.sessionsCompleted + 1;

    return content;
  }

  _getNextTopic() {
    const completed = this.learningState.knowledgeBase.map(k => k.id);
    return this.yoloTopics.find(t => !completed.includes(t.id));
  }

  _status() {
    return {
      agent: this.name,
      state: this.learningState,
      currentTopic: this.learningState.currentTopic?.name || "None",
      autoLearnMode: "Active (5min interval)",
      summary: `Learning status: ${this.learningState.currentTopic?.name || "Idle"}`
    };
  }

  _progress() {
    const completed = this.learningState.knowledgeBase.length;
    const remaining = this.yoloTopics.length - completed;

    return {
      agent: this.name,
      progress: {
        completed: completed,
        remaining: remaining,
        total: this.yoloTopics.length,
        percentage: ((completed / this.yoloTopics.length) * 100).toFixed(1) + "%"
      },
      topics: this.yoloTopics.map(t => ({
        name: t.name,
        level: t.level,
        status: this.learningState.knowledgeBase.find(k => k.id === t.id) ? "✅" : "⏳"
      })),
      summary: `Completed ${completed}/${this.yoloTopics.length} topics`
    };
  }

  _getCurrentTopic() {
    return {
      agent: this.name,
      topic: this.learningState.currentTopic,
      summary: `Current: ${this.learningState.currentTopic?.name || "None"}`
    };
  }

  _reset() {
    this.learningState = {
      currentTopic: null,
      progress: 0,
      sessionsCompleted: 0,
      knowledgeBase: [],
      lastLearned: null
    };

    return {
      agent: this.name,
      action: "reset",
      status: "Learning state reset",
      summary: "YOLO learning reset complete"
    };
  }

  // Called after each successful learning session
  completeSession(content) {
    const currentCycle = Math.floor(this.learningState.sessionsCompleted / 8) + 1;
    
    this.learningState.sessionsCompleted++;
    this.learningState.knowledgeBase.push({
      id: this.learningState.currentTopic?.id,
      name: this.learningState.currentTopic?.name,
      completedAt: new Date().toISOString(),
      content,
      cycle: currentCycle,
      sessionNumber: this.learningState.sessionsCompleted + 1
    });
    this.learningState.lastLearned = new Date().toISOString();
    this.learningState.progress = (this.learningState.sessionsCompleted / this.yoloTopics.length) * 100;
    this.learningState.currentCycle = currentCycle;
  }
}
