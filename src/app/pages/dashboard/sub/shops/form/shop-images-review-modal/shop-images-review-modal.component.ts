import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CarouselService } from '@app/shared/components/carousel/carousel.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pkz-shop-images-review-modal',
  templateUrl: './shop-images-review-modal.component.html',
  styleUrls: ['./shop-images-review-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopImagesReviewModalComponent implements OnInit {
  data: any;
  imagesObj: { [key: string]: File | string } = {};
  imageOptions = { path: 'shop/img/vw', width: 150 };

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private carouselService: CarouselService,
  ) { }

  ngOnInit() {
    this.setImages(this.data);
  }

  private setImages(images): void {
    this.imagesObj = images.reduce((obj, image) => {
      obj[image.keyid] = image.name;
      return obj;
    }, {});
  }

  onZoom(key) {
    this.carouselService.open(this.imagesObj, this.imageOptions.path, key)
      .subscribe();
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }

  close(): void {
    this.ngbActiveModal.close();
  }

}
