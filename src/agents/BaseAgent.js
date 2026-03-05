// Base Agent - Foundation for all XinSor agents
export class BaseAgent {
  constructor(name, description, domain = "general") {
    this.name = name;
    this.description = description;
    this.domain = domain;
    this.capabilities = [];
    this.state = {};
  }

  async execute(input, context = {}) {
    throw new Error("execute() must be implemented by subclass");
  }

  async initialize() {
    return Promise.resolve();
  }

  getState(key) {
    return this.state[key];
  }

  setState(key, value) {
    this.state[key] = value;
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description,
      domain: this.domain,
      capabilities: this.capabilities
    };
  }
}
