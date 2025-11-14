import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Repository, SearchService } from '../../services/search.service';
import { RepositoriesList } from './repositories-list';
import { provideZonelessChangeDetection, signal, WritableSignal } from '@angular/core';

describe('RepositoriesList Screen', () => {
  let component: RepositoriesList;
  let fixture: ComponentFixture<RepositoriesList>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSearchService: jasmine.SpyObj<SearchService>;
  let repositoriesSignal: WritableSignal<Repository[]>;

  const mockRepositories: Repository[] = [
    {
      id: crypto.randomUUID().toString(),
      html_url: '',
      name: 'my-repo',
      full_name: 'user1/my-repo',
      description: 'Repository for testing',
      stargazers_count: 10,
      open_issues_count: 2,
      owner: { avatar_url: 'https://example.com/avatar1.png', login: 'user1' },
    },
    {
      id: crypto.randomUUID().toString(),
      html_url: '',
      name: 'another-repo',
      full_name: 'user2/another-repo',
      description: 'Another test repo',
      stargazers_count: 5,
      open_issues_count: 0,
      owner: { avatar_url: 'https://example.com/avatar2.png', login: 'user2' },
    },
  ];

  beforeEach(async () => {
    repositoriesSignal = signal<Repository[]>(mockRepositories);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSearchService = jasmine.createSpyObj('SearchService', ['addRepository']);
    Object.defineProperty(mockSearchService, 'repositories', {
      get: () => repositoriesSignal,
    });

    await TestBed.configureTestingModule({
      imports: [CommonModule, RepositoriesList],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SearchService, useValue: mockSearchService },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RepositoriesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load the repository list from SearchService', () => {
    const repos = component.repositories();
    expect(repos.length).toBe(2);
    expect(repos[0].name).toBe('my-repo');
  });

  it('should navigate to repository details when navigateToDetails is called', () => {
    const repo = mockRepositories[0];
    component.navigateToDetails(repo);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/repository', 'user1', 'my-repo']);
  });

  it('should render repository names in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const repoNames = compiled.querySelectorAll('.repository-name');
    expect(repoNames.length).toBe(2);
    expect(repoNames[0].textContent).toContain('my-repo');
    expect(repoNames[1].textContent).toContain('another-repo');
  });

  it('should display the empty state when the repositories list is empty', () => {
    expect(component.repositories().length).toBeGreaterThan(0);

    repositoriesSignal.set([]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const emptyState = compiled.querySelector('.empty-state');

    expect(emptyState)
      .withContext('Expected .empty-state element to exist when repositories are empty')
      .not.toBeNull();

    expect(emptyState!.textContent?.trim()).toContain('Nenhum repositório encontrado');
  });
});
