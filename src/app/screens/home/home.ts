import { Component, inject } from '@angular/core';
import { Search } from '../../components/ui/components/search/search';
import { SearchStateService } from '../../services/search-state.service';
import { Header } from '../../shared/header/header';
import { Loading } from '../../shared/loading/loading';
import { RepositoriesList } from '../repositories-list/repositories-list';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [RepositoriesList, Header, Search, Loading],
})
export class Home {
  private readonly state = inject(SearchStateService);

  readonly loading = this.state.loading;
  readonly hasError = this.state.hasError;
}
