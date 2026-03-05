// Auto Learn Scheduler - Autonomous learning scheduler with configurable intervals
import { EventEmitter } from "events";

export class AutoLearnScheduler extends EventEmitter {
  constructor(agent, intervalMinutes = 5) {
    super();
    this.agent = agent;
    this.intervalMinutes = intervalMinutes;
    this.intervalMs = intervalMinutes * 60 * 1000;
    this.timer = null;
    this.isRunning = false;
    this.sessionCount = 0;
    this.startTime = null;
  }

  start() {
    if (this.isRunning) {
      console.log(`⏱️  Scheduler already running (interval: ${this.intervalMinutes}min)`);
      return false;
    }

    this.isRunning = true;
    this.startTime = new Date();
    console.log(`\n🚀 Starting Auto-Learn Scheduler`);
    console.log(`   Agent: ${this.agent.name}`);
    console.log(`   Interval: ${this.intervalMinutes} minutes`);
    console.log(`   Start time: ${this.startTime.toLocaleString()}`);
    console.log(`─`.repeat(50));

    // Immediate first run
    this._executeSession();
    
    // Then schedule recurring
    this.timer = setInterval(() => this._executeSession(), this.intervalMs);
    
    return true;
  }

  stop() {
    if (!this.isRunning) return false;

    clearInterval(this.timer);
    this.timer = null;
    this.isRunning = false;
    
    const endTime = new Date();
    const duration = Math.round((endTime - this.startTime) / 60000);
    
    console.log(`\n🛑 Auto-Learn Scheduler stopped`);
    console.log(`   Total sessions: ${this.sessionCount}`);
    console.log(`   Duration: ${duration} minutes`);
    console.log(`─`.repeat(50));

    this.emit("stop", { sessions: this.sessionCount, duration });
    return true;
  }

  async _executeSession() {
    const sessionStart = new Date();
    console.log(`\n📚 [${sessionStart.toLocaleString()}] Starting learning session #${this.sessionCount + 1}`);

    try {
      const result = await this.agent.execute("learn");
      
      console.log(`   Topic: ${result.session?.topic || "N/A"}`);
      console.log(`   Level: ${result.session?.level || "N/A"}`);
      console.log(`   Progress: ${result.progress?.percentage || "N/A"}`);
      console.log(`   ✅ Session completed`);

      // Mark session as complete in agent
      if (this.agent.completeSession) {
        this.agent.completeSession(result.session?.content);
      }

      this.sessionCount++;
      this.emit("session", { 
        count: this.sessionCount, 
        result,
        timestamp: new Date()
      });

      // Send progress report if listeners exist
      if (this.listenerCount("report") > 0) {
        this.emit("report", this._generateReport());
      }

    } catch (err) {
      console.error(`   ❌ Session failed:`, err.message);
      this.emit("error", { error: err, session: this.sessionCount + 1 });
    }

    const sessionEnd = new Date();
    const sessionDuration = Math.round((sessionEnd - sessionStart) / 1000);
    console.log(`   Duration: ${sessionDuration}s`);
    console.log(`   Next session: ${new Date(Date.now() + this.intervalMs).toLocaleString()}`);
  }

  _generateReport() {
    const now = new Date();
    const uptime = Math.round((now - this.startTime) / 60000);
    
    return {
      status: this.isRunning ? "running" : "stopped",
      uptime: `${uptime} minutes`,
      sessions: this.sessionCount,
      interval: `${this.intervalMinutes} minutes`,
      agentState: this.agent.learningState,
      nextSession: new Date(Date.now() + this.intervalMs)
    };
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      interval: this.intervalMinutes,
      sessions: this.sessionCount,
      startTime: this.startTime,
      uptime: this.isRunning 
        ? Math.round((new Date() - this.startTime) / 60000) + " minutes"
        : "N/A",
      nextSession: this.isRunning 
        ? new Date(Date.now() + this.intervalMs)
        : null
    };
  }

  // Change interval dynamically
  setInterval(minutes) {
    this.intervalMinutes = minutes;
    this.intervalMs = minutes * 60 * 1000;
    
    if (this.isRunning) {
      clearInterval(this.timer);
      this.timer = setInterval(() => this._executeSession(), this.intervalMs);
      console.log(`⏱️  Interval changed to ${minutes} minutes`);
    }
    
    return true;
  }
}
