import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pkz-pause-subscription-confirmation-modal',
  templateUrl: './pause-subscription-confirmation-modal.component.html',
  styleUrls: ['./pause-subscription-confirmation-modal.component.scss']
})
export class PauseSubscriptionConfirmationModalComponent implements OnInit {
  data: any;
  selectedReason = '';

  constructor(private ngbActiveModal: NgbActiveModal) { }

  ngOnInit() {
    this.selectedReason = this.data.pause_fb[0];
  }

  save() {
    const queryObj = {
      _id: this.data.subsInfo._id,
      fb_title: this.selectedReason,
      flag: 2
    };

    this.ngbActiveModal.close(queryObj);
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }

}
