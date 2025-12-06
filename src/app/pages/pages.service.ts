import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '@app/app.service';
import { StorageService } from '@app/core/services/storage.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable()
export class PagesService {
  constructor(
    private modalService: ModalService,
    private storage: StorageService,
    private permissionsService: NgxPermissionsService,
    private appService: AppService
  ) { }

  confirmActionModal(item = '', action = 'delete') {
    return this.modalService.openConfirm({
      message: `Are you sure you want to ${action} <b>${item}</b>?`,
      options: {
        size: 'sm'
      }
    });
  }

  isBrowser() {
    return this.appService.isBrowser();
  }

  getComponentRoute(activatedRoute: ActivatedRoute): string {
    const arr = [];

    for (const segment of activatedRoute.snapshot.pathFromRoot) {
      for (const urlItem of segment.url) {
        arr.push(urlItem.path);
      }
    }

    return `/${arr.join('/')}`;
  }

  getRoutedTabsData(tabs, url) {
    return tabs.map(tab => {
      return {
        ...tab,
        route: `${url}/${tab.route}`
      };
    });
  }

  getLoggedUserDetails() {
    return this.storage.getUserDetails();
  }

  getLoggedUserId() {
    return this.getLoggedUserDetails()._id;
  }

  hasPermission(perm) {
    return !!this.permissionsService.getPermission(perm);
  }

  hasPermissions(basePath) {
    const permissions = this.permissionsService.getPermissions();
    return !!Object.keys(permissions).filter(item => item.startsWith(basePath)).length;
  }
}
