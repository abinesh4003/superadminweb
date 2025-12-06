import { Pipe, PipeTransform } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ImageDataToRetrieve } from '@app/core/models';
import { SharedHelperService } from '@app/shared/services/shared-helper.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

@Pipe({
  name: 'imageSecure'
})
export class ImageSecurePipe implements PipeTransform {
  constructor(
    private sharedHelperService: SharedHelperService
  ) {}

  transform(imageName: string, data: ImageDataToRetrieve): Observable<SafeUrl | string> {
    if (!imageName) {
      return of('');
    }

    return this.sharedHelperService.getImageBlob(imageName, data)
      .pipe(
        map(val => this.sharedHelperService.createImageUrlFromBlob(val)),
        startWith('')
      );
  }
}
