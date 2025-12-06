import { Component } from '@angular/core';
import { privilegesToArray } from '@app/core/utils/privileges.helper';
import { ProfilePermissionsConstants } from '@app/pages/admin/profile/profile-permissions.constants';
import { RolesPermissionsConstants } from '@app/pages/admin/roles/roles-permissions.constants';
import { ScPermissionsConstants } from '@app/pages/admin/sc/sc-permissions.constants';
import { SettingsPermissionsConstants } from '@app/pages/admin/settings/settings-permissions.constants';
import { UsersPermissionsConstants } from '@app/pages/admin/users/users-permissions.constants';

@Component({
  selector: 'pkz-pages-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent {
  constructor() {}

  getScPermissions() {
    return privilegesToArray(ScPermissionsConstants);
  }

  getRolesPermissions() {
    return privilegesToArray(RolesPermissionsConstants);
  }

  getProfilePermissions() {
    return privilegesToArray(ProfilePermissionsConstants);
  }

  getSettingsPermissions() {
    return privilegesToArray(SettingsPermissionsConstants);
  }

  getUsersPermissions() {
    return privilegesToArray(UsersPermissionsConstants);
  }
}
