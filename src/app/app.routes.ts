import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./screens/home/home').then((m) => m.Home),
  },
  {
    path: 'repository/:owner/:repo',
    loadComponent: () =>
      import('./screens/repository-details/repository-details').then((m) => m.RepositoryDetails),
  },
  {
    path: 'repository/:owner/:repo/issues/:number',
    loadComponent: () =>
      import('./screens/issue-details/issue-details').then((m) => m.IssueDetails),
  },
];
