import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pkz-recharge-reminder-modal',
  templateUrl: './recharge-reminder-modal.component.html',
  styleUrls: ['./recharge-reminder-modal.component.scss']
})
export class RechargeReminderModalComponent implements OnInit {
  data;

  constructor(private ngbActiveModal: NgbActiveModal) { }

  ngOnInit() {
  }

  confirm() {
    const body = {
      customer_id: this.data.subsInfo.user_id
    };

    this.ngbActiveModal.close(body);
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }

}
