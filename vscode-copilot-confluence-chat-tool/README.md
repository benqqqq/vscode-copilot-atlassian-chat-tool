# Confluence Chat Tool for VS Code

An intelligent Confluence integration for VS Code Copilot Chat that makes finding and accessing Confluence content effortless. No more struggling with exact page titles or space keys!

## Features

### 🧠 Intelligent Search (`#confluence`)

This tool understands natural language and context:

- **Feed it anything**: Paste a paragraph, describe your problem, or reference chat history
- **Intelligent keyword extraction**: Automatically finds the most relevant terms
- **Multiple search strategies**: Uses various approaches to find the best matches
- **Content included**: Returns page content snippets, not just titles
- **Context-aware**: Can use chat history to understand what you're looking for

## Usage Examples

```
#confluence I'm working on implementing OAuth authentication in our React application. The login flow keeps failing and I think there might be some configuration issues with our identity provider setup.
```

```
#confluence We discussed API rate limiting yesterday. Find documentation about our rate limiting policies and implementation guidelines.
```

```
#confluence database migration procedures postgres production environment
```

## Setup

1. Install the extension
2. Configure your Confluence settings in VS Code:
   - `confluenceChatTool.baseUrl`: Your Confluence URL (e.g., `https://yourcompany.atlassian.net/wiki`)
   - `confluenceChatTool.email`: Your Atlassian account email
   - `confluenceChatTool.apiToken`: Generate at [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)

## How It Works

1. **Keyword Extraction**: Removes stop words, identifies key terms
2. **Multiple Query Strategies**:
   - Exact phrase matching
   - Title keyword search
   - Content keyword combinations
   - Individual keyword searches
3. **Result Aggregation**: Combines results from multiple strategies
4. **Relevance Sorting**: Orders by recency and relevance
5. **Content Inclusion**: Provides page content snippets for immediate use

## Tips for Best Results

- Be descriptive about your problem or topic
- Include relevant technical terms
- Reference previous conversations when relevant
- Use the `context` parameter for additional background information

## Troubleshooting

- **No results found**: Try different keywords or check your Confluence permissions
- **Configuration errors**: Verify your base URL, email, and API token
- **Rate limiting**: The tool respects Confluence API limits and will warn you if exceeded

---

Transform your Confluence experience - just describe what you need!
