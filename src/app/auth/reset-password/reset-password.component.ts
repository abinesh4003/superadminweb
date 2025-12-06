import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthHelperService } from '@app/auth/services/auth-helper.service';
import { NbAuthResult, NbAuthService } from '@nebular/auth';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';

@Component({
  selector: 'pkz-reset-password',
  templateUrl: './reset-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PkzResetPasswordComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private redirectDelay: number;

  showMessages: any = {};
  provider: string;
  errors: string[];
  messages: string[];
  user: any = {};
  submitted = false;
  isPasswordRequired = false;

  constructor(
    protected authService: NbAuthService,
    private authHelperService: AuthHelperService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initDefaultFormValues();
    this.initRequiredFlags();
  }

  resetPass(): void {
    this.errors = this.messages = [];
    this.submitted = true;

    this.authService.resetPassword(this.provider, this.user)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result: NbAuthResult) => {
        this.submitted = false;
        if (result.isSuccess()) {
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

  private initDefaultFormValues(): void {
    this.redirectDelay = this.authHelperService.getConfigValue('forms.resetPassword.redirectDelay');
    this.showMessages = this.authHelperService.getConfigValue('forms.resetPassword.showMessages');
    this.provider = this.authHelperService.getConfigValue('forms.resetPassword.provider');
  }

  private initRequiredFlags() {
    this.isPasswordRequired = this.authHelperService.getConfigValue('forms.validation.password.required');
  }
}
