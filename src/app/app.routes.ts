import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/ui/search/search').then((m) => m.Search),
  },
  {
    path: 'repository/:owner/:repo',
    loadComponent: () =>
      import('./components/ui/repository-details/repository-details').then(
        (m) => m.RepositoryDetails
      ),
  },
  {
    path: 'repository/:owner/:repo/issues/:number',
    loadComponent: () =>
      import('./components/ui/issue-details/issue-details').then((m) => m.IssueDetails),
  },
];
