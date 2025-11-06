import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchStateService {
  readonly loading = signal(false);
  readonly hasError = signal(false);
}
