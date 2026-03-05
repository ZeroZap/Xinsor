# 🚀 XinSor SOLO Mode - 到天亮

##  autonomous learning mode

### 启动方式

#### 模式 1: Discord Bot + 自主学习 (完整模式)
```bash
# 配置 Discord Token
cp .env.example .env
# 编辑 .env 添加 DISCORD_TOKEN

npm start
```

#### 模式 2: 纯自主学习模式 (SOLO)
```bash
npm run learn
```

### YOLO 自主学习配置

**学习间隔**: 每 **5 分钟** 自动执行一次

**学习主题** (8 个，循环学习):
1. YOLO Architecture (basic)
2. Anchor Boxes & IoU (basic)
3. Loss Functions (intermediate)
4. Data Augmentation (intermediate)
5. Model Optimization (advanced)
6. Custom Dataset Training (advanced)
7. Real-time Deployment (advanced)
8. YOLOv8/v9/v10 Features (expert)

### 输出示例

```
╔═══════════════════════════════════════════════════════════╗
║        🧠 YOLO Autonomous Learning Mode                  ║
║           XinSor - Sensor Integration                    ║
╚═══════════════════════════════════════════════════════════╝

🚀 Starting Auto-Learn Scheduler
   Agent: YOLOLearningAgent
   Interval: 5 minutes
   Start time: 2026/3/3 01:30:00
──────────────────────────────────────────────────

📚 [2026/3/3 01:30:01] Starting learning session #1
   Topic: YOLO Architecture
   Level: basic
   Progress: 0%
   ✅ Session completed
   Duration: 2s
   Next session: 2026/3/3 01:35:01

📝 ═══════════════════════════════════════════════════
   Session #1 completed
   Time: 2026/3/3 01:30:03
   💾 Progress saved to: docs/yolo_progress.json
   ═══════════════════════════════════════════════════
```

### 进度查看

**Discord 命令** (完整模式):
- `!yolo` - 开始/继续学习
- `!yolo status` - 查看进度
- `!yolo progress` - 详细报告

**进度文件**: `docs/yolo_progress.json`

### 停止学习

按 `Ctrl+C` 停止，进度会自动保存。

### 配置修改

编辑 `src/config/yolo.config.js`:

```javascript
export const yoloConfig = {
  intervalMinutes: 5,     // 学习间隔
  autoStart: true,        // 自动启动
  saveProgress: true      // 保存进度
};
```

---

**SOLO 到天亮** - 让 XinSor 陪你学习到天亮 🌅
