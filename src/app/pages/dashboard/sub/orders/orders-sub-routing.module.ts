import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersSubComponent } from '@app/pages/dashboard/sub/orders/orders-sub.component';

const routes: Routes = [
  {path: '', component: OrdersSubComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersSubRoutingModule {
}

export const routedComponents = [
  OrdersSubComponent
];
