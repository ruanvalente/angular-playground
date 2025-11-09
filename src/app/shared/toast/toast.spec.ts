import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Toast } from './toast';
import { ToastService } from '../../services/toast.service';
import { provideZonelessChangeDetection, signal } from '@angular/core';

describe('ToastComponent', () => {
  let fixture: ComponentFixture<Toast>;
  let component: Toast;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['remove'], {
      toasts: signal([
        { id: '1', type: 'success', message: 'Operation successful!' },
        { id: '2', type: 'error', message: 'Something went wrong!' },
        { id: '3', type: 'warning', message: 'Be careful!' },
      ]),
    });

    TestBed.configureTestingModule({
      imports: [Toast],
      providers: [
        { provide: ToastService, useValue: toastServiceSpy },
        provideZonelessChangeDetection(),
      ],
    });

    fixture = TestBed.createComponent(Toast);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    fixture.detectChanges();
  });

  it('should render a toast container when toasts are available', () => {
    const container = fixture.nativeElement.querySelector('.toast-container');
    expect(container)
      .withContext('Expected the toast container to be rendered when there are toasts')
      .toBeTruthy();
  });

  it('should render one .toast element per toast item', () => {
    const toasts = fixture.nativeElement.querySelectorAll('.toast');
    expect(toasts.length)
      .withContext('Expected 3 toasts to be rendered for the given mock data')
      .toBe(3);
  });

  it('should apply the correct CSS class based on toast type', () => {
    const [success, error, warning] = fixture.nativeElement.querySelectorAll('.toast');
    expect(success.classList.contains('success'))
      .withContext('Expected first toast to have class .success')
      .toBeTrue();
    expect(error.classList.contains('error'))
      .withContext('Expected second toast to have class .error')
      .toBeTrue();
    expect(warning.classList.contains('warning'))
      .withContext('Expected third toast to have class .warning')
      .toBeTrue();
  });

  it('should display the correct message for each toast', () => {
    const messages = Array.from(fixture.nativeElement.querySelectorAll('.toast-content span')).map(
      (element: any) => element.textContent.trim()
    );

    expect(messages)
      .withContext('Expected toast messages to match the provided data')
      .toEqual(['Operation successful!', 'Something went wrong!', 'Be careful!']);
  });

  it('should call ToastService.remove() when the close button is clicked', () => {
    const closeButton: HTMLButtonElement = fixture.nativeElement.querySelector('.toast-close');

    closeButton.click();
    expect(toastService.remove)
      .withContext('Expected ToastService.remove() to be called when closing a toast')
      .toHaveBeenCalledWith('1');
  });
});
