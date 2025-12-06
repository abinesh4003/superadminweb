import { NgModule } from '@angular/core';
import { FinanceService } from '@app/pages/finance/finance.service';
import { SharedModule } from '@app/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { FinanceRoutingModule, routedComponents } from './finance-routing.module';

@NgModule({
  imports: [
    FinanceRoutingModule,
    SharedModule,
    NgxPermissionsModule.forChild()
  ],
  declarations: [
    ...routedComponents
  ],
  providers: [
    FinanceService
  ]
})
export class FinanceModule {

}
