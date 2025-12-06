import {NgModule} from '@angular/core';
import {ShopFormApiService} from '@app/pages/dashboard/sub/shops/form/shop-form-api.service';
import {ShopFormService} from '@app/pages/dashboard/sub/shops/form/shop-form.service';
import {ShopInventoryFilterSettingsService} from '@app/pages/dashboard/sub/shops/inventory/shop-inventory-filter-settings.service';
import {ShopInventoryService} from '@app/pages/dashboard/sub/shops/inventory/shop-inventory.service';
import {ShopSettingsService} from '@app/pages/dashboard/sub/shops/settings/shop-settings.service';
import {routedComponents, ShopsSubRoutingModule} from '@app/pages/dashboard/sub/shops/shops-sub-routing.module';
import {SharedModule} from '@app/shared/shared.module';
import {NgxPermissionsModule} from 'ngx-permissions';
import {ShopsSubService} from './shops-sub.service';
import {ShopListService} from './list/shop-list.service';
import {ShopImagesReviewModalComponent} from './form/shop-images-review-modal/shop-images-review-modal.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {MerchantSettingsModalComponent} from './settings/merchant-settings-modal/merchant-settings-modal.component';

const MODALS = [
  ShopImagesReviewModalComponent,
  MerchantSettingsModalComponent
];

@NgModule({
  imports: [
    ShopsSubRoutingModule,
    SharedModule,
    NgxPermissionsModule.forChild(),
    NgSelectModule
  ],
  declarations: [
    ...routedComponents,
    ...MODALS,

  ],
  exports: [],
  entryComponents: [
    ...MODALS
  ],
  providers: [
    ShopsSubService,
    ShopListService,
    ShopFormApiService,
    ShopFormService,
    ShopSettingsService,
    ShopInventoryService,
    ShopInventoryFilterSettingsService
  ]
})
export class ShopsSubModule {
}
