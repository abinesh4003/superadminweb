import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DB_INV_STATUS_M_DRAFT } from '@app/core/constants';
import { PaginationPage } from '@app/core/models/common.models';
import { StorageService } from '@app/core/services/storage.service';
import { InventoryService } from '@app/pages/dashboard/sub/inventory/inventory.service';
import { BulkUploadModalService } from '@app/pages/dashboard/sub/inventory/list/bulk-upload-modal/bulk-upload-modal.service';
import { InventoryListFilterSettingsService } from '@app/pages/dashboard/sub/inventory/list/inventory-list-filter-settings.service';
import { InventoryListService } from '@app/pages/dashboard/sub/inventory/list/inventory-list.service';
import { PagesService } from '@app/pages/pages.service';
import { AppState, getSubCategoryId, getInventoryStatusTab, isUpcInventoryTab } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import { TableColumn } from '@swimlane/ngx-datatable/release/types/table-column.type';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { zip } from 'rxjs/observable/zip';
import { tap } from 'rxjs/operators/tap';
import { switchMap } from 'rxjs/operators/switchMap';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
import { saveAs } from 'file-saver/FileSaver';

@Component({
  selector: 'pkz-inventory-list',
  styleUrls: ['./inventory-list.component.scss'],
  templateUrl: 'inventory-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    InventoryListFilterSettingsService
  ]
})
export class InventoryListComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private categoryId: string;
  private tabId: number;
  private reInitData: BehaviorSubject<number> = new BehaviorSubject(Date.now());

  rows: any[];
  columns: TableColumn[];
  origData: any;
  isPageLoaded = false;
  selectedProducts: any[] = [];
  origColumns: any[];
  isTableView = true;
  page: PaginationPage;
  filterFormSettings$: Observable<any[]>;
  filterValues: any = {};
  isUpcTab = true;
  perms;
  assignUsers: any[];
  selectedAssignUser = '';
  selectedViewUser = '';
  imageOptions = {path: 'inv/img/vw', width: 80};

  constructor(
    private cd: ChangeDetectorRef,
    private store: Store<AppState>,
    private inventoryService: InventoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private inventoryListService: InventoryListService,
    private storage: StorageService,
    private filterSettingsService: InventoryListFilterSettingsService,
    private bulkUploadModalService: BulkUploadModalService,
    private pagesService: PagesService
  ) {}

  ngOnInit() {
    this.handleRowsLimit();

    combineLatest(
      this.store.select(getSubCategoryId),
      this.store.select(getInventoryStatusTab),
      this.store.select(isUpcInventoryTab),
      this.reInitData
    )
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(this.initAssociatedData.bind(this)),
        switchMap(() => {
          return zip(
            this.getDashboardInventoryProducts(),
            this.getAssignUsers()
          );
        })
      )
      .subscribe(([data, assignUsers]) => {
        this.setTableData(data);
        this.assignUsers = assignUsers;
        this.isPageLoaded = true;
        this.cd.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  hasPermission(perm) {
    return this.pagesService.hasPermission(perm);
  }

  onSelect({ selected }) {
    this.selectedProducts = selected;
  }

  onChangeColumns(columns) {
    this.columns = [...columns];
  }

  onSwitchView(value) {
    this.isTableView = value;
  }

  onDeleteProducts() {
    this.inventoryListService.deleteProductsModal(this.selectedProducts)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.selectedProducts = [];
        this.resetPageOffset();
      });
  }

  addProduct() {
    this.navigateToProductDetails(['add']);
  }

  onCopyProduct(event, product) {
    event.preventDefault();

    this.navigateToProductDetails(['copy', product._id], product);
  }

  onEditProduct(event, product) {
    event.preventDefault();

    this.navigateToProductDetails(['edit', product._id], product);
  }

  onViewProduct(event, product) {
    event.preventDefault();

    this.navigateToProductDetails(['view', product._id], product);
  }

  isDraftTab() {
    return this.inventoryService.isDraftTab(this.tabId);
  }

  isMDraftTab() {
    return this.inventoryService.isMDraftTab(this.tabId);
  }

  isWFRTab() {
    return this.inventoryService.isWFRTab(this.tabId);
  }

  isLiveTab() {
    return this.inventoryService.isLiveTab(this.tabId);
  }

  getStatusName(id): string {
    return this.inventoryService.getStatusName(id);
  }

  onFilter(filterValues) {
    this.filterValues = filterValues;
    this.resetPageOffset();
  }

  isAllowedAssign() {
    return this.isDraftTab() || this.isMDraftTab() || this.isWFRTab();
  }

  isAllowedAddProduct() {
    return this.isUpcTab && this.isDraftTab() || !this.isUpcTab && this.isMDraftTab();
  }

  isAllowedBulkUpload() {
    return this.isUpcTab && this.isDraftTab() || !this.isUpcTab && this.isMDraftTab();
  }

  isDeleteAllowed() {
    return this.isTableView && (this.isMDraftTab() || this.isDraftTab());
  }

  getStatusColumnWidth() {
    return this.inventoryListService.getStatusColumnWidth(this.tabId);
  }

  onBulkUpload() {
    this.bulkUploadModalService.openBulkUploadModal()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.resetPageOffset());
  }

  onDownloadProducts() {
    this.inventoryListService.getDashboardInventoryProductsDownload(this.selectedProducts)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(({blob, filename}) => {
        this.selectedProducts = [];
        saveAs(blob, filename);
        this.cd.detectChanges();
      });
  }

  goToBulkLog() {
    const queryParams = {
      tabId: this.tabId
    };

    this.router.navigate(['log'], {relativeTo: this.activatedRoute, queryParams});
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.runReinitData();
  }

  private runReinitData() {
    this.reInitData.next(Date.now());
  }

  onAssign() {
    const data = {
      _id: this.selectedAssignUser,
      products: this.selectedProducts.map(({_id}) => _id)
    };

    this.inventoryListService.assignProducts(this.tabId, this.isUpcTab, this.categoryId, data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.selectedProducts = [];
        this.selectedAssignUser = '';
        this.runReinitData();
        this.cd.markForCheck();
      });
  }

  isDisabledAssignButton() {
    return !this.selectedAssignUser || !this.selectedProducts.length;
  }

  onChangeViewUser(user) {
    this.selectedViewUser = user;
    this.resetPageOffset();
  }

  private getAssignUsers() {
    return this.inventoryListService.getAssignUsers(this.tabId, this.isUpcTab, this.categoryId);
  }

  private getDashboardInventoryProducts() {
    return this.inventoryListService.getDashboardInventoryProducts(this.getQueryObj());
  }

  private initAssociatedData([categoryId, tabId, isUpcTab]) {
    if (this.tabId !== tabId || this.categoryId !== categoryId) {
      this.categoryId = categoryId;
      this.tabId = tabId;
      this.isUpcTab = isUpcTab;
      this.page.pageNumber = 0;
      this.initFiltersData();
      this.perms = this.inventoryService.getPermissions(isUpcTab, tabId);
    }
  }

  private handleRowsLimit() {
    this.page = new PaginationPage();
    this.page.setLimit(this.storage.getRowsPerPage());
    this.storage.observeRowsPerPage()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(key => {
        this.page.setLimit(key);
        this.resetPageOffset();
      });
  }

  private resetPageOffset() {
    this.setPage({offset: 0});
  }

  private navigateToProductDetails(commands, product = null) {
    const queryParams = {
      tabId: this.tabId,
    };

    if (product) {
      queryParams['status'] = product.status;
    }

    this.router.navigate(commands, {relativeTo: this.activatedRoute, queryParams});
  }

  private getQueryObj() {
    const status = this.inventoryListService.getStatusesForQuery(this.filterValues.status, this.tabId);

    return {
      status,
      text: this.filterValues.text,
      user_id: this.getUserId(),
      skip: this.page.pageNumber * this.page.limit,
      limit: this.page.limit,
      added_by: this.inventoryListService.getAddedBy(this.isUpcTab, this.tabId),
      rejected_by: this.getRejectedBy()
    };
  }

  private getRejectedBy() {
    if (this.tabId === DB_INV_STATUS_M_DRAFT) {
      return 'reviewer';
    }

    return '';
  }

  private getUserId() {
    if (this.hasPermission(this.perms.manage)) {
      return this.selectedViewUser;
    } else if (this.isLiveTab()) {
      return '';
    } else {
      return this.pagesService.getLoggedUserId();
    }
  }

  private setTableData(data) {
    this.origData = data;
    this.page.count = data.total;
    this.rows = data.products;
    this.initCols();
  }

  private initFiltersData() {
    const statuses = this.inventoryListService.getStatuses(this.tabId);
    this.filterValues = {
      status: statuses[0].id,
      text: ''
    };
    this.filterFormSettings$ = this.filterSettingsService.getFilterSettings();
  }

  private initCols() {
    this.origColumns = this.inventoryListService.getFormattedColumns(this.origData.column);
    this.columns = [...this.origColumns];
  }
}
