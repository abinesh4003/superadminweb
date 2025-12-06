import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { BillingsRoutingModule, routedComponents } from './billings-routing.module';

@NgModule({
  imports: [
    BillingsRoutingModule,
    SharedModule,
    NgxPermissionsModule.forChild()
  ],
  declarations: [
    ...routedComponents
  ]
})
export class BillingsModule {

}
