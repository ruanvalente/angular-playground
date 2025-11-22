import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Repository, SearchService } from '../../services/search.service';

@Component({
  selector: 'app-repositories-list',
  standalone: true,
  templateUrl: './repositories-list.html',
  styleUrl: './repositories-list.css',
})
export class RepositoriesList {
  private router = inject(Router);
  private searchService = inject(SearchService);

  repositories = this.searchService.repositories;

  navigateToDetails(repo: Repository): void {
    const [owner, repoName] = repo.full_name.split('/');
    this.router.navigate(['/repository', owner, repoName]);
  }
}
