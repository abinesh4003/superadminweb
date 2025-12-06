import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkUploadLogComponent } from '@app/pages/dashboard/sub/inventory/bulk-upload-log/bulk-upload-log.component';
import { InventoryFormComponent } from '@app/pages/dashboard/sub/inventory/form/inventory-form.component';
import { InventoryComponent } from '@app/pages/dashboard/sub/inventory/inventory.component';
import { InventoryListComponent } from '@app/pages/dashboard/sub/inventory/list/inventory-list.component';

const routes: Routes = [{
  path: '',
  component: InventoryComponent,
  children: [{
    path: '',
    component: InventoryListComponent
  }, {
    path: 'log',
    component: BulkUploadLogComponent
  }, {
    path: ':page',
    component: InventoryFormComponent
  }, {
    path: ':page/:id',
    component: InventoryFormComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {
}

export const routedComponents = [
  InventoryComponent,
  InventoryListComponent,
  InventoryFormComponent,
  BulkUploadLogComponent
];
