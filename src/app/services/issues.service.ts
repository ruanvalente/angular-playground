import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Issue {
  id: string;
  number: number;
  title: string;
  body: string;
  html_url: string;
  created_at: string;
  user: {
    login: string;
    avatar_url: string | null;
  };
  state: 'open' | 'closed';
}

export interface IssuesResponse {
  items: Issue[];
  total_count: number;
}

@Injectable({
  providedIn: 'root',
})
export class IssuesService {
  getIssues(owner: string, repo: string, page = 1, perPage = 10): Observable<IssuesResponse> {
    const items: Issue[] = Array.from({ length: perPage }, (_, i) => ({
      id: crypto.randomUUID(),
      number: (page - 1) * perPage + i + 1,
      title: `Issue ${(page - 1) * perPage + i + 1}`,
      body: `Description for issue ${(page - 1) * perPage + i + 1}`,
      html_url: `https://github.com/${owner}/${repo}/issues/${(page - 1) * perPage + i + 1}`,
      created_at: new Date().toISOString(),
      user: {
        login: 'user',
        avatar_url: 'https://github.com/github.png',
      },
      state: 'open',
    }));

    return of({
      items,
      total_count: 100,
    }).pipe(delay(700));
  }

  getIssue(owner: string, repo: string, number: number): Observable<Issue> {
    const issue: Issue = {
      id: crypto.randomUUID(),
      number,
      title: `Issue ${number}`,
      body: `# Issue ${number}\n\nThis is a detailed description of issue ${number} with markdown support.\n\n## Features\n- Point 1\n- Point 2\n\n## Code Example\n\`\`\`typescript\nconsole.log("Hello from issue ${number}");\n\`\`\``,
      html_url: `https://github.com/${owner}/${repo}/issues/${number}`,
      created_at: new Date().toISOString(),
      user: {
        login: 'user',
        avatar_url: 'https://github.com/github.png',
      },
      state: 'open',
    };

    return of(issue).pipe(delay(700));
  }
}
