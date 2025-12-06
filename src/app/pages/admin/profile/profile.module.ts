import { NgModule } from '@angular/core';
import { ProfileRoutingModule, routedComponents } from '@app/pages/admin/profile/profile-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  imports: [
    ProfileRoutingModule,
    SharedModule,
    NgxPermissionsModule.forChild()
  ],
  declarations: [
    ...routedComponents
  ],
  exports: [],
  entryComponents: []
})
export class ProfileModule {
}
