import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationPage } from '@app/core/models';
import { ConstantsService } from '@app/core/services/constants.service';
import { StorageService } from '@app/core/services/storage.service';
import { PagesService } from '@app/pages/pages.service';
import { PromotionAdsMerchantsPermissionsConstants } from '@app/pages/promotion/ads/promotion-ads-permissions.constants';
import { MerchantsAdsListFilterSettingsService } from './merchants-ads-list-filter-settings.service';
import { MerchantsAdsListService } from '@app/pages/promotion/ads/merchants-ads/list/merchants-ads-list.service';
import { skip } from 'rxjs/operators/skip';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-merchants-ads-list',
  templateUrl: 'merchants-ads-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MerchantsAdsListComponent implements OnInit, OnDestroy {
  isPageLoaded = true;
  filterFormSettings$;
  filtersObj: any = {};
  page: PaginationPage;
  rows: any[];
  perms = PromotionAdsMerchantsPermissionsConstants;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private cd: ChangeDetectorRef,
    private service: MerchantsAdsListService,
    private filterSettingsService: MerchantsAdsListFilterSettingsService,
    private storage: StorageService,
    private constantsService: ConstantsService,
    private router: Router,
    private route: ActivatedRoute,
    private pagesService: PagesService
  ) {
  }

  ngOnInit() {
    this.handleRowsLimit();
    this.initFiltersData();
    this.resetPageOffset();
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

  getAdName(id) {
    return this.constantsService.getNameById(id, 'promotion_merchants_ads_types');
  }

  onCreateAd() {
    this.router.navigate(['add'], {relativeTo: this.route});
  }

  hasPermission(perm) {
    return this.pagesService.hasPermission(perm);
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
