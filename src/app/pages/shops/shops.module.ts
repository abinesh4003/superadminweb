import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ShopsRoutingModule, routedComponents } from './shops-routing.module';

@NgModule({
  imports: [
    ShopsRoutingModule,
    SharedModule,
    NgxPermissionsModule.forChild()
  ],
  declarations: [
    ...routedComponents
  ]
})
export class ShopsModule {

}
