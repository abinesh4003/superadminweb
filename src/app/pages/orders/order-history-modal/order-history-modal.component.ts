import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '@app/core/services/api.service';
import {finalize} from 'rxjs/operators/finalize';

@Component({
  selector: 'pkz-order-history-modal',
  templateUrl: './order-history-modal.component.html',
  styleUrls: ['./order-history-modal.component.scss']
})
export class OrderHistoryModalComponent implements OnInit {
  data;
  ordersList = [];
  spin;
  isLoading = true;

  constructor(private ngbActiveModal: NgbActiveModal,
              private _api: ApiService) { }

  ngOnInit() {
    const body = {
      subs_id: this.data.subsInfo._id,
      customer_id: this.data.subsInfo.user_id
    };

    this._api.getSubsOrderHistory(body)
        .pipe(
            finalize(() => {
              this.isLoading = false;
            })
        )
        .subscribe(res => {
      this.ordersList = res.data;
    });
  }

  getDtByStatusId(deliveryStatusId) {
    switch (deliveryStatusId) {
      case 1:
        return {
          statusName: 'Ordered',
          objName: 'ordered'
        };
      case 2:
        return {
          statusName: 'Accepted',
          objName: 'accepted'
        };
      case 3:
        return {
          statusName: 'Ready For Shipping',
          objName: 'ready_to_ship'
        };
      case 4:
        return {
          statusName: 'Shipping',
          objName: 'shipping'
        };
      case 5:
        return {
          statusName: 'Delivered',
          objName: 'delivered'
        };
      case 6:
        return {
          statusName: 'Verified',
          objName: 'verified'
        };
      case 7:
        return {
          statusName: 'Cancelled',
          objName: 'cancelled',
          textColor: 'color-red'
        };
    }
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }

}
