import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';

describe('HeaderComponent', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideZonelessChangeDetection()],
    });
    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should display an image with the alt text "Github Explore Angular"', () => {
    const headerElement: HTMLElement = fixture.nativeElement;
    const expectedTextAlternative = 'Github Explore Angular';
    const imageTag = headerElement.querySelector('img');

    expect(imageTag).withContext('Expected an <img> element in the header').toBeTruthy();
    expect(imageTag?.alt)
      .withContext('Expected image alt text to match the header title')
      .toBe(expectedTextAlternative);
  });
});
