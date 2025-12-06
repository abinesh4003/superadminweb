import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@app/pages/admin/users/user/user.service';
import { UsersPermissionsConstants } from '@app/pages/admin/users/users-permissions.constants';
import { PagesService } from '@app/pages/pages.service';
import { AppState, getActiveUserId, getUserPageType } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import { NgxPermissionsService } from 'ngx-permissions';
import { zip } from 'rxjs/observable/zip';
import { concatMap } from 'rxjs/operators/concatMap';
import { map } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-user-roles',
  templateUrl: 'user-roles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserRolesComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  form: FormGroup;
  roles: any[] = [];
  pageType: string;
  perms = UsersPermissionsConstants;

  constructor(
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private store: Store<AppState>,
    private pagesService: PagesService,
    private permissionsService: NgxPermissionsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    zip(
      this.getRoles(),
      this.store.select(getUserPageType)
    )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([roles, page]) => {
        this.roles = roles;
        this.pageType = page;
        this.initBreadcrumb();
        this.cd.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSave() {
    const ids = this.roles
      .filter(({checked}) => checked)
      .map(({id}) => id);

    this.store.select(getActiveUserId)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap((id) => this.userService.updateUser(id, {role: ids}))
      )
      .subscribe();
  }

  onToggleRole(val, role) {
    role.checked = val;
  }

  isViewPage() {
    return this.pageType === 'view';
  }

  isDisabledRole(role) {
    return this.isCheckedSuperAdmin(role);
  }

  isDisabledForm() {
    return this.store.select(getActiveUserId)
      .pipe(
        map((userId) => {
          return this.isViewPage()
            || userId === this.pagesService.getLoggedUserId()
            || !this.permissionsService.getPermission(this.perms.create);
        })
      );
  }

  private isCheckedSuperAdmin(role) {
    const saRole = this.roles.find(({is_super_admin}) => is_super_admin);

    return !!saRole && saRole.checked && saRole !== role;
  }

  private initBreadcrumb() {
    this.userService.dispatchBreadcrumb(false)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  private getRoles() {
    const superAdmin = this.activatedRoute.parent.snapshot.data['isSuperAdmin'];

    return this.store.select(getActiveUserId)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        concatMap(id => this.userService.getRoles(id, superAdmin))
      );
  }
}
