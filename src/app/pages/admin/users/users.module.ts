import { NgModule } from '@angular/core';
import { SuperAdminResolver } from '@app/pages/admin/users/super-admin.resolver';
import { UserAddStoreModalComponent } from '@app/pages/admin/users/user/sc/add-store-modal/user-add-store-modal.component';
import { UserService } from '@app/pages/admin/users/user/user.service';
import { UsersRoutingModule, routedComponents } from '@app/pages/admin/users/users-routing.module';
import { UsersService } from '@app/pages/admin/users/users.service';
import { SharedModule } from '@app/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';

const MODALS = [
  UserAddStoreModalComponent
];

@NgModule({
  imports: [
    UsersRoutingModule,
    SharedModule,
    NgxPermissionsModule.forChild()
  ],
  declarations: [
    ...routedComponents,
    ...MODALS
  ],
  entryComponents: [
    ...MODALS
  ],
  providers: [
    UsersService,
    UserService,
    SuperAdminResolver
  ],
})
export class UsersModule {
}
