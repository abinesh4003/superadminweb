import { Category, Dashboard } from '@app/core/models';
import { ScTemplateItem } from '@app/core/models/admin.models';
import { DashboardInventoryProduct } from '@app/core/models/dashboard.models';

export interface GetDashboardStoreCategoryListInterface {
  success: boolean;
  data: Category[];
}

export interface GetDashboardInterface {
  success: boolean;
  data: Dashboard;
}

export interface GetDashboardInventoryProductsInterface {
  success: boolean;
  data: {
    count: number;
    products: DashboardInventoryProduct[];
    keys: any[];
  };
}

export interface GetDashboardInventoryProductTemplateInterface {
  success: boolean;
  data: ScTemplateItem[];
}

export interface GetDashboardInventoryProductViewInterface {
  success: boolean;
  data: DashboardInventoryProduct;
}

export interface GetDashboardShopsStoresInterface {
  success: boolean;
  data: {
    count: number;
    docs: any[];
  };
}

export interface GetShopsLocationListInterface {
  success: boolean;
  locations: string[];
}

export interface GetDashboardShopsStoreViewInterface {
  success: boolean;
  data: any;
}

export interface GetDashboardShopInventoryInterface {
  success: boolean;
  data: {
    count: number;
    total: number;
    last_updated: string;
    product_details: any[];
    _id: string;
  };
}

export interface GetDashboardProductCategoryListInterface {
  success: boolean;
  data: {
    _id: string;
    product_category: string[];
  };
}
