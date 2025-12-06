import { NgModule } from '@angular/core';
import { CommonChargesService } from '@app/pages/admin/settings/common-charges/common-charges.service';
import { SettingsRoutingModule, routedComponents } from '@app/pages/admin/settings/settings-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  imports: [
    SettingsRoutingModule,
    SharedModule,
    NgxPermissionsModule.forChild()
  ],
  declarations: [
    ...routedComponents
  ],
  providers: [
    CommonChargesService
  ],
  entryComponents: []
})
export class SettingsModule {
}
