export const SC_STATUS_OPEN = 0;
export const SC_STATUS_ALPHA = 1;
export const SC_STATUS_LIVE = 2;
export const SC_STATUS_SUSPENDED = 3;

export const SC_TYPE_ALL = 0;
export const SC_TYPE_PUBLIC = 1;
export const SC_TYPE_BRANDED = 2;

export const SC_FORMAT_TEXT = 1;
export const SC_FORMAT_NUMBER = 2;
export const SC_FORMAT_DECIMAL = 3;
export const SC_FORMAT_DATE = 4;
export const SC_FORMAT_LIST = 5;
export const SC_FORMAT_LONG_TEXT = 6;
export const SC_FORMAT_DROPDOWN = 7;

export const DB_INV_STATUS_OPEN = 0;
export const DB_INV_STATUS_DRAFT = 1;
export const DB_INV_STATUS_M_DRAFT = 11;
export const DB_INV_STATUS_WAITING_REVIEW = 2;
export const DB_INV_STATUS_REJECTED = 3;
export const DB_INV_STATUS_LIVE = 4;
export const DB_INV_STATUS_SUSPENDED = 5;
export const DB_INV_STATUS_TERMINATED = 6;

export const ADMIN_USERS_STATUS_ALL = '';
export const ADMIN_USERS_STATUS_ACTIVE = 'active';
export const ADMIN_USERS_STATUS_INACTIVE = 'inactive';

export const INPUT_TEXTAREA = 'textarea';
export const INPUT_TEXT = 'text';
export const INPUT_NUMBER = 'number';
export const INPUT_SELECT = 'select';

export const DB_SHOP_TAB_WAITING_REVIEW = 1;
export const DB_SHOP_TAB_ACTIVE = 2;

export const DB_SHOP_STATUS_OPEN = 0;
export const DB_SHOP_STATUS_SUBMITTED = 1;
export const DB_SHOP_STATUS_LIVE = 2;
export const DB_SHOP_STATUS_REJECTED = 3;
export const DB_SHOP_STATUS_SUSPENDED = 4;
export const DB_SHOP_STATUS_TERMINATED = 5;

export const DB_SHOP_TYPE_ALL = 0;
export const DB_SHOP_TYPE_PUBLIC = 1;
export const DB_SHOP_TYPE_BRANDED = 2;
export const DB_SHOP_TYPE_PRIVATE = 3;

export const PROMOTION_PROMO_TAB_BAYFAY = 'bayfay';
export const PROMOTION_PROMO_TAB_MERCHANTS = 'merchants';

export const PROMOTION_PROMO_STATUS_OPEN = 0;
export const PROMOTION_PROMO_STATUS_ACTIVE = 1;
export const PROMOTION_PROMO_STATUS_DEACTIVATED = 2;
export const PROMOTION_PROMO_STATUS_EXPIRED = 3;

export const PROMOTION_BROADCAST_TAB_BAYFAY = 'bayfay';
export const PROMOTION_BROADCAST_TAB_MERCHANTS = 'merchants';

export const PROMOTION_BROADCAST_STATUS_REQUEST = 2;
export const PROMOTION_BROADCAST_STATUS_APPROVED = 4;
// TODO change id
export const PROMOTION_BROADCAST_STATUS_REJECTED = 5;
export const PROMOTION_BROADCAST_STATUS_SENT = 6;

export const PROMOTION_ADS_TAB_SCRATCH_CARD = 'scratch';
export const PROMOTION_ADS_TAB_MERCHANTS_ADS = 'merchants';

export const PROMOTION_MERCHANTS_ADS_STATUS_LIVE = 1;
export const PROMOTION_MERCHANTS_ADS_STATUS_DEACTIVATED = 2;
export const PROMOTION_MERCHANTS_ADS_STATUS_EXPIRED = 3;

export const PROMOTION_MERCHANTS_ADS_TYPE_TEXT = 1;
export const PROMOTION_MERCHANTS_ADS_TYPE_BANNER = 2;

export const PROMOTION_ANNOUNCEMENT_TAB_SMS = 'sms';
export const PROMOTION_ANNOUNCEMENT_TAB_PUSH = 'push';
export const PROMOTION_ANNOUNCEMENT_TAB_EMAIL = 'email';

export const FINANCE_WITHDRAWAL_STATUS_REQUESTED = 1;
export const FINANCE_WITHDRAWAL_STATUS_TRANSFERRED = 2;
export const FINANCE_WITHDRAWAL_STATUS_REJECTED = 3;

export const FINANCE_REMITTANCE_STATUS_PENDING = 1;
export const FINANCE_REMITTANCE_STATUS_TRANSFERRED = 2;
export const FINANCE_REMITTANCE_STATUS_APPROVED = 3;
export const FINANCE_REMITTANCE_STATUS_REJECTED = 4;

export const NEW_ORDERS_TAB = 'newOrders';
export const PACKAGING_ORDERS_TAB = 'acceptedOrder';
export const DISPATCHED_ORDERS_TAB = 'readyToShipOrders';
export const ON_THE_WAY_ORDERS_TAB = 'shippingOrders';
export const DELIVERED_ORDERS_TAB = 'deliveredOrders';
export const CANCELLED_ORDERS_TAB = 'cancelledOrders';
export const REPLACEMENT_REQUEST_ORDERS_TAB = 'escalatedOrders';

export const ORDER_TYPE_ALL = 'All';
export const ORDER_TYPE_LOCAL = 'local';
export const ORDER_TYPE_OTHER = 'other';

export const ORDER_FILTER_TYPE_ALL = 'All';
export const ORDER_FILTER_TYPE_READ = 'read';
export const ORDER_FILTER_TYPE_UNREAD = 'unread';

export const DELIVERY_ASSISTANT_FILTER_TYPE_ALL = -1;
export const DELIVERY_ASSISTANT_FILTER_TYPE_WAITING_APPROVAL = 0;
export const DELIVERY_ASSISTANT_FILTER_TYPE_APPROVED = 1;
export const DELIVERY_ASSISTANT_FILTER_TYPE_REJECTED = 2;
export const DELIVERY_ASSISTANT_FILTER_TYPE_SUSPENDED = 3;
export const DELIVERY_ASSISTANT_FILTER_TYPE_RESIGNED = 4;
export const DELIVERY_ASSISTANT_FILTER_TYPE_TERMINATED = 5;

export const ONLINE_ASSISTANT_IDLE = 0;
export const ONLINE_ASSISTANT_ENGAGED = 1;
export const ONLINE_ASSISTANT_OFFLINE = 2;

export const ONLINE_DELIVERY_ASSISTANTS = 'online';
export const ALL_DELIVERY_ASSISTANTS = 'all';

export const SUBSCRIPTIONS_TAB = 'subscriptions';
export const UNSUBSCRIPTIONS_TAB = 'unsubscriptions';

export const SUBSCRIPTIONS_STATUS_OPTION_ALL = 0;
export const SUBSCRIPTIONS_STATUS_OPTION_ACTIVE = 1;
export const SUBSCRIPTIONS_STATUS_OPTION_PAUSE = 2;
export const SUBSCRIPTIONS_STATUS_OPTION_UNSUBSCRIBED = 3;
