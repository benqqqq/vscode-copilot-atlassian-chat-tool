export interface IConfluenceParameters {
  content: string;
  context?: string;
  spaceKey?: string;
  limit?: number;
  includeContent?: boolean;
}

export interface ConfluenceSearchResponse {
  results: Array<{
    id: string;
    type: string;
    status: string;
    title: string;
    space?: {
      key: string;
      name: string;
    };
    history?: {
      lastUpdated: {
        when: string;
        by: {
          displayName: string;
          email?: string;
        };
      };
    };
    _links?: {
      webui?: string;
    };
    excerpt?: string;
    body?: {
      view?: {
        value: string;
      };
    };
  }>;
  size: number;
  limit: number;
  start: number;
}

export interface ConfluenceConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
}
