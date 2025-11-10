import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { SearchStateService } from '../../../../services/search-state.service';
import { Repository, SearchService } from '../../../../services/search.service';
import { SeoService } from '../../../../services/seo.service';
import { Search } from './search';
import { provideZonelessChangeDetection } from '@angular/core';

describe('SearchComponent', () => {
  let component: Search;
  let fixture: ComponentFixture<Search>;

  let searchServiceMock: jasmine.SpyObj<SearchService>;
  let seoServiceMock: jasmine.SpyObj<SeoService>;
  let stateMock: any;

  beforeEach(async () => {
    searchServiceMock = jasmine.createSpyObj(
      'SearchService',
      ['searchRepository', 'addRepository', 'removeRepository'],
      { repositories: of([]) }
    );

    seoServiceMock = jasmine.createSpyObj('SeoService', ['updateTags']);

    stateMock = {
      loading: { set: jasmine.createSpy('set') },
      hasError: { set: jasmine.createSpy('set') },
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, Search],
      providers: [
        { provide: SearchService, useValue: searchServiceMock },
        { provide: SeoService, useValue: seoServiceMock },
        { provide: SearchStateService, useValue: stateMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: new Map([['repo', null]]),
              url: [{ path: 'search' }],
            },
          },
        },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Search);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize SEO tags on component creation', () => {
    expect(seoServiceMock.updateTags).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Buscar Repositórios GitHub',
        description: jasmine.any(String),
      })
    );
  });

  it('should mark input as touched if search term is empty', () => {
    component.searchControl.setValue('');
    component.searchRepository();
    expect(component.searchControl.touched).toBeTrue();
  });

  it('should call searchRepository() and add repository on success', () => {
    const fakeRepo: Repository = { id: '1', name: 'repo1' } as any;
    searchServiceMock.searchRepository.and.returnValue(of(fakeRepo));

    component.searchControl.setValue('user/repo');
    component.searchRepository();

    expect(stateMock.loading.set).toHaveBeenCalledWith(true);
    expect(searchServiceMock.addRepository).toHaveBeenCalledWith(fakeRepo);
  });

  it('should handle repository not found', () => {
    spyOn(console, 'warn');
    searchServiceMock.searchRepository.and.returnValue(of(null));

    component.searchControl.setValue('user/repo');
    component.searchRepository();

    expect(console.warn).toHaveBeenCalledWith('[toast error]', 'Repositório não encontrado');
  });

  it('should handle search error gracefully', () => {
    spyOn(console, 'warn');
    searchServiceMock.searchRepository.and.returnValue(
      throwError(() => new Error('Network failure'))
    );

    component.searchControl.setValue('user/repo');
    component.searchRepository();

    expect(console.warn).toHaveBeenCalledWith(
      '[toast error]',
      jasmine.stringMatching('Erro ao buscar repositório')
    );
  });

  it('should call removeRepository() with given id', () => {
    component.removeRepository('123');
    expect(searchServiceMock.removeRepository).toHaveBeenCalledWith('123');
  });

  it('should disable submit button when form is invalid', () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBeTrue();
  });

  it('should enable submit button when form is valid', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'angular/angular';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBeFalse();
  });

  it('should display "required" helper message when empty and touched', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = '';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const helper = fixture.debugElement.query(By.css('#search-help-empty'));
    expect(helper).toBeTruthy();
    expect(helper.nativeElement.textContent).toContain('Por favor');
  });

  it('should display "invalid format" helper message when pattern fails', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'invalidFormat';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const helper = fixture.debugElement.query(By.css('#search-help-format'));
    expect(helper).toBeTruthy();
    expect(helper.nativeElement.textContent).toContain('Formato inválido');
  });

  it('should call searchRepository() when form is submitted', () => {
    const spySearch = spyOn(component, 'searchRepository');
    const input = fixture.debugElement.query(By.css('input')).nativeElement;

    input.value = 'user/repo';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', {});
    fixture.detectChanges();

    expect(spySearch).toHaveBeenCalled();
  });
});
