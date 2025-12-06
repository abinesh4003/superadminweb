import { NgModule } from '@angular/core';
import { ScFormService } from '@app/pages/admin/sc/form/sc-form.service';
import { ScRoutingModule, routedComponents } from '@app/pages/admin/sc/sc-routing.module';
import { ScService } from '@app/pages/admin/sc/sc.service';
import { ScCustomFieldModalComponent } from '@app/pages/admin/sc/template/sc-custom-field-modal/sc-custom-field-modal.component';
import { SharedModule } from '@app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TreeModule } from 'ng2-tree';
import { NgxPermissionsModule } from 'ngx-permissions';

const MODALS = [
  ScCustomFieldModalComponent
];

@NgModule({
  imports: [
    ScRoutingModule,
    SharedModule,
    NgSelectModule,
    TreeModule,
    NgxPermissionsModule.forChild()
  ],
  declarations: [
    ...routedComponents,
    ...MODALS
  ],
  exports: [],
  entryComponents: [
    ...MODALS
  ],
  providers: [
    ScService,
    ScFormService
  ],
})
export class ScModule {
}
