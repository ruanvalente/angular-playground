import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'repository/:owner/:repo',
    renderMode: RenderMode.Server,
  },
  {
    path: 'repository/:owner/:repo/issues/:number',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
