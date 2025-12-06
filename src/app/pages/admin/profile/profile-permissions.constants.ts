export const ProfilePermissionsConstants = {
  PATH: 'admin.profile',
  get create() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  }
};
