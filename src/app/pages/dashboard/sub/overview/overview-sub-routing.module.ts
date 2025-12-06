import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewSubComponent } from '@app/pages/dashboard/sub/overview/overview-sub.component';

const routes: Routes = [
  {path: '', component: OverviewSubComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OverviewSubRoutingModule {
}

export const routedComponents = [
  OverviewSubComponent
];
