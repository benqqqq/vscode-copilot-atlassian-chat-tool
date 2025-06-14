import * as vscode from "vscode";
import { IJiraIssueParameters, JiraIssueResponse, JiraConfig } from "./types";

export class JiraIssueTool
  implements vscode.LanguageModelTool<IJiraIssueParameters>
{
  private getJiraConfig(): JiraConfig | null {
    const config = vscode.workspace.getConfiguration("atlassianChatTool");
    const baseUrl = config.get<string>("baseUrl");
    const email = config.get<string>("email");
    const apiToken = config.get<string>("apiToken");

    if (!baseUrl || !email || !apiToken) {
      return null;
    }

    return { baseUrl, email, apiToken };
  }

  private getAuthHeader(email: string, apiToken: string): string {
    const auth = Buffer.from(`${email}:${apiToken}`).toString("base64");
    return `Basic ${auth}`;
  }

  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  }

  private async fetchJiraIssue(
    config: JiraConfig,
    issueKey: string
  ): Promise<JiraIssueResponse | null> {
    try {
      // Ensure baseUrl doesn't end with slash
      const baseUrl = config.baseUrl.replace(/\/$/, "");
      const url = `${baseUrl}/rest/api/3/issue/${issueKey}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: this.getAuthHeader(config.email, config.apiToken),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Issue not found
        }
        throw new Error(
          `Jira API error: ${response.status} ${response.statusText}`
        );
      }

      const data = (await response.json()) as JiraIssueResponse;
      return data;
    } catch (error) {
      console.error("Jira API error:", error);
      throw error;
    }
  }

  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IJiraIssueParameters>,
    _token: vscode.CancellationToken
  ) {
    const params = options.input;
    const issueKey = params.issueKey.trim().toUpperCase();

    try {
      // Get Jira configuration
      const config = this.getJiraConfig();
      if (!config) {
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(
            JSON.stringify(
              {
                error:
                  "Atlassian configuration is incomplete. Please configure your Atlassian base URL, email, and API token in VS Code settings.",
                requiredSettings: [
                  "atlassianChatTool.baseUrl",
                  "atlassianChatTool.email",
                  "atlassianChatTool.apiToken",
                ],
                helpUrl:
                  "https://id.atlassian.com/manage-profile/security/api-tokens",
              },
              null,
              2
            )
          ),
        ]);
      }

      // Fetch issue data from Jira
      const issueData = await this.fetchJiraIssue(config, issueKey);
      if (!issueData) {
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(
            JSON.stringify(
              {
                error: `Issue "${issueKey}" not found. Please check the issue key and try again.`,
                issueKey: issueKey,
              },
              null,
              2
            )
          ),
        ]);
      }

      // Format the issue data for response
      const issueReport = {
        key: issueData.key,
        summary: issueData.fields.summary,
        description: issueData.fields.description || "No description provided",
        status: issueData.fields.status.name,
        statusCategory:
          issueData.fields.status.statusCategory?.name || "Unknown",
        priority: issueData.fields.priority?.name || "Not set",
        issueType: issueData.fields.issuetype.name,
        assignee: issueData.fields.assignee
          ? `${issueData.fields.assignee.displayName} (${issueData.fields.assignee.emailAddress})`
          : "Unassigned",
        reporter: issueData.fields.reporter
          ? `${issueData.fields.reporter.displayName} (${issueData.fields.reporter.emailAddress})`
          : "Unknown",
        project: {
          key: issueData.fields.project.key,
          name: issueData.fields.project.name,
        },
        created: this.formatDate(issueData.fields.created),
        updated: this.formatDate(issueData.fields.updated),
        labels: issueData.fields.labels || [],
        components: issueData.fields.components?.map((c) => c.name) || [],
        fixVersions: issueData.fields.fixVersions?.map((v) => v.name) || [],
        url: `${config.baseUrl}/browse/${issueData.key}`,
        summary_text: `${issueData.key}: ${issueData.fields.summary} (Status: ${
          issueData.fields.status.name
        }, Priority: ${
          issueData.fields.priority?.name || "Not set"
        }, Assignee: ${
          issueData.fields.assignee?.displayName || "Unassigned"
        })`,
      };

      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(JSON.stringify(issueReport, null, 2)),
      ]);
    } catch (error) {
      console.error("Jira tool error:", error);
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(
          JSON.stringify(
            {
              error: `An error occurred while fetching Jira issue: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
              issueKey: issueKey,
            },
            null,
            2
          )
        ),
      ]);
    }
  }

  async prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<IJiraIssueParameters>,
    _token: vscode.CancellationToken
  ) {
    const confirmationMessages = {
      title: "Get Jira Issue Information",
      message: new vscode.MarkdownString(
        `Get detailed information for Jira issue **${options.input.issueKey}**?`
      ),
    };
    return {
      invocationMessage: `Fetching Jira issue details for ${options.input.issueKey}...`,
      confirmationMessages,
    };
  }
}
