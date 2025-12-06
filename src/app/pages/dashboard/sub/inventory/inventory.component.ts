import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IdName } from '@app/core/models';
import { InventoryService } from '@app/pages/dashboard/sub/inventory/inventory.service';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators/tap';

@Component({
  selector: 'pkz-inventory',
  templateUrl: './inventory.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryComponent implements OnInit {
  tabs$: Observable<IdName[]>;
  activeTabId$: Observable<number>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
    this.tabs$ = this.inventoryService.getTabItems()
      .pipe(tap((tabs) => this.inventoryService.changeInventoryStatusTab(tabs[0].id)));

    this.activeTabId$ = this.inventoryService.getActiveTabId();
    this.inventoryService.changeInventoryTab(this.activatedRoute.snapshot.data);
  }

  onSelectTab(tab) {
    this.inventoryService.changeInventoryStatusTab(tab.id);
  }
}
