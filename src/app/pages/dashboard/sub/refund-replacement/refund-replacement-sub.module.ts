import { NgModule } from '@angular/core';
import {
  RefundReplacementSubRoutingModule, routedComponents
} from '@app/pages/dashboard/sub/refund-replacement/refund-replacement-sub-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  imports: [
    RefundReplacementSubRoutingModule,
    SharedModule,
    NgxPermissionsModule.forChild()
  ],
  declarations: [
    ...routedComponents
  ],
  exports: [],
  entryComponents: []
})
export class RefundReplacementSubModule {
}
