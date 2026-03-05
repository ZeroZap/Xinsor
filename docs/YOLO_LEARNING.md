# YOLO 自主学习模式

## 🧠 功能概述

XinSor 已开启 **YOLO 目标检测自主学习模式**，每 **5 分钟** 自动执行一次学习会话。

## 学习主题

| 序号 | 主题 | 难度 | 时长 |
|------|------|------|------|
| 1 | YOLO Architecture | basic | 5 min |
| 2 | Anchor Boxes & IoU | basic | 5 min |
| 3 | Loss Functions | intermediate | 5 min |
| 4 | Data Augmentation | intermediate | 5 min |
| 5 | Model Optimization | advanced | 5 min |
| 6 | Custom Dataset Training | advanced | 5 min |
| 7 | Real-time Deployment | advanced | 5 min |
| 8 | YOLOv8/v9/v10 Features | expert | 5 min |

## Discord 命令

| 命令 | 描述 |
|------|------|
| `!yolo` | 开始/继续 YOLO 学习 |
| `!yolo status` | 查看学习进度 |
| `!yolo progress` | 详细进度报告 |
| `!yolo reset` | 重置学习进度 |

## 自动学习日志

```
🚀 Starting Auto-Learn Scheduler
   Agent: YOLOLearningAgent
   Interval: 5 minutes
──────────────────────────────────────────────────
📚 [2026/3/3 10:00:00] Starting learning session #1
   Topic: YOLO Architecture
   Level: basic
   Progress: 0%
   ✅ Session completed
   Duration: 2s
   Next session: 2026/3/3 10:05:00
```

## 配置选项

在 `src/config/yolo.config.js` 中修改：

```javascript
export const yoloConfig = {
  intervalMinutes: 5,     // 学习间隔（分钟）
  autoStart: true,        // 启动时自动开始
  focusArea: "all",       // 学习领域
  saveProgress: true      // 保存进度
};
```

## 学习报告

每完成一个会话，系统会自动记录：
- 学习主题
- 完成时间
- 关键知识点
- 代码示例
- 参考资源

完整学习周期：约 **40 分钟**（8 个主题 × 5 分钟）
