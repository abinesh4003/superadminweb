import { NgModule } from '@angular/core';
import { OrdersSubRoutingModule, routedComponents } from '@app/pages/dashboard/sub/orders/orders-sub-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  imports: [
    OrdersSubRoutingModule,
    SharedModule,
    NgxPermissionsModule.forChild()
  ],
  declarations: [
    ...routedComponents
  ],
  exports: [],
  entryComponents: []
})
export class OrdersSubModule {
}
