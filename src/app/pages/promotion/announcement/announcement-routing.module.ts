import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  PROMOTION_ANNOUNCEMENT_TAB_EMAIL,
  PROMOTION_ANNOUNCEMENT_TAB_PUSH,
  PROMOTION_ANNOUNCEMENT_TAB_SMS,
} from '@app/core/constants';
import { AnnouncementComponent } from '@app/pages/promotion/announcement/announcement.component';
import { AnnouncementFormComponent } from '@app/pages/promotion/announcement/form/announcement-form.component';

const routes: Routes = [
  {
    path: '',
    component: AnnouncementComponent,
    children: [{
      path: '',
      pathMatch: 'full',
      redirectTo: PROMOTION_ANNOUNCEMENT_TAB_SMS
    }, {
      path: PROMOTION_ANNOUNCEMENT_TAB_SMS,
      component: AnnouncementFormComponent,
      data: {
        pageType: PROMOTION_ANNOUNCEMENT_TAB_SMS
      }
    }, {
      path: PROMOTION_ANNOUNCEMENT_TAB_PUSH,
      component: AnnouncementFormComponent,
      data: {
        pageType: PROMOTION_ANNOUNCEMENT_TAB_PUSH
      }
    }, {
      path: PROMOTION_ANNOUNCEMENT_TAB_EMAIL,
      component: AnnouncementFormComponent,
      data: {
        pageType: PROMOTION_ANNOUNCEMENT_TAB_EMAIL
      }
    }, {
      path: '**',
      redirectTo: PROMOTION_ANNOUNCEMENT_TAB_SMS
    }]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnouncementRoutingModule {
}

export const routedComponents = [
  AnnouncementComponent,
  AnnouncementFormComponent
];
