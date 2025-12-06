import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShopsComponent } from './shops.component';

const routes: Routes = [{
  path: '',
  component: ShopsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopsRoutingModule {
}

export const routedComponents = [
  ShopsComponent,
];
