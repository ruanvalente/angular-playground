import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Repository, SearchService } from '../../../services/search.service';
import { Header } from '../../shared/header/header';
import { Loading } from '../../shared/loading/loading';
import { RepositoriesList } from '../repositories-list/repositories-list';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Header, Loading, RepositoriesList],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  private searchService = inject(SearchService);
  private activatedRoute = inject(ActivatedRoute);

  readonly repositories = this.searchService.repositories;
  readonly searchControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/^[^\/\s]+\/[^\/\s]+$/)],
  });
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
            this.searchControl.setValue('');
            this.hasError.set(true);
            return;
          }

          this.searchService.addRepository(repository);
          this.showSuccess('Repositório adicionado com sucesso');
          this.searchControl.setValue('');
        },
        error: (error: any) => {
          this.showError('Repositório não encontrado');
          this.searchControl.setValue('');
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
    const term = this.searchControl.value?.trim();
    if (!term) {
      this.searchControl.markAsTouched();
      return;
    }

    this.searchTerm.set(term);
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
