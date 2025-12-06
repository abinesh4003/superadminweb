import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShopFormComponent } from '@app/pages/dashboard/sub/shops/form/shop-form.component';
import { ShopInventoryComponent } from '@app/pages/dashboard/sub/shops/inventory/shop-inventory.component';
import { ShopSettingsComponent } from '@app/pages/dashboard/sub/shops/settings/shop-settings.component';
import { ShopsSubComponent } from '@app/pages/dashboard/sub/shops/shops-sub.component';
import { ShopListComponent } from './list/shop-list.component';

const routes: Routes = [
  {
    path: '',
    component: ShopsSubComponent,
    children: [{
      path: '',
      component: ShopListComponent
    }, {
      path: 'settings/:id',
      component: ShopSettingsComponent
    }, {
      path: 'inventory/:id',
      component: ShopInventoryComponent
    }, {
      path: ':page/:id',
      component: ShopFormComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopsSubRoutingModule {
}

export const routedComponents = [
  ShopsSubComponent,
  ShopListComponent,
  ShopFormComponent,
  ShopSettingsComponent,
  ShopInventoryComponent
];
