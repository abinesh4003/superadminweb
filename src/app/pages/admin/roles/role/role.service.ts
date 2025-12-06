import { Injectable } from '@angular/core';
import { Role } from '@app/core/models';
import { ApiService } from '@app/core/services/api.service';
import { AssignAdminsModalComponent } from '@app/pages/admin/roles/assign-admins-modal/assign-admins-modal.component';
import { ADMIN_TAB, PRIVILEGES_TAB } from '@app/pages/admin/roles/role/role.constants';
import { RolesService } from '@app/pages/admin/roles/roles.service';
import { PagesService } from '@app/pages/pages.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import * as admin from '@app/store/actions/admin.actions';
import { AppState, getActiveRoleId } from '@app/store/root-reducer';
import { Store } from '@ngrx/store';
import { first } from 'rxjs/operators/first';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { concatMap } from 'rxjs/operators/concatMap';

@Injectable()
export class RoleService {

  constructor(
    private store: Store<AppState>,
    private pagesService: PagesService,
    private modalService: ModalService,
    private rolesService: RolesService,
    private api: ApiService
  ) {}

  dispatchActiveRoleId(id) {
    if (!id) {
      return;
    }
    this.store.dispatch(new admin.ChangeActiveRoleId(id));
  }

  dispatchRoleTab(name) {
    this.store.dispatch(new admin.ChangeRolesRoleTab(name));
  }

  getRoleTabs(activatedRoute) {
    const url = this.pagesService.getComponentRoute(activatedRoute);
    const tabsData = [{
      title: 'Admin',
      route: ADMIN_TAB
    }, {
      title: 'Privileges',
      route: PRIVILEGES_TAB
    }];

    return this.pagesService.getRoutedTabsData(tabsData, url);
  }

  assignAdminsModal() {
    return this.modalService.open(AssignAdminsModalComponent)
      .pipe(
        withLatestFrom(this.store.select(getActiveRoleId)),
        concatMap(([data, id]) => this.api.assignRolesRoleUsers(id, data)),
        concatMap(() => this.rolesService.initRolesList())
      );
  }

  unassignAdminsModal(data) {
    return this.modalService.openConfirm({
      message: `Are you sure you want to unassign the selected admin(s) from the role?`,
    })
      .pipe(
        concatMap(() => this.store.select(getActiveRoleId)),
        first(),
        concatMap((id) => this.api.unassignRolesRoleUsers(id, data)),
        concatMap(() => this.rolesService.initRolesList())
      );
  }

  deleteRole(role: Role, activatedRoute) {
    return this.pagesService.confirmActionModal(role.name)
      .pipe(
        concatMap(() => this.api.deleteRolesRole(role._id)),
        concatMap(() => this.rolesService.initRolesList()),
        concatMap(() => this.rolesService.redirectToDefaultRoute(activatedRoute, true))
      );
  }
}
