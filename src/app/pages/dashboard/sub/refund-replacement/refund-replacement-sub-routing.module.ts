import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RefundReplacementSubComponent } from '@app/pages/dashboard/sub/refund-replacement/refund-replacement-sub.component';

const routes: Routes = [
  {path: '', component: RefundReplacementSubComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RefundReplacementSubRoutingModule {
}

export const routedComponents = [
  RefundReplacementSubComponent
];
