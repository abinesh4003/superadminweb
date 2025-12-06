import { formatPrivilegesKeys } from '@app/core/utils/privileges.helper';
import { InventorySubPermissionsConstants, } from '@app/pages/dashboard/sub/inventory/inventory-sub-permissions.constants';
import { OrdersSubPermissionsConstants } from '@app/pages/dashboard/sub/orders/orders-sub-permissions.constants';
import { OverviewSubPermissionsConstants } from '@app/pages/dashboard/sub/overview/overview-sub-permissions.constants';
import {
  RefundReplacementSubPermissionsConstants
} from '@app/pages/dashboard/sub/refund-replacement/refund-replacement-sub-permissions.constants';
import { SettingsSubPermissionsConstants } from '@app/pages/dashboard/sub/settings/settings-sub-permissions.constants';
import { ShopsSubPermissionsConstants } from '@app/pages/dashboard/sub/shops/shops-sub-permissions.constants';

export const DashboardSubPermissionsConstants = {
  ...formatPrivilegesKeys(InventorySubPermissionsConstants),
  ...formatPrivilegesKeys(RefundReplacementSubPermissionsConstants),
  ...formatPrivilegesKeys(OrdersSubPermissionsConstants),
  ...formatPrivilegesKeys(OverviewSubPermissionsConstants),
  ...formatPrivilegesKeys(SettingsSubPermissionsConstants),
  ...formatPrivilegesKeys(ShopsSubPermissionsConstants),
  PATH: ''
};
