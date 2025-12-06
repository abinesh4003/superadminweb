import { NgModule } from '@angular/core';
import { ManageOffersService } from '@app/pages/finance/offers/manage/manage-offers.service';
import { OffersRoutingModule, routedComponents } from '@app/pages/finance/offers/offers-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  imports: [
    SharedModule,
    OffersRoutingModule,
    NgxPermissionsModule.forChild()
  ],
  exports: [],
  declarations: [
    ...routedComponents
  ],
  providers: [
    ManageOffersService
  ]
})
export class OffersModule {
}
