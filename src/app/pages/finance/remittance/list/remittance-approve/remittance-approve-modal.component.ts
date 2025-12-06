import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pkz-remittance-approve',
  templateUrl: 'remittance-approve-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemittanceApproveModalComponent implements OnInit {
  data;
  referenceId = '';

  constructor(
    private ngbActiveModal: NgbActiveModal
  ) {}

  ngOnInit() {
  }

  submit(): void {
    const referenceId = this.referenceId.trim();
    this.ngbActiveModal.close({
      _id: this.data.id,
      reference_id: referenceId,
      status: 3
    });
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }
}
