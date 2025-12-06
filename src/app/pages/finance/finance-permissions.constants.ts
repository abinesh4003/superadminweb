import { formatPrivilegesKeys } from '@app/core/utils/privileges.helper';
import { FinanceManageOffersPermissionsConstants } from '@app/pages/finance/offers/offers-permissions.constants';
import { WithdrawalPermissionsConstants } from '@app/pages/finance/withdrawal/withdrawal-permissions.constants';

export const FinancePermissionsConstants = {
  ...formatPrivilegesKeys(WithdrawalPermissionsConstants),
  ...formatPrivilegesKeys(FinanceManageOffersPermissionsConstants),
  PATH: '',
};
