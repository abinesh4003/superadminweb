import {Component} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";

@Component({
  selector: 'pkz-product-expiry-details-modal',
  templateUrl: './product-expiry-details-modal.component.html',
  styleUrls: ['./product-expiry-details-modal.component.scss']
})
export class ProductExpiryDetailsModalComponent {
  data: any;

  constructor(private ngbActiveModal: NgbActiveModal) {
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }

  public formatDate(date) {
    const format = 'DD/MM/YYYY';
    return `${moment(date).format(format)}`
  }

  public getDiff(mfgDate, expDate) {
    const date1 = moment(mfgDate);
    const date2 = moment(expDate);
    const months = date2.diff(date1, 'months');
    date2.add(months, 'months');
    const days = date2.diff(date1, 'days');
    return `${months}M ${days}D`;
  }
}
