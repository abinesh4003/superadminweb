import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { privilegesToArray } from '@app/core/utils/privileges.helper';
import { ManageOffersComponent } from '@app/pages/finance/offers/manage/manage-offers.component';
import {
  FinanceManageOffersPermissionsConstants
} from '@app/pages/finance/offers/offers-permissions.constants';
import { OffersComponent } from '@app/pages/finance/offers/offers.component';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path: '',
    component: OffersComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'manage'
      },

      {
        path: 'manage',
        component: ManageOffersComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: privilegesToArray(FinanceManageOffersPermissionsConstants),
            redirectTo: 'pages/finance/offers'
          }
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffersRoutingModule {}

export const routedComponents = [
  OffersComponent,
  ManageOffersComponent
];
