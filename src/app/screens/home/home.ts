import { Component, inject } from '@angular/core';
import { Search } from '../../components/ui/components/search/search';
import { SearchStateService } from '../../services/search-state.service';
import { Header } from '../../shared/header/header';
import { RepositoriesList } from '../repositories-list/repositories-list';
import { CardLoading } from '../../shared/card-loading/card-loading';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [RepositoriesList, Header, Search, CardLoading],
})
export class Home {
  private readonly state = inject(SearchStateService);

  readonly loading = this.state.loading;
  readonly hasError = this.state.hasError;
}
