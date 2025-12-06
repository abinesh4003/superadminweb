import {
  ADMIN_USERS_STATUS_ACTIVE,
  ADMIN_USERS_STATUS_ALL,
  ADMIN_USERS_STATUS_INACTIVE,
  DB_INV_STATUS_DRAFT,
  DB_INV_STATUS_LIVE,
  DB_INV_STATUS_M_DRAFT,
  DB_INV_STATUS_OPEN,
  DB_INV_STATUS_REJECTED,
  DB_INV_STATUS_SUSPENDED,
  DB_INV_STATUS_TERMINATED,
  DB_INV_STATUS_WAITING_REVIEW,
  SC_FORMAT_DATE,
  SC_FORMAT_DECIMAL,
  SC_FORMAT_DROPDOWN,
  SC_FORMAT_LIST,
  SC_FORMAT_LONG_TEXT,
  SC_FORMAT_NUMBER,
  SC_FORMAT_TEXT,
  SC_STATUS_ALPHA,
  SC_STATUS_LIVE,
  SC_STATUS_OPEN,
  SC_STATUS_SUSPENDED,
  DB_SHOP_STATUS_OPEN,
  DB_SHOP_STATUS_SUSPENDED,
  DB_SHOP_STATUS_SUBMITTED,
  DB_SHOP_TYPE_ALL,
  DB_SHOP_TYPE_BRANDED,
  DB_SHOP_TYPE_PRIVATE,
  DB_SHOP_TYPE_PUBLIC,
  DB_SHOP_TAB_WAITING_REVIEW,
  DB_SHOP_STATUS_LIVE,
  DB_SHOP_STATUS_REJECTED,
  DB_SHOP_STATUS_TERMINATED,
  DB_SHOP_TAB_ACTIVE,
  PROMOTION_BROADCAST_TAB_MERCHANTS,
  FINANCE_WITHDRAWAL_STATUS_REQUESTED,
  FINANCE_WITHDRAWAL_STATUS_TRANSFERRED,
  FINANCE_WITHDRAWAL_STATUS_REJECTED,
  PROMOTION_BROADCAST_STATUS_REQUEST,
  PROMOTION_BROADCAST_STATUS_APPROVED,
  PROMOTION_ADS_TAB_SCRATCH_CARD,
  PROMOTION_ADS_TAB_MERCHANTS_ADS,
  PROMOTION_MERCHANTS_ADS_STATUS_LIVE,
  PROMOTION_MERCHANTS_ADS_STATUS_DEACTIVATED,
  PROMOTION_MERCHANTS_ADS_STATUS_EXPIRED,
  PROMOTION_MERCHANTS_ADS_TYPE_TEXT,
  PROMOTION_MERCHANTS_ADS_TYPE_BANNER,
  PROMOTION_ANNOUNCEMENT_TAB_SMS,
  PROMOTION_ANNOUNCEMENT_TAB_PUSH,
  PROMOTION_ANNOUNCEMENT_TAB_EMAIL,
  PROMOTION_PROMO_STATUS_OPEN,
  PROMOTION_PROMO_STATUS_DEACTIVATED,
  PROMOTION_PROMO_STATUS_EXPIRED,
  PROMOTION_PROMO_TAB_BAYFAY,
  // PROMOTION_PROMO_TAB_MERCHANTS,
  PROMOTION_PROMO_STATUS_ACTIVE,
  NEW_ORDERS_TAB,
  PACKAGING_ORDERS_TAB,
  DISPATCHED_ORDERS_TAB,
  ON_THE_WAY_ORDERS_TAB,
  DELIVERED_ORDERS_TAB,
  CANCELLED_ORDERS_TAB,
  REPLACEMENT_REQUEST_ORDERS_TAB,
  ORDER_FILTER_TYPE_ALL,
  ORDER_FILTER_TYPE_READ,
  ORDER_FILTER_TYPE_UNREAD,
  ORDER_TYPE_ALL,
  ORDER_TYPE_LOCAL,
  ORDER_TYPE_OTHER,
  ONLINE_DELIVERY_ASSISTANTS,
  ALL_DELIVERY_ASSISTANTS,
  DELIVERY_ASSISTANT_FILTER_TYPE_ALL,
  DELIVERY_ASSISTANT_FILTER_TYPE_WAITING_APPROVAL,
  DELIVERY_ASSISTANT_FILTER_TYPE_APPROVED,
  DELIVERY_ASSISTANT_FILTER_TYPE_REJECTED,
  DELIVERY_ASSISTANT_FILTER_TYPE_SUSPENDED,
  DELIVERY_ASSISTANT_FILTER_TYPE_TERMINATED,
  ONLINE_ASSISTANT_IDLE,
  ONLINE_ASSISTANT_ENGAGED,
  ONLINE_ASSISTANT_OFFLINE,
  DELIVERY_ASSISTANT_FILTER_TYPE_RESIGNED,
  FINANCE_REMITTANCE_STATUS_APPROVED,
  FINANCE_REMITTANCE_STATUS_PENDING,
  FINANCE_REMITTANCE_STATUS_REJECTED,
  FINANCE_REMITTANCE_STATUS_TRANSFERRED,
  SUBSCRIPTIONS_TAB,
  UNSUBSCRIPTIONS_TAB,
  SUBSCRIPTIONS_STATUS_OPTION_ALL,
  SUBSCRIPTIONS_STATUS_OPTION_ACTIVE,
  SUBSCRIPTIONS_STATUS_OPTION_PAUSE,
  SUBSCRIPTIONS_STATUS_OPTION_UNSUBSCRIBED,
} from '@app/core/constants/ids.constants';
import {CANCELLED} from "dns";


