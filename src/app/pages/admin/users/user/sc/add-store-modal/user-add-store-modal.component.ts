import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ScFilterSettingsService } from '@app/pages/admin/shared/sc-filter-settings.service';
import { SharedService } from '@app/pages/admin/shared/shared.service';
import { UserService } from '@app/pages/admin/users/user/user.service';
import { AppState, getActiveUser, getActiveUserId } from '@app/store/root-reducer';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { zip } from 'rxjs/observable/zip';
import { delay } from 'rxjs/operators/delay';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-user-add-store-modal',
  templateUrl: 'user-add-store-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserAddStoreModalComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  isPageLoaded = false;
  filterFormSettings;
  filtersObj: any = {};
  stores: any[] = [];
  isSelectedAll = false;
  userCategoriesIds: string[];

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private filterSettingsService: ScFilterSettingsService,
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private store: Store<AppState>,
    private sharedService: SharedService
  ) {}

  ngOnInit() {

    this.store.select(getActiveUserId)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        delay(100),
        mergeMap(((id) => this.userService.getCategoryTypes(id)))
      )
      .subscribe((categoryTypes) => {
        this.initFiltersData(categoryTypes);
        this.loadTableData();
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  close(): void {
    this.ngbActiveModal.close(this.getCheckedIds());
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }

  onToggleStore(value, store) {
    store.checked = value;
  }

  onFilter(filtersObj) {
    this.filtersObj = filtersObj;
    this.loadTableData();
  }

  onSelectAll(val) {
    this.isSelectedAll = val;

    const selectedStores  = val ? this.stores : [];
    const selectedStoresIds = selectedStores.map(({_id}) => _id);
    this.stores = this.getFormattedCategories(this.stores, selectedStoresIds);
  }

  private getCheckedIds() {
    const storeIds = this.stores.map(({_id}) => _id);
    const missedStores = this.userCategoriesIds.filter(id => !storeIds.includes(id));
    const checkedStores = this.stores
      .filter(({checked}) => checked)
      .map(({_id}) => _id);

    const allIds = [].concat(checkedStores).concat(missedStores);

    return Array.from(new Set(allIds));
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

    zip(
      this.getUserCategories(queryObj),
      this.store.select(getActiveUser)
    )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([{docs: categories}, user]) => {
        this.userCategoriesIds = user && user.category || [];
        this.stores = this.getFormattedCategories(categories, this.userCategoriesIds);
        this.isSelectedAll = (this.userCategoriesIds.length === this.stores.length);
        this.cd.markForCheck();
      });
  }

  private getUserCategories(queryObj) {
    return this.store.select(getActiveUserId)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        mergeMap((id) => this.userService.getUsersUserCategories(id, queryObj))
      );
  }

  private getFormattedCategories(categories, selectedCategories) {
    if (!categories || !categories.length) {
      return [];
    }

    return categories.map((category) => {
      return {
        ...category,
        checked: selectedCategories.includes(category._id)
      };
    });
  }
}
