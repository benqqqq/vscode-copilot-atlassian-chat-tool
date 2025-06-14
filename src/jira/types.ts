export interface IJiraIssueParameters {
  issueKey: string;
}

export interface JiraIssueResponse {
  key: string;
  fields: {
    summary: string;
    description?: string;
    status: {
      name: string;
      statusCategory?: {
        name: string;
      };
    };
    priority?: {
      name: string;
    };
    issuetype: {
      name: string;
      iconUrl?: string;
    };
    assignee?: {
      displayName: string;
      emailAddress: string;
    };
    reporter?: {
      displayName: string;
      emailAddress: string;
    };
    created: string;
    updated: string;
    project: {
      key: string;
      name: string;
    };
    labels?: string[];
    components?: Array<{
      name: string;
    }>;
    fixVersions?: Array<{
      name: string;
    }>;
  };
}

export interface JiraConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
}
