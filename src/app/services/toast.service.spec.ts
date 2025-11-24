import { TestBed } from '@angular/core/testing';
import { ToastService, ToastType } from './toast.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ToastService (Zoneless)', () => {
  let service: ToastService;
  let timeouts: Function[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService, provideZonelessChangeDetection()],
    });

    service = TestBed.inject(ToastService);

    timeouts = [];

    spyOn(window, 'setTimeout').and.callFake(((
      handler: TimerHandler,
      timeout?: number,
      ...args: any[]
    ) => {
      timeouts.push(() => (handler as Function)(...args));
      return 0;
    }) as any);
  });

  const runTimeout = (index: number) => {
    expect(timeouts[index]).withContext(`Timeout #${index} should exist`).toBeDefined();
    timeouts[index]();
  };

  it('should create a new toast when show() is called', () => {
    service.show('Test', ToastType.SUCCESS);

    const toasts = service.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].message).toBe('Test');
    expect(toasts[0].type).toBe(ToastType.SUCCESS);
    expect(toasts[0].isExiting).toBeUndefined();
  });

  it('should mark a toast as exiting after 5 seconds', () => {
    service.show('Test Exit', ToastType.WARNING);

    let toast = service.toasts()[0];
    expect(toast.isExiting).toBeUndefined();

    runTimeout(0);

    toast = service.toasts()[0];
    expect(toast.isExiting).toBeTrue();
  });

  it('should remove toast 300ms after it starts exiting', () => {
    service.show('Test Remove', ToastType.ERROR);

    runTimeout(0);

    let toast = service.toasts()[0];
    expect(toast.isExiting).toBeTrue();

    runTimeout(1);

    expect(service.toasts().length).toBe(0);
  });

  it('should mark toast as exiting and then remove it when remove() is called manually', () => {
    service.show('Manual Remove', ToastType.SUCCESS);

    const id = service.toasts()[0].id;

    service.remove(id);

    let toast = service.toasts()[0];
    expect(toast.isExiting).toBeTrue();
  });
});
