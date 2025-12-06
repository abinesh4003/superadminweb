import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { privilegesToArray } from '@app/core/utils/privileges.helper';
import { FinanceManageOffersPermissionsConstants } from '@app/pages/finance/offers/offers-permissions.constants';
import { WithdrawalPermissionsConstants } from '@app/pages/finance/withdrawal/withdrawal-permissions.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { FinanceComponent } from './finance.component';
import {RemittancePermissionsConstants} from "@app/pages/finance/remittance/remittance-permissions.constants";

const routes: Routes = [{
  path: '',
  component: FinanceComponent,
  children: [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'withdrawal'
    },

    {
      path: 'withdrawal',
      loadChildren: './withdrawal/withdrawal.module#WithdrawalModule',
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: privilegesToArray(WithdrawalPermissionsConstants),
          redirectTo: 'pages/finance/remittance'
        }
      }
    },
    {
      path: 'remittance',
      loadChildren: './remittance/remittance.module#RemittanceModule',
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: privilegesToArray(RemittancePermissionsConstants),
          redirectTo: 'pages/finance/offers'
        }
      }
    },

    {
      path: 'offers',
      loadChildren: './offers/offers.module#OffersModule',
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: privilegesToArray(FinanceManageOffersPermissionsConstants),
          redirectTo: 'pages/finance'
        }
      }
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceRoutingModule {
}

export const routedComponents = [
  FinanceComponent,
];
