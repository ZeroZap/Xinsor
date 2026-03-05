// Base Skill - Foundation for all XinSor skills
export class BaseSkill {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.options = {};
  }

  async run(input, options = {}) {
    throw new Error("run() must be implemented by subclass");
  }

  setOption(key, value) {
    this.options[key] = value;
  }

  getOption(key, defaultValue = null) {
    return this.options[key] || defaultValue;
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description
    };
  }
}
