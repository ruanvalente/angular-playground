import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CardLoading } from './card-loading';

describe('CardLoadingComponent', () => {
  let fixture: ComponentFixture<CardLoading>;
  let component: CardLoading;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardLoading],
    }).compileComponents();

    fixture = TestBed.createComponent(CardLoading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the skeleton card container', () => {
    const container = fixture.debugElement.query(By.css('.repositories-list'));
    expect(container).toBeTruthy();
  });

  it('should display a skeleton repository card', () => {
    const card = fixture.debugElement.query(By.css('.repository-card.skeleton-card'));
    expect(card).toBeTruthy();
  });

  it('should render the skeleton avatar', () => {
    const avatar = fixture.debugElement.query(By.css('.skeleton-avatar'));
    expect(avatar).toBeTruthy();
  });

  it('should render the skeleton title line', () => {
    const titleLine = fixture.debugElement.query(By.css('.skeleton-line.title'));
    expect(titleLine).toBeTruthy();
  });

  it('should render the description skeleton lines', () => {
    const lines = fixture.debugElement.queryAll(By.css('.repository-description .skeleton-line'));
    expect(lines.length).toBeGreaterThan(0);
  });

  it('should render the short description skeleton line', () => {
    const shortLine = fixture.debugElement.query(
      By.css('.repository-description .skeleton-line.short')
    );
    expect(shortLine).toBeTruthy();
  });
});
