import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pkz-reject-modal',
  templateUrl: 'reject-modal.component.html',
  styleUrls: ['./reject-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RejectModalComponent implements OnInit {
  reason = '';

  constructor(
    private ngbActiveModal: NgbActiveModal
  ) {}

  ngOnInit() {
  }

  dismiss() {
    this.ngbActiveModal.dismiss('');
  }

  close() {
    const reason = this.reason.trim();

    this.ngbActiveModal.close(reason);
  }
}
