import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageDataToRetrieve } from '@app/core/models';
import { environment } from '@env/environment';
import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SharedHelperService {

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  fileToBase64(file) {
    const subject = new Subject();
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => subject.next(reader.result);

    return subject.asObservable();
  }

  getImageDimensions(file) {
    return this.fileToBase64(file)
      .pipe(
        mergeMap((result: string) => {
          const subject = new Subject();
          const image = new Image();
          image.src = result;
          image.onload = () => {
            subject.next({
              width: image.width,
              height: image.height
            });
          };

          return subject;
        })
      );
  }

  createImageUrlFromBlob(value: Blob) {
    return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(value));
  }

  getImageBlob(imageName: string, {path, width, height, imagePropName = 'img'}: ImageDataToRetrieve): Observable<Blob> {
    const url = `${environment.apiUrl}/${path}`;
    let params = new HttpParams();

    if (imageName) {
      params = params.set(imagePropName, String(imageName));
    }
    if (width) {
      params = params.set('width', String(width));
    }
    if (height) {
      params = params.set('height', String(height));
    }

    return this.http.get(url, {responseType: 'blob', params});
  }
}
