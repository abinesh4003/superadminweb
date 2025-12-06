import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AppState, getShowSidebar } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'pkz-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  opened$: Observable<boolean>;

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.opened$ = this.store.select(getShowSidebar);
  }
}
