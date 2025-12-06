import { Injectable } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';
import { PagesService } from '@app/pages/pages.service';
import { zip } from 'rxjs/observable/zip';
import { concatMap } from 'rxjs/operators/concatMap';
import { map } from 'rxjs/operators/map';

@Injectable()
export class UsersService {
  constructor(
    private api: ApiService,
    private pagesService: PagesService
  ) {}

  isLoggedUserSuperAdmin() {
    const userId = this.pagesService.getLoggedUserId();

    return zip(
      this.api.getUsersUserRoles(userId),
      this.api.getUsersUser(userId),
    )
      .pipe(
        map(([roles, user]) => {
          const userRolesIds = user && user.role || [];
          const superAdminRole = roles.find(role => role.is_super_admin);

          if (superAdminRole) {
            return userRolesIds.includes(superAdminRole._id);
          }
          return false;
        })
      );
  }

  getUsersList(queryObj) {
    return this.api.getUsersList(queryObj)
      .pipe(
        map(users => {
          let sno = 0;
          return users.map(item => {
            sno += 1;
            item['sno'] = sno;
            return item;
          });
        })
      );
  }

  deleteUser(id) {
    return this.pagesService.confirmActionModal('user(s)')
      .pipe(concatMap(() => this.api.deleteUsersUser(id)));
  }

  suspendUser(id) {
    return this.api.usersUserSuspend(id);
  }

  unsuspendUser(id) {
    return this.api.usersUserUnsuspend(id);
  }
}
