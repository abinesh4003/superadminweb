import { NgModule } from '@angular/core';
import { ProductsStatusComponent } from '@app/pages/dashboard/sub/shared/products-status/products-status.component';
import { MessageHistoryModalComponent } from './message-history-modal/message-history-modal.component';
import { SharedModule } from '@app/shared/shared.module';

const COMPONENTS = [
  ProductsStatusComponent
];

const MODALS = [
  MessageHistoryModalComponent
];

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [
    ...COMPONENTS
  ],
  declarations: [
    ...COMPONENTS,
    ...MODALS
  ],
  entryComponents: [
    ...MODALS
  ],
  providers: [],
})
export class DashboardSubSharedModule {
}
