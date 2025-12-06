import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pkz-remittance-reject',
  templateUrl: 'remittance-reject-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemittanceRejectModalComponent implements OnInit {
  data;
  reason = '';

  constructor(
    private ngbActiveModal: NgbActiveModal
  ) {}

  ngOnInit() {

  }

  submit(): void {
    const reason = this.reason.trim();

    this.ngbActiveModal.close({
      _id: this.data.id,
      reference_id: this.data.reference_id,
      status: 4,
      feedback: reason
    });
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }
}
