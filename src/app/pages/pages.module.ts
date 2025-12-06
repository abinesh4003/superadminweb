import { NgModule } from '@angular/core';
import { PagesService } from '@app/pages/pages.service';
import { SharedModule } from '@app/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';

import { PagesRoutingModule, routedComponents } from './pages-routing.module';

@NgModule({
  imports: [
    SharedModule,
    PagesRoutingModule,
    NgxPermissionsModule.forChild()
  ],
  declarations: [
    ...routedComponents
  ],
  providers: [
    PagesService
  ]
})
export class PagesModule {

}
