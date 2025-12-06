import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IdName, PaginationPage } from '@app/core/models/common.models';
import { ConstantsService } from '@app/core/services/constants.service';
import { StorageService } from '@app/core/services/storage.service';
import { ScFilterSettingsService } from '@app/pages/admin/shared/sc-filter-settings.service';
import { SharedService } from '@app/pages/admin/shared/shared.service';
import { UserAddStoreModalComponent } from '@app/pages/admin/users/user/sc/add-store-modal/user-add-store-modal.component';
import { UserService } from '@app/pages/admin/users/user/user.service';
import { UsersPermissionsConstants } from '@app/pages/admin/users/users-permissions.constants';
import { PagesService } from '@app/pages/pages.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { AppState, getActiveUser, getActiveUserId, getUserPageType } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { first } from 'rxjs/operators/first';
import { concatMap } from 'rxjs/operators/concatMap';
import { map } from 'rxjs/operators/map';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { tap } from 'rxjs/operators/tap';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-user-sc',
  templateUrl: 'user-sc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserScComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  filterFormSettings;
  isPageLoaded = false;
  rows$: Observable<any[]>;
  allRows: any[];
  page: PaginationPage;
  filtersObj: any = {};
  types: IdName[];
  pageType: string;
  userId: string;
  perms = UsersPermissionsConstants;
  imageOptions = {path: 'sc/img/vw', width: 0, height: 60};

  constructor(
    private filterSettingsService: ScFilterSettingsService,
    private modalService: ModalService,
    private storage: StorageService,
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private constantsService: ConstantsService,
    private store: Store<AppState>,
    private pagesService: PagesService,
    private sharedService: SharedService,
  ) {}

  ngOnInit() {
    zip(
      this.store.select(getActiveUserId),
      this.store.select(getUserPageType)
    )
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(([userId, page]) => {
          this.pageType = page;
          this.userId = userId;
        }),
        mergeMap(() => {
          return zip(
            this.userService.getCategoryTypes(this.userId),
            this.userService.dispatchBreadcrumb(false)
          );
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(([types]) => {
        this.types = types;
        this.handleRowsLimit();
        this.initFiltersData(types);
        this.loadTableData();
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onFilter(filtersObj) {
    this.filtersObj = filtersObj;
    this.loadTableData();
  }

  addStore() {
    this.modalService.open(UserAddStoreModalComponent, {
      options: {
        windowClass: 'modal-size-1000'
      }
    })
      .pipe(
        takeUntil(this.ngUnsubscribe),
        concatMap((categoriesIds) => {
          return this.userService.updateUser(this.userId, {category: categoriesIds});
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  onDelete(event, row) {
    event.preventDefault();

    this.pagesService.confirmActionModal(row.display_name)
      .pipe(
        concatMap(() => this.store.select(getActiveUser)),
        first(),
        takeUntil(this.ngUnsubscribe),
        concatMap((user) => {
          const userCategoryIds = this.getUserCategories(user).slice();
          const index = userCategoryIds.indexOf(row._id);

          if (index !== -1) {
            userCategoryIds.splice(index, 1);
          }

          return this.userService.updateUser(this.userId, {category: userCategoryIds});
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
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

  isEditPage() {
    return this.pageType === 'edit';
  }

  private initPage({docs}): void {
    this.allRows = docs;
    this.rows$ = this.filterUserRows(docs);
  }

  private filterUserRows(rows) {
    return this.store.select(getActiveUser)
      .pipe(map(user => {
        const userCategories = this.getUserCategories(user);

        return rows.filter(({_id}) => userCategories.includes(_id));
      }));
  }

  private getUserCategories(user) {
    const userCategories = user && user.category;

    if (!userCategories || !userCategories.length) {
      return [];
    }

    return userCategories;
  }

  private handleRowsLimit() {
    this.page = new PaginationPage();
    this.page.setLimit(this.storage.getRowsPerPage());
    this.storage.observeRowsPerPage()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(key => {
        this.page.setLimit(key);
        this.cd.markForCheck();
      });
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
      skip: null,
      limit: null
    };

    this.userService.getUsersUserCategories(this.userId, queryObj)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: any) => {
        this.initPage(data);
        this.isPageLoaded = true;
        this.cd.markForCheck();
      });
  }
}
