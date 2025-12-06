import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthHelperService } from '@app/auth/services/auth-helper.service';
import { StorageService } from '@app/core/services/storage.service';
import { NbTokenService } from '@nebular/auth/services/token/token.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-logout',
  template: `<div>Logging out, please wait...</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PkzLogoutComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private authHelperService: AuthHelperService,
    private tokenService: NbTokenService,
    private storage: StorageService,
    private permissionsService: NgxPermissionsService
  ) {}

  ngOnInit(): void {
    this.logout();
  }

  private logout(): void {
    this.storage.clearUserDetails();
    this.permissionsService.flushPermissions();
    this.tokenService.clear();
    this.authHelperService.redirectToLoginPage();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
