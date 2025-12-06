import { NgModule } from '@angular/core';
import { BroadcastListFilterSettingsService } from '@app/pages/promotion/broadcast/list/broadcast-list-filter-settings.service';
import { BroadcastListService } from '@app/pages/promotion/broadcast/list/broadcast-list.service';
import { PromotionBroadcastRoutingModule, routedComponents } from '@app/pages/promotion/broadcast/promotion-broadcast-routing.module';
import { PromotionBroadcastService } from '@app/pages/promotion/broadcast/promotion-broadcast.service';
import { BroadcastSettingsService } from '@app/pages/promotion/broadcast/settings/broadcast-settings.service';
import { SharedModule } from '@app/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  imports: [
    SharedModule,
    PromotionBroadcastRoutingModule,
    NgxPermissionsModule.forChild()
  ],
  exports: [],
  declarations: [
    ...routedComponents
  ],
  providers: [
    PromotionBroadcastService,
    BroadcastListService,
    BroadcastListFilterSettingsService,
    BroadcastSettingsService
  ]
})
export class PromotionBroadcastModule {
}
