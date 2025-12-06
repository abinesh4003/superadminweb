import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pkz-edit-start-date-modal',
  templateUrl: './edit-start-date-modal.component.html',
  styleUrls: ['./edit-start-date-modal.component.scss']
})
export class EditStartDateModalComponent implements OnInit {
  data: any;
  datepickerModelFrom: Date;

  constructor(private ngbActiveModal: NgbActiveModal) { }

  ngOnInit() {
    this.datepickerModelFrom = new Date(this.data.subsInfo.subscription_info.var_start_date);
  }

  confirm() {
    const queryObj = {
      _id: this.data.subsInfo._id,
      startDate: this.datepickerModelFrom.toISOString(),
      deliveryTime: this.data.subsInfo.delivery_time
    };
    this.ngbActiveModal.close(queryObj);
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }

}
