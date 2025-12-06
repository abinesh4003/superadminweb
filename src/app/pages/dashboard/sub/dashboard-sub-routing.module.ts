import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { privilegesToArray } from '@app/core/utils/privileges.helper';
import { DashboardSubComponent } from '@app/pages/dashboard/sub/dashboard-sub.component';
import {
  InventorySkuSubPermissionsConstants,
  InventoryUpcSubPermissionsConstants
} from '@app/pages/dashboard/sub/inventory/inventory-sub-permissions.constants';
import { MessagesSubComponent } from '@app/pages/dashboard/sub/messages/messages-sub.component';
import { OrdersSubPermissionsConstants } from '@app/pages/dashboard/sub/orders/orders-sub-permissions.constants';
// import { OverviewSubPermissionsConstants } from '@app/pages/dashboard/sub/overview/overview-sub-permissions.constants';
import {
  RefundReplacementSubPermissionsConstants
} from '@app/pages/dashboard/sub/refund-replacement/refund-replacement-sub-permissions.constants';
import { SettingsSubPermissionsConstants } from '@app/pages/dashboard/sub/settings/settings-sub-permissions.constants';
import { ShopsSubPermissionsConstants } from '@app/pages/dashboard/sub/shops/shops-sub-permissions.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';

const noPermissionRedirect = (section) => {
  return (rejectedPermissionName: string, activateRouteSnapshot: ActivatedRouteSnapshot) => {
    const id = activateRouteSnapshot.parent.params['id'];

    return `pages/dashboard/${id}/${section}`;
  };
};

const routes: Routes = [{
    path: '',
    component: DashboardSubComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'upc' },

      // TODO: uncomment once section will be implemented
      // {
      //   path: 'overview',
      //   loadChildren: 'app/pages/dashboard/sub/overview/overview-sub.module#OverviewSubModule',
      //   canActivate: [NgxPermissionsGuard],
      //   data: {
      //     permissions: {
      //       only: privilegesToArray(OverviewSubPermissionsConstants),
      //       redirectTo: noPermissionRedirect('upc'),
      //     }
      //   }
      // },

      {
        path: 'upc',
        loadChildren: 'app/pages/dashboard/sub/inventory/inventory.module#InventoryModule',
        canActivate: [NgxPermissionsGuard],
        data: {
          inventory: 'upc',
          permissions: {
            only: privilegesToArray(InventoryUpcSubPermissionsConstants),
            redirectTo: noPermissionRedirect('sku'),
          }
        }
      },

      {
        path: 'sku',
        loadChildren: 'app/pages/dashboard/sub/inventory/inventory.module#InventoryModule',
        canActivate: [NgxPermissionsGuard],
        data: {
          inventory: 'sku',
          permissions: {
            only: privilegesToArray(InventorySkuSubPermissionsConstants),
            redirectTo: noPermissionRedirect('shops'),
          }
        }
      },

      {
        path: 'shops',
        loadChildren: 'app/pages/dashboard/sub/shops/shops-sub.module#ShopsSubModule',
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: privilegesToArray(ShopsSubPermissionsConstants),
            redirectTo: noPermissionRedirect('orders'),
          }
        }
      },

      {
        path: 'orders',
        loadChildren: 'app/pages/dashboard/sub/orders/orders-sub.module#OrdersSubModule',
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: privilegesToArray(OrdersSubPermissionsConstants),
            redirectTo: noPermissionRedirect('refund-replacement'),
          }
        }
      },

      {
        path: 'refund-replacement',
        loadChildren: 'app/pages/dashboard/sub/refund-replacement/refund-replacement-sub.module#RefundReplacementSubModule',
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: privilegesToArray(RefundReplacementSubPermissionsConstants),
            // redirectTo: noPermissionRedirect('messages'), TODO: uncomment once messages section will be implemented
            redirectTo: noPermissionRedirect('settings')
          }
        }
      },

      // TODO: uncomment once section will be implemented
      // { path: 'messages', component: MessagesSubComponent },

      {
        path: 'settings',
        loadChildren: 'app/pages/dashboard/sub/settings/settings-sub.module#SettingsSubModule',
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: privilegesToArray(SettingsSubPermissionsConstants),
            // redirectTo: noPermissionRedirect('overview'), TODO: uncomment once overview section will be implemented
            redirectTo: noPermissionRedirect('/'),
          }
        }
      }
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardSubRoutingModule {}

export const routedComponents = [
  DashboardSubComponent,
  MessagesSubComponent
];
