import { NgModule } from '@angular/core';
import { PromotionService } from '@app/pages/promotion/promotion.service';
import { SendPreviewModalComponent } from '@app/pages/promotion/send-preview-modal/send-preview-modal.component';
import { SharedModule } from '@app/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PromotionRoutingModule, routedComponents } from './promotion-routing.module';

@NgModule({
  imports: [
    PromotionRoutingModule,
    SharedModule,
    NgxPermissionsModule.forChild()
  ],
  declarations: [
    SendPreviewModalComponent,
    ...routedComponents
  ],
  providers: [
    PromotionService
  ],
  entryComponents: [
    SendPreviewModalComponent
  ]
})
export class PromotionModule {

}
