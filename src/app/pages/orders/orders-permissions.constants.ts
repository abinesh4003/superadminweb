import {formatPrivilegesKeys} from "@app/core/utils/privileges.helper";

export const OrdersDashboardPermissionsConstants = {
  PATH: 'orders.dashboard',
  get view() {
    return `${this.PATH}.view`;
  }
};

// export const OrdersListPermissionsConstants = {
//   PATH: 'orders.orders.new_orders',
//
//   get view() {
//     return `${this.PATH}.view`;
//   },
//   get edit() {
//     return `${this.PATH}.edit`;
//   },
//   get create() {
//     return `${this.PATH}.new_order`;
//   }
// };

export const OrdersNewPermissionsConstants = {
  PATH: 'orders.orders.new_orders',

  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  },
  get create() {
    return `${this.PATH}.new_order`;
  }
};

export const OrdersPackagingPermissionsConstants = {
  PATH: 'orders.orders.packaging',

  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  }
};

export const OrdersDispatchedPermissionsConstants = {
  PATH: 'orders.orders.dispatched',

  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  }
};

export const OrdersShippingPermissionsConstants = {
  PATH: 'orders.orders.shipping',

  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  }
};

export const OrdersDeliveredPermissionsConstants = {
  PATH: 'orders.orders.delivered',

  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  }
};

export const OrdersCancelledPermissionsConstants = {
  PATH: 'orders.orders.cancelled',

  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  }
};

export const OrdersReplacementPermissionsConstants = {
  PATH: 'orders.orders.replacement',

  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  }
};

export const DeliveryAssistantsOnlinePermissionsConstants = {
  PATH: 'orders.delivery_associates.online_associates',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  }
};

export const DeliveryAssistantsAllPermissionsConstants = {
  PATH: 'orders.delivery_associates.associates',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  }
};


export const SubscriptionSubscriptionsPermissionsConstants = {
  PATH: 'orders.subscription.subscription',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  }
};
export const SubscriptionUnsubscriptionsPermissionsConstants = {
  PATH: 'orders.subscription.unsubscription',
  get view() {
    return `${this.PATH}.view`;
  },
  get edit() {
    return `${this.PATH}.edit`;
  }
};

export const OrdersPermissionsConstants = {
  ...formatPrivilegesKeys(OrdersDashboardPermissionsConstants),
  ...formatPrivilegesKeys(OrdersNewPermissionsConstants),
  ...formatPrivilegesKeys(OrdersPackagingPermissionsConstants),
  ...formatPrivilegesKeys(OrdersDispatchedPermissionsConstants),
  ...formatPrivilegesKeys(OrdersShippingPermissionsConstants),
  ...formatPrivilegesKeys(OrdersDeliveredPermissionsConstants),
  ...formatPrivilegesKeys(OrdersCancelledPermissionsConstants),
  ...formatPrivilegesKeys(OrdersReplacementPermissionsConstants),
  ...formatPrivilegesKeys(DeliveryAssistantsOnlinePermissionsConstants),
  ...formatPrivilegesKeys(DeliveryAssistantsAllPermissionsConstants),
  ...formatPrivilegesKeys(SubscriptionSubscriptionsPermissionsConstants),
  ...formatPrivilegesKeys(SubscriptionUnsubscriptionsPermissionsConstants),
  PATH: ''
};

export const OrdersALLPermissionsConstants = {
  ...formatPrivilegesKeys(OrdersNewPermissionsConstants),
  ...formatPrivilegesKeys(OrdersPackagingPermissionsConstants),
  ...formatPrivilegesKeys(OrdersDispatchedPermissionsConstants),
  ...formatPrivilegesKeys(OrdersShippingPermissionsConstants),
  ...formatPrivilegesKeys(OrdersDeliveredPermissionsConstants),
  ...formatPrivilegesKeys(OrdersCancelledPermissionsConstants),
  ...formatPrivilegesKeys(OrdersReplacementPermissionsConstants),
  PATH: ''
};

export const DeliveryAssistantsConstants = {
  ...formatPrivilegesKeys(DeliveryAssistantsOnlinePermissionsConstants),
  ...formatPrivilegesKeys(DeliveryAssistantsAllPermissionsConstants),
  PATH: ''
};

export const SubscriptionConstants = {
  ...formatPrivilegesKeys(SubscriptionSubscriptionsPermissionsConstants),
  ...formatPrivilegesKeys(SubscriptionUnsubscriptionsPermissionsConstants),
  PATH: ''
};
