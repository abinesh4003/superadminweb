import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  PROMOTION_ADS_TAB_MERCHANTS_ADS,
  PROMOTION_ADS_TAB_SCRATCH_CARD
} from '@app/core/constants';
import { privilegesToArray } from '@app/core/utils/privileges.helper';
import { MerchantsAdsFormComponent } from '@app/pages/promotion/ads/merchants-ads/form/merchants-ads-form.component';
import { MerchantsAdsListComponent } from '@app/pages/promotion/ads/merchants-ads/list/merchants-ads-list.component';
import { AdsScratchCardComponent } from '@app/pages/promotion/ads/scratch-card/ads-scratch-card.component';
import {
  PromotionAdsMerchantsPermissionsConstants,
  PromotionAdsScratchCardPermissionsConstants
} from '@app/pages/promotion/ads/promotion-ads-permissions.constants';
import { PromotionAdsComponent } from '@app/pages/promotion/ads/promotion-ads.component';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path: '',
    component: PromotionAdsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: PROMOTION_ADS_TAB_SCRATCH_CARD
      },

      {
        path: PROMOTION_ADS_TAB_SCRATCH_CARD,
        component: AdsScratchCardComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: privilegesToArray(PromotionAdsScratchCardPermissionsConstants),
            redirectTo: `pages/promotion/ads/${PROMOTION_ADS_TAB_MERCHANTS_ADS}`
          }
        }
      },

      {
        path: PROMOTION_ADS_TAB_MERCHANTS_ADS,
        children: [{
          path: '',
          pathMatch: 'full',
          component: MerchantsAdsListComponent
        }, {
          path: ':page',
          component: MerchantsAdsFormComponent
        }, {
          path: ':page/:adId',
          component: MerchantsAdsFormComponent
        }],
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: privilegesToArray(PromotionAdsMerchantsPermissionsConstants),
            redirectTo: 'pages/promotion/ads'
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
export class PromotionAdsRoutingModule {
}

export const routedComponents = [
  PromotionAdsComponent,
  AdsScratchCardComponent,
  MerchantsAdsListComponent,
  MerchantsAdsFormComponent
];
