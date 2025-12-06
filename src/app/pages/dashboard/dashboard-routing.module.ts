import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { privilegesToArray } from '@app/core/utils/privileges.helper';
import { DashboardMainComponent } from '@app/pages/dashboard/main/dashboard-main.component';
import { DashboardSubPermissionsConstants } from '@app/pages/dashboard/sub/dashboard-sub-permissions.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [{
  path: '',
  component: DashboardComponent,
  children: [
    { path: 'main', component: DashboardMainComponent },

    {
      path: ':id',
      loadChildren: 'app/pages/dashboard/sub/dashboard-sub.module#DashboardSubModule',
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only: privilegesToArray(DashboardSubPermissionsConstants),
          redirectTo: 'pages/dashboard'
        }
      }
    },

    { path: '', pathMatch: 'full', redirectTo: 'main' },
    { path: '**', redirectTo: 'main'}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {
}

export const routedComponents = [
  DashboardComponent,
  DashboardMainComponent,
];
