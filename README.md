# Atlassian Chat Tool

VS Code extension that integrates Jira and Confluence with GitHub Copilot Chat for seamless issue management and content search.

## Features

- **Jira Integration**: Get issue details, status, assignee, and direct links
- **Confluence Search**: Intelligent content discovery with natural language queries
- **Unified Interface**: Access both tools through GitHub Copilot Chat

## Setup

### 1. Configure Atlassian Connection

Add to VS Code settings:

```json
{
  "atlassianChatTool.baseUrl": "https://yourcompany.atlassian.net",
  "atlassianChatTool.email": "your.email@company.com",
  "atlassianChatTool.apiToken": "your-api-token"
}
```

### 2. Get API Token

1. Visit [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Create token → Copy to configuration

## Usage

### Jira

```
@workspace /jira Get details for issue PROJ-123
@workspace What's the status of TASK-456?
```

### Confluence

```
@workspace @confluence Search for API documentation
@workspace @confluence Find troubleshooting guides in DEV space
```

## Tools

- **`@jira`**: Get Jira issue details by key
- **`@confluence`**: Search Confluence with options for space, limit (1-25), and content inclusion

## Troubleshooting

- **Configuration errors**: Verify all settings and API token validity
- **Access issues**: Check permissions for Jira projects/Confluence spaces
- **Auth errors**: Regenerate API token, confirm email matches Atlassian account

## Requirements

- VS Code 1.95.0+
- Atlassian account with API access
- Network access to your Atlassian instance
