import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ADMIN_USERS_STATUS_ALL } from '@app/core/constants/ids.constants';
import { UsersPermissionsConstants } from '@app/pages/admin/users/users-permissions.constants';
import { UsersFilterSettingsService } from '@app/pages/admin/users/users/users-filter-settings.service';
import { UsersService } from '@app/pages/admin/users/users.service';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-users',
  templateUrl: 'users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    UsersFilterSettingsService
  ]
})
export class UsersComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  filterFormSettings$;
  rows$: Observable<any[]>;
  filtersObj: any = {};
  perms = UsersPermissionsConstants;
  imageOptions = {path: 'spad/us/img/vw', width: 0, height: 60};

  constructor(
    private filterSettingsService: UsersFilterSettingsService,
    private usersService: UsersService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initFiltersData();
    this.loadTableData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onFilter(filtersObj) {
    this.filtersObj = filtersObj;
    this.loadTableData();
  }

  onDelete(event, row) {
    event.preventDefault();

    this.usersService.deleteUser(row._id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.loadTableData();
        this.cd.markForCheck();
      });
  }

  onSuspend(event, row) {
    event.preventDefault();
    row.log.is_active = false;

    this.usersService.suspendUser(row._id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  onUnsuspend(event, row) {
    event.preventDefault();
    row.log.is_active = true;

    this.usersService.unsuspendUser(row._id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  private initFiltersData() {
    this.filterFormSettings$ = this.filterSettingsService.getFilterSettings();
    this.filtersObj = {
      status: ADMIN_USERS_STATUS_ALL,
      text: '',
      role: ''
    };
  }

  private loadTableData() {
    const queryObj = {
      ...this.getFiltersObj()
    };

    this.rows$ = this.usersService.getUsersList(queryObj);
  }

  private getFiltersObj() {
    const { status, text, role } = this.filtersObj;

    return {
      status,
      text,
      role
    };
  }
}
