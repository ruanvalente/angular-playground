import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';

export interface Repository {
  id: string;
  name: string;
  full_name: string;
  description?: string;
  html_url: string;
  stargazers_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly STORAGE_KEY = '@GithubExploreAngular';
  private readonly _repositories = signal<Repository[]>([]);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly repositories = this._repositories.asReadonly();

  private readonly baseUrl = environment.github.baseUrl;
  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastService);

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

    const [owner, repo] = trimmedTerm.split('/');
    if (!owner || !repo) {
      return of(null);
    }

    return this.http.get<Repository>(`${this.baseUrl}/repos/${owner}/${repo}`).pipe(
      map((response) => ({
        ...response,
        id: response.id.toString(),
      })),
      catchError((error) => {
        this.toastService.show(
          `Repositório "${owner}/${repo}" não encontrado. Verifique se o nome está correto.`,
          'error'
        );
        return of(null);
      })
    );
  }

  addRepository(repository: Repository): void {
    this._repositories.update((repos) => {
      if (repos.some((r) => r.id === repository.id)) {
        this.toastService.show('Repositório já foi adicionado anteriormente', 'error');
        return repos;
      }
      this.toastService.show('Repositório adicionado com sucesso!', 'success');
      return [repository, ...repos];
    });
  }

  removeRepository(id: string): void {
    if (!id) return;

    this._repositories.update((repos) => repos.filter((repo) => repo.id !== id));
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
