import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { SC_STATUS_ALPHA, SC_STATUS_SUSPENDED } from '@app/core/constants';
import { IdName, PaginationPage } from '@app/core/models/common.models';
import { ApiService } from '@app/core/services/api.service';
import { ConstantsService } from '@app/core/services/constants.service';
import { StorageService } from '@app/core/services/storage.service';
import { ScPermissionsConstants } from '@app/pages/admin/sc/sc-permissions.constants';
import { ScService } from '@app/pages/admin/sc/sc.service';
import { ScFilterSettingsService } from '@app/pages/admin/shared/sc-filter-settings.service';
import { SharedService } from '@app/pages/admin/shared/shared.service';
import { PagesService } from '@app/pages/pages.service';
import { skip } from 'rxjs/operators/skip';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-sc-list',
  templateUrl: 'sc-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScListComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  isPageLoaded = false;
  rows: any[];
  sorts: any[];
  page: PaginationPage;
  filterFormSettings;
  filtersObj: any = {};
  types: IdName[];
  perms = ScPermissionsConstants;
  imageOptions = {path: 'sc/img/vw', width: 0, height: 60};

  constructor(
    private api: ApiService,
    private cd: ChangeDetectorRef,
    private constantsService: ConstantsService,
    private pagesService: PagesService,
    private storage: StorageService,
    private filterSettingsService: ScFilterSettingsService,
    private scService: ScService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.scService.getCategoryTypes()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(types => {
        this.types = types;
        this.handleRowsLimit();
        this.initFiltersData(types);
        this.resetPageOffset();
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onChangeSuspend(event, row) {
    event.preventDefault();

    const data = {
      status: this.isSuspendedStoreCategory(row.status) ? SC_STATUS_ALPHA : SC_STATUS_SUSPENDED
    };
    const action = this.isSuspendedStoreCategory(row.status) ? 'unsuspend' : 'suspend';

    this.pagesService.confirmActionModal(row.display_name, action)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        mergeMap(() => this.api.updateStoreCategory(row._id, data))
      )
      .subscribe(() => this.resetPageOffset());
  }

  getShopTypeName(id): string {
    if (!this.types) {
      return;
    }

    return this.constantsService.getNameById(id, this.types);
  }

  getStatusName(id): string {
    return this.constantsService.getNameById(id, 'sc_status');
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.loadTableData();
  }

  isSuspendedStoreCategory(status) {
    return status === SC_STATUS_SUSPENDED;
  }

  onFilter(filtersObj) {
    this.filtersObj = filtersObj;
    this.resetPageOffset();
  }

  private handleRowsLimit() {
    this.page = new PaginationPage();
    this.page.setLimit(this.storage.getRowsPerPage());
    this.storage.observeRowsPerPage()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        skip(1)
      )
      .subscribe(key => {
        this.page.setLimit(key);
        this.resetPageOffset();
      });
  }

  private resetPageOffset() {
    this.setPage({offset: 0});
  }

  private initPage({docs, total}): void {
    this.rows = docs;
    this.page.count = total;
    this.initSorts();
  }

  private initFiltersData(categoryTypes) {
    this.filterFormSettings = this.filterSettingsService.getFilterSettings(categoryTypes);
    this.filtersObj = this.sharedService.getScInitFiltersData();
  }

  private getFiltersObj() {
    return this.sharedService.getScFiltersObj(this.filtersObj);
  }

  private loadTableData() {
    const queryObj = {
      ...this.getFiltersObj(),
      skip: this.page.pageNumber * this.page.limit,
      limit: this.page.limit
    };

    this.api.getStoreCategoryList(queryObj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: any) => {
        this.initPage(data);
        this.isPageLoaded = true;
        this.cd.markForCheck();
      });
  }

  private initSorts() {
    this.sorts = [{prop: 'category_number', dir: 'desc'}];
  }
}
