import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from "@app/core/services/api.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs/Subject";
import * as moment from "moment";
import {isNullOrUndefined} from "util";
import {ModalService} from "@app/shared/components/modal/modal.service";
import {ImageViewerComponent} from "@app/pages/orders/image-viewer/image-viewer.component";

@Component({
  selector: 'pkz-replacement-product-modal',
  templateUrl: './replacement-product-modal.component.html',
  styleUrls: ['./replacement-product-modal.component.scss']
})
export class ReplacementProductModalComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  imageOptions = {path: 'order/image', width: 200, imagePropName: 'file'};

  data: any;
  chat;
  productName: string;

  constructor(private _api: ApiService, private modalService: ModalService, private ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit() {
    if (this.data.orderId) {
      const {orderId, categoryId, shopId, productId} = this.data;
      this._api.getProductReplacementChat({
        category_id: categoryId,
        shop_id: shopId,
        order_id: orderId,
        product_id: productId
      }).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(response => {
          this.productName = response.product.product_name;
          this.chat = response.chat.chat.sort((msg1, msg2) => {
            const date1 = moment(msg1.at);
            const date2 = moment(msg2.at);
            return date1.diff(date2, "seconds");
          });
        })
    }
  }

  onConfirm(who_side): void {
    const {orderId, categoryId, shopId, productId} = this.data;
    const body = {
      who_side,
      category_id: categoryId,
      shop_id: shopId,
      order_id: orderId,
      product_id: productId,
    };
    this._api.resolveReplacement(body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(_ => {
        this.ngbActiveModal.close();
      });
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }

  isExist(value) {
    return !isNullOrUndefined(value);
  }

  formatDate(date) {
    return moment(date).format('DD/MM/YYYY hh:mm A');
  }

  public viewImage(image) {
    this.modalService.open(ImageViewerComponent, {
      options: {size: "lg"},
      data: {image, imageOptions: {...this.imageOptions, width: 750}}
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
