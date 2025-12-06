import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationPage } from '@app/core/models';
import { StorageService } from '@app/core/services/storage.service';
import { ShopInventoryFilterSettingsService } from '@app/pages/dashboard/sub/shops/inventory/shop-inventory-filter-settings.service';
import { ShopInventoryService } from '@app/pages/dashboard/sub/shops/inventory/shop-inventory.service';
import { ShopsSubService } from '@app/pages/dashboard/sub/shops/shops-sub.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { skip } from 'rxjs/operators/skip';
import { concatMap } from 'rxjs/operators/concatMap';
import { switchMap } from 'rxjs/operators/switchMap';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';

@Component({
  selector: 'pkz-shop-inventory',
  templateUrl: 'shop-inventory.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopInventoryComponent implements OnInit, OnDestroy {
  isPageLoaded = false;
  rootBreadcrumbName: string;
  storeData;
  filterFormSettings$: Observable<any[]>;
  filterValues: any = {};
  origData;
  rows: any[];
  page: PaginationPage;
  imageOptions = { path: 'inv/img/vw', width: 0, height: 150 };

  private reInitData: BehaviorSubject<number> = new BehaviorSubject(Date.now());
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private tabId: number;
  private storeId: string;
  private categoryId: string;
  private pageType: string;

  constructor(
    private shopsSubService: ShopsSubService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private service: ShopInventoryService,
    private cd: ChangeDetectorRef,
    private filterSettingsService: ShopInventoryFilterSettingsService,
    private storage: StorageService
  ) {}

  ngOnInit() {
    this.handleUrlParams();
    this.handleRowsLimit();

    this.shopsSubService.getItemData(this.categoryId, this.storeId)
      .pipe(
        concatMap((storeData) => {
          this.storeData = storeData;
          this.page.pageNumber = 0;
          this.initFiltersData();
          return this.reInitData.asObservable();
        }),
        switchMap(() => this.getShopInventoryList()),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((data) => {
        this.setTableData(data);
        this.isPageLoaded = true;
        this.cd.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onFilter(filterValues) {
    this.filterValues = filterValues;
    this.resetPageOffset();
  }

  private resetPageOffset() {
    this.setPage({offset: 0});
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.runReinitData();
  }

  private runReinitData() {
    this.reInitData.next(Date.now());
  }

  private getShopInventoryList() {
    return this.service.getShopInventoryList(this.categoryId, this.storeId, this.getQueryObj());
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

  private getQueryObj() {
    const {text, category, type} = this.filterValues;
    return {
      text,
      type: type === 0 ? null : type,
      category,
      skip: this.page.pageNumber * this.page.limit,
      limit: this.page.limit,
    };
  }

  private setTableData(data) {
    if (!data || !data.product_details) {
      this.rows = [];
      this.origData = null;
      return;
    } else {
      this.rows = data.product_details;
      this.origData = data;
      this.page.count = data.total;
    }
  }

  private initFiltersData() {
    const types = this.service.getBarcodeTypes();
    this.filterValues = {
      type: types[0].id,
      text: '',
      category: ''
    };
    this.filterFormSettings$ = this.filterSettingsService.getFilterSettings(this.categoryId);
  }

  onViewStore(event) {
    event.preventDefault();
    const queryParams = {
      tabId: this.tabId
    };
    this.router.navigate(['../shops/view', this.storeData._id], {
      relativeTo: this.activatedRoute.parent, queryParams
    });
  }

  private handleUrlParams() {
    this.storeId = this.activatedRoute.snapshot.params['id'];
    this.tabId = +this.activatedRoute.snapshot.queryParams['tabId'];
    this.pageType = this.activatedRoute.snapshot.queryParams['page'];
    this.categoryId = this.activatedRoute.snapshot.queryParams['category'];
    this.shopsSubService.changeShopsStatusTab(this.tabId);
    this.rootBreadcrumbName = this.shopsSubService.getStatusName(this.tabId);
  }
}
