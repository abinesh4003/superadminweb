import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { ApiHelperService } from '@app/core/services/api-helper.service';
import { ApiService } from '@app/core/services/api.service';
import { ConstantsService } from '@app/core/services/constants.service';
import { DatepickerDateAdapterService } from '@app/core/services/datepicker-date-adapter.service';
import { DatepickerDateFormatterService } from '@app/core/services/datepicker-date-formatter.service';
import { FormHelperService } from '@app/core/services/form-helper.service';
import { GlobalToasterService } from '@app/core/services/global-toaster.service';
import { initPrivilegesProvider, PrivilegesService } from '@app/core/services/privileges.service';
import { StorageService } from '@app/core/services/storage.service';
import { environment } from '@env/environment';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsService } from 'ngx-permissions';
import { ToastrModule } from 'ngx-toastr';
import {
  NgxUiLoaderConfig,
  NgxUiLoaderModule,
  POSITION,
  PB_DIRECTION,
  SPINNER,
  NgxUiLoaderHttpModule
} from 'ngx-ui-loader';

import { throwIfAlreadyLoaded } from './module-import-guard';

const loaderConf: NgxUiLoaderConfig = {
  blur: 2,
  fgsColor: '#00bafd',
  fgsPosition: POSITION.centerCenter,
  fgsSize: 40,
  fgsType: SPINNER.circle,
  gap: 24,
  overlayColor: 'rgba(40, 40, 40, 0.2)',
  pbColor: '#00bafd',
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 2,
  threshold: 300
};

const CORE_PROVIDERS = [
  ApiService,
  ConstantsService,
  ApiHelperService,
  ...NgxUiLoaderModule.forRoot(loaderConf).providers,
  ...NgxUiLoaderHttpModule.forRoot({
    showForeground: true,
    exclude: [
      `${environment.apiUrl}/sc/img/vw`,
      `${environment.apiUrl}/inv/img/vw`,
      `${environment.apiUrl}/spad/us/img/vw`,
      `${environment.apiUrl}/shop/ick/vw`,
      `${environment.apiUrl}/shop/img/vw`,
      `${environment.apiUrl}/dsbd/sc/img/vw`
    ]
  }).providers,
  ...ToastrModule.forRoot({
    maxOpened: 5,
    newestOnTop: true,
    timeOut: 3000,
    tapToDismiss: false,
    positionClass:  'toast-top-right',
    preventDuplicates: true,
    closeButton: true
  }).providers,
  GlobalToasterService,
  StorageService,
  PrivilegesService,
  {
    provide: APP_INITIALIZER,
    useFactory: initPrivilegesProvider,
    deps: [PrivilegesService, NgxPermissionsService],
    multi: true,
  },
  FormHelperService,
  {
    provide: NgbDateParserFormatter,
    useClass: DatepickerDateFormatterService
  },
  {
    provide: NgbDateAdapter,
    useClass: DatepickerDateAdapterService
  }
];

@NgModule({
  imports: [],
  exports: [
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule,
    ToastrModule
  ],
  declarations: []
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders> {
      ngModule: CoreModule,
      providers: [
        ...CORE_PROVIDERS
      ]
    };
  }
}
