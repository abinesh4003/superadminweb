import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from '@app/auth/services/auth-guard.service';
import { AuthHelperService } from '@app/auth/services/auth-helper.service';
import { PkzAuthJWTInterceptor } from '@app/auth/services/interceptors/auth-interceptor';
import { environment } from '@env/environment';
import { NbAuthJWTToken, NbAuthModule, NbAuthOptions, NbEmailPassAuthProvider } from '@nebular/auth';
import { NB_AUTH_TOKEN_CLASS } from '@nebular/auth/auth.options';
import { AuthRoutingModule, routedComponents } from './auth-routing.module';
import { PkzAuthBlockComponent } from './auth-block/auth-block.component';

const authOptions: NbAuthOptions = {
  providers: {
    email: {
      service: NbEmailPassAuthProvider,
      config: {
        baseEndpoint: environment.apiUrl,
        login: {
          endpoint: '/auth',
          method: 'post',
        },
        token: {
          key: 'data.auth_token'
        },
        // todo uncomment and change once logout will be implemented on BE
        // logout: {
        //   endpoint: '/logout',
        //   alwaysFail: false,
        //   method: 'delete',
        //   redirect: {
        //     success: '/auth/login',
        //     failure: '/auth/login'
        //   }
        // }
      },
    },
  },
};

const AUTH_PROVIDERS = [
  ...NbAuthModule.forRoot(authOptions).providers,
  AuthGuard,
  AuthHelperService,
  { provide: HTTP_INTERCEPTORS, useClass: PkzAuthJWTInterceptor, multi: true },
  { provide: NB_AUTH_TOKEN_CLASS, useValue: NbAuthJWTToken }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule
  ],
  exports: [],
  declarations: [
    PkzAuthBlockComponent,
    ...routedComponents
  ],
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders> {
      ngModule: AuthModule,
      providers: [
        ...AUTH_PROVIDERS
      ]
    };
  }
}
