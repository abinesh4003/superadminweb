import { Injectable } from '@angular/core';
import { StorageService } from '@app/core/services/storage.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

@Injectable()
export class PrivilegesService {

  constructor(
    private storage: StorageService
  ) {}

  getDotPrivileges() {

    return this.storage.observeUserDetails()
      .pipe(
        startWith(this.storage.getUserDetails()),
        map(user => {
          if (user && user.privileges) {
            return this.convertObjectToArray(user.privileges);
          }

          return [];
        })
      );
  }

  private convertObjectToArray(item) {
    const items = Object.keys(this.getDottedObject(item));
    return items;
  }

  private getDottedObject(obj, current = null, res = {}) {
    if (Array.isArray(obj)) {
      for (const item of obj) {
        const newKey = this.getKey(current, item);
        res[newKey] = item;
      }
    } else {

      Object.entries(obj).forEach(([key, value]) => {
        const newKey = this.getKey(current, key);

        if (value && typeof value === 'object') {
          this.getDottedObject(value, newKey, res);
        } else {
          res[newKey] = value;
        }
      });
    }

    return res;
  }

  private getKey(current, item) {
    return (current ? [current, item].join('.') : item);
  }

}

export function initPrivilegesProvider(privSvc: PrivilegesService, permServ: NgxPermissionsService) {
  return () => privSvc.getDotPrivileges()
    .subscribe((privileges) => {
      permServ.loadPermissions(privileges);
    });
}
