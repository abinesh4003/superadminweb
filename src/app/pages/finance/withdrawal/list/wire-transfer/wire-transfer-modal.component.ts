import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pkz-wire-transfer',
  templateUrl: 'wire-transfer-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WireTransferModalComponent implements OnInit {
  data;
  referenceId = '';

  constructor(
    private ngbActiveModal: NgbActiveModal
  ) {}

  ngOnInit() {

  }

  close(): void {
    const referenceId = this.referenceId.trim();
    this.ngbActiveModal.close({
      request_id: this.data.requestId,
      reference_id: referenceId
    });
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }
}
