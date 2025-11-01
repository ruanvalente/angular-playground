import { CommonModule } from '@angular/common';
import { Component, effect, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Repository, SearchService } from '../../../services/search.service';
import { Header } from '../../shared/header/header';
import { Loading } from '../../shared/loading/loading';
import { RepositoriesList } from '../repositories-list/repositories-list';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Loading, RepositoriesList],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  private searchService = inject(SearchService);
  private activatedRoute = inject(ActivatedRoute);

  readonly repositories = this.searchService.repositories;
  readonly search = model<string>('');
  readonly loading = signal(false);
  readonly hasError = signal(false);
  readonly hasRouterRepository = signal(false);
  private searchTerm = signal('');

  constructor() {
    effect(() => {
      if (!this.activatedRoute.snapshot.paramMap.get('/')) {
        this.hasRouterRepository.set(true);
      }
    });

    effect(() => {
      const term = this.searchTerm();
      if (!term) return;

      this.loading.set(true);
      this.hasError.set(false);

      this.searchService.searchRepository(term).subscribe({
        next: (repository: Repository | null) => {
          if (!repository) {
            this.showError('Repositório não encontrado');
            this.search.set('');
            this.hasError.set(true);
            return;
          }

          this.searchService.addRepository(repository);
          this.showSuccess('Repositório adicionado com sucesso');
          this.search.set('');
        },
        error: (error: any) => {
          this.showError('Repositório não encontrado');
          this.search.set('');
          this.hasError.set(true);
          console.error(error?.message || error);
        },
        complete: () => {
          this.loading.set(false);
          this.searchTerm.set('');
        },
      });
    });
  }

  searchRepository(): void {
    const term = this.search();
    if (!term?.trim()) return;
    this.searchTerm.set(term.trim());
  }

  removeRepository(id: string): void {
    this.searchService.removeRepository(id);
  }

  private showSuccess(message: string) {
    console.info('[toast success]', message);
  }

  private showError(message: string) {
    console.warn('[toast error]', message);
  }
}
