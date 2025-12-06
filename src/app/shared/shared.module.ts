import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImageUploadComponent } from '@app/shared/components/image-upload/image-upload.component';
import { RoutedTabsComponent } from '@app/shared/components/routed-tabs/routed-tabs.component';
import { TablePaginationComponent } from '@app/shared/components/table-pagination/table-pagination.component';
import { SwitchViewBtnComponent } from '@app/shared/components/switch-view-btn/switch-view-btn.component';
import { ResponsiveDatatableDirective } from '@app/shared/directives';
import { SharedHelperService } from '@app/shared/services/shared-helper.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SidebarModule } from 'ng-sidebar';
import { NgxPermissionsModule } from 'ngx-permissions';
import {
  HeaderModule,
  SidebarComponent,
  FooterComponent,
  CarouselModule,
  ModalModule,
  StatusTabsComponent,
  FilterFormModule,
  TableConfigureColumnsComponent,
  TableDeleteBtnComponent,
  SelectAllComponent,
  RoutedVerticalNavComponent
} from './components';
import {
  ImageSecurePipe
} from './pipes';
import { TimerComponent } from './components/timer/timer.component';
import {DateTimePickerComponent} from "@app/shared/components/date-time-picker/date-time-picker.component";

const MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  ModalModule,
  CarouselModule,
  FilterFormModule,
  NgxDatatableModule,
  NgbModule,
  HeaderModule
];
const COMPONENTS = [
  SidebarComponent,
  FooterComponent,
  RoutedTabsComponent,
  RoutedVerticalNavComponent,
  ImageUploadComponent,
  TablePaginationComponent,
  StatusTabsComponent,
  TableConfigureColumnsComponent,
  SwitchViewBtnComponent,
  TableDeleteBtnComponent,
  SelectAllComponent,
  TimerComponent,
  DateTimePickerComponent
];
const PROVIDERS = [
  SharedHelperService
];
const PIPES = [
  ImageSecurePipe
];
const DIRECTIVES = [
  ResponsiveDatatableDirective
];

@NgModule({
  imports: [
    ...MODULES,
    RouterModule,
    SidebarModule.forRoot()
  ],
  exports: [
    ...MODULES,
    ...COMPONENTS,
    ...PIPES,
    ...DIRECTIVES,
    NgxPermissionsModule,
  ],
  declarations: [
    ...COMPONENTS,
    ...PIPES,
    ...DIRECTIVES,
  ]
})
export class SharedModule {
  constructor() {
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders> {
      ngModule: SharedModule,
      providers: [...PROVIDERS]
    };
  }
}
