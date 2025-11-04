import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  private toastService = inject(ToastService);
  readonly toasts = this.toastService.toasts;

  remove(toast: { id: string; isExiting?: boolean }) {
    this.toastService.remove(toast.id);
  }
}
