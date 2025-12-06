import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PROMOTION_BROADCAST_TAB_BAYFAY, PROMOTION_BROADCAST_TAB_MERCHANTS } from '@app/core/constants';
import { privilegesToArray } from '@app/core/utils/privileges.helper';
import { BroadcastListComponent } from '@app/pages/promotion/broadcast/list/broadcast-list.component';
import {
  PromotionBroadcastBayFayPermissionsConstants,
  PromotionBroadcastMerchantsPermissionsConstants
} from '@app/pages/promotion/broadcast/promotion-broadcast-permissions.constants';
import { PromotionBroadcastComponent } from '@app/pages/promotion/broadcast/promotion-broadcast.component';
import { BroadcastSettingsComponent } from '@app/pages/promotion/broadcast/settings/broadcast-settings.component';
import { NgxPermissionsGuard } from 'ngx-permissions';

const commonChildren: Routes = [{
  path: '',
  pathMatch: 'full',
  component: BroadcastListComponent
}, {
  path: 'settings/:promoId/:promoContactsId/:requestType',
  component: BroadcastSettingsComponent
}];

const routes: Routes = [
  {
    path: '',
    component: PromotionBroadcastComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: PROMOTION_BROADCAST_TAB_MERCHANTS
      },

      {
        path: PROMOTION_BROADCAST_TAB_MERCHANTS,
        children: commonChildren,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: privilegesToArray(PromotionBroadcastMerchantsPermissionsConstants),
            redirectTo: `pages/promotion/broadcast/${PROMOTION_BROADCAST_TAB_BAYFAY}`
          }
        }
      },

      {
        path: PROMOTION_BROADCAST_TAB_BAYFAY,
        children: commonChildren,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: privilegesToArray(PromotionBroadcastBayFayPermissionsConstants),
            redirect: 'pages/promotion/broadcast'
          }
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionBroadcastRoutingModule {
}

export const routedComponents = [
  PromotionBroadcastComponent,
  BroadcastListComponent,
  BroadcastSettingsComponent
];
