import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RolesPermissionsConstants } from '@app/pages/admin/roles/roles-permissions.constants';
import { RolesService } from '@app/pages/admin/roles/roles.service';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-roles',
  templateUrl: './roles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  navItems$: Observable<any[]>;
  groups: any[];
  perms = RolesPermissionsConstants;

  constructor(
    private rolesService: RolesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.navItems$ = this.rolesService.getNavTabsWithRole(this.activatedRoute);
    this.groups = this.rolesService.getNavGroups();
    this.initRolesList();
    this.handleRouterChange();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onAddRole() {
    this.rolesService.addRoleModal(this.activatedRoute)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  private initRolesList() {
    this.rolesService.initRolesList()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  private handleRouterChange() {
    this.redirectToDefaultRoute();

    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.redirectToDefaultRoute();
      }
    });
  }

  private redirectToDefaultRoute() {
    this.rolesService.redirectToDefaultRoute(this.activatedRoute)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }
}
