import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { IdName } from '@app/core/models';
import { Observable } from 'rxjs/Observable';
import { ShopsSubService } from './shops-sub.service';

@Component({
  selector: 'pkz-shops-sub',
  templateUrl: './shops-sub.component.html',
  styleUrls: ['./shops-sub.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopsSubComponent implements OnInit {
  tabs: IdName[];
  activeTabId$: Observable<number>;

  constructor(
    private shopsSubService: ShopsSubService
  ) { }

  ngOnInit() {
    this.tabs = this.shopsSubService.getTabItems();
    this.activeTabId$ = this.shopsSubService.getActiveTabId();
  }

  onSelectTab(tab) {
    this.shopsSubService.changeShopsStatusTab(tab.id);
  }
}
