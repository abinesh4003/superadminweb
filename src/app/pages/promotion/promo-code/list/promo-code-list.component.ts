import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaginationPage } from '@app/core/models';
import { StorageService } from '@app/core/services/storage.service';
import { PagesService } from '@app/pages/pages.service';
import { PromoCodeListFilterSettingsService } from '@app/pages/promotion/promo-code/list/promo-code-list-filter-settings.service';
import { PromoCodeListService } from '@app/pages/promotion/promo-code/list/promo-code-list.service';
import { PromoService } from '@app/pages/promotion/promo-code/promo.service';
import { skip } from 'rxjs/operators/skip';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-promo-code-list',
  templateUrl: 'promo-code-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromoCodeListComponent implements OnInit, OnDestroy {
  isPageLoaded = false;
  filterFormSettings$;
  filtersObj: any = {};
  page: PaginationPage;
  rows: any[];
  customerTypes: any[];
  perms;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private service: PromoCodeListService,
    private filterSettingsService: PromoCodeListFilterSettingsService,
    private storage: StorageService,
    private promoService: PromoService,
    private pagesService: PagesService
  ) {
  }

  ngOnInit() {
    this.perms = this.promoService.getPermissions(this.route);
    this.service.getPromoCodeDropdownValues()
      .subscribe(({customer_type}) => {
        this.customerTypes = customer_type;
        this.handleRowsLimit();
        this.initFiltersData();
        this.resetPageOffset();
        this.isPageLoaded = true;
      });
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

    this.service.getPromoCodesList(queryObj)
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
