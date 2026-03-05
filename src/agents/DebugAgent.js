// Debug Agent - Debugging assistance
import { BaseAgent } from "./BaseAgent.js";

export class DebugAgent extends BaseAgent {
  constructor() {
    super("Debug", "Debugging assistance and issue resolution", "code-quality");
    this.capabilities = ["debug", "trace", "fix", "diagnose"];
  }

  async execute(issue, options = {}) {
    return {
      agent: this.name,
      diagnosis: {
        issue,
        possibleCauses: this._analyzeCauses(issue),
        suggestedFixes: this._suggestFixes(issue),
        debuggingSteps: [
          "1. Reproduce the issue consistently",
          "2. Check error logs and stack traces",
          "3. Isolate the failing component",
          "4. Add debug logging",
          "5. Test fix in isolation"
        ]
      },
      summary: `Analyzed issue: ${issue.substring(0, 50)}...`
    };
  }

  _analyzeCauses(issue) {
    const causes = [];
    const lower = issue.toLowerCase();
    
    if (lower.includes("null") || lower.includes("undefined")) {
      causes.push("Possible null/undefined reference");
    }
    if (lower.includes("timeout")) {
      causes.push("Network or async operation timeout");
    }
    if (lower.includes("memory")) {
      causes.push("Potential memory leak or exhaustion");
    }
    
    return causes.length > 0 ? causes : ["Requires manual investigation"];
  }

  _suggestFixes(issue) {
    return [
      "Add input validation",
      "Implement error boundaries",
      "Add retry logic for transient failures",
      "Review async/await handling"
    ];
  }
}
