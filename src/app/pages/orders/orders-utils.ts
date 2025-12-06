import {
  CANCELLED_ORDERS_TAB,
  DELIVERED_ORDERS_TAB,
  DISPATCHED_ORDERS_TAB,
  NEW_ORDERS_TAB,
  ON_THE_WAY_ORDERS_TAB,
  PACKAGING_ORDERS_TAB,
  REPLACEMENT_REQUEST_ORDERS_TAB
} from "@app/core/constants";

export const orderStatusMap = {
  1: {label: 'New Orders', display_name: 'New Order', path: NEW_ORDERS_TAB},
  2: {label: 'Packaging', display_name: 'Packaging', path: PACKAGING_ORDERS_TAB},
  3: {label: 'Dispatched', display_name: 'Dispatched', path: DISPATCHED_ORDERS_TAB},
  4: {label: 'Shipping', display_name: 'Shipping', path: ON_THE_WAY_ORDERS_TAB},
  5: {label: 'Delivered', display_name: 'Delivered', path: DELIVERED_ORDERS_TAB},
  6: {label: 'Replacement / Undelivered', display_name: 'Replacement', path: CANCELLED_ORDERS_TAB},
  7: {label: 'Cancelled', display_name: 'Cancelled By Customer', path: REPLACEMENT_REQUEST_ORDERS_TAB},
  8: {label: 'Cancelled', display_name: 'Cancelled By Shop', path: REPLACEMENT_REQUEST_ORDERS_TAB},
  9: {label: 'Cancelled', display_name: 'Cancelled By Super Admin', path: REPLACEMENT_REQUEST_ORDERS_TAB},
};
