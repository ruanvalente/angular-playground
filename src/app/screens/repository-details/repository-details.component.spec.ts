import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { IssuesService } from '../../services/issues.service';
import { SearchService } from '../../services/search.service';
import { SeoService } from '../../services/seo.service';
import { RepositoryDetails } from './repository-details';
import { provideZonelessChangeDetection } from '@angular/core';

describe('RepositoryDetails Screen', () => {
  let component: RepositoryDetails;
  let router: jasmine.SpyObj<Router>;
  let issuesService: jasmine.SpyObj<IssuesService>;
  let searchService: jasmine.SpyObj<SearchService>;
  let seoService: jasmine.SpyObj<SeoService>;

  const mockRoute = {
    snapshot: {
      params: { owner: 'angular', repo: 'angular' },
    },
  };

  const mockRepository = {
    full_name: 'angular/angular',
    name: 'angular',
    owner: { avatar_url: 'img.png' },
    stargazers_count: 100,
    open_issues_count: 5,
  };

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    issuesService = jasmine.createSpyObj('IssuesService', ['getIssues']);
    searchService = jasmine.createSpyObj('SearchService', ['repositories']);
    seoService = jasmine.createSpyObj('SeoService', ['updateTags']);

    TestBed.configureTestingModule({
      imports: [RepositoryDetails],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: router },
        { provide: IssuesService, useValue: issuesService },
        { provide: SearchService, useValue: searchService },
        { provide: SeoService, useValue: seoService },
        provideZonelessChangeDetection(),
      ],
    });

    const fixture = TestBed.createComponent(RepositoryDetails);
    component = fixture.componentInstance;
  });

  it('should initialize and load repository and issues', () => {
    searchService.repositories.and.returnValue([mockRepository as any]);

    issuesService.getIssues.and.returnValue(of({ items: [{ id: 1 }], total_count: 1 }) as any);

    component.ngOnInit();

    expect(component.repository()).toEqual(mockRepository);
    expect(issuesService.getIssues).toHaveBeenCalledWith('angular', 'angular', 1, 10);
    expect(component.issues().length).toBe(1);
    expect(seoService.updateTags).toHaveBeenCalled();
  });

  it('should redirect to home when repository is not found', () => {
    searchService.repositories.and.returnValue([]);

    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle error when loading issues', () => {
    searchService.repositories.and.returnValue([mockRepository as any]);

    issuesService.getIssues.and.returnValue(throwError(() => new Error('fail')));

    component.ngOnInit();

    expect(component.loading()).toBeFalse();
  });

  it('should go to next page when hasNextPage is true', () => {
    searchService.repositories.and.returnValue([mockRepository as any]);

    issuesService.getIssues.and.returnValue(of({ items: [], total_count: 25 }));

    component.ngOnInit();

    const initialPage = component.currentPage();

    component.nextPage();

    expect(component.currentPage()).toBe(initialPage + 1);
    expect(issuesService.getIssues).toHaveBeenCalledTimes(2);
  });

  it('should not go to next page when no more pages are available', () => {
    searchService.repositories.and.returnValue([mockRepository as any]);

    issuesService.getIssues.and.returnValue(of({ items: [], total_count: 5 }));

    component.ngOnInit();

    component.nextPage();

    expect(component.currentPage()).toBe(1);
  });

  it('should go to previous page when current page > 1', () => {
    searchService.repositories.and.returnValue([mockRepository as any]);

    issuesService.getIssues.and.returnValue(of({ items: [], total_count: 25 }));

    component.ngOnInit();
    component.currentPage.set(2);

    component.previousPage();

    expect(component.currentPage()).toBe(1);
  });

  it('should navigate to issue details page', () => {
    searchService.repositories.and.returnValue([mockRepository as any]);
    issuesService.getIssues.and.returnValue(of({ items: [], total_count: 1 }));

    component.ngOnInit();

    component.navigateToIssue({ number: 123 } as any);

    expect(router.navigate).toHaveBeenCalledWith([
      '/repository',
      'angular',
      'angular',
      'issues',
      123,
    ]);
  });

  it('should change perPage and reload data', () => {
    searchService.repositories.and.returnValue([mockRepository as any]);
    issuesService.getIssues.and.returnValue(of({ items: [], total_count: 1 }));

    component.ngOnInit();

    const event = {
      target: { value: '20' },
    } as unknown as Event;

    component.changePerPage(event);

    expect(component.perPage).toBe(20);
    expect(component.currentPage()).toBe(1);
    expect(issuesService.getIssues).toHaveBeenCalledTimes(2);
  });
});
