import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuperAdminResolver } from '@app/pages/admin/users/super-admin.resolver';
import { UserDetailsComponent } from '@app/pages/admin/users/user/details/user-details.component';
import { UserLocationsComponent } from '@app/pages/admin/users/user/locations/user-locations.component';
import { UserRolesComponent } from '@app/pages/admin/users/user/roles/user-roles.component';
import { UserScComponent } from '@app/pages/admin/users/user/sc/user-sc.component';
import { UserComponent } from '@app/pages/admin/users/user/user.component';
import { UsersComponent } from '@app/pages/admin/users/users/users.component';

const commonChildren = [{
  path: 'user',
  component: UserDetailsComponent
}, {
  path: '',
  redirectTo: 'user',
  pathMatch: 'full'
}];

const routes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      component: UsersComponent
    }, {
      path: ':page',
      component: UserComponent,
      children: commonChildren
    }, {
      path: ':page/:id',
      component: UserComponent,
      resolve: {
        isSuperAdmin: SuperAdminResolver
      },
      children: [
        ...commonChildren,
      {
        path: 'roles',
        component: UserRolesComponent
      }, {
        path: 'sc',
        component: UserScComponent
      }, {
        path: 'locations',
        component: UserLocationsComponent
      }]
    }]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {
}

export const routedComponents = [
  UsersComponent,
  UserComponent,
  UserDetailsComponent,
  UserRolesComponent,
  UserScComponent,
  UserLocationsComponent
];
