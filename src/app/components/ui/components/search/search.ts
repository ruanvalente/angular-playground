
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { Repository, SearchService } from '../../../../services/search.service';
import { SeoService } from '../../../../services/seo.service';
import { environment } from '../../../../../environments/environment';
import { SearchStateService } from '../../../../services/search-state.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  private readonly searchService = inject(SearchService);
  private readonly route = inject(ActivatedRoute);
  private readonly seoService = inject(SeoService);
  private readonly state = inject(SearchStateService);

  private readonly baseUrl = environment.app.baseURL;

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

    this.seoService.updateTags({
      title: 'Buscar Repositórios GitHub',
      description: 'Busque e gerencie seus repositórios GitHub favoritos.',
      url: this.baseUrl + this.route.snapshot.url.join('/'),
    });
  }

  searchRepository(): void {
    const term = this.searchControl.value?.trim();
    if (!term) {
      this.searchControl.markAsTouched();
      return;
    }

    this.state.loading.set(true);
    this.state.hasError.set(false);

    this.searchService
      .searchRepository(term)
      .pipe(finalize(() => this.state.loading.set(false)))
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
