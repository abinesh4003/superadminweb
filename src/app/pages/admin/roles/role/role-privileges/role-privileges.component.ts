import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RolePrivilegesService } from '@app/pages/admin/roles/role/role-privileges/role-privileges.service';
import { PRIVILEGES_TAB } from '@app/pages/admin/roles/role/role.constants';
import { RoleService } from '@app/pages/admin/roles/role/role.service';
import { RolesPermissionsConstants } from '@app/pages/admin/roles/roles-permissions.constants';
import { RolesService } from '@app/pages/admin/roles/roles.service';
import { AppState, getActiveRole, getActiveRoleId } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import { NgxPermissionsService } from 'ngx-permissions';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-role-privileges',
  templateUrl: 'role-privileges.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    RolePrivilegesService
  ]
})
export class RolePrivilegesComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false
  });
  items: TreeviewItem[];
  perms = RolesPermissionsConstants;
  isEditAllowed: boolean;
  activeRoleId: string;

  constructor(
    private roleService: RoleService,
    private rolesService: RolesService,
    private rolePrivilegesService: RolePrivilegesService,
    private cd: ChangeDetectorRef,
    private permissionsService: NgxPermissionsService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.roleService.dispatchRoleTab(PRIVILEGES_TAB);

    this.store.select(getActiveRole)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((role) => {
        this.isEditAllowed = !!this.permissionsService.getPermission(this.perms.edit) && role.is_editable;
      });

    this.store.select(getActiveRoleId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((activeRoleId) => {
        this.activeRoleId = activeRoleId;
      });

    this.rolePrivilegesService.getPrivileges()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((items) => {
        this.items = items;
        this.cd.markForCheck();
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSave() {
    const privileges = this.rolePrivilegesService.prepareItemsForSubmit(this.items);

    this.rolesService.updateRolesRole(this.activeRoleId, {privileges})
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }
}

