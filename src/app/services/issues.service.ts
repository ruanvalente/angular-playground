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

  getIssues(
    owner: string,
    repo: string,
    page: number,
    perPage: number
  ): Observable<IssuesResponse> {
    const params = new HttpParams().set('state', 'open').set('page', page).set('per_page', perPage);

    return this.http
      .get<Issue[]>(`${this.baseUrl}/repos/${owner}/${repo}/issues`, {
        params,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          const linkHeader = response.headers.get('Link');
          const hasNext = linkHeader?.includes('rel="next"') ?? false;

          return {
            items: response.body ?? [],
            total_count: hasNext ? (page + 1) * perPage : page * perPage,
          };
        })
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
