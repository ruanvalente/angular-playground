import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Search } from './components/ui/search/search';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('My Angular App');
}
