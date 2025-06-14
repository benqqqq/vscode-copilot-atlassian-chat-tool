# VSCode Copilot Jira Chat Tool

A VS Code extension that adds a `jira` tool for Copilot Chat, letting you query Jira issue details by issue key.

## Features

- **Copilot Integration**: Ask Copilot about Jira issues using issue keys (e.g., "Get details for PROJ-123").
- **User Confirmation**: Confirms before fetching issue data from your Jira instance.
- **Comprehensive Data**: Returns issue summary, description, status, priority, assignee, and more.
- **Flexible Input**: Supports various issue key formats (case-insensitive).
- **Prompt Reference**: Use `#jira` in prompts.

## Prerequisites

You'll need:

1. A Jira Cloud instance (Atlassian Cloud)
2. A Jira API token ([create one here](https://id.atlassian.com/manage-profile/security/api-tokens))
3. Your Jira account email

## Setup

1. **Install the extension**
2. **Configure settings** in VS Code:
   - Open Settings (Cmd/Ctrl + ,)
   - Search for "Jira Chat Tool"
   - Set the following:
     - **Base URL**: Your Jira instance URL (e.g., `https://yourcompany.atlassian.net`)
     - **Email**: Your Jira account email
     - **API Token**: Your Jira API token

### Creating a Jira API Token

1. Go to [Atlassian Account Security](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Give it a label (e.g., "VS Code Copilot")
4. Copy the token and paste it in VS Code settings

## How It Works

1. Ask Copilot: "Get details for PROJ-123" or "What's the status of TASK-456?"
2. Copilot uses the Jira tool and shows a confirmation dialog.
3. Issue information is fetched from your Jira instance.
4. Follow-up questions about the issue are supported.

## Quick Start

```bash
npm install
npm run compile
# Open in VS Code and press F5 to run
```

## Example Usage

```
User: Get details for PROJ-123
Copilot: PROJ-123: Fix login bug (Status: In Progress, Priority: High, Assignee: John Doe)

User: What's the description?
Copilot: The description is: "Users unable to login after recent deployment..."

User: Who's the reporter?
Copilot: The issue was reported by Jane Smith (jane.smith@company.com)
```

## Issue Data Returned

The tool returns comprehensive issue information including:

- **Basic Info**: Key, summary, description
- **Status**: Current status and status category
- **Assignment**: Assignee and reporter details
- **Metadata**: Priority, issue type, project
- **Timestamps**: Created and updated dates
- **Organization**: Labels, components, fix versions
- **Direct Link**: URL to view the issue in Jira

## Configuration Settings

| Setting                 | Description             | Example                             |
| ----------------------- | ----------------------- | ----------------------------------- |
| `jiraChatTool.baseUrl`  | Your Jira instance URL  | `https://yourcompany.atlassian.net` |
| `jiraChatTool.email`    | Your Jira account email | `your.email@company.com`            |
| `jiraChatTool.apiToken` | Your Jira API token     | `ATATT3xFf...`                      |

## Security Notes

- API tokens are stored in VS Code settings
- Consider using workspace-specific settings for team projects
- Tokens have the same permissions as your Jira account
- Revoke unused tokens from your Atlassian account

## Troubleshooting

**"Jira configuration is incomplete"**

- Ensure all three settings are configured (baseUrl, email, apiToken)

**"Issue not found"**

- Verify the issue key exists and you have permission to view it
- Check that the issue key format is correct (e.g., PROJ-123)

**"Jira API error: 401"**

- Check your email and API token are correct
- Ensure the API token hasn't expired

**"Jira API error: 403"**

- You don't have permission to view this issue
- Contact your Jira administrator

## Implementation Notes

- Tool registered in `registerJiraTools()`
- Tool configuration in `package.json` under `languageModelTools`
- Uses Jira REST API v3
- Supports both Cloud and Server instances (with proper configuration)
