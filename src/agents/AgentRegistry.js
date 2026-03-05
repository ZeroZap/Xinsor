// Agent Registry - Manages all XinSor agents
import { CodeReviewAgent } from "./CodeReviewAgent.js";
import { DebugAgent } from "./DebugAgent.js";
import { DocAgent } from "./DocAgent.js";
import { TestAgent } from "./TestAgent.js";
import { SecurityAgent } from "./SecurityAgent.js";
import { TemplateAgent } from "./TemplateAgent.js";
import { XinSorDiscussionAgent } from "./XinSorDiscussionAgent.js";
import { SensorAgent } from "./sensor/SensorAgent.js";
import { DataCollectionAgent } from "./sensor/DataCollectionAgent.js";
import { SimulationAgent } from "./sensor/SimulationAgent.js";
import { MCUHALAgent } from "./embedded/MCUHALAgent.js";
import { EmbeddedDriverAgent } from "./embedded/EmbeddedDriverAgent.js";
import { HardwareLearningAgent } from "./embedded/HardwareLearningAgent.js";
import { YOLOLearningAgent } from "./ai/YOLOLearningAgent.js";

export class AgentRegistry {
  constructor() {
    this.agents = new Map();
    this.registerDefaults();
  }

  registerDefaults() {
    // Code quality agents
    this.register(new CodeReviewAgent());
    this.register(new DebugAgent());
    this.register(new DocAgent());
    this.register(new TestAgent());
    this.register(new SecurityAgent());

    // Utility agents
    this.register(new TemplateAgent());

    // XinSor sensor agents
    this.register(new XinSorDiscussionAgent());
    this.register(new SensorAgent());
    this.register(new DataCollectionAgent());
    this.register(new SimulationAgent());

    // Embedded agents
    this.register(new MCUHALAgent());
    this.register(new EmbeddedDriverAgent());
    this.register(new HardwareLearningAgent());

    // AI Learning agents
    this.register(new YOLOLearningAgent());
  }

  register(agent) {
    this.agents.set(agent.name, agent);
    console.log(`✅ Registered agent: ${agent.name}`);
  }

  get(name) {
    return this.agents.get(name);
  }

  list() {
    return Array.from(this.agents.values()).map(a => ({
      name: a.name,
      description: a.description,
      domain: a.domain
    }));
  }

  getByDomain(domain) {
    return Array.from(this.agents.values()).filter(a => a.domain === domain);
  }
}
