import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { SC_TYPE_PUBLIC } from '@app/core/constants';
import { ShopListActiveFilterSettingsService } from './shop-list-active-filter-settings.service';
import { ShopListWfrFilterSettingsService } from './shop-list-wfr-filter-settings.service';
import { Store } from '@ngrx/store';
import { TableColumn } from '@swimlane/ngx-datatable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { tap } from 'rxjs/operators/tap';
import { switchMap } from 'rxjs/operators/switchMap';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
import { PaginationPage } from '@app/core/models/common.models';
import { AppState, getSubCategoryId, getShopStatusTab } from '@app/store/root-reducer';
import { StorageService } from '@app/core/services/storage.service';
import { PagesService } from '@app/pages/pages.service';
import { ShopsSubService } from '../shops-sub.service';
import { ShopListService } from './shop-list.service';
import { zip } from 'rxjs/observable/zip';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'pkz-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    ShopListWfrFilterSettingsService,
    ShopListActiveFilterSettingsService
  ]
})
export class ShopListComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private categoryId: string;
  private tabId: number;
  private reInitData: BehaviorSubject<number> = new BehaviorSubject(Date.now());

  rows: any[];
  isPageLoaded = false;
  selectedStores: any[] = [];
  page: PaginationPage;
  filterFormSettings$: Observable<any[]>;
  filterValues: any = {};
  perms;
  selectedAssignUser = '';
  selectedViewUser = '';
  assignUsers: any[];
  origColumns: any[];
  columns: TableColumn[];
  origData: any;
  imageOptions = { path: 'shop/ick/vw', width: 0, height: 60 };
  latitude: number;
  longitude: number;
  distance: number;
  isPrivate = false;
  listRadius;

  searchControl: FormControl;
  zoom: number;
  location: string;

  @ViewChild('search')
  searchElementRef: ElementRef;

  constructor(
    private cd: ChangeDetectorRef,
    private store: Store<AppState>,
    private shopsSubService: ShopsSubService,
    private shopListService: ShopListService,
    private storage: StorageService,
    private wfrFilterSettingsService: ShopListWfrFilterSettingsService,
    private activeFilterSettingsService: ShopListActiveFilterSettingsService,
    private pagesService: PagesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.listRadius = this.shopsSubService.getListOfRadiuses();

    this.handleRowsLimit();
    combineLatest(
      this.store.select(getSubCategoryId),
      this.store.select(getShopStatusTab),
      this.reInitData
    )
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(this.initAssociatedData.bind(this)),
        switchMap(() => {
          return zip(
            this.getDashboardShopsStores(),
            this.getAssignUsers()
          );
        })
      )
      .subscribe(([data, assignUsers]) => {
        this.setTableData(data);
        this.isPageLoaded = true;
        this.assignUsers = assignUsers;
        this.cd.markForCheck();
      });

    /**  create search FormControl */
    this.searchControl = new FormControl();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
    this.setPage({ offset: 0 });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.reInitData.next(Date.now());
  }

  private setTableData(data) {
    this.origData = data;
    this.page.count = data.count;
    this.rows = data.docs;
    this.initCols();
  }

  private initAssociatedData([categoryId, tabId]) {
    if (this.tabId !== tabId || this.categoryId !== categoryId) {
      this.categoryId = categoryId;
      this.tabId = tabId;
      this.page.pageNumber = 0;
      this.initFiltersData();
      this.perms = this.shopsSubService.getPermissions(tabId);
    }
  }

  private initFiltersData() {
    if (this.isWFRTab()) {
      this.initWFRFiltersData();
    } else if (this.isActiveTab()) {
      this.initActiveFiltersData();
    }
  }

  private initWFRFiltersData() {
    const statuses = this.shopListService.getStatuses(this.tabId);
    this.filterValues = {
      status: statuses[0].id,
      text: '',
      location: ''
    };

    this.filterFormSettings$ = this.wfrFilterSettingsService.getFilterSettings(this.tabId);
  }

  private initActiveFiltersData() {
    const statuses = this.shopListService.getStatuses(this.tabId);
    this.filterValues = {
      type: SC_TYPE_PUBLIC,
      status: statuses[0].id,
      location: '',
      text: ''
    };

    this.filterFormSettings$ = this.activeFilterSettingsService.getFilterSettings(this.tabId);
  }

  private getDashboardShopsStores() {
    return this.shopListService.getDashboardShopsStores(this.categoryId, this.getQueryObj(), this.tabId);
  }

  private getQueryObj() {
    const status = this.shopListService.getStatusesForQuery(this.filterValues.status, this.tabId);
    const base = {
      status,
      text: this.filterValues.text,
      location: this.filterValues.location,
      skip: this.page.pageNumber * this.page.limit,
      limit: this.page.limit
    };

    if (this.isWFRTab()) {
      return {
        ...base,
        user_id: this.getUserId()
      };
    } else if (this.isActiveTab()) {
      const { latitude, longitude, distance } = this.getLocationParams();
      return {
        ...base,
        type: this.filterValues.type,
        isPrivate: this.isPrivate,
        longitude,
        latitude,
        distance
      };
    }
  }

  private getLocationParams() {
    const distance = this.distance ? this.distance * 1000 : null;

    if (!distance || !this.latitude || !this.longitude) {
      return {
        distance: null,
        latitude: null,
        longitude: null
      };
    }

    return {
      distance,
      latitude: this.latitude,
      longitude: this.longitude
    };
  }

  private getUserId() {
    if (this.hasPermission(this.perms.manage)) {
      return this.selectedViewUser;
    } else if (this.isActiveTab()) {
      return '';
    } else {
      return this.pagesService.getLoggedUserId();
    }
  }

  hasPermission(perm) {
    return this.pagesService.hasPermission(perm);
  }

  isActiveTab() {
    return this.shopsSubService.isActiveTab(this.tabId);
  }

  isWFRTab() {
    return this.shopsSubService.isWFRTab(this.tabId);
  }

  onChangeColumns(columns) {
    this.columns = [...columns];
  }

  onFilter(filterValues) {
    this.filterValues = filterValues;
    this.resetPageOffset();
  }

  private getAssignUsers() {
    return this.shopListService.getAssignUsers(this.categoryId);
  }

  isAllowedAssign() {
    return this.shopsSubService.isWFRTab(this.tabId);
  }

  isDisabledAssignButton() {
    return !this.selectedAssignUser || !this.selectedStores.length;
  }

  onAssign() {
    const data = {
      _id: this.selectedAssignUser,
      stores: this.selectedStores.map(({ _id }) => _id)
    };

    this.shopListService.assignStores(this.categoryId, data)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.selectedStores = [];
        this.reInitData.next(Date.now());
        this.selectedAssignUser = '';
        this.cd.markForCheck();
      });
  }

  onDeleteStores() {
    this.shopListService.deleteStoresModal(this.selectedStores)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.selectedStores = [];
        this.resetPageOffset();
      });
  }

  onSelect({ selected }) {
    this.selectedStores = selected;
  }

  onChangeViewUser(user) {
    this.selectedViewUser = user;
    this.resetPageOffset();
  }

  onViewLocation(event, coordinates) {
    event.preventDefault();
    this.shopListService.viewLocation(coordinates);
  }

  onEditStore(event, store) {
    event.preventDefault();
    this.navigateToStoreDetails(['edit', store._id]);
  }

  private navigateToStoreDetails(commands) {
    const queryParams = {
      tabId: this.tabId,
      amountOfShop: this.page.count
    };
    this.router.navigate(commands, { relativeTo: this.activatedRoute, queryParams });
  }

  onSettings(event, row) {
    event.preventDefault();

    const page = this.hasPermission(this.perms.edit) ? 'edit' : 'view';
    const queryParams = {
      tabId: this.tabId,
      page
    };
    this.router.navigate(['settings', row._id], { relativeTo: this.activatedRoute, queryParams });
  }

  onViewStore(event, store) {
    event.preventDefault();
    this.navigateToStoreDetails(['view', store._id]);
  }

  onPrivateChange(value) {
    this.isPrivate = value;

    this.resetPageOffset();
  }

  onDistanceChange(value) {
    this.distance = value;

    this.callSearchByLocation();
  }

  onLatitudeChange(value) {
    this.latitude = value;

    this.callSearchByLocation();
  }

  onLongitudeChange(value) {
    this.longitude = value;

    this.callSearchByLocation();
  }

  private callSearchByLocation() {
    if (this.distance && this.longitude && this.latitude) {
      this.resetPageOffset();
    }
  }

  private initCols() {
    this.origColumns = this.shopListService.getFormattedColumns(this.origData);
    this.columns = [...this.origColumns];
  }

  findOnMap() {

  }
}
