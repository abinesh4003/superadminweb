import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MerchantsRoutingModule, routedComponents } from './merchants-routing.module';

@NgModule({
  imports: [
    MerchantsRoutingModule,
    SharedModule,
    NgxPermissionsModule.forChild()
  ],
  declarations: [
    ...routedComponents
  ]
})
export class MerchantsModule {

}
