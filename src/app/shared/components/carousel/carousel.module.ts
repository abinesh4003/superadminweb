import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CarouselModalComponent } from '@app/shared/components/carousel/carousel-modal/carousel-modal.component';
import { CarouselService } from '@app/shared/components/carousel/carousel.service';
import { ImageSecurePipe } from '@app/shared/pipes';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    NgbCarouselModule
  ],
  exports: [],
  providers: [
    CarouselService,
    ImageSecurePipe
  ],
  declarations: [
    CarouselModalComponent,
  ],
  entryComponents: [
    CarouselModalComponent
  ]
})
export class CarouselModule {
}
