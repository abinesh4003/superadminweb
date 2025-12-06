import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '@app/core/models';
import { RoleService } from '@app/pages/admin/roles/role/role.service';
import { RolesPermissionsConstants } from '@app/pages/admin/roles/roles-permissions.constants';
import { RolesService } from '@app/pages/admin/roles/roles.service';
import { AppState, getActiveRole } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators/tap';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-role',
  templateUrl: 'role.component.html',
  styleUrls: ['./role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  tabs: any[] = [];
  role$: Observable<Role>;
  perms = RolesPermissionsConstants;

  constructor(
    private activatedRoute: ActivatedRoute,
    private roleService: RoleService,
    private store: Store<AppState>,
    private cd: ChangeDetectorRef,
    private router: Router,
    private rolesService: RolesService,
  ) {}

  ngOnInit() {
    this.initTab();

    this.role$ = this.store.select(getActiveRole);
    this.activatedRoute.params
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(({id}) => this.roleService.dispatchActiveRoleId(id))
      )
      .subscribe(() => {
        this.tabs = this.roleService.getRoleTabs(this.activatedRoute);
        this.cd.markForCheck();
      });
  }

  onDelete(event, role) {
    event.preventDefault();

    this.roleService.deleteRole(role, this.activatedRoute.parent)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  onEdit(event, role) {
    event.preventDefault();

    this.rolesService.editRoleModal(role)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private initTab() {
    const tabRoute = this.router.url.split('/')[5];
    this.roleService.dispatchRoleTab(tabRoute);
  }
}
