import { NgModule } from '@angular/core';
import { DashboardRoutingModule, routedComponents } from '@app/pages/dashboard/dashboard-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  imports: [
    SharedModule,
    NgxChartsModule,
    DashboardRoutingModule,
    NgxPermissionsModule.forChild()
  ],
  declarations: [
    ...routedComponents
  ]
})
export class DashboardModule {

}
