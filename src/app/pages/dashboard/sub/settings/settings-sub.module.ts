import { NgModule } from '@angular/core';
import { SettingsSubRoutingModule, routedComponents } from '@app/pages/dashboard/sub/settings/settings-sub-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { FormSettingComponent } from './form-setting/form-setting.component';
import { SettingSubService } from './setting-sub.service';

@NgModule({
  imports: [
    SettingsSubRoutingModule,
    SharedModule,
    NgxPermissionsModule.forChild()
  ],
  declarations: [
    ...routedComponents,
    FormSettingComponent
  ],
  exports: [],
  entryComponents: [],
  providers: [SettingSubService]
})
export class SettingsSubModule {
}
