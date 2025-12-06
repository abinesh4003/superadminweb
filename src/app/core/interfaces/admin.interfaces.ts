import { Category, Role, User } from '@app/core/models';
import { ScTemplateItem } from '@app/core/models/admin.models';

export interface GetScViewInterface {
  success: boolean;
  data: {
    _id: string;
    category_number: number;
    category_name: string;
    display_name: string;
    type: number;
    status: number;
    image: string;
    product_category: string[];
    template: ScTemplateItem[];
  };
}

export interface GetStoreCategoryListInterface {
  success: boolean;
  data: {
    count: number;
    total: number;
    docs: Category[];
  };
}

export interface GetRolesListInterface {
  success: boolean;
  roles: Role[];
}

export interface GetUsersListInterface {
  success: boolean;
  users: User[];
}

export interface GetUsersUserProfileInterface {
  success: boolean;
  user: User;
}
