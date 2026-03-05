// Command Handler - Process Discord commands
import { EmbedBuilder } from "discord.js";

export class CommandHandler {
  constructor(agentRegistry, skillRegistry, orchestrator) {
    this.agentRegistry = agentRegistry;
    this.skillRegistry = skillRegistry;
    this.orchestrator = orchestrator;
    this.commands = this._registerCommands();
  }

  _registerCommands() {
    return {
      // Agent commands
      agents: () => this._listAgents(),
      skills: () => this._listSkills(),
      help: () => this._help(),
      
      // Discussion commands
      discuss: (args) => this._discuss(args),
      history: () => this._history(),
      
      // XinSor commands
      xinsor: (args) => this._xinsor(args),
      sensor: (args) => this._sensor(args),
      data: (args) => this._data(args),
      sim: (args) => this._simulation(args),
      
      // Skill commands
      git: (args) => this._runSkill("git", args),
      format: (args) => this._runSkill("format", args),
      search: (args) => this._runSkill("search", args),
      link: (args) => this._runSkill("link", args),
      protocol: (args) => this._runSkill("protocol", args),
      hal: (args) => this._runSkill("hal", args),
      build: (args) => this._runSkill("build", args),
      crypto: (args) => this._runSkill("crypto", args),
      
      // Agent-specific commands
      CodeReview: (args) => this._runAgent("CodeReview", args),
      Debug: (args) => this._runAgent("Debug", args),
      Doc: (args) => this._runAgent("Doc", args),
      Test: (args) => this._runAgent("Test", args),
      Security: (args) => this._runAgent("Security", args),
      template: (args) => this._runAgent("TemplateAgent", args),
      
      // YOLO Learning commands
      yolo: (args) => this._yolo(args),
      ystatus: () => this._yoloStatus()
    };
  }

  async handle(message, input) {
    const parts = input.split(" ");
    const command = parts[0];
    const args = parts.slice(1).join(" ");

    console.log(`📝 Command: ${command}, Args: ${args}`);

    const handler = this.commands[command];
    if (handler) {
      try {
        const result = await handler(args);
        return this._formatResponse(result);
      } catch (err) {
        console.error(`Command ${command} failed:`, err);
        return { text: `❌ Error executing ${command}: ${err.message}` };
      }
    }

    return { text: `❓ Unknown command: ${command}. Use !help for available commands.` };
  }

  _listAgents() {
    const agents = this.agentRegistry.list();
    const embed = new EmbedBuilder()
      .setTitle("🤖 XinSor Agents")
      .setDescription(agents.map(a => `**${a.name}** - ${a.description}`).join("\n"))
      .setColor(0x0099FF)
      .setFooter({ text: `Total: ${agents.length} agents` });

    return { embeds: [embed] };
  }

  _listSkills() {
    const skills = this.skillRegistry.list();
    const embed = new EmbedBuilder()
      .setTitle("🛠️ XinSor Skills")
      .setDescription(skills.map(s => `**${s.name}** - ${s.description}`).join("\n"))
      .setColor(0x00AA00)
      .setFooter({ text: `Total: ${skills.length} skills` });

    return { embeds: [embed] };
  }

  _help() {
    const embed = new EmbedBuilder()
      .setTitle("📚 XinSor Help")
      .setDescription("XinSor - Sensor Integration AI Agents")
      .addFields(
        { name: "🤖 Agents", value: "`!agents` - List all agents\n`!discuss <topic>` - Start discussion" },
        { name: "🛠️ Skills", value: "`!skills` - List all skills\n`!git`, `!search`, `!protocol`" },
        { name: "🎯 XinSor", value: "`!xinsor` - Sensor blueprint\n`!sensor` - Sensor info\n`!data` - Data pipeline\n`!sim` - Simulation" },
        { name: "📋 Code Quality", value: "`!CodeReview`, `!Debug`, `!Doc`, `!Test`, `!Security`" }
      )
      .setColor(0xFF9900)
      .setFooter({ text: "Prefix: ! | Use !help for this message" });

    return { embeds: [embed] };
  }

  async _discuss(topic) {
    if (!topic) {
      return { text: "Please provide a topic: `!discuss <topic>`" };
    }

    const result = await this.orchestrator.organize(topic);
    
    const embed = new EmbedBuilder()
      .setTitle("💬 Multi-Agent Discussion")
      .setDescription(`**Topic:** ${topic}`)
      .addFields(
        { name: "Participants", value: result.participants?.join(", ") || "Auto-selected" },
        { name: "Summary", value: result.summary?.substring(0, 1000) || "Discussion completed" }
      )
      .setColor(0x9900FF);

    return { embeds: [embed] };
  }

