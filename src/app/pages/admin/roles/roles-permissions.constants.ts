export const RolesPermissionsConstants = {
  PATH: 'admin.role',
  get view() {
    return `${this.PATH}.view`;
  },
  get create() {
    return `${this.PATH}.create`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
  get delete() {
    return `${this.PATH}.delete`;
  }
};
