import { Component, OnInit } from '@angular/core';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pkz-carousel-modal',
  styleUrls: ['./carousel-modal.component.scss'],
  templateUrl: './carousel-modal.component.html',
})
export class CarouselModalComponent extends ModalComponent implements OnInit {
  isCarouselView = false;

  constructor(
    public ngbActiveModal: NgbActiveModal
  ) {
    super(ngbActiveModal);
  }

  ngOnInit() {
    this.isCarouselView = (this.data.images.length > 1);
  }

  onClose(event) {
    const classList = event.target.classList;
    if (classList.contains('carousel-item') || classList.contains('carousel')) {
      this.dismiss();
    }
  }
}
