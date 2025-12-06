import { NgModule } from '@angular/core';
import { MerchantsAdsFormService } from '@app/pages/promotion/ads/merchants-ads/form/merchants-ads-form.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { MerchantsAdsListFilterSettingsService } from './merchants-ads/list/merchants-ads-list-filter-settings.service';
import { MerchantsAdsListService } from '@app/pages/promotion/ads/merchants-ads/list/merchants-ads-list.service';
import { RewardModalComponent } from '@app/pages/promotion/ads/reward-modal/reward-modal.component';
import { AdsScratchCardService } from '@app/pages/promotion/ads/scratch-card/ads-scratch-card.service';
import { PromotionAdsRoutingModule, routedComponents } from '@app/pages/promotion/ads/promotion-ads-routing.module';
import { PromotionAdsService } from '@app/pages/promotion/ads/promotion-ads.service';
import { SharedModule } from '@app/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';

const MODALS = [
  RewardModalComponent
];

@NgModule({
  imports: [
    SharedModule,
    PromotionAdsRoutingModule,
    NgxPermissionsModule.forChild(),
    NgSelectModule,
  ],
  exports: [],
  declarations: [
    ...MODALS,
    ...routedComponents
  ],
  providers: [
    PromotionAdsService,
    AdsScratchCardService,
    MerchantsAdsListService,
    MerchantsAdsListFilterSettingsService,
    MerchantsAdsFormService
  ],
  entryComponents: [
    ...MODALS,
  ]
})
export class PromotionAdsModule {
}
