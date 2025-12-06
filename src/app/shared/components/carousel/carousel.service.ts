import { Injectable } from '@angular/core';
import { CarouselModalComponent } from '@app/shared/components/carousel/carousel-modal/carousel-modal.component';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { ImageSecurePipe } from '@app/shared/pipes';
import { SharedHelperService } from '@app/shared/services/shared-helper.service';
import { of } from 'rxjs/observable/of';

@Injectable()
export class CarouselService {
  constructor(
    private modalService: ModalService,
    private sharedHelperService: SharedHelperService,
    private imageSecurePipe: ImageSecurePipe,
  ) {}

  open(images, imagePath, activeId?) {
    if (!images) {
      return of(null);
    }

    images = this.getImages(images, imagePath);
    const windowClass = this.getWindowClass(images);

    return this.modalService.open(CarouselModalComponent, {
      data: { images, activeId },
      options: { windowClass }
    });
  }

  private getImages(images, imagePath) {
    if (typeof images === 'string' || images instanceof File || images instanceof Blob) {
      images = [images].map(this.imagesToObject);
    } else if (Array.isArray(images)) {
      images = images.map(this.imagesToObject);
    } else if (typeof images === 'object' && !Array.isArray(images)) {
      images = Object.entries(images)
        .filter(([key, val]) => !!val)
        .map(([key, value]) => this.imagesToObject(value, key));
    }

    return images.map((item) => this.getImageUrl(item, imagePath));
  }

  private getWindowClass(images) {
    return (images.length > 1)
      ? 'modal-carousel'
      : 'modal-carousel modal-carousel-single';
  }

  private imagesToObject(url, index) {
    return {
      id: index.toString(),
      url
    };
  }

  private getImageUrl({id, url}, imagePath) {
    if (url instanceof File) {
      url = this.sharedHelperService.fileToBase64(url);
    } else if (url instanceof Blob) {
      url = of(this.sharedHelperService.createImageUrlFromBlob(url));
    } else if (typeof url === 'string') {
      url = this.imageSecurePipe.transform(url, {path: imagePath});
    }

    return { id, url };
  }
}
