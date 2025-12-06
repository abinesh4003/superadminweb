import { formatPrivilegesKeys } from '@app/core/utils/privileges.helper';

export const InventoryUpcDraft = {
  PATH: 'manage_store.upc.draft',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
  get delete() {
    return `${this.PATH}.delete`;
  },
  get manage() {
    return `${this.PATH}.manage`;
  },
  get add_new_product() {
    return `${this.PATH}.add_new_product`;
  },
  get bulk_upload() {
    return `${this.PATH}.bulk_upload`;
  },
  get bulk_upload_log() {
    return `${this.PATH}.bulk_upload_log`;
  },
  get configure_columns() {
    return `${this.PATH}.configure_columns`;
  }
};

export const InventoryUpcMDraft = {
  PATH: 'manage_store.upc.m-draft',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
  get delete() {
    return `${this.PATH}.delete`;
  },
  get reject() {
    return `${this.PATH}.reject`;
  },
  get manage() {
    return `${this.PATH}.manage`;
  },
  get configure_columns() {
    return `${this.PATH}.configure_columns`;
  }
};


export const InventoryUpcReview = {
  PATH: 'manage_store.upc.review',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
  get approve() {
    return `${this.PATH}.approve`;
  },
  get reject() {
    return `${this.PATH}.reject`;
  },
  get manage() {
    return `${this.PATH}.manage`;
  },
  get configure_columns() {
    return `${this.PATH}.configure_columns`;
  },
};

export const InventoryUpcLive = {
  PATH: 'manage_store.upc.live',
  get view() {
    return `${this.PATH}.view`;
  },
  get suspend() {
    return `${this.PATH}.suspend`;
  },
  get terminate() {
    return `${this.PATH}.terminate`;
  },
  get approve() {
    return `${this.PATH}.approve`;
  },
  get reject() {
    return `${this.PATH}.reject`;
  },
  get configure_columns() {
    return `${this.PATH}.configure_columns`;
  },
  get download() {
    return `${this.PATH}.download`;
  },
};

export const InventoryUpcSubPermissionsConstants = {
    ...formatPrivilegesKeys(InventoryUpcDraft),
    ...formatPrivilegesKeys(InventoryUpcMDraft),
    ...formatPrivilegesKeys(InventoryUpcReview),
    ...formatPrivilegesKeys(InventoryUpcLive),
  PATH: 'manage_store.upc'
};

export const InventorySkuMDraft = {
  PATH: 'manage_store.sku.m-draft',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
  get delete() {
    return `${this.PATH}.delete`;
  },
  get reject() {
    return `${this.PATH}.reject`;
  },
  get add_new_product() {
    return `${this.PATH}.add_new_product`;
  },
  get bulk_upload() {
    return `${this.PATH}.bulk_upload`;
  },
  get bulk_upload_log() {
    return `${this.PATH}.bulk_upload_log`;
  },
  get manage() {
    return `${this.PATH}.manage`;
  },
  get configure_columns() {
    return `${this.PATH}.configure_columns`;
  },
};

export const InventorySkuReview = {
  PATH: 'manage_store.sku.review',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
  get approve() {
    return `${this.PATH}.approve`;
  },
  get reject() {
    return `${this.PATH}.reject`;
  },
  get manage() {
    return `${this.PATH}.manage`;
  },
  get configure_columns() {
    return `${this.PATH}.configure_columns`;
  },
};

export const InventorySkuLive = {
  PATH: 'manage_store.sku.live',
  get view() {
    return `${this.PATH}.view`;
  },
  get suspend() {
    return `${this.PATH}.suspend`;
  },
  get terminate() {
    return `${this.PATH}.terminate`;
  },
  get approve() {
    return `${this.PATH}.approve`;
  },
  get reject() {
    return `${this.PATH}.reject`;
  },
  get configure_columns() {
    return `${this.PATH}.configure_columns`;
  },
  get download() {
    return `${this.PATH}.download`;
  },
};

export const InventorySkuSubPermissionsConstants = {
  ...formatPrivilegesKeys(InventorySkuMDraft),
  ...formatPrivilegesKeys(InventorySkuReview),
  ...formatPrivilegesKeys(InventorySkuLive),
  PATH: 'manage_store.sku'
};

export const InventorySubPermissionsConstants = {
  ...InventoryUpcSubPermissionsConstants,
  ...InventorySkuSubPermissionsConstants,
  PATH: ''
};
