export class ScTemplateItem {
  key_id: number;
  key_name: string;
  display_name: string;
  format: number;
  access: number;
  default: null;
  required: boolean;
  req_inventory: boolean;
  req_store: boolean;
  req_user: boolean;
  is_searchable: boolean;
  description: string;

  constructor({
                key_id,
                key_name,
                display_name,
                format,
                access,
                default: defProp,
                required,
                req_inventory,
                req_store,
                req_user,
                is_searchable,
                description
              }: any = {}) {
    this.key_id = key_id;
    this.key_name = key_name;
    this.display_name = display_name;
    this.format = format;
    this.access = access;
    this.default = defProp;
    this.required = required;
    this.req_inventory = req_inventory;
    this.req_store = req_store;
    this.req_user = req_user;
    this.is_searchable = is_searchable;
    this.description = description;
  }
}

export class Role {
  _id: string;
  name: string;
  description: string;
  is_editable: boolean;
  is_default: boolean;
  privileges: object;
  users: RoleUser[];

  constructor({_id, name, description, is_editable, is_default, privileges, users}: any = {}) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.is_editable = is_editable;
    this.is_default = is_default;
    this.privileges = privileges;
    this.users = users;
  }
}

export class RoleUser {
  _id: string;
  user_name: string;
  email_id: string;

  constructor({_id, user_name, email_id}: any = {}) {
    this._id = _id;
    this.user_name = user_name;
    this.email_id = email_id;
  }
}

export class RoleTab {
  title: string;
  route: string;
  is_default: boolean;

  constructor({title, route, is_default}: any = {}) {
    this.title = title;
    this.route = route;
    this.is_default = is_default;
  }
}

export class User {
  _id: string;
  first_name: string;
  last_name: string;
  user_name: string;
  email_id: string;
  profile_image: string;
  created: {
    by: string;
    at: string;
  };
  role: string[];
  log: UserLog[];
}

export class UserLog {
  _id: string;
  user_id: string;
  is_active: boolean;
  log_count: number;
  recent: string;
}
