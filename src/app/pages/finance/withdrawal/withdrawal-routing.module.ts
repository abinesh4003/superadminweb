import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WithdrawalListComponent } from '@app/pages/finance/withdrawal/list/withdrawal-list.component';

const routes: Routes = [
  {
    path: '',
    component: WithdrawalListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WithdrawalRoutingModule {}

export const routedComponents = [
  WithdrawalListComponent
];
