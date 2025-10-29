import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Header } from '../../shared/header/header';
import { Loading } from '../../shared/loading/loading';

interface Repository {
  id?: number;
  name?: string;
  full_name?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Loading],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {
  search = model<string>('');

  loading = signal(false);
  hasError = signal(false);
  hasRouterRepository = signal(false);
  repositories = signal<Repository[]>([]);

  private readonly STORAGE_KEY = '@GithubExploreAngular';
  private repositoryChangeSubject = new Subject<Repository[]>();

  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.loading.set(true);

    if (!this.activatedRoute.snapshot.paramMap.get('/')) {
      this.hasRouterRepository.set(true);
    }

    setTimeout(() => {
      const stored = this.getData(this.STORAGE_KEY);
      this.repositories.set(stored || []);
      this.loading.set(false);
    }, 2000);

    this.repositoryChangeSubject.subscribe({
      next: (changeRepositoryValue) => this.repositories.set(changeRepositoryValue),
      error: (err) => console.error(err),
    });
  }

  searchRepository(): void {
    const term = this.search();
    if (!term || term.trim().length === 0) return;

    this.mockSearchRepository(term).subscribe({
      next: (repository: Repository | null) => {
        if (!repository) {
          this.showError('Repositório não encontrado');
          this.search.set('');
          this.hasError.set(true);
          return;
        }

        this.showSuccess('Repositório adicionado com sucesso');
        const nextList = [...this.repositories(), repository];
        this.saveData(this.STORAGE_KEY, nextList);

        this.repositoryChangeSubject.next(nextList);
        this.search.set('');
        this.hasError.set(false);
      },
      error: (error: any) => {
        this.showError('Repositório não encontrado');
        this.search.set('');
        this.hasError.set(true);
        console.error(error?.message || error);
      },
      complete: () => {},
    });
  }

  private mockSearchRepository(term: string): Observable<Repository | null> {
    if (term.toLowerCase().includes('notfound')) {
      return of(null).pipe(delay(700));
    }

    const repository: Repository = {
      id: Date.now(),
      name: term,
      full_name: term,
    };

    return of(repository).pipe(delay(700));
  }

  private getData(key: string): Repository[] | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as Repository[]) : null;
    } catch (e) {
      console.error('Failed to parse stored data', e);
      return null;
    }
  }

  private saveData(key: string, data: Repository[]) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save data', e);
    }
  }

  private showSuccess(message: string) {
    console.info('[toast success]', message);
  }

  private showError(message: string) {
    console.warn('[toast error]', message);
  }
}
