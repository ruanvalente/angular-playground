import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IssuesService, Issue } from '../../../services/issues.service';
import { Loading } from '../../shared/loading/loading';

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

  issue = signal<Issue | null>(null);
  loading = signal(true);

  private owner = signal<string>('');
  private repo = signal<string>('');
  private issueNumber = signal<number>(0);

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
