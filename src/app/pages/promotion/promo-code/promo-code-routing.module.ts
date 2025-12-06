import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  PROMOTION_PROMO_TAB_BAYFAY,
  // PROMOTION_PROMO_TAB_MERCHANTS
} from '@app/core/constants';
import { privilegesToArray } from '@app/core/utils/privileges.helper';
import { PromoInventoryComponent } from '@app/pages/promotion/promo-code/inventory/promo-inventory.component';
import { PromoCodeListComponent } from '@app/pages/promotion/promo-code/list/promo-code-list.component';
import { PromoCodeComponent } from '@app/pages/promotion/promo-code/promo-code.component';
import { PromoSettingsComponent } from '@app/pages/promotion/promo-code/settings/promo-settings.component';
import {
  PromotionPromoCodeBayFayPermissionsConstants,
  // PromotionPromoCodeMerchantsPermissionsConstants
} from '@app/pages/promotion/promo-code/promo-code-permissions.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';

const commonChildren: Routes = [{
  path: '',
  pathMatch: 'full',
  component: PromoCodeListComponent
}, {
  path: 'settings/:id',
  component: PromoSettingsComponent
}, {
  path: 'add',
  component: PromoInventoryComponent
}, {
  path: 'edit/:id',
  component: PromoInventoryComponent
}];

const routes: Routes = [
  {
    path: '',
    component: PromoCodeComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: PROMOTION_PROMO_TAB_BAYFAY
      },

      {
        path: PROMOTION_PROMO_TAB_BAYFAY,
        children: commonChildren,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: privilegesToArray(PromotionPromoCodeBayFayPermissionsConstants),
            redirect: 'pages/promotion/promo'
            // TODO: uncomment later
            // redirectTo: `pages/promotion/promo/${PROMOTION_PROMO_TAB_MERCHANTS}`
          }
        }
      },

      // TODO: implement later
      // {
      //   path: PROMOTION_PROMO_TAB_MERCHANTS,
      //   children: commonChildren,
      //   canActivate: [NgxPermissionsGuard],
      //   data: {
      //     permissions: {
      //       only: privilegesToArray(PromotionPromoCodeMerchantsPermissionsConstants),
      //       redirect: 'pages/promotion/promo'
      //     }
      //   }
      // }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromoCodeRoutingModule {
}

export const routedComponents = [
  PromoCodeComponent,
  PromoCodeListComponent,
  PromoSettingsComponent,
  PromoInventoryComponent
];
