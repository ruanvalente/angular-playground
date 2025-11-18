import { TestBed } from '@angular/core/testing';
import { SearchStateService } from './search-state.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('SearchStateService', () => {
  let service: SearchStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(SearchStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with default values', () => {
    expect(service.loading()).toBeFalse();
    expect(service.hasError()).toBeFalse();
  });

  it('should update loading signal', () => {
    service.loading.set(true);
    expect(service.loading()).toBeTrue();
  });

  it('should update hasError signal', () => {
    service.hasError.set(true);
    expect(service.hasError()).toBeTrue();
  });
});
