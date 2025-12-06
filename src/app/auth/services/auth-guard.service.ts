import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AppService } from '@app/app.service';
import { AuthHelperService } from '@app/auth/services/auth-helper.service';
import { NbAuthService } from '@nebular/auth';
import { tap } from 'rxjs/operators/tap';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: NbAuthService,
    private authHelperService: AuthHelperService,
    private appService: AppService
  ) {}

  canActivate() {
    return this.authService.isAuthenticated()
      .pipe(
        tap(authenticated => {
          if (!authenticated && this.appService.isBrowser()) {
            this.authHelperService.actionForNotAuthorized();
          }
        })
      );
  }
}
