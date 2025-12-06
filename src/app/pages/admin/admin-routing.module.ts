import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { privilegesToArray } from '@app/core/utils/privileges.helper';
import { AdminInfoComponent } from '@app/pages/admin/info/admin-info.component';
import { ProfilePermissionsConstants } from '@app/pages/admin/profile/profile-permissions.constants';
import { RolesPermissionsConstants } from '@app/pages/admin/roles/roles-permissions.constants';
import { ScPermissionsConstants } from '@app/pages/admin/sc/sc-permissions.constants';
import { SettingsPermissionsConstants } from '@app/pages/admin/settings/settings-permissions.constants';
import { UsersPermissionsConstants } from '@app/pages/admin/users/users-permissions.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AdminComponent } from './admin.component';

const routes: Routes = [{
  path: '',
  component: AdminComponent,
  children: [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'sc'
    },

    {
      path: 'sc',
      loadChildren: 'app/pages/admin/sc/sc.module#ScModule',
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: privilegesToArray(ScPermissionsConstants),
          redirectTo: 'pages/admin/users'
        }
      }
    },

    {
      path: 'users',
      loadChildren: 'app/pages/admin/users/users.module#UsersModule',
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: privilegesToArray(UsersPermissionsConstants),
          redirectTo: 'pages/admin/roles'
        }
      }
    },

    {
      path: 'roles',
      loadChildren: 'app/pages/admin/roles/roles.module#RolesModule',
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: privilegesToArray(RolesPermissionsConstants),
          redirectTo: 'pages/admin/profile'
        }
      }
    },

    {
      path: 'profile',
      loadChildren: 'app/pages/admin/profile/profile.module#ProfileModule',
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: privilegesToArray(ProfilePermissionsConstants),
          redirectTo: 'pages/admin/settings'
        }
      }
    },

    {
      path: 'settings',
      loadChildren: 'app/pages/admin/settings/settings.module#SettingsModule',
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: privilegesToArray(SettingsPermissionsConstants),
          redirectTo: 'pages/admin' // TODO: change once next section will be implemented
        }
      }
    },
    // TODO: uncomment once section will be implemented
    //
    // {
    //   path: 'info',
    //   component: AdminInfoComponent
    // }
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {
}

export const routedComponents = [
  AdminComponent,
  AdminInfoComponent
];
