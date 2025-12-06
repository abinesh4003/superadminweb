import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { AuthHelperService } from '@app/auth/services/auth-helper.service';
import { GlobalToasterService } from '@app/core/services/global-toaster.service';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators/tap';
import { switchMap } from 'rxjs/operators/switchMap';

@Injectable()
export class PkzAuthJWTInterceptor implements HttpInterceptor {
  constructor(
    private injector: Injector,
    private authHelperService: AuthHelperService,
    private toaster: GlobalToasterService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return this.authService.getToken()
      .pipe(
        switchMap((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            const JWT = `JWT ${token.getValue()}`;
            req = req.clone({
              setHeaders: {
                Authorization: JWT,
              },
            });
          }

          return next.handle(req)
            .pipe(
              tap((event: HttpEvent<any>) => {
                this.toaster.handleRequest(event);
              },
                (err: any) => {
                if (err instanceof HttpErrorResponse) {
                  if (err.status === 401) {
                    this.authHelperService.actionForNotAuthorized();
                  }

                  this.toaster.handleError(err);
                }
              })
            );
        }),
      );
  }

  protected get authService(): NbAuthService {
    return this.injector.get(NbAuthService);
  }
}