  _history() {
    const history = this.orchestrator.getHistory(5);
    
    if (history.length === 0) {
      return { text: "📭 No discussion history yet." };
    }

    const embed = new EmbedBuilder()
      .setTitle("📜 Discussion History")
      .setDescription(history.map(h => `• ${h.topic}`).join("\n"))
      .setColor(0x666666);

    return { embeds: [embed] };
  }

  async _xinsor(args) {
    const agent = this.agentRegistry.get("XinSorDiscussion");
    if (!agent) {
      return { text: "❌ XinSorDiscussion agent not found" };
    }

    const result = await agent.execute(args || "blueprint");
    
    const embed = new EmbedBuilder()
      .setTitle("🎯 XinSor Sensor Ecosystem")
      .setDescription(result.summary)
      .setColor(0x0099FF);

    return { embeds: [embed] };
  }

  async _sensor(args) {
    const agent = this.agentRegistry.get("SensorAgent");
    if (!agent) {
      return { text: "❌ SensorAgent not found" };
    }

    const result = await agent.execute(args || "list");
    
    const embed = new EmbedBuilder()
      .setTitle("🎯 Sensor Agent")
      .setDescription(result.summary)
      .setColor(0x00AA00);

    return { embeds: [embed] };
  }

  async _data(args) {
    const agent = this.agentRegistry.get("DataCollectionAgent");
    if (!agent) {
      return { text: "❌ DataCollectionAgent not found" };
    }

    const result = await agent.execute(args || "pipeline");
    
    const embed = new EmbedBuilder()
      .setTitle("📊 Data Collection Agent")
      .setDescription(result.summary)
      .setColor(0x0066CC);

    return { embeds: [embed] };
  }

  async _simulation(args) {
    const agent = this.agentRegistry.get("SimulationAgent");
    if (!agent) {
      return { text: "❌ SimulationAgent not found" };
    }

    const result = await agent.execute(args || "model");
    
    const embed = new EmbedBuilder()
      .setTitle("🔬 Simulation Agent")
      .setDescription(result.summary)
      .setColor(0xCC6600);

    return { embeds: [embed] };
  }

  async _runSkill(skillName, args) {
    const skill = this.skillRegistry.get(skillName);
    if (!skill) {
      return { text: `❌ Skill ${skillName} not found` };
    }

    const result = await skill.run(args || "");
    
    return { text: `**${skillName}:** ${JSON.stringify(result, null, 2)}` };
  }

  async _runAgent(agentName, args) {
    const agent = this.agentRegistry.get(agentName);
    if (!agent) {
      return { text: `❌ Agent ${agentName} not found` };
    }

    const result = await agent.execute(args || "");
    
    return { text: `**${agentName}:** ${result.summary || JSON.stringify(result, null, 2)}` };
  }

  async _yolo(args) {
    const agent = this.agentRegistry.get("YOLOLearningAgent");
    if (!agent) {
      return { text: "❌ YOLOLearningAgent not found" };
    }

    const result = await agent.execute(args || "learn");
    
    const embed = new EmbedBuilder()
      .setTitle("🧠 YOLO Learning Agent")
      .setDescription(result.summary)
      .setColor(0xFF6600);

    if (result.progress) {
      embed.addFields({
        name: "📊 Progress",
        value: `${result.progress.current}/${result.progress.total} (${result.progress.percentage})`
      });
    }

    if (result.session) {
      embed.addFields({
        name: "📚 Current Session",
        value: `**Topic:** ${result.session.topic}\n**Level:** ${result.session.level}`
      });
    }

    return { embeds: [embed] };
  }

  async _yoloStatus() {
    const agent = this.agentRegistry.get("YOLOLearningAgent");
    if (!agent) {
      return { text: "❌ YOLOLearningAgent not found" };
    }

    const result = await agent.execute("progress");
    
    const embed = new EmbedBuilder()
      .setTitle("📈 YOLO Learning Progress")
      .setDescription(result.summary)
      .setColor(0x00AA00);

    if (result.progress) {
      embed.addFields({
        name: "Completion",
        value: `${result.progress.completed}/${result.progress.total} (${result.progress.percentage})`
      });
    }

    return { embeds: [embed] };
  }

  _formatResponse(result) {
    return result;
  }
}
