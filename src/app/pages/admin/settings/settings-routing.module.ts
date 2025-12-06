import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { privilegesToArray } from '@app/core/utils/privileges.helper';
import { CommonChargesComponent } from '@app/pages/admin/settings/common-charges/common-charges.component';
import { SettingsCardChargesPermissionsConstants } from '@app/pages/admin/settings/settings-permissions.constants';
import { SettingsComponent } from '@app/pages/admin/settings/settings.component';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'charges'
      },

      {
        path: 'charges',
        component: CommonChargesComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: privilegesToArray(SettingsCardChargesPermissionsConstants),
            redirectTo: 'pages/admin/settings'
          }
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {
}

export const routedComponents = [
  SettingsComponent,
  CommonChargesComponent
];
