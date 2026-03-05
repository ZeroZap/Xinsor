// Autonomous Task Scheduler - 自主任务调度器
import { EventEmitter } from "events";

export class AutonomousTaskScheduler extends EventEmitter {
  constructor(options = {}) {
    super();
    this.tasks = new Map();
    this.intervals = new Map();
    this.isRunning = false;
    this.startTime = null;
    this.completedTasks = 0;
    this.failedTasks = 0;
    this.config = {
      logEnabled: options.logEnabled !== false,
      saveState: options.saveState !== false,
      stateFile: options.stateFile || './docs/autonomous_state.json'
    };
  }

  // 注册任务
  registerTask(name, taskFn, intervalMinutes, options = {}) {
    this.tasks.set(name, {
      name,
      fn: taskFn,
      interval: intervalMinutes * 60 * 1000,
      intervalMinutes,
      enabled: options.enabled !== false,
      priority: options.priority || 5,
      retryCount: options.retryCount || 3,
      lastRun: null,
      nextRun: null,
      runCount: 0,
      successCount: 0,
      failCount: 0
    });
    
    if (this.config.logEnabled) {
      console.log(`✅ 注册任务：${name} (每${intervalMinutes}分钟)`);
    }
    
    return this;
  }

  // 启动调度器
  start() {
    if (this.isRunning) {
      console.log('⚠️ 调度器已在运行中');
      return false;
    }

    this.isRunning = true;
    this.startTime = new Date();
    
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║        🤖 XinSor 自主工作模式                            ║');
    console.log('║           Autonomous Working Mode                        ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');
    console.log(`📋 已注册任务：${this.tasks.size} 个`);
    console.log(`🕐 启动时间：${this.startTime.toLocaleString('zh-CN')}`);
    console.log(`─`.repeat(60));

    // 启动所有启用的任务
    for (const [name, task] of this.tasks) {
      if (task.enabled) {
        this._startTask(name, task);
      }
    }

    this.emit('start', { 
      startTime: this.startTime,
      taskCount: this.tasks.size 
    });

    return true;
  }

  // 停止调度器
  stop() {
    if (!this.isRunning) return false;

    // 清除所有定时器
    for (const [name, timer] of this.intervals) {
      clearInterval(timer);
    }
    this.intervals.clear();

    this.isRunning = false;
    const endTime = new Date();
    const duration = Math.round((endTime - this.startTime) / 60000);

    console.log('\n' + '─'.repeat(60));
    console.log(`🛑 自主工作已停止`);
    console.log(`📊 总任务数：${this.completedTasks + this.failedTasks}`);
    console.log(`✅ 成功：${this.completedTasks}`);
    console.log(`❌ 失败：${this.failedTasks}`);
    console.log(`⏱️  运行时长：${duration} 分钟`);
    console.log('─'.repeat(60));

    this.emit('stop', {
      endTime,
      duration,
      completed: this.completedTasks,
      failed: this.failedTasks
    });

    return true;
  }

  // 启动单个任务
  _startTask(name, task) {
    // 立即执行一次
    this._executeTask(name, task);

    // 设置定时器
    const timer = setInterval(() => {
      this._executeTask(name, task);
    }, task.interval);

    this.intervals.set(name, timer);
  }

  // 执行任务
  async _executeTask(name, task) {
    const now = new Date();
    task.lastRun = now;
    task.nextRun = new Date(now.getTime() + task.interval);
    task.runCount++;

    console.log(`\n📝 [${now.toLocaleString('zh-CN')}] 执行任务：${task.name} #${task.runCount}`);

    try {
      const result = await task.fn({
        taskName: name,
        runCount: task.runCount,
        timestamp: now
      });

      task.successCount++;
      this.completedTasks++;

      console.log(`   ✅ 完成：${task.name}`);
      if (result?.summary) {
        console.log(`   📋 ${result.summary}`);
      }

      this.emit('taskComplete', {
        name,
        task,
        result,
        timestamp: now
      });

    } catch (err) {
      task.failCount++;
      this.failedTasks++;

      console.error(`   ❌ 失败：${task.name} - ${err.message}`);

      this.emit('taskError', {
        name,
        task,
        error: err,
        timestamp: now
      });
    }

    // 更新下次执行时间
    console.log(`   ⏱️  下次执行：${task.nextRun.toLocaleString('zh-CN')}`);
  }

  // 获取状态
  getStatus() {
    const now = new Date();
    const uptime = this.isRunning 
      ? Math.round((now - this.startTime) / 60000) 
      : 0;

    return {
      isRunning: this.isRunning,
      startTime: this.startTime,
      uptime: `${uptime} 分钟`,
      tasks: Array.from(this.tasks.values()).map(t => ({
        name: t.name,
        enabled: t.enabled,
        interval: `${t.intervalMinutes} 分钟`,
        runCount: t.runCount,
        successCount: t.successCount,
        failCount: t.failCount,
        lastRun: t.lastRun,
        nextRun: t.nextRun
      })),
      stats: {
        total: this.completedTasks + this.failedTasks,
        completed: this.completedTasks,
        failed: this.failedTasks,
        successRate: this.completedTasks + this.failedTasks > 0
          ? ((this.completedTasks / (this.completedTasks + this.failedTasks)) * 100).toFixed(1) + '%'
          : '0%'
      }
    };
  }

  // 启用/禁用任务
  setTaskEnabled(name, enabled) {
    const task = this.tasks.get(name);
    if (task) {
      task.enabled = enabled;
      if (!enabled && this.intervals.has(name)) {
        clearInterval(this.intervals.get(name));
        this.intervals.delete(name);
      } else if (enabled && !this.intervals.has(name) && this.isRunning) {
        this._startTask(name, task);
      }
      return true;
    }
    return false;
  }

  // 添加临时任务
  async addOneTimeTask(name, taskFn) {
    console.log(`\n📋 添加临时任务：${name}`);
    try {
      const result = await taskFn();
      this.completedTasks++;
      console.log(`   ✅ 临时任务完成：${name}`);
      return { success: true, result };
    } catch (err) {
      this.failedTasks++;
      console.error(`   ❌ 临时任务失败：${name} - ${err.message}`);
      return { success: false, error: err.message };
    }
  }
}
