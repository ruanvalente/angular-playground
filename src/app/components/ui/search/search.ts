import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

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
  private readonly searchService = inject(SearchService);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly hasError = signal(false);

  readonly searchControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/^[^\/\s]+\/[^\/\s]+$/)],
  });

  readonly searchForm = new FormGroup({
    search: this.searchControl,
  });

  readonly repositories = this.searchService.repositories;

  constructor() {
    const repoParam = this.route.snapshot.queryParamMap.get('repo');
    if (repoParam) {
      this.searchControl.setValue(repoParam);
      this.searchRepository();
    }
  }

  searchRepository(): void {
    const term = this.searchControl.value?.trim();
    if (!term) {
      this.searchControl.markAsTouched();
      return;
    }

    this.loading.set(true);
    this.hasError.set(false);

    this.searchService
      .searchRepository(term)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (repository: Repository | null) => {
          if (!repository) {
            this.showError('Repositório não encontrado');
            return;
          }
          this.searchService.addRepository(repository);
          this.showSuccess('Repositório adicionado com sucesso');
          this.resetForm();
        },
        error: (error: Error) => {
          this.showError(`Erro ao buscar repositório: ${error.message}`);
        },
      });
  }

  removeRepository(id: string): void {
    this.searchService.removeRepository(id);
  }

  private resetForm(): void {
    this.searchForm.reset();
  }

  private showSuccess(message: string) {
    console.info('[toast success]', message);
  }

  private showError(message: string) {
    console.warn('[toast error]', message);
  }
}
