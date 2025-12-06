import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";

@Component({
  selector: 'pkz-edit-delivery-time-modal',
  templateUrl: './edit-delivery-time-modal.component.html',
  styleUrls: ['./edit-delivery-time-modal.component.scss']
})
export class EditDeliveryTimeModalComponent implements OnInit {
  stringDateModel: string;
  dateTimeFormat = 'dd MMM yyyy hh:mm a';
  data: any;

  constructor(private ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.stringDateModel = new Date(this.data.expectedDeliveryTime).toString();
  }

  onConfirm(): void {
    this.ngbActiveModal.close(moment(this.stringDateModel).format('YYYY-MM-DD hh:mm a'));
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }

  getExpectedDeliveryTime() {
    return new Date(this.data.expectedDeliveryTime).toString();
  }
}
