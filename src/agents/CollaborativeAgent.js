// Collaborative Agent - Enables multi-agent discussion and consensus
import { BaseAgent } from "./BaseAgent.js";

export class CollaborativeAgent extends BaseAgent {
  constructor(name, description, domain = "collaborative") {
    super(name, description, domain);
    this.participants = [];
    this.consensusThreshold = 0.6;
  }

  async collaborate(participants, topic, options = {}) {
    const contributions = [];
    
    for (const agent of participants) {
      try {
        const contribution = await agent.execute(topic, options);
        contributions.push({
          agent: agent.name,
          contribution
        });
      } catch (err) {
        console.error(`Agent ${agent.name} failed:`, err);
      }
    }

    return this.synthesize(contributions, topic);
  }

  synthesize(contributions, topic) {
    return {
      topic,
      contributions,
      consensus: this._findConsensus(contributions),
      summary: this._generateSummary(contributions)
    };
  }

  _findConsensus(contributions) {
    const themes = new Map();
    
    for (const { contribution } of contributions) {
      if (contribution?.themes) {
        for (const theme of contribution.themes) {
          themes.set(theme, (themes.get(theme) || 0) + 1);
        }
      }
    }

    const total = contributions.length;
    const consensusThemes = [];
    
    for (const [theme, count] of themes) {
      if (count / total >= this.consensusThreshold) {
        consensusThemes.push(theme);
      }
    }

    return consensusThemes;
  }

  _generateSummary(contributions) {
    const points = contributions.map(c => c.contribution?.summary).filter(Boolean);
    return points.join("\n\n");
  }
}
