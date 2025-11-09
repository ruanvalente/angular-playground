import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Loading } from './loading';

describe('LoadingComponent', () => {
  let component: Loading;
  let fixture: ComponentFixture<Loading>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Loading],
      providers: [provideZonelessChangeDetection()],
    });
    fixture = TestBed.createComponent(Loading);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should render a loading indicator with 4 animated items', () => {
    const loadingElement: HTMLElement = fixture.nativeElement;
    const container = loadingElement.querySelector('.loading');
    const items = loadingElement.querySelectorAll('.loading__item');

    expect(container).withContext('Expected a container element with class .loading').toBeTruthy();

    expect(items.length)
      .withContext('Expected 4 child elements with class .loading__item inside .loading')
      .toBe(4);

    items.forEach((item, index) => {
      expect(item.tagName.toLowerCase())
        .withContext(`Expected loading item #${index + 1} to be a <span>`)
        .toBe('span');
    });
  });
});
