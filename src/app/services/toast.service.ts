import { Injectable, signal } from '@angular/core';

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  isExiting?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(message: string, type: ToastType): void {
    const id = crypto.randomUUID();
    const toast: Toast = { id, message, type };

    this._toasts.update((toasts) => [...toasts, toast]);

    setTimeout(() => {
      this.startRemove(id);
    }, 5000);
  }

  remove(id: string): void {
    this.startRemove(id);
  }

  private startRemove(id: string): void {
    this._toasts.update((toasts) =>
      toasts.map((toast) => (toast.id === id ? { ...toast, isExiting: true } : toast))
    );

    setTimeout(() => {
      this._toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
    }, 300);
  }
}
