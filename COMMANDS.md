# Extension Control Commands

This document provides a simple guide to managing your VS Code Atlassian Chat Tool extension using npm scripts.

## Quick Start

1. **Initial Setup:**

   ```bash
   npm run install-deps
   npm run config-set
   ```

2. **Development:**

   ```bash
   npm run dev          # Start watching for changes
   npm run build        # Build extension
   ```

3. **Testing:**

   ```bash
   npm run install-local  # Install extension locally (first time)
   npm run update-local   # Update locally installed extension
   ```

4. **Publishing:**
   ```bash
   npm run package       # Create .vsix file
   ```

## Available Commands

| Command                 | Description                                        |
| ----------------------- | -------------------------------------------------- |
| `npm run help`          | Show all available commands                        |
| `npm run install-deps`  | Install dependencies                               |
| `npm run update-deps`   | Update dependencies                                |
| `npm run build`         | Build extension                                    |
| `npm run package`       | Package extension for distribution                 |
| `npm run dev`           | Start development mode (watch for changes)         |
| `npm run clean`         | Clean build artifacts                              |
| `npm run config-check`  | Check current extension configuration              |
| `npm run config-set`    | Set up extension configuration interactively       |
| `npm run test`          | Run tests                                          |
| `npm run lint`          | Run linter                                         |
| `npm run lint:fix`      | Run linter with auto-fix                           |
| `npm run install-local` | Install extension locally for testing (first time) |
| `npm run update-local`  | Update locally installed extension                 |
| `npm run setup`         | Quick development setup (install + config)         |
| `npm run ci`            | Full CI pipeline (clean + install + build + test)  |

## Configuration Management

### Setting Up Extension Configuration

The extension requires Atlassian credentials to function properly:

1. **Interactive Setup (Recommended):**

   ```bash
   npm run config-set
   ```

   This will prompt you for:

   - Atlassian Base URL (e.g., `https://yourcompany.atlassian.net`)
   - Your email address
   - API token

2. **Manual Setup:**
   Create or edit `.vscode/settings.json`:

   ```json
   {
     "atlassianChatTool.baseUrl": "https://yourcompany.atlassian.net",
     "atlassianChatTool.email": "your-email@company.com",
     "atlassianChatTool.apiToken": "your-api-token"
   }
   ```

3. **Check Current Configuration:**
   ```bash
   npm run config-check
   ```

### Getting an API Token

1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Give it a descriptive label
4. Copy the token and use it in your configuration

⚠️ **Security Note:** Keep your API token secure and never commit it to version control.

## Development Workflow

### Basic Development Cycle

1. **Start Development:**

   ```bash
   npm run dev  # Starts TypeScript compiler in watch mode
   ```

2. **Test Changes:**

   - Open VS Code
   - Press `F5` to launch Extension Development Host
   - Test your extension in the new window

3. **Install Locally for Testing:**
   ```bash
   npm run install-local  # First time installation
   npm run update-local   # Update existing installation
   ```
   Then restart VS Code to see changes.

### Advanced Development

1. **Lint Code:**

   ```bash
   npm run lint
   npm run lint:fix  # Auto-fix issues
   ```

2. **Build and Test:**

   ```bash
   npm run build
   npm run test
   ```

3. **Clean Start:**
   ```bash
   npm run clean
   npm run install-deps
   npm run build
   ```

## Packaging and Distribution

### Create Extension Package

```bash
npm run package
```

This will:

1. Build the extension
2. Install `@vscode/vsce` if needed
3. Create a `.vsix` file
4. Show the generated file name

### Install Packaged Extension

After packaging, you can install the extension:

```bash
npm run install-local
```

### Publish to Marketplace

1. **Get a Personal Access Token:**

   - Go to [Azure DevOps](https://dev.azure.com/)
   - Create a PAT with "Marketplace" scope

2. **Login to vsce:**

   ```bash
   npx vsce login your-publisher-name
   ```

3. **Publish:**
   ```bash
   npx vsce publish
   ```

## Troubleshooting

### Common Issues

1. **"vsce command not found":**

   ```bash
   npm install -g @vscode/vsce
   ```

2. **"Extension Host did not start in 10 seconds":**

   - Close VS Code completely
   - Run `npm run clean && npm run build`
   - Try again

3. **Configuration not working:**

   ```bash
   npm run config-check  # Check current settings
   npm run config-set    # Reconfigure
   ```

4. **Build errors:**
   ```bash
   npm run clean
   npm run install-deps
   npm run build
   ```

### Debug Mode

To debug the extension:

1. Open the project in VS Code
2. Set breakpoints in your TypeScript code
3. Press `F5` to launch Extension Development Host
4. The debugger will attach automatically

### Logs and Output

- Extension logs: VS Code Output panel → "Atlassian Chat Tool"
- Development logs: VS Code Developer Tools (Help → Toggle Developer Tools)

## Tips and Best Practices

1. **Use `npm run dev` during development** for automatic rebuilds
2. **Test with `npm run install-local` (or `npm run update-local`)** before publishing
3. **Keep your API token secure** - `.vscode/settings.json` is already in `.gitignore`
4. **Use `npm run ci`** to run the full pipeline before committing
5. **Check configuration** with `npm run config-check` if things aren't working

## Need Help?

Run `npm run help` to see all available commands with descriptions.
