export const UsersPermissionsConstants = {
  PATH: 'admin.user',
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
  },
  get suspend() {
    return `${this.PATH}.suspend`;
  }
};
