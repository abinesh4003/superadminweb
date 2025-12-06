import { formatPrivilegesKeys } from '@app/core/utils/privileges.helper';

export const SettingsSubGeneralPermissionsConstants = {
  PATH: 'manage_store.settings.general',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  }
};

export const SettingsSubBasicPermissionsConstants = {

  PATH: 'manage_store.settings.basic(public/branded)',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  }
};

export const SettingsSubPrivatePermissionsConstants = {

  PATH: 'manage_store.settings.private',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  }
};

export const SettingsSubPermissionsConstants = {
  ...formatPrivilegesKeys(SettingsSubGeneralPermissionsConstants),
  ...formatPrivilegesKeys(SettingsSubBasicPermissionsConstants),
  ...formatPrivilegesKeys(SettingsSubPrivatePermissionsConstants),
  PATH: 'manage_store.settings'
};
