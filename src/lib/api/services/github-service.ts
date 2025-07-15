interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  company: string;
  blog: string;
  twitter_username: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
}

interface GitHubApiError {
  message: string;
  status: number;
}

class GitHubService {
  private baseUrl = 'https://api.github.com';
  private headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Budokan-Team-Portfolio',
  };

  async getUser(username: string): Promise<GitHubUser | null> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${username}`, {
        headers: this.headers,
        next: {
          revalidate: 3600, // Cache for 1 hour
          tags: [`github-user-${username}`],
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`GitHub user not found: ${username}`);
          return null;
        }
        if (response.status === 403) {
          console.warn(`GitHub API rate limit exceeded for user: ${username}`);
          return null;
        }
        throw new Error(
          `GitHub API error: ${response.status} ${response.statusText}`
        );
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error(`Error fetching GitHub user ${username}:`, error);
      return null;
    }
  }

  async getUserRepos(
    username: string,
    limit: number = 6
  ): Promise<GitHubRepo[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/users/${username}/repos?sort=updated&per_page=${limit}`,
        {
          headers: this.headers,
          next: {
            revalidate: 1800, // Cache for 30 minutes (repos update more frequently)
            tags: [`github-repos-${username}`],
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`GitHub repos not found for user: ${username}`);
          return [];
        }
        if (response.status === 403) {
          console.warn(`GitHub API rate limit exceeded for repos: ${username}`);
          return [];
        }
        throw new Error(
          `GitHub API error: ${response.status} ${response.statusText}`
        );
      }

      const repos = await response.json();
      return repos;
    } catch (error) {
      console.error(`Error fetching repos for ${username}:`, error);
      return [];
    }
  }

  async getUserContributions(
    username: string
  ): Promise<{ total: number } | null> {
    try {
      // This would require GitHub GraphQL API for contributions
      // For now, we'll return null and use other metrics
      return null;
    } catch (error) {
      console.error(`Error fetching contributions for ${username}:`, error);
      return null;
    }
  }

  // Method to check API rate limits
  async checkRateLimit(): Promise<{ remaining: number; reset: number } | null> {
    try {
      const response = await fetch(`${this.baseUrl}/rate_limit`, {
        headers: this.headers,
        next: { revalidate: 0 }, // Don't cache rate limit checks
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return {
        remaining: data.rate.remaining,
        reset: data.rate.reset,
      };
    } catch (error) {
      console.error('Error checking GitHub rate limit:', error);
      return null;
    }
  }

  // Batch fetch users for better performance
  async batchGetUsers(usernames: string[]): Promise<(GitHubUser | null)[]> {
    const batchSize = 10; // GitHub API can handle concurrent requests
    const batches = [];

    for (let i = 0; i < usernames.length; i += batchSize) {
      batches.push(usernames.slice(i, i + batchSize));
    }

    const results: (GitHubUser | null)[] = [];

    for (const batch of batches) {
      const promises = batch.map((username) => this.getUser(username));
      const batchResults = await Promise.all(promises);
      results.push(...batchResults);
    }

    return results;
  }
}

export const githubService = new GitHubService();
export type { GitHubApiError, GitHubRepo, GitHubUser };
