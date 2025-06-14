# Atlassian Chat Tool

A unified VS Code extension that provides intelligent Jira and Confluence integration for GitHub Copilot Chat. This extension combines both Jira issue management and Confluence content search capabilities in a single tool.

## Features

### 🎯 Jira Integration

- **Get Issue Details**: Retrieve comprehensive information about Jira issues by key
- **Rich Issue Data**: Access issue summary, description, status, priority, assignee, reporter, and more
- **Direct Links**: Get direct links to issues in your Jira instance

### 🔍 Confluence Integration

- **Intelligent Search**: Smart content discovery using natural language processing
- **Keyword Extraction**: Automatically extract relevant keywords from your queries
- **Context-Aware**: Use chat context and related information for better search results
- **Multiple Search Strategies**: Combines exact phrases, keyword combinations, and title searches
- **Content Preview**: Optional inclusion of page content in search results

## Installation

1. Install the extension from VS Code Marketplace (when published)
2. Or install from VSIX: `code --install-extension atlassian-chat-tool-0.0.1.vsix`

## Configuration

### Jira Configuration

Set up your Jira connection in VS Code settings:

```json
{
  "atlassianChatTool.jira.baseUrl": "https://yourcompany.atlassian.net",
  "atlassianChatTool.jira.email": "your.email@company.com",
  "atlassianChatTool.jira.apiToken": "your-api-token"
}
```

### Confluence Configuration

Set up your Confluence connection in VS Code settings:

```json
{
  "atlassianChatTool.confluence.baseUrl": "https://yourcompany.atlassian.net/wiki",
  "atlassianChatTool.confluence.email": "your.email@company.com",
  "atlassianChatTool.confluence.apiToken": "your-api-token"
}
```

### Getting API Tokens

1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Give it a descriptive name (e.g., "VS Code Extension")
4. Copy the generated token and use it in your configuration

## Usage

### Using with GitHub Copilot Chat

#### Jira Operations

```
@workspace /jira Get details for issue PROJ-123
@workspace Tell me about the status of TASK-456
@workspace What's the priority of BUG-789?
```

#### Confluence Operations

```
@workspace @confluence Search for documentation about authentication
@workspace @confluence Find pages related to API integration best practices
@workspace @confluence Look for troubleshooting guides in the DEV space
```

### Available Tools

#### `@jira` - Jira Issue Tool

- **Purpose**: Get detailed information about Jira issues
- **Input**: Issue key (e.g., "PROJ-123", "TASK-456")
- **Output**: Comprehensive issue details including status, assignee, description, etc.

#### `@confluence` - Confluence Search Tool

- **Purpose**: Intelligently search Confluence content
- **Input**:
  - `content`: Search query, paragraph, or keywords
  - `context`: Optional additional context
  - `spaceKey`: Optional space limitation
  - `limit`: Maximum results (1-25, default: 10)
  - `includeContent`: Include page content in results (default: true)
- **Output**: Relevant pages with metadata and optional content preview

## Examples

### Jira Examples

```
Get issue PROJ-123
What's the status of TASK-456?
Show me details for BUG-789
```

### Confluence Examples

```
Find documentation about REST API implementation
Search for pages about deployment procedures
Look for troubleshooting guides related to database connection issues
Find pages in the DEVOPS space about monitoring setup
```

## Features in Detail

### Smart Confluence Search

The extension uses advanced search strategies:

1. **Keyword Extraction**: Automatically identifies meaningful terms from your query
2. **Multiple Search Approaches**:
   - Exact phrase matching
   - Title searches
   - Keyword combinations
   - Individual keyword searches
3. **Result Deduplication**: Prevents duplicate results across different search strategies
4. **Relevance Sorting**: Orders results by recency and relevance

### Comprehensive Jira Information

For each Jira issue, the tool provides:

- Issue key, summary, and description
- Current status and status category
- Priority and issue type
- Assignee and reporter information
- Project details
- Created and updated timestamps
- Labels, components, and fix versions
- Direct browser link to the issue

## Troubleshooting

### Common Issues

1. **"Configuration is incomplete"**

   - Ensure all required settings are configured
   - Verify your API token is valid and has necessary permissions

2. **"Issue not found" or "No pages found"**

   - Check if you have access to the specified Jira project or Confluence space
   - Verify the issue key format or search terms

3. **Authentication errors**
   - Regenerate your API token
   - Ensure your email matches your Atlassian account

### Debugging

Enable VS Code Developer Tools (Help > Toggle Developer Tools) to see detailed error logs in the console.

## Development

### Building from Source

```bash
npm install
npm run compile
```

### Package Extension

```bash
vsce package
```

## Requirements

- VS Code 1.95.0 or higher
- Valid Atlassian (Jira/Confluence) account with API access
- Network access to your Atlassian instance

## License

This extension is provided as-is for educational and development purposes.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
