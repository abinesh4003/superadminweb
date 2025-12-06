import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  PROMOTION_BROADCAST_STATUS_APPROVED,
  PROMOTION_BROADCAST_STATUS_REJECTED,
  PROMOTION_BROADCAST_STATUS_REQUEST,
  PROMOTION_BROADCAST_STATUS_SENT
} from '@app/core/constants';
import { PaginationPage } from '@app/core/models';
import { StorageService } from '@app/core/services/storage.service';
import { BroadcastListFilterSettingsService } from '@app/pages/promotion/broadcast/list/broadcast-list-filter-settings.service';
import { BroadcastListService } from '@app/pages/promotion/broadcast/list/broadcast-list.service';
import { PromotionBroadcastService } from '@app/pages/promotion/broadcast/promotion-broadcast.service';
import { skip } from 'rxjs/operators/skip';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  templateUrl: 'broadcast-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BroadcastListComponent implements OnInit, OnDestroy {
  isPageLoaded = true;
  filterFormSettings$;
  filtersObj: any = {};
  page: PaginationPage;
  rows: any[];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private service: BroadcastListService,
    private filterSettingsService: BroadcastListFilterSettingsService,
    private storage: StorageService,
    private promotionBroadcastService: PromotionBroadcastService
  ) {
  }

  ngOnInit() {
    this.handleRowsLimit();
    this.initFiltersData();
    this.resetPageOffset();
  }

  get isMerchantsPage() {
    return this.promotionBroadcastService.isMerchantsPage(this.route);
  }

  get isBayFayPage() {
    return this.promotionBroadcastService.isBayFayPage(this.route);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onFilter(filtersObj) {
    this.filtersObj = filtersObj;
    this.resetPageOffset();
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.loadTableData();
  }

  isRequestTab() {
    return this.filtersObj.status === PROMOTION_BROADCAST_STATUS_REQUEST;
  }

  isSentTab() {
    return this.filtersObj.status === PROMOTION_BROADCAST_STATUS_SENT;
  }

  isApprovedTab() {
    return this.filtersObj.status === PROMOTION_BROADCAST_STATUS_APPROVED;
  }

  isRejectedTab() {
    return this.filtersObj.status === PROMOTION_BROADCAST_STATUS_REJECTED;
  }

  private resetPageOffset() {
    this.setPage({offset: 0});
  }

  private initFiltersData() {
    this.filterFormSettings$ = this.filterSettingsService.getFilterSettings();
    this.filtersObj = this.service.getInitFiltersData();
  }

  private loadTableData() {
    const queryObj = {
      ...this.service.getFiltersObj(this.filtersObj),
      skip: this.page.pageNumber * this.page.limit,
      limit: this.page.limit
    };

    this.service.getList(queryObj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: any) => {
        this.initPage(data);
        this.isPageLoaded = true;
        this.cd.detectChanges();
      });
  }

  private initPage({data, count}): void {
    this.rows = data ? data : [];
    this.page.count = count;
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
}
