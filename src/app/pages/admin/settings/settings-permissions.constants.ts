import { formatPrivilegesKeys } from '@app/core/utils/privileges.helper';

export const SettingsCardChargesPermissionsConstants = {
  PATH: 'admin.settings.card_charges',
  get create() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  }
};

export const SettingsPermissionsConstants = {
  ...formatPrivilegesKeys(SettingsCardChargesPermissionsConstants),
  PATH: ''
};
