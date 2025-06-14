import * as vscode from "vscode";
import {
  IConfluenceParameters,
  ConfluenceSearchResponse,
  ConfluenceConfig,
} from "./types";

export class ConfluenceTool
  implements vscode.LanguageModelTool<IConfluenceParameters>
{
  private getConfluenceConfig(): ConfluenceConfig | null {
    const config = vscode.workspace.getConfiguration(
      "atlassianChatTool.confluence"
    );
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

  private extractKeywords(text: string): string[] {
    // Remove common stop words and extract meaningful keywords
    const stopWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "could",
      "should",
      "may",
      "might",
      "must",
      "can",
      "this",
      "that",
      "these",
      "those",
      "i",
      "you",
      "he",
      "she",
      "it",
      "we",
      "they",
      "me",
      "him",
      "her",
      "us",
      "them",
      "my",
      "your",
      "his",
      "her",
      "its",
      "our",
      "their",
      "about",
      "above",
      "after",
      "again",
      "all",
      "any",
      "because",
      "before",
      "below",
      "between",
      "both",
      "each",
      "few",
      "from",
      "into",
      "more",
      "most",
      "other",
      "same",
      "some",
      "such",
      "than",
      "too",
      "very",
      "what",
      "where",
      "when",
      "why",
      "how",
    ]);

    // Extract words, clean them, and filter out stop words
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word))
      .filter((word) => !/^\d+$/.test(word)); // Remove pure numbers

    // Remove duplicates and sort by length (longer words first)
    const uniqueWords = [...new Set(words)].sort((a, b) => b.length - a.length);

    // Return top 15 keywords
    return uniqueWords.slice(0, 15);
  }

  private buildSmartSearchQuery(content: string, context?: string): string[] {
    const queries: string[] = [];

    // Extract keywords from main content
    const contentKeywords = this.extractKeywords(content);

    // Extract keywords from context if provided
    const contextKeywords = context ? this.extractKeywords(context) : [];

    // Combine and prioritize keywords
    const allKeywords = [...contentKeywords, ...contextKeywords];

    // Create multiple search strategies
    if (contentKeywords.length > 0) {
      // Strategy 1: Search for exact phrases (quoted strings)
      const phrases = content.match(/"([^"]+)"/g);
      if (phrases) {
        phrases.forEach((phrase) => {
          queries.push(`text ~ ${phrase}`);
        });
      }

      // Strategy 2: Search for key terms in title
      const topKeywords = contentKeywords.slice(0, 5);
      if (topKeywords.length > 0) {
        queries.push(`title ~ "${topKeywords.join('" OR title ~ "')}""`);
      }

      // Strategy 3: Search for combinations of keywords in content
      const keywordCombinations = this.createKeywordCombinations(
        contentKeywords.slice(0, 8)
      );
      keywordCombinations.forEach((combo) => {
        queries.push(`text ~ "${combo}"`);
      });

      // Strategy 4: Individual keyword search
      topKeywords.forEach((keyword) => {
        queries.push(`text ~ "${keyword}"`);
      });
    }

    return queries;
  }

  private createKeywordCombinations(keywords: string[]): string[] {
    const combinations: string[] = [];

    // Create pairs and triplets of keywords
    for (let i = 0; i < keywords.length - 1; i++) {
      for (let j = i + 1; j < keywords.length; j++) {
        combinations.push(`${keywords[i]} ${keywords[j]}`);

        // Add triplets for the first few keywords
        if (i < 3 && j < 4) {
          for (let k = j + 1; k < Math.min(keywords.length, 5); k++) {
            combinations.push(`${keywords[i]} ${keywords[j]} ${keywords[k]}`);
          }
        }
      }
    }

    return combinations.slice(0, 10); // Limit combinations
  }

  private async performSmartSearch(
    config: ConfluenceConfig,
    queries: string[],
    spaceKey?: string,
    limit: number = 10
  ): Promise<ConfluenceSearchResponse> {
    const baseUrl = config.baseUrl.replace(/\/$/, "");
    const allResults: any[] = [];
    const seenIds = new Set<string>();

    // Execute multiple search strategies
    for (const query of queries) {
      try {
        let cqlQuery = `(${query}) AND type = page`;
        if (spaceKey) {
          cqlQuery += ` AND space = "${spaceKey}"`;
        }

        const params = new URLSearchParams({
          cql: cqlQuery,
          limit: Math.min(limit, 25).toString(),
          expand: "space,history.lastUpdated,excerpt,body.view",
        });

        const url = `${baseUrl}/rest/api/content/search?${params}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: this.getAuthHeader(config.email, config.apiToken),
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = (await response.json()) as ConfluenceSearchResponse;
          if (data.results) {
            // Add unique results
            data.results.forEach((result) => {
              if (!seenIds.has(result.id)) {
                seenIds.add(result.id);
                allResults.push(result);
              }
            });
          }
        }
      } catch (error) {
        console.warn(`Search query failed: ${query}`, error);
      }

      // Stop if we have enough results
      if (allResults.length >= limit) {
        break;
      }
    }

    // Sort results by relevance (this is a simple heuristic)
    allResults.sort((a, b) => {
      // Prioritize pages with more recent updates
      const aDate = new Date(a.history?.lastUpdated?.when || 0);
      const bDate = new Date(b.history?.lastUpdated?.when || 0);
      return bDate.getTime() - aDate.getTime();
    });

    return {
      results: allResults.slice(0, limit),
      size: allResults.length,
      limit: limit,
      start: 0,
    };
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim();
  }

  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IConfluenceParameters>,
    _token: vscode.CancellationToken
  ) {
    const params = options.input;
    const content = params.content.trim();
    const limit = params.limit ?? 10;
    const includeContent = params.includeContent ?? true;

    try {
      // Get Confluence configuration
      const config = this.getConfluenceConfig();
      if (!config) {
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(
            JSON.stringify(
              {
                error:
                  "Confluence configuration is incomplete. Please configure your Confluence base URL, email, and API token in VS Code settings.",
                requiredSettings: [
                  "atlassianChatTool.confluence.baseUrl",
                  "atlassianChatTool.confluence.email",
                  "atlassianChatTool.confluence.apiToken",
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

      // Build smart search queries
      const searchQueries = this.buildSmartSearchQuery(content, params.context);

      if (searchQueries.length === 0) {
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(
            JSON.stringify(
              {
                message:
                  "Could not extract meaningful search terms from the provided content.",
                content: content,
                suggestion:
                  "Try providing more specific keywords or technical terms.",
              },
              null,
              2
            )
          ),
        ]);
      }

      // Perform smart search
      const searchResults = await this.performSmartSearch(
        config,
        searchQueries,
        params.spaceKey,
        limit
      );

      if (!searchResults || searchResults.results.length === 0) {
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(
            JSON.stringify(
              {
                message:
                  "No relevant pages found based on the provided content.",
                extractedKeywords: this.extractKeywords(content),
                searchQueries: searchQueries,
                suggestion:
                  "Try different keywords or check if you have access to the relevant Confluence spaces.",
              },
              null,
              2
            )
          ),
        ]);
      }

      // Format the search results with content if requested
      const searchReport = {
        query: content.substring(0, 100) + (content.length > 100 ? "..." : ""),
        extractedKeywords: this.extractKeywords(content),
        searchStrategies: searchQueries.length,
        resultsCount: searchResults.results.length,
        pages: searchResults.results.map((page) => {
          const result: any = {
            id: page.id,
            title: page.title,
            space: page.space
              ? {
                  key: page.space.key,
                  name: page.space.name,
                }
              : null,
            lastUpdated: page.history?.lastUpdated
              ? {
                  when: this.formatDate(page.history.lastUpdated.when),
                  by: page.history.lastUpdated.by.displayName,
                }
              : null,
            url: page._links?.webui
              ? `${config.baseUrl}${page._links.webui}`
              : null,
            excerpt: page.excerpt || "No excerpt available",
          };

          // Include content if requested and available
          if (includeContent && page.body?.view?.value) {
            const plainTextContent = this.stripHtml(page.body.view.value);
            result.content = {
              plain:
                plainTextContent.substring(0, 1500) +
                (plainTextContent.length > 1500 ? "..." : ""),
              fullLength: plainTextContent.length,
            };
          }

          return result;
        }),
        summary_text: `Found ${
          searchResults.results.length
        } relevant page(s) based on your content${
          params.spaceKey ? ` in space ${params.spaceKey}` : ""
        }`,
      };

      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(JSON.stringify(searchReport, null, 2)),
      ]);
    } catch (error) {
      console.error("Confluence tool error:", error);
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(
          JSON.stringify(
            {
              error: `An error occurred while searching Confluence: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
              content: content,
            },
            null,
            2
          )
        ),
      ]);
    }
  }

  async prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<IConfluenceParameters>,
    _token: vscode.CancellationToken
  ) {
    const contentPreview =
      options.input.content.substring(0, 100) +
      (options.input.content.length > 100 ? "..." : "");

    const confirmationMessages = {
      title: "Search Confluence",
      message: new vscode.MarkdownString(
        `Search Confluence for content related to: **"${contentPreview}"**${
          options.input.spaceKey
            ? ` in space **${options.input.spaceKey}**`
            : ""
        }?`
      ),
    };
    return {
      invocationMessage: `Searching Confluence intelligently...`,
      confirmationMessages,
    };
  }
}
