// XinSor Discord Bot - Main Entry Point (with Auto-Learn)
import { Client, GatewayIntentBits, Events } from "discord.js";
import { config } from "./config/bot.config.js";
import { AgentRegistry } from "./agents/AgentRegistry.js";
import { SkillRegistry } from "./skills/SkillRegistry.js";
import { OrchestratorAgent } from "./agents/OrchestratorAgent.js";
import { CommandHandler } from "./utils/CommandHandler.js";
import { AutoLearnScheduler } from "./utils/AutoLearnScheduler.js";
import { yoloConfig } from "./config/yolo.config.js";

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Initialize registries
const agentRegistry = new AgentRegistry();
const skillRegistry = new SkillRegistry();
const orchestrator = new OrchestratorAgent(agentRegistry);
const commandHandler = new CommandHandler(
  agentRegistry,
  skillRegistry,
  orchestrator
);

// Auto-learn scheduler
let autoLearnScheduler = null;

// Ready event
client.once(Events.Ready, () => {
  console.log("🚀 XinSor Agents Online: " + client.user.tag);
  console.log("📦 Agents: " + agentRegistry.agents.size);
  console.log("🛠️  Skills: " + skillRegistry.skills.size);
  console.log("🌍 Platform: " + process.platform);
  console.log("🎯 Focus: Sensor Integration");
  console.log("─".repeat(50));
  
  // Start YOLO auto-learning
  const yoloAgent = agentRegistry.get("YOLOLearningAgent");
  if (yoloAgent && yoloConfig.autoStart) {
    autoLearnScheduler = new AutoLearnScheduler(yoloAgent, yoloConfig.intervalMinutes);
    autoLearnScheduler.start();
    
    // Listen for session reports
    autoLearnScheduler.on("session", (data) => {
      console.log(`📝 Session #${data.count} completed at ${data.timestamp.toLocaleString()}`);
    });
    
    autoLearnScheduler.on("report", (report) => {
      console.log(`📊 Auto-Learn Report: ${report.sessions} sessions, uptime: ${report.uptime}`);
    });
  }
  
  console.log("─".repeat(50));
});

// Message handler
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.content.startsWith(config.prefix)) return;

  const input = message.content.slice(config.prefix.length);

  try {
    const response = await commandHandler.handle(message, input);
    
    if (response.text) {
      // Split long messages
      const chunks = response.text.match(/[\s\S]{1,1999}/g) || [];
      for (const chunk of chunks) {
        await message.reply(chunk);
      }
    } else if (response.embeds) {
      await message.reply({ embeds: response.embeds });
    }
  } catch (err) {
    console.error("Command error:", err);
    message.reply("❌ An error occurred. Check logs for details.");
  }
});

// Error handling
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

// Login
client.login(process.env.DISCORD_TOKEN);
