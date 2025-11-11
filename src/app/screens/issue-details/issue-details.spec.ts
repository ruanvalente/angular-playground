import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { IssuesService } from '../../services/issues.service';
import { SeoService } from '../../services/seo.service';
import { Loading } from '../../shared/loading/loading';
import { IssueDetails } from './issue-details';

describe('IssueDetails Screen', () => {
  let fixture: ComponentFixture<IssueDetails>;
  let component: IssueDetails;
  let mockRoute: any;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockIssuesService: jasmine.SpyObj<IssuesService>;
  let mockSeoService: jasmine.SpyObj<SeoService>;

  const mockIssue = {
    number: 42,
    title: 'Bug in production',
    body: 'Something is not working!',
    user: { login: 'john', avatar_url: 'avatar.png' },
    state: 'open',
    created_at: new Date('2024-01-01T00:00:00Z'),
    html_url: 'https://github.com/org/repo/issues/42',
  };

  beforeEach(async () => {
    mockRoute = {
      snapshot: {
        params: { owner: 'org', repo: 'repo', number: '42' },
      },
    };

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockIssuesService = jasmine.createSpyObj('IssuesService', ['getIssue']);
    mockSeoService = jasmine.createSpyObj('SeoService', ['updateTags']);

    await TestBed.configureTestingModule({
      imports: [IssueDetails, Loading, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
        { provide: IssuesService, useValue: mockIssuesService },
        { provide: SeoService, useValue: mockSeoService },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    mockIssuesService.getIssue.and.returnValue(of(mockIssue) as any);
    fixture = TestBed.createComponent(IssueDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call getIssue with correct params and render data', () => {
    mockIssuesService.getIssue.and.returnValue(of(mockIssue) as any);

    fixture = TestBed.createComponent(IssueDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(mockIssuesService.getIssue).toHaveBeenCalledWith('org', 'repo', 42);
    expect(component.issue()).toEqual(mockIssue as any);
    expect(component.loading()).toBeFalse();

    const titleEl = fixture.nativeElement.querySelector('.issue-title');
    expect(titleEl.textContent).toContain('#42');
    expect(titleEl.textContent).toContain('Bug in production');

    expect(mockSeoService.updateTags).toHaveBeenCalled();
  });

  it('should navigate to home on getIssue error', () => {
    mockIssuesService.getIssue.and.returnValue(throwError(() => new Error('Network error')));

    fixture = TestBed.createComponent(IssueDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate back to repository on goBack()', () => {
    mockIssuesService.getIssue.and.returnValue(of(mockIssue) as any);

    fixture = TestBed.createComponent(IssueDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.goBack();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/repository', 'org', 'repo']);
  });
});
