import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RoleUser } from '@app/core/models/admin.models';
import { RoleService } from '@app/pages/admin/roles/role/role.service';
import { RolesPermissionsConstants } from '@app/pages/admin/roles/roles-permissions.constants';
import { RolesService } from '@app/pages/admin/roles/roles.service';
import { AppState, getActiveRole } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
import { ADMIN_TAB } from '../role.constants';

@Component({
  selector: 'pkz-role-admin',
  templateUrl: 'role-admin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleAdminComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  rows: any[] = [];
  selectedItems = [];
  users$: Observable<RoleUser[]>;
  perms = RolesPermissionsConstants;

  constructor(
    private roleService: RoleService,
    private rolesService: RolesService,
    private store: Store<AppState>,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.users$ = this.store.select(getActiveRole)
      .pipe(map((role) => role.users));
    this.roleService.dispatchRoleTab(ADMIN_TAB);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSelect({selected}) {
    const filtered = selected.filter(item => !this.isCurrentUser(item));
    this.selectedItems.splice(0, this.selectedItems.length);
    this.selectedItems.push(...filtered);
  }

  isCurrentUser(row) {
    return row._id === this.rolesService.getLoggedUserId();
  }

  onAssignAdmins() {
    this.roleService.assignAdminsModal()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  onUnassignAdmins() {
    const users = this.selectedItems.map(({_id}) => _id);

    if (!users.length) {
      return;
    }

    this.roleService.unassignAdminsModal({users})
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.selectedItems = [];
        this.cd.markForCheck();
      });
  }
}

