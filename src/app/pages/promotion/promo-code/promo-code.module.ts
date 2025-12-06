import { NgModule } from '@angular/core';
import { PromoInventoryService } from '@app/pages/promotion/promo-code/inventory/promo-inventory.service';
import { PromoCodeListFilterSettingsService } from '@app/pages/promotion/promo-code/list/promo-code-list-filter-settings.service';
import { PromoCodeListService } from '@app/pages/promotion/promo-code/list/promo-code-list.service';
import { PromoCodeRoutingModule, routedComponents } from '@app/pages/promotion/promo-code/promo-code-routing.module';
import { PromoService } from '@app/pages/promotion/promo-code/promo.service';
import { PromoSettingsService } from '@app/pages/promotion/promo-code/settings/promo-settings.service';
import { SharedModule } from '@app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  imports: [
    SharedModule,
    PromoCodeRoutingModule,
    NgxPermissionsModule.forChild(),
    NgSelectModule
  ],
  exports: [],
  declarations: [
    ...routedComponents
  ],
  providers: [
    PromoService,
    PromoCodeListService,
    PromoCodeListFilterSettingsService,
    PromoInventoryService,
    PromoSettingsService
  ]
})
export class PromoCodeModule {
}
