import { NgModule } from '@angular/core';
import {
  AnnouncementRoutingModule,
  routedComponents
} from '@app/pages/promotion/announcement/announcement-routing.module';
import { AnnouncementService } from '@app/pages/promotion/announcement/announcement.service';
import { AnnouncementFormService } from '@app/pages/promotion/announcement/form/announcement-form.service';
import { SharedModule } from '@app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPermissionsModule } from 'ngx-permissions';
import { EditorModule } from '@tinymce/tinymce-angular';

const MODALS = [];

@NgModule({
  imports: [
    SharedModule,
    AnnouncementRoutingModule,
    NgxPermissionsModule.forChild(),
    NgSelectModule,
    EditorModule
  ],
  exports: [],
  declarations: [
    ...MODALS,
    ...routedComponents
  ],
  providers: [
    AnnouncementService,
    AnnouncementFormService
  ],
  entryComponents: [
    ...MODALS,
  ]
})
export class AnnouncementModule {
}
