import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Loading } from '../../shared/loading/loading';
import { environment } from '../../../environments/environment';
import { Issue, IssuesService } from '../../services/issues.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-issue-details',
  standalone: true,
  imports: [CommonModule, Loading],
  templateUrl: './issue-details.html',
  styleUrl: './issue-details.css',
})
export class IssueDetails {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private issuesService = inject(IssuesService);
  private seoService = inject(SeoService);

  issue = signal<Issue | null>(null);
  loading = signal(true);

  private owner = signal<string>('');
  private repo = signal<string>('');
  private issueNumber = signal<number>(0);
  private readonly baseUrl = environment.app.baseURL;

  constructor() {
    const params = this.route.snapshot.params;
    this.owner.set(params['owner']);
    this.repo.set(params['repo']);
    this.issueNumber.set(Number(params['number']));

    effect(() => {
      this.loading.set(true);

      this.issuesService.getIssue(this.owner(), this.repo(), this.issueNumber()).subscribe({
        next: (issue) => {
          this.issue.set(issue);
          this.loading.set(false);

          const title = `Issue #${issue.number}: ${issue.title} | ${this.repo()} - ${this.owner()}`;
          const description = issue.body?.slice(0, 160) || `Detalhes do issue #${issue.number}`;
          const url = `${this.baseUrl}/repository/${this.owner()}/${this.repo()}/issues/${
            issue.number
          }`;

          this.seoService.updateTags({
            title,
            description,
            url,
            image: issue.user?.avatar_url || '',
          });
        },
        error: () => {
          this.loading.set(false);
          this.router.navigate(['/']);
        },
      });
    });
  }

  goBack() {
    const { owner, repo } = this.route.snapshot.params;
    this.router.navigate(['/repository', owner, repo]);
  }
}
