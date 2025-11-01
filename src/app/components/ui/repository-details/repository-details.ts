import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Issue, IssuesService } from '../../../services/issues.service';
import { SearchService } from '../../../services/search.service';
import { Loading } from '../../shared/loading/loading';

@Component({
  selector: 'app-repository-details',
  standalone: true,
  imports: [CommonModule, Loading],
  templateUrl: './repository-details.html',
  styleUrl: './repository-details.css',
})
export class RepositoryDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private issuesService = inject(IssuesService);
  private searchService = inject(SearchService);

  repository = signal<any>(null);
  issues = signal<Issue[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  totalIssues = signal(0);
  readonly perPage = 10;

  ngOnInit() {
    const { owner, repo } = this.route.snapshot.params;

    const repository = this.searchService
      .repositories()
      .find((r) => r.full_name === `${owner}/${repo}`);

    if (!repository) {
      this.router.navigate(['/']);
      return;
    }

    this.repository.set(repository);
    this.loadIssues();
  }

  loadIssues() {
    const { owner, repo } = this.route.snapshot.params;

    this.loading.set(true);
    this.issuesService.getIssues(owner, repo, this.currentPage(), this.perPage).subscribe({
      next: (response) => {
        this.issues.set(response.items);
        this.totalIssues.set(response.total_count);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  navigateToIssue(issue: Issue) {
    const { owner, repo } = this.route.snapshot.params;
    this.router.navigate(['/repository', owner, repo, 'issues', issue.number]);
  }

  hasNextPage(): boolean {
    return this.currentPage() * this.perPage < this.totalIssues();
  }

  nextPage() {
    if (this.hasNextPage()) {
      this.currentPage.update((page) => page + 1);
      this.loadIssues();
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
      this.loadIssues();
    }
  }

  goBackToHome() {
    this.router.navigate(['/']);
  }
}
