import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { privilegesToArray } from '@app/core/utils/privileges.helper';
import { PromotionAdsPermissionsConstants } from '@app/pages/promotion/ads/promotion-ads-permissions.constants';
import { PromotionAnnouncementPermissionsConstants } from '@app/pages/promotion/announcement/announcement-permissions.constants';
import { PromotionBroadcastPermissionsConstants } from '@app/pages/promotion/broadcast/promotion-broadcast-permissions.constants';
import { PromotionPromoCodePermissionsConstants } from '@app/pages/promotion/promo-code/promo-code-permissions.constants';
import { PromotionComponent } from '@app/pages/promotion/promotion.component';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [{
  path: '',
  component: PromotionComponent,
  children: [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'promo'
    },

    {
      path: 'promo',
      loadChildren: './promo-code/promo-code.module#PromoCodeModule',
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: privilegesToArray(PromotionPromoCodePermissionsConstants),
          redirectTo: 'pages/promotion/broadcast'
        }
      }
    },

    {
      path: 'broadcast',
      loadChildren: './broadcast/promotion-broadcast.module#PromotionBroadcastModule',
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: privilegesToArray(PromotionBroadcastPermissionsConstants),
          redirectTo: 'pages/promotion/ads'
        }
      }
    },

    {
      path: 'ads',
      loadChildren: './ads/promotion-ads.module#PromotionAdsModule',
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: privilegesToArray(PromotionAdsPermissionsConstants),
          redirectTo: 'pages/promotion/announcement'
        }
      }
    },

    {
      path: 'announcement',
      loadChildren: './announcement/announcement.module#AnnouncementModule',
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: privilegesToArray(PromotionAnnouncementPermissionsConstants),
          redirectTo: 'pages/promotion'
        }
      }
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromotionRoutingModule {
}

export const routedComponents = [
  PromotionComponent,
];
