import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

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
  private readonly baseUrl = environment.github.baseUrl;
  private readonly http = inject(HttpClient);

  getIssues(owner: string, repo: string, page = 1, perPage = 10): Observable<IssuesResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString())
      .set('state', 'all');

    return this.http.get<Issue[]>(`${this.baseUrl}/repos/${owner}/${repo}/issues`, { params }).pipe(
      map((issues) => ({
        items: issues.map((issue) => ({
          ...issue,
          id: issue.id.toString(),
        })),
        total_count: issues.length,
      }))
    );
  }

  getIssue(owner: string, repo: string, number: number): Observable<Issue> {
    return this.http.get<Issue>(`${this.baseUrl}/repos/${owner}/${repo}/issues/${number}`).pipe(
      map((issue) => ({
        ...issue,
        id: issue.id.toString(),
      }))
    );
  }
}
