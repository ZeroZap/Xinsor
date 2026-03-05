// Template Agent - Structured template generation
import { BaseAgent } from "./BaseAgent.js";

export class TemplateAgent extends BaseAgent {
  constructor() {
    super("Template", "Structured templates for common patterns", "utility");
    this.capabilities = ["template", "scaffold", "boilerplate", "generate"];
    this.templates = new Map();
    this._initTemplates();
  }

  _initTemplates() {
    this.templates.set("component", this._componentTemplate());
    this.templates.set("agent", this._agentTemplate());
    this.templates.set("skill", this._skillTemplate());
    this.templates.set("test", this._testTemplate());
  }

  async execute(templateName, options = {}) {
    const template = this.templates.get(templateName);
    
    if (!template) {
      return {
        agent: this.name,
        error: `Template "${templateName}" not found`,
        available: Array.from(this.templates.keys())
      };
    }

    return {
      agent: this.name,
      template: templateName,
      content: this._render(template, options),
      summary: `Generated ${templateName} template`
    };
  }

  _render(template, options) {
    let content = template;
    for (const [key, value] of Object.entries(options)) {
      content = content.replace(new RegExp(`\\{${key}\\}`, "g"), value);
    }
    return content;
  }

  _componentTemplate() {
    return `// {name} Component
export class {name} {
  constructor(options = {}) {
    this.options = options;
  }

  async execute(input) {
    // Implementation here
    return { result: input };
  }
}
`;
  }

  _agentTemplate() {
    return `// {name} Agent
import { BaseAgent } from "./BaseAgent.js";

export class {name} extends BaseAgent {
  constructor() {
    super("{name}", "{description}", "{domain}");
    this.capabilities = {capabilities};
  }

  async execute(input, options = {}) {
    // Implementation here
    return { agent: this.name, result: input };
  }
}
`;
  }

  _skillTemplate() {
    return `// {name} Skill
import { BaseSkill } from "./BaseSkill.js";

export class {name} extends BaseSkill {
  constructor() {
    super("{skillName}", "{description}");
  }

  async run(input, options = {}) {
    // Implementation here
    return { skill: this.name, result: input };
  }
}
`;
  }

  _testTemplate() {
    return `// {name} Tests
import { {className} } from "../src/{fileName}.js";

describe("{name}", () => {
  let instance;

  beforeEach(() => {
    instance = new {className}();
  });

  test("should initialize correctly", () => {
    expect(instance).toBeDefined();
  });

  test("should execute successfully", async () => {
    const result = await instance.execute("test");
    expect(result).toBeDefined();
  });
});
`;
  }
}
