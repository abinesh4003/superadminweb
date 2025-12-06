import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
  HttpParams,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { catchError } from 'rxjs/operators/catchError';

@Injectable()
export class ApiHelperService {
  constructor(
    private http: HttpClient
  ) {}

  getQueryParams(propertyName, propertyValue, params = new HttpParams()) {
    if (propertyValue === undefined || propertyValue === null || propertyValue === '') {
      return params;
    }

    return params.set(propertyName, propertyValue);
  }

  handleUploadProgress(method, url, data) {
    const progressObj = {
      done: false,
      percent: 0,
      data: {}
    };
    const req = new HttpRequest(method, url, data, {reportProgress: true});

    return this.http.request(req)
      .pipe(
        mergeMap((event) => {
          if (event.type === HttpEventType.UploadProgress) {
            progressObj.percent = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            progressObj.done = true;
            progressObj.data = event.body;
          }

          return of(progressObj);
        }),
        catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse | any) {
    console.error('ApiService::handleError', error);
    return _throw(error);
  }

  getFilenameFromHeaders(headers) {
    return headers.get('content-disposition')
      .split('; ')
      .pop()
      .split('=')
      .pop()
      .replace(/"/g, '');
  }
}
