import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Repository {
  id: string;
  name: string;
  full_name: string;
  description?: string;
  url?: string;
  stars_count?: number;
  open_issues_count?: number;
  html_url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly STORAGE_KEY = '@GithubExploreAngular';
  private readonly _repositories = signal<Repository[]>([]);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly repositories = this._repositories.asReadonly();

  constructor() {
    if (this.isBrowser) {
      this._load();

      effect(() => {
        const repos = this._repositories();
        if (repos.length > 0) {
          localStorage?.setItem(this.STORAGE_KEY, JSON.stringify(repos));
        }
      });
    }
  }

  searchRepository(term: string): Observable<Repository | null> {
    const trimmedTerm = term?.trim();
    if (!trimmedTerm) {
      return of(null);
    }

    return this.mockSearchRepository(trimmedTerm);
  }

  addRepository(repository: Repository): void {
    this._repositories.update((repos) => {
      if (repos.some((r) => r.id === repository.id)) {
        return repos;
      }
      return [repository, ...repos];
    });
  }

  removeRepository(id: string): void {
    if (!id) return;

    this._repositories.update((repos) => repos.filter((repo) => repo.id !== id));
  }

  private mockSearchRepository(term: string): Observable<Repository | null> {
    if (term.toLowerCase().includes('notfound')) {
      return of(null).pipe(delay(700));
    }

    const repository: Repository = {
      id: crypto.randomUUID(),
      name: term,
      full_name: `${term}/${term}`,
      description: `Mock repository for ${term}`,
      url: `https://github.com/${term}/${term}`,
    };

    return of(repository).pipe(delay(700));
  }

  private _load(): void {
    if (!this.isBrowser) return;

    try {
      const stored = localStorage?.getItem(this.STORAGE_KEY);
      if (stored) {
        const repos = JSON.parse(stored) as Repository[];
        if (Array.isArray(repos)) {
          this._repositories.set(repos);
        }
      }
    } catch (e) {
      console.error('Failed to load repositories:', e);
      this._repositories.set([]);
    }
  }
}
