import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthHelperService } from '@app/auth/services/auth-helper.service';
import { StorageService } from '@app/core/services/storage.service';
import { NbAuthResult, NbAuthService } from '@nebular/auth';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';

@Component({
  selector: 'pkz-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PkzLoginComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private redirectDelay: number;

  showMessages: any = {};
  provider: string;
  errors: string[];
  messages: string[];
  user: any = {};
  submitted = false;
  isEmailRequired = false;
  isPasswordRequired = true;

  constructor(
    protected authService: NbAuthService,
    private authHelperService: AuthHelperService,
    private cd: ChangeDetectorRef,
    private storage: StorageService
  ) {}

  ngOnInit() {
    this.initDefaultFormValues();
    this.initRequiredFlags();
  }

  login(): void {
    this.errors = this.messages = [];
    this.submitted = true;
    console.log('Login Payload:', this.user);

    this.authService.authenticate(this.provider, this.user)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: NbAuthResult) => {
        this.submitted = false;

        if (result.isSuccess()) {
          this.setUserDetailsToStorage(result.getResponse());
          this.messages = result.getMessages();
        } else {
          this.errors = result.getErrors();
        }

        this.authHelperService.redirectAuth(result, this.redirectDelay);
        this.cd.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private setUserDetailsToStorage(resp) {
    const data = resp && resp.body && resp.body.data;
    if (data) {
      this.storage.setUserDetails(data);
      console.log('set User Details : ', data);
    }
  }

  private initDefaultFormValues() {
    this.redirectDelay = this.authHelperService.getConfigValue('forms.login.redirectDelay') || 0;
    this.showMessages = this.authHelperService.getConfigValue('forms.login.showMessages');
    this.provider = this.authHelperService.getConfigValue('forms.login.provider');
  }

  private initRequiredFlags() {
    this.isEmailRequired = this.authHelperService.getConfigValue('forms.validation.email.required');
    this.isPasswordRequired = this.authHelperService.getConfigValue('forms.validation.password.required');
  }
}
