import { formatPrivilegesKeys } from '@app/core/utils/privileges.helper';
import { ProfilePermissionsConstants } from '@app/pages/admin/profile/profile-permissions.constants';
import { RolesPermissionsConstants } from '@app/pages/admin/roles/roles-permissions.constants';
import { ScPermissionsConstants } from '@app/pages/admin/sc/sc-permissions.constants';
import { SettingsPermissionsConstants } from '@app/pages/admin/settings/settings-permissions.constants';
import { UsersPermissionsConstants } from '@app/pages/admin/users/users-permissions.constants';

export const AdminPermissionsConstants = {
  ...formatPrivilegesKeys(ProfilePermissionsConstants),
  ...formatPrivilegesKeys(RolesPermissionsConstants),
  ...formatPrivilegesKeys(ScPermissionsConstants),
  ...formatPrivilegesKeys(SettingsPermissionsConstants),
  ...formatPrivilegesKeys(UsersPermissionsConstants),
  PATH: ''
};
