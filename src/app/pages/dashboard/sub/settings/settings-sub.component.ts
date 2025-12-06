import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { IdName } from '@app/core/models';
import { getSubCategoryId, AppState } from '@app/store/root-reducer';
import { SettingSubService } from './setting-sub.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
import { switchMap } from 'rxjs/operators/switchMap';
import { tap } from 'rxjs/operators/tap';

@Component({
  selector: 'pkz-settings-sub',
  templateUrl: 'setting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsSubComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  tabs: IdName[];
  activeTabId$: Observable<number>;
  categoryId: any;
  constructor(private settingSubService: SettingSubService,
    private store: Store<AppState>
  ) {
  }

  ngOnInit() {
    this.store.select(getSubCategoryId)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(this.initAssociatedData.bind(this)),
        switchMap(() => {
          return this.getItemData(this.categoryId);
        })
      )
      .subscribe((data) => {
        this.tabs = this.settingSubService.getTabItems(data.data.type);
        if (this.tabs[0]) {
          this.settingSubService.changeShopsStatusTab(this.tabs[0].id);
        }
      });
    this.activeTabId$ = this.settingSubService.getActiveTabId();

  }

  private initAssociatedData(categoryId) {
    if (this.categoryId !== categoryId) {
      this.categoryId = categoryId;
    }
  }

  private getItemData(categoryId) {
    if (categoryId) {
      return this.settingSubService.getCategorySettings(categoryId);
    }

  }
  onSelectTab(tab) {
    this.settingSubService.changeShopsStatusTab(tab.id);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
