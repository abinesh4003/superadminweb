import { NgModule } from '@angular/core';
import { AssignAdminsModalComponent } from '@app/pages/admin/roles/assign-admins-modal/assign-admins-modal.component';
import { RoleModalComponent } from '@app/pages/admin/roles/role-modal/role-modal.component';
import { RoleService } from '@app/pages/admin/roles/role/role.service';
import { RolesRoutingModule, routedComponents } from '@app/pages/admin/roles/roles-routing.module';
import { RolesService } from '@app/pages/admin/roles/roles.service';
import { SharedModule } from '@app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TreeviewModule } from 'ngx-treeview';

const MODALS = [
  RoleModalComponent,
  AssignAdminsModalComponent
];

@NgModule({
  imports: [
    SharedModule,
    RolesRoutingModule,
    NgSelectModule,
    TreeviewModule,
    NgxPermissionsModule.forChild()
  ],
  exports: [],
  declarations: [
    ...routedComponents,
    ...MODALS
  ],
  providers: [
    RolesService,
    RoleService
  ],
  entryComponents: [
    ...MODALS
  ]
})
export class RolesModule {
}