export const listConstants = {
  sc_status: [{
    id: SC_STATUS_OPEN,
    name: 'Open'
  }, {
    id: SC_STATUS_ALPHA,
    name: 'Alpha'
  }, {
    id: SC_STATUS_LIVE,
    name: 'Live'
  }, {
    id: SC_STATUS_SUSPENDED,
    name: 'Suspended'
  }],

  sc_format: [{
    id: SC_FORMAT_TEXT,
    name: 'Text'
  }, {
    id: SC_FORMAT_NUMBER,
    name: 'Number'
  }, {
    id: SC_FORMAT_DECIMAL,
    name: 'Decimal Number '
  }, {
    id: SC_FORMAT_DATE,
    name: 'Date '
  }, {
    id: SC_FORMAT_LIST,
    name: 'List'
  }, {
    id: SC_FORMAT_LONG_TEXT,
    name: 'Long Text'
  }, {
    id: SC_FORMAT_DROPDOWN,
    name: 'Dropdown'
  }],

  db_inv_statuses_all: [{
    id: DB_INV_STATUS_OPEN,
    name: 'Open'
  }, {
    id: DB_INV_STATUS_DRAFT,
    name: 'Draft'
  }, {
    id: DB_INV_STATUS_M_DRAFT,
    name: 'M-Draft'
  }, {
    id: DB_INV_STATUS_WAITING_REVIEW,
    name: 'Waiting for Review'
  }, {
    id: DB_INV_STATUS_REJECTED,
    name: 'Rejected'
  }, {
    id: DB_INV_STATUS_LIVE,
    name: 'Live'
  }, {
    id: DB_INV_STATUS_SUSPENDED,
    name: 'Suspended'
  }, {
    id: DB_INV_STATUS_TERMINATED,
    name: 'Terminated'
  }],

  admin_users_statuses: [{
    id: ADMIN_USERS_STATUS_ALL,
    name: 'All'
  }, {
    id: ADMIN_USERS_STATUS_ACTIVE,
    name: 'Active'
  }, {
    id: ADMIN_USERS_STATUS_INACTIVE,
    name: 'Inactive'
  }],

  db_shop_tabs: [{
    id: DB_SHOP_TAB_WAITING_REVIEW,
    name: 'Waiting for Review'
  }, {
    id: DB_SHOP_TAB_ACTIVE,
    name: 'Active'
  }],

  db_shop_statuses_all: [{
    id: DB_SHOP_STATUS_OPEN,
    name: 'Open'
  }, {
    id: DB_SHOP_STATUS_SUBMITTED,
    name: 'Submitted'
  }, {
    id: DB_SHOP_STATUS_LIVE,
    name: 'Live'
  }, {
    id: DB_SHOP_STATUS_REJECTED,
    name: 'Rejected'
  }, {
    id: DB_SHOP_STATUS_SUSPENDED,
    name: 'Suspended'
  }, {
    id: DB_SHOP_STATUS_TERMINATED,
    name: 'Terminated'
  }],

  db_shop_type: [{
    id: DB_SHOP_TYPE_ALL,
    name: 'General'
  }, {
    id: DB_SHOP_TYPE_PUBLIC,
    name: 'Public'
  }, {
    id: DB_SHOP_TYPE_BRANDED,
    name: 'Branded'
  }, {
    id: DB_SHOP_TYPE_PRIVATE,
    name: 'Private'
  }],

  promotion_broadcast_tabs: [{
    id: PROMOTION_BROADCAST_TAB_MERCHANTS,
    name: 'Merchants'
    // }, {
    //   id: PROMOTION_BROADCAST_TAB_BAYFAY,
    //   name: 'BayFay'
  }],

  // TODO add more as per design
  promotion_broadcast_status_types: [{
    id: PROMOTION_BROADCAST_STATUS_REQUEST,
    name: 'Request'
  }, {
    id: PROMOTION_BROADCAST_STATUS_APPROVED,
    name: 'Approved'
    // }, {
    //   id: PROMOTION_BROADCAST_STATUS_REJECTED,
    //   name: 'Rejected'
    // }, {
    //   id: PROMOTION_BROADCAST_STATUS_SENT,
    //   name: 'Sent'
  }],

  promotion_ads_tabs: [{
    id: PROMOTION_ADS_TAB_SCRATCH_CARD,
    name: 'Scratch Card'
  }, {
    id: PROMOTION_ADS_TAB_MERCHANTS_ADS,
    name: 'Merchants Ads'
  }],

  promotion_merchants_ads_status_types: [{
    id: PROMOTION_MERCHANTS_ADS_STATUS_LIVE,
    name: 'Live Ads'
  }, {
    id: PROMOTION_MERCHANTS_ADS_STATUS_DEACTIVATED,
    name: 'Deactivated'
  }, {
    id: PROMOTION_MERCHANTS_ADS_STATUS_EXPIRED,
    name: 'Expired'
  }],

  promotion_merchants_ads_types: [{
    id: PROMOTION_MERCHANTS_ADS_TYPE_TEXT,
    name: 'Text'
  }, {
    id: PROMOTION_MERCHANTS_ADS_TYPE_BANNER,
    name: 'Banner'
  }],

  promotion_announcement_tabs: [{
    id: PROMOTION_ANNOUNCEMENT_TAB_SMS,
    name: 'SMS'
  }, {
    id: PROMOTION_ANNOUNCEMENT_TAB_PUSH,
    name: 'Push'
  }, {
    id: PROMOTION_ANNOUNCEMENT_TAB_EMAIL,
    name: 'Email'
  }],

  finance_withdrawal_status_types: [{
    id: FINANCE_WITHDRAWAL_STATUS_REQUESTED,
    name: 'Requested'
  }, {
    id: FINANCE_WITHDRAWAL_STATUS_TRANSFERRED,
    name: 'Approved/Transferred'
  }, {
    id: FINANCE_WITHDRAWAL_STATUS_REJECTED,
    name: 'Rejected'
  }],

  finance_remittance_status_types: [{
    id: FINANCE_REMITTANCE_STATUS_TRANSFERRED,
    name: 'Waiting for Approval'
  },
  {
    id: FINANCE_REMITTANCE_STATUS_APPROVED,
    name: 'Approved'
  },
  {
    id: FINANCE_REMITTANCE_STATUS_PENDING,
    name: 'Pending'
  },
  {
    id: FINANCE_REMITTANCE_STATUS_REJECTED,
    name: 'Rejected'
  }],

  promotion_promo_status_types: [{
    id: PROMOTION_PROMO_STATUS_OPEN,
    name: 'Open'
  }, {
    id: PROMOTION_PROMO_STATUS_ACTIVE,
    name: 'Active'
  }, {
    id: PROMOTION_PROMO_STATUS_DEACTIVATED,
    name: 'Deactivated'
  }, {
    id: PROMOTION_PROMO_STATUS_EXPIRED,
    name: 'Expired'
  }],

  promotion_promo_tabs: [{
    id: PROMOTION_PROMO_TAB_BAYFAY,
    name: 'BayFay Code'
  // }, {
  //   id: PROMOTION_PROMO_TAB_MERCHANTS,
  //   name: 'Merchants Code'
  }],
  orders_list_tabs: [{
    id: NEW_ORDERS_TAB,
    name: 'New Orders'
  }, {
    id: PACKAGING_ORDERS_TAB,
    name: 'Packaging'
  }, {
    id: DISPATCHED_ORDERS_TAB,
    name: 'Dispatched'
  }, {
    id: ON_THE_WAY_ORDERS_TAB,
    name: 'Shipping'
  }, {
    id: DELIVERED_ORDERS_TAB,
    name: 'Delivered'
  }, {
    id: CANCELLED_ORDERS_TAB,
    name: 'Cancelled'
  }, {
    id: REPLACEMENT_REQUEST_ORDERS_TAB,
    name: 'Replacement Request'
  }],
  order_list_filter_values: [{
    id: ORDER_FILTER_TYPE_ALL,
    name: 'All'
  }, {
    id: ORDER_FILTER_TYPE_UNREAD,
    name: 'Unread'
  }, {
    id: ORDER_FILTER_TYPE_READ,
    name: 'Read'
  }],
  order_list_types: [{
    id: ORDER_TYPE_ALL,
    name: 'All'
  }, {
    id: ORDER_TYPE_LOCAL,
    name: 'Local'
  }, {
    id: ORDER_TYPE_OTHER,
    name: 'Other Location'
  }],
  delivery_assistants_list_filter_values: [{
    id: DELIVERY_ASSISTANT_FILTER_TYPE_ALL,
    name: 'All'
  },{
    id: DELIVERY_ASSISTANT_FILTER_TYPE_WAITING_APPROVAL,
    name: 'Waiting for Approval'
  },{
    id: DELIVERY_ASSISTANT_FILTER_TYPE_APPROVED,
    name: 'Approved'
  },{
    id: DELIVERY_ASSISTANT_FILTER_TYPE_REJECTED,
    name: 'Rejected'
  },{
    id: DELIVERY_ASSISTANT_FILTER_TYPE_SUSPENDED,
    name: 'Suspended'
  },{
    id: DELIVERY_ASSISTANT_FILTER_TYPE_RESIGNED,
    name: 'Resigned'
  }, {
    id: DELIVERY_ASSISTANT_FILTER_TYPE_TERMINATED,
    name: 'Terminated'
  }],
  online_delivery_assistants_list_filter_values: [{
    id: -1,
    name: 'All'
  },{
    id: ONLINE_ASSISTANT_IDLE,
    name: 'Idle'
  },{
    id: ONLINE_ASSISTANT_ENGAGED,
    name: 'Engaged'
  },{
    id: ONLINE_ASSISTANT_OFFLINE,
    name: 'Offline'
  }],
  delivery_assistants_tabs: [{
    id: ONLINE_DELIVERY_ASSISTANTS,
    name: 'Online Assistants'
  }, {
    id: ALL_DELIVERY_ASSISTANTS,
    name: 'Assistants'
  }],
  subscription_tabs: [{
    id: SUBSCRIPTIONS_TAB,
    name: 'Subscriptions'
  }, {
    id: UNSUBSCRIPTIONS_TAB,
    name: 'UnSubscribed'
  }],
  subscriptions_status_options: [{
    id: SUBSCRIPTIONS_STATUS_OPTION_ALL,
    name: 'All'
  }, {
    id: SUBSCRIPTIONS_STATUS_OPTION_ACTIVE,
    name: 'Active'
  }, {
    id: SUBSCRIPTIONS_STATUS_OPTION_PAUSE,
    name: 'Pause'
  }],
  unsubscriptions_status_options: [{
    id: SUBSCRIPTIONS_STATUS_OPTION_UNSUBSCRIBED,
    name: 'UnSubscribed'
  }]
};
