// Link Skill - Obsidian link generator
import { BaseSkill } from "./BaseSkill.js";

export class LinkSkill extends BaseSkill {
  constructor() {
    super("link", "Generate Obsidian-style wiki links");
  }

  async run(input, options = {}) {
    const format = options.format || "obsidian";
    
    return {
      skill: this.name,
      action: "link",
      input,
      output: {
        wikiLink: `[[${input}]]`,
        markdownLink: `[${input}](./${this._slugify(input)}.md)`,
        fullPath: options.base ? `${options.base}/${input}.md` : `./${input}.md`
      },
      format
    };
  }

  _slugify(text) {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }

  async generateBacklink(source, target) {
    return {
      skill: this.name,
      action: "backlink",
      source,
      target,
      backlink: `See also: [[${source}]]`
    };
  }

  async generateIndex(items, title = "Index") {
    const links = items.map(item => `- [[${item}]]`).join("\n");
    
    return {
      skill: this.name,
      action: "index",
      title,
      content: `# ${title}\n\n${links}`
    };
  }
}
