import { NgModule } from '@angular/core';
import { ScFilterSettingsService } from '@app/pages/admin/shared/sc-filter-settings.service';
import { SharedService } from '@app/pages/admin/shared/shared.service';
import { SharedModule } from '@app/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AdminRoutingModule, routedComponents } from './admin-routing.module';

@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,
    NgxPermissionsModule.forChild()
  ],
  declarations: [
    ...routedComponents
  ],
  providers: [
    SharedService,
    ScFilterSettingsService
  ]
})
export class AdminModule {}
