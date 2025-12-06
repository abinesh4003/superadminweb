import { NgModule } from '@angular/core';
import { DashboardSubRoutingModule, routedComponents } from '@app/pages/dashboard/sub/dashboard-sub-routing.module';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    DashboardSubRoutingModule
  ],
  declarations: [
    ...routedComponents
  ],
  providers: [],
})
export class DashboardSubModule {}
