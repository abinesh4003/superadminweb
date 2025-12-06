export const ScPermissionsConstants = {
  PATH: 'admin.store_category',
  get create() {
    return `${this.PATH}.create`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
  get delete() {
    return `${this.PATH}.delete`;
  },
  get read() {
    return `${this.PATH}.view`;
  },
  get suspend() {
    return `${this.PATH}.suspend`;
  },
  get move_to_production() {
    return `${this.PATH}.move_to_production`;
  },
  get add_custom_field() {
    return `${this.PATH}.add_custom_field`;
  }
};
