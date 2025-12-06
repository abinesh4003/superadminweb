import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '@app/core/services/storage.service';
import { NB_AUTH_OPTIONS, NbAuthResult } from '@nebular/auth';
import { getDeepFromObject } from '@nebular/auth/helpers';
import { NbTokenService } from '@nebular/auth/services/token/token.service';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable()
export class AuthHelperService {
  constructor(
    private router: Router,
    private tokenService: NbTokenService,
    private storage: StorageService,
    private permissionsService: NgxPermissionsService,
    @Inject(NB_AUTH_OPTIONS) protected config = {},
  ) {}

  redirectAuth(result: NbAuthResult, redirectDelay: number) {
    const redirect = result.getRedirect();

    if (redirect) {
      setTimeout(() => {
        return this.router.navigateByUrl(redirect);
      }, redirectDelay);
    }
  }

  actionForNotAuthorized(): void {
    this.storage.clearUserDetails();
    this.permissionsService.flushPermissions();
    this.tokenService.clear()
      .subscribe(() => this.redirectToLoginPage());
  }

  redirectToLoginPage() {
    this.router.navigate(['auth/login']);
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.config, key, null);
  }
}
