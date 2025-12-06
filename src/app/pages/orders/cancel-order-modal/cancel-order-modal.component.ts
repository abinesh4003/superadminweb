import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

const CANCEL_ORDER_VIEW = 'CANCEL_ORDER_VIEW';
const CONFIRM_CANCEL_ORDER_VIEW = 'CONFIRM_CANCEL_ORDER_VIEW';

@Component({
  selector: 'pkz-cancel-order-modal',
  templateUrl: './cancel-order-modal.component.html',
  styleUrls: ['./cancel-order-modal.component.scss']
})

export class CancelOrderModalComponent implements OnInit {
  public activeView = CANCEL_ORDER_VIEW;
  reductionPercentage = 0;
  reductionValue: number;
  percentageValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  data: any;
  totalReduction: number;
  excludeDeliveryCharge = true;

  constructor(private ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit() {
    if (this.data.isOnlinePayment) {
      if (this.data.deliveryCharges) {
        this.totalReduction = this.data.deliveryCharges;
      } else {
        this.totalReduction = 0;
      }
    } else {
      this.activeView = CONFIRM_CANCEL_ORDER_VIEW;
    }
  }

  onConfirm(): void {
    if (this.data.isOnlinePayment) {
      const excludeDeliveryCharge = this.data.withDelivery ? this.excludeDeliveryCharge : false;
      this.ngbActiveModal.close({
        has_reduction_percent: this.reductionPercentage > 0,
        reduction_value: this.totalReduction,
        has_excluded_delivery: excludeDeliveryCharge
      });
    } else {
      this.ngbActiveModal.close({
        has_excluded_delivery: false
      });
    }
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }

  public recalculateTotalReduction() {
    let totalReduction = this.excludeDeliveryCharge ? this.data.deliveryCharges : 0;
    if (this.reductionPercentage > 0) {
      const totalPrice = this.excludeDeliveryCharge ? (this.data.totalPrice - this.data.deliveryCharges) : this.data.totalPrice;
      const x = (totalPrice / 100) * this.reductionPercentage;
      totalReduction += x;
    } else if (this.reductionValue) {
      totalReduction += (+this.reductionValue);
    }
    this.totalReduction = totalReduction;
  }

  showConfirmationView() {
    this.activeView = CONFIRM_CANCEL_ORDER_VIEW;
  }

  getTitle() {
    if (this.activeView === CANCEL_ORDER_VIEW) {
      return 'Cancel Order'
    }
    return 'Cancel Order Confirmation';
  }

}
