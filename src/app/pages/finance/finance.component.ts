import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { privilegesToArray } from '@app/core/utils/privileges.helper';
import {
  FinanceManageOffersPermissionsConstants,
} from '@app/pages/finance/offers/offers-permissions.constants';
import { WithdrawalPermissionsConstants } from '@app/pages/finance/withdrawal/withdrawal-permissions.constants';
import {RemittancePermissionsConstants} from "@app/pages/finance/remittance/remittance-permissions.constants";

@Component({
  selector: 'pkz-pages-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinanceComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

  get withdrawalPermissions() {
    return privilegesToArray(WithdrawalPermissionsConstants);
  }

  get remittancePermissions() {
    return privilegesToArray(RemittancePermissionsConstants);
  }

  get offersPermissions() {
    return privilegesToArray(FinanceManageOffersPermissionsConstants);
  }
}
