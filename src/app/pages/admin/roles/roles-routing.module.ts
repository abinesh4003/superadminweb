import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleAdminComponent } from '@app/pages/admin/roles/role/role-admin/role-admin.component';
import { RolePrivilegesComponent } from '@app/pages/admin/roles/role/role-privileges/role-privileges.component';
import { RoleComponent } from '@app/pages/admin/roles/role/role.component';
import { ADMIN_TAB, PRIVILEGES_TAB } from '@app/pages/admin/roles/role/role.constants';
import { RolesComponent } from '@app/pages/admin/roles/roles.component';

const routes: Routes = [
  {
    path: '',
    component: RolesComponent,
    children: [{
      path: ':id',
      component: RoleComponent,
      children: [{
        path: '',
        pathMatch: 'full',
        redirectTo: ADMIN_TAB
      }, {
        path: ADMIN_TAB,
        component: RoleAdminComponent
      }, {
        path: PRIVILEGES_TAB,
        component: RolePrivilegesComponent
      }]
    }]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesRoutingModule {
}

export const routedComponents = [
  RolesComponent,
  RoleComponent,
  RolePrivilegesComponent,
  RoleAdminComponent
];
