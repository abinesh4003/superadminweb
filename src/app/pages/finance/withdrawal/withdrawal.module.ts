import { CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { WireTransferModalComponent } from './list/wire-transfer/wire-transfer-modal.component';
import { WithdrawalDetailsModalComponent } from './list/withdrawal-details/withdrawal-details-modal.component';
import { WithdrawalFilterSettingsService } from '@app/pages/finance/withdrawal/list/withdrawal-filter-settings.service';
import { WithdrawalListService } from '@app/pages/finance/withdrawal/list/withdrawal-list.service';
import { WithdrawalRoutingModule, routedComponents } from '@app/pages/finance/withdrawal/withdrawal-routing.module';
import { SharedModule } from '@app/shared/shared.module';

const MODALS = [
  WithdrawalDetailsModalComponent,
  WireTransferModalComponent
];

@NgModule({
  imports: [
    SharedModule,
    WithdrawalRoutingModule
  ],
  exports: [],
  declarations: [
    ...routedComponents,
    ...MODALS
  ],
  providers: [
    WithdrawalListService,
    WithdrawalFilterSettingsService,
    CurrencyPipe
  ],
  entryComponents: [
    ...MODALS
  ]
})
export class WithdrawalModule {
}
