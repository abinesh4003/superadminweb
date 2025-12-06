import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from '@app/pages/dashboard/sub/inventory/inventory.service';
import { AppState, getSubCategoryId } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import { zip } from 'rxjs/observable/zip';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { tap } from 'rxjs/operators/tap';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-bulk-upload-log',
  templateUrl: 'bulk-upload-log.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BulkUploadLogComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private tabId: number;
  private categoryId: string;

  rows: any[] = []; // todo
  sorts: any[];
  isPageLoaded = false;
  rootBreadcrumbName: string;

  constructor(
    private inventoryService: InventoryService,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    zip(
      this.activatedRoute.queryParams,
      this.store.select(getSubCategoryId)
    )
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(this.initAssociatedData.bind(this)),
      )
      .subscribe(() => {
        this.isPageLoaded = true;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private initAssociatedData([ {tabId}, categoryId ]) {
    this.tabId = +tabId;
    this.categoryId = categoryId;
    this.rootBreadcrumbName = this.inventoryService.getStatusName(this.tabId);
    this.sorts = [{prop: 'category_number', dir: 'desc'}]; // todo change if needed
    this.inventoryService.changeInventoryStatusTab(this.tabId);
  }
}
