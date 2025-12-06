import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pkz-withdrawal-details',
  templateUrl: 'withdrawal-details-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WithdrawalDetailsModalComponent implements OnInit {
  data;

  constructor(
    private ngbActiveModal: NgbActiveModal
  ) {}

  ngOnInit() {
  }

  isStatusRequested() {
    return this.data.status.toLowerCase() === 'requested';
  }

  isStatusTransferred() {
    return this.data.status.toLowerCase() === 'transferred';
  }

  close(action): void {
    this.ngbActiveModal.close({
      action,
      request_id: this.data._id
    });
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }
}
