// Skill Registry - Manages all XinSor skills
import { GitSkill } from "./GitSkill.js";
import { FormatSkill } from "./FormatSkill.js";
import { SearchSkill } from "./SearchSkill.js";
import { LinkSkill } from "./LinkSkill.js";
import { ProtocolSkill } from "./ProtocolSkill.js";
import { HALGeneratorSkill } from "./HALGeneratorSkill.js";
import { EmbeddedBuildSkill } from "./EmbeddedBuildSkill.js";
import { CryptoSkill } from "./CryptoSkill.js";

export class SkillRegistry {
  constructor() {
    this.skills = new Map();
    this.registerDefaults();
  }

  registerDefaults() {
    this.register(new GitSkill());
    this.register(new FormatSkill());
    this.register(new SearchSkill());
    this.register(new LinkSkill());
    this.register(new ProtocolSkill());
    this.register(new HALGeneratorSkill());
    this.register(new EmbeddedBuildSkill());
    this.register(new CryptoSkill());
  }

  register(skill) {
    this.skills.set(skill.name, skill);
    console.log(`✅ Registered skill: ${skill.name}`);
  }

  get(name) {
    return this.skills.get(name);
  }

  list() {
    return Array.from(this.skills.values()).map(s => ({
      name: s.name,
      description: s.description
    }));
  }
}
