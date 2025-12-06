import {Component} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";

@Component({
  selector: 'pkz-accept-order--modal',
  templateUrl: './accept-order--modal.component.html',
  styleUrls: ['./accept-order--modal.component.scss']
})
export class AcceptOrderModalComponent {
  stringDateModel = moment(new Date()).add(35, "minutes").toDate();
  dateTimeFormat = 'dd MMM yyyy hh:mm a';
  data: any;
  showError: boolean;

  constructor(private ngbActiveModal: NgbActiveModal) {
  }

  onConfirm(): void {
    if (this.stringDateModel) {
      this.showError = false;
      this.ngbActiveModal.close(moment(this.stringDateModel).format('YYYY-MM-DD hh:mm:ss A'));
    } else {
      this.showError = true;
    }
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }
}
