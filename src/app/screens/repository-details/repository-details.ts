import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Loading } from '../../shared/loading/loading';
import { Issue, IssuesService } from '../../services/issues.service';
import { SearchService } from '../../services/search.service';
import { SeoService } from '../../services/seo.service';
import { environment } from '../../../environments/environment';

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
  private readonly seoService = inject(SeoService);
  private readonly baseUrl = environment.app.baseURL;

  repository = signal<any>(null);
  issues = signal<Issue[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  totalIssues = signal(0);
  perPage = 10;
  perPageOptions = [5, 10, 20, 50];

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

    this.seoService.updateTags({
      title: 'Lista de Repositórios | Angular SSR SEO',
      description: 'Explore os repositórios mais populares e veja detalhes de cada um.',
      url: `${this.baseUrl}/repository/${owner}/${repo}`,
      image: repository.owner.avatar_url || '',
    });
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

  changePerPage(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.perPage = Number(select.value);
    this.currentPage.set(1);
    this.loadIssues();
  }

  goBackToHome() {
    this.router.navigate(['/']);
  }
}
