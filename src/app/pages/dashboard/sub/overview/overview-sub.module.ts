import { NgModule } from '@angular/core';
import { OverviewSubRoutingModule, routedComponents } from '@app/pages/dashboard/sub/overview/overview-sub-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  imports: [
    OverviewSubRoutingModule,
    SharedModule,
    NgxPermissionsModule.forChild()
  ],
  declarations: [
    ...routedComponents
  ],
  exports: [],
  entryComponents: []
})
export class OverviewSubModule {
}
