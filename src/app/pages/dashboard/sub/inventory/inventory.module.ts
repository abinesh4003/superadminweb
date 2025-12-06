import { NgModule } from '@angular/core';
import { InventoryFormService } from '@app/pages/dashboard/sub/inventory/form/inventory-form.service';
import { InventoryRoutingModule, routedComponents } from '@app/pages/dashboard/sub/inventory/inventory-routing.module';
import { InventoryService } from '@app/pages/dashboard/sub/inventory/inventory.service';
import { BulkUploadModalService } from '@app/pages/dashboard/sub/inventory/list/bulk-upload-modal/bulk-upload-modal.service';
import { InventoryListService } from '@app/pages/dashboard/sub/inventory/list/inventory-list.service';
import { DashboardSubSharedModule } from '@app/pages/dashboard/sub/shared/dashboard-sub-shared.module';
import { BulkUploadModalComponent } from '@app/pages/dashboard/sub/inventory/list/bulk-upload-modal';
import { SharedModule } from '@app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPermissionsModule } from 'ngx-permissions';

const MODALS = [
  BulkUploadModalComponent
];

@NgModule({
  imports: [
    InventoryRoutingModule,
    SharedModule,
    DashboardSubSharedModule,
    NgSelectModule,
    NgxPermissionsModule.forChild()
  ],
  declarations: [
    ...routedComponents,
    ...MODALS
  ],
  entryComponents: [
    ...MODALS
  ],
  providers: [
    InventoryService,
    BulkUploadModalService,
    InventoryListService,
    InventoryFormService
  ],
})
export class InventoryModule {
}
