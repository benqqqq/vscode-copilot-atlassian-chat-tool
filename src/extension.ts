import * as vscode from "vscode";
import { JiraIssueTool } from "./jira/tool";
import { ConfluenceTool } from "./confluence/tool";

/**
 * Register all Atlassian tools (Jira and Confluence) with VS Code
 */
export function registerAtlassianTools(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.lm.registerTool("jira-tool_getIssue", new JiraIssueTool()),
    vscode.lm.registerTool("confluence-tool", new ConfluenceTool())
  );
}

/**
 * Extension activation function
 */
export function activate(context: vscode.ExtensionContext) {
  registerAtlassianTools(context);
  console.log("Atlassian Chat Tool extension activated successfully");
}

/**
 * Extension deactivation function
 */
export function deactivate() {
  console.log("Atlassian Chat Tool extension deactivated");
}
