import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AppService } from '@app/app.service';
import { NbAuthService } from '@nebular/auth';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { takeWhile } from 'rxjs/operators/takeWhile';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-auth',
  styleUrls: ['./auth.component.scss'],
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PkzAuthComponent implements OnInit, OnDestroy {
  private alive = true;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  authenticated = false;
  token = '';

  constructor(
    protected authService: NbAuthService,
    private renderer: Renderer2,
    private appService: AppService
  ) {}

  ngOnInit(): void {
    this.authService.onAuthenticationChange()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        takeWhile(() => this.alive)
      )
      .subscribe((authenticated: boolean) => {
        this.authenticated = authenticated;
      });

    this.destroyPreloader();
  }

  private destroyPreloader(): void {
    if (this.appService.isBrowser()) {
      const preloader = document.body.querySelector('.preloader');
      if (preloader) {
        this.renderer.removeChild(document.body, preloader);
      }
    }
  }

  ngOnDestroy(): void {
    this.alive = false;
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
