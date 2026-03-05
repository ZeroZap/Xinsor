// Orchestrator Agent - Coordinates multi-agent discussions
import { CollaborativeAgent } from "./CollaborativeAgent.js";

export class OrchestratorAgent extends CollaborativeAgent {
  constructor(agentRegistry) {
    super("Orchestrator", "Coordinates multi-agent discussions and consensus", "orchestration");
    this.agentRegistry = agentRegistry;
    this.discussionHistory = [];
  }

  async organize(topic, participantNames = [], options = {}) {
    const participants = this._selectParticipants(participantNames, topic);
    
    console.log(`🎯 Orchestrating discussion on: ${topic}`);
    console.log(`👥 Participants: ${participants.map(p => p.name).join(", ")}`);

    const result = await this.collaborate(participants, topic, options);
    
    this.discussionHistory.push({
      timestamp: new Date().toISOString(),
      topic,
      participants: participants.map(p => p.name),
      result
    });

    return result;
  }

  _selectParticipants(explicitNames, topic) {
    const topicLower = topic.toLowerCase();
    
    if (explicitNames.length > 0) {
      return explicitNames
        .map(name => this.agentRegistry.get(name))
        .filter(Boolean);
    }

    // Auto-select based on topic keywords
    const selectors = [
      { keywords: ["sensor", "interface", "protocol"], agents: ["SensorAgent", "ProtocolAgent"] },
      { keywords: ["mcu", "hal", "embedded"], agents: ["MCUHALAgent", "EmbeddedDriverAgent"] },
      { keywords: ["data", "collection", "pipeline"], agents: ["DataCollectionAgent"] },
      { keywords: ["simulation", "sim", "model"], agents: ["SimulationAgent"] },
      { keywords: ["security", "auth", "encrypt"], agents: ["SecurityAgent"] },
      { keywords: ["code", "review", "quality"], agents: ["CodeReviewAgent"] },
      { keywords: ["debug", "error", "issue"], agents: ["DebugAgent"] }
    ];

    const selected = new Set();
    
    for (const { keywords, agents } of selectors) {
      if (keywords.some(kw => topicLower.includes(kw))) {
        agents.forEach(a => selected.add(a));
      }
    }

    return Array.from(selected)
      .map(name => this.agentRegistry.get(name))
      .filter(Boolean);
  }

  getHistory(limit = 10) {
    return this.discussionHistory.slice(-limit);
  }

  clearHistory() {
    this.discussionHistory = [];
  }
}
