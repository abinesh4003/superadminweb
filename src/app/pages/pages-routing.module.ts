import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { privilegesToArray } from '@app/core/utils/privileges.helper';
import { AdminPermissionsConstants } from '@app/pages/admin/admin-permissions.constants';
import { BillingsPermissionsConstants } from '@app/pages/billings/billings-permissions.constants';
import { DashboardPermissionsConstants } from '@app/pages/dashboard/dashboard-permissions.constants';
import { FinancePermissionsConstants } from '@app/pages/finance/finance-permissions.constants';
import { MerchantsPermissionsConstants } from '@app/pages/merchants/merchants-permissions.constants';
import { PagesComponent } from '@app/pages/pages.component';
import { PromotionPermissionsConstants } from '@app/pages/promotion/promotion-permissions.constants';
import { ShopsPermissionsConstants } from '@app/pages/shops/shops-permissions.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import {OrdersPermissionsConstants} from "@app/pages/orders/orders-permissions.constants";

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      loadChildren: 'app/pages/dashboard/dashboard.module#DashboardModule',
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: privilegesToArray(DashboardPermissionsConstants),
          redirectTo: 'pages/finance'
        }
      }
    },

    {
      path: 'finance',
      loadChildren: 'app/pages/finance/finance.module#FinanceModule',
      data: {
        permissions: {
          only: privilegesToArray(FinancePermissionsConstants),
          redirectTo: 'pages/promotion'
        }
      }
    },

    {
      path: 'promotion',
      loadChildren: 'app/pages/promotion/promotion.module#PromotionModule',
      data: {
        permissions: {
          only: privilegesToArray(PromotionPermissionsConstants),
          redirectTo: 'pages/merchants'
        }
      }
    },

    {
      path: 'merchants',
      loadChildren: 'app/pages/merchants/merchants.module#MerchantsModule',
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: privilegesToArray(MerchantsPermissionsConstants),
          redirectTo: 'pages/shops'
        }
      }
    },

    {
      path: 'shops',
      loadChildren: 'app/pages/shops/shops.module#ShopsModule',
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: privilegesToArray(ShopsPermissionsConstants),
          redirectTo: 'pages/billings'
        }
      }
    },

    {
      path: 'billings',
      loadChildren: 'app/pages/billings/billings.module#BillingsModule',
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: privilegesToArray(BillingsPermissionsConstants),
          redirectTo: 'pages/orders'
        }
      }
    },

    {
      path: 'orders',
      loadChildren: 'app/pages/orders/orders.module#OrdersModule',
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: privilegesToArray(OrdersPermissionsConstants),
          redirectTo: 'pages/admin'
        }
      }
    },

    {
      path: 'admin',
      loadChildren: 'app/pages/admin/admin.module#AdminModule',
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: privilegesToArray(AdminPermissionsConstants),
          redirectTo: 'pages' // TODO: change once next section will be implemented
        }
      }
    },

    // { path: 'messages', loadChildren: 'app/pages/messages/messages.module#MessagesModule' },
    { path: '', pathMatch: 'full', redirectTo: 'dashboard'},
    { path: '**', redirectTo: 'dashboard'}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}

export const routedComponents = [
  PagesComponent
];
