import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '@app/core/models';
import { RoleTab } from '@app/core/models/admin.models';
import { ApiService } from '@app/core/services/api.service';
import { RoleModalComponent } from '@app/pages/admin/roles/role-modal/role-modal.component';
import { PagesService } from '@app/pages/pages.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { AppState, getRoles, getRolesRoleTab } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import * as admin from '@app/store/actions/admin.actions';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators/switchMap';
import { concatMap } from 'rxjs/operators/concatMap';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { map } from 'rxjs/operators/map';
import { tap } from 'rxjs/operators/tap';

@Injectable()
export class RolesService {

  constructor(
    private pagesService: PagesService,
    private modalService: ModalService,
    private store: Store<AppState>,
    private api: ApiService,
    private router: Router
  ) {}

  addRoleModal(activatedRoute) {
    return this.modalService.open(RoleModalComponent)
      .pipe(
        switchMap(({name, description}) => {
          const userId = this.getLoggedUserId();
          return of({name, description, created_by: userId });
        }),
        concatMap((data) => this.api.addRolesRole(data)),
        concatMap((roleData) => this.initRolesList().map(() => roleData)),
        concatMap((roleData) => {
          const commands = [`${roleData._id}/privileges`];
          const extras = {relativeTo: activatedRoute.parent};
          const redirectPromise = this.router.navigate(commands, extras);
          return fromPromise(redirectPromise);
        })
      );
  }

  editRoleModal(role) {
    return this.modalService.open(RoleModalComponent, {
      data: {
        name: role.name,
        description: role.description
      }
    })
      .pipe(
        concatMap(({name, description}) => {
          return this.updateRolesRole(role._id, {name, description});
        })
      );
  }

  updateRolesRole(roleId, data) {
    const userId = this.getLoggedUserId();
    const submitData = {
      ...data,
      modified_by: userId
    };

    return this.api.updateRolesRole(roleId, submitData)
      .pipe(
        concatMap(() => this.initRolesList())
      );
  }

  getNavTabs(activatedRoute, route = '') {
    const url = this.pagesService.getComponentRoute(activatedRoute);

    return this.getTabs()
      .pipe(
        map((tabs: RoleTab[]) => tabs.map((tab: RoleTab) => this.formatWithRoute(tab, route))),
        map(tabs => this.pagesService.getRoutedTabsData(tabs, url))
      );
  }

  getNavTabsWithRole(activatedRoute) {
    return this.store.select(getRolesRoleTab)
      .pipe(mergeMap((roleRoute) => this.getNavTabs(activatedRoute, roleRoute)));
  }

  getTabs(): Observable<RoleTab[]> {
    return this.store.select(getRoles)
      .pipe(
        map((roles: Role[]) => {
        return roles.map(({name: title, is_default, _id}) => {
          return {
            title,
            is_default,
            route: _id
          };
        });
      }));
  }

  initRolesList() {
    return this.api.getRolesList()
      .pipe(tap((roles) => this.store.dispatch(new admin.InitRoles(roles))));
  }

  redirectToDefaultRoute(activatedRoute, force = false) {
    return this.getTabs()
      .pipe(tap((tabs) => {
        if (activatedRoute.firstChild && !force) {
          return;
        }

        const tab = tabs.find(item => item.is_default);
        if (tab) {
          this.router.navigate([tab.route], {relativeTo: activatedRoute});
        }
      }));
  }

  getNavGroups() {
    return [{
      name: 'System Roles',
      key: 'is_default',
      value: true
    }, {
      name: 'User Created Roles',
      key: 'is_default',
      value: false
    }];
  }

  getLoggedUserId() {
    return this.pagesService.getLoggedUserId();
  }

  private formatWithRoute(tab: RoleTab, childRoute: string): RoleTab {
    let route = tab.route;
    if (childRoute) {
      route = [route, childRoute].join('/');
    }
    return {
      ...tab,
      route
    };
  }
}
