import { CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RemittanceApproveModalComponent } from './list/remittance-approve/remittance-approve-modal.component';
import { RemittanceDetailsModalComponent } from './list/remittance-details/remittance-details-modal.component';
import { SharedModule } from '@app/shared/shared.module';
import {RemittanceFilterSettingsService} from "@app/pages/finance/remittance/list/remittance-filter-settings.service";
import {RemittanceRoutingModule, routedComponents} from "@app/pages/finance/remittance/remittance-routing.module";
import {RemittanceRejectModalComponent} from "@app/pages/finance/remittance/list/remittance-reject/remittance-reject-modal.component";
import { RemittanceStatusPipe } from './remittance-status.pipe';
import { CodHistoryComponent } from './cod-history/cod-history.component';
import {RemittanceService} from "@app/pages/finance/remittance/remittance.service";

const MODALS = [
  RemittanceDetailsModalComponent,
  RemittanceApproveModalComponent,
  RemittanceRejectModalComponent
];

@NgModule({
  imports: [
    SharedModule,
    RemittanceRoutingModule
  ],
  exports: [],
  declarations: [
    ...routedComponents,
    ...MODALS,
    RemittanceStatusPipe,
    CodHistoryComponent
  ],
  providers: [
    RemittanceService,
    RemittanceFilterSettingsService,
    CurrencyPipe
  ],
  entryComponents: [
    ...MODALS
  ]
})
export class RemittanceModule {
}
