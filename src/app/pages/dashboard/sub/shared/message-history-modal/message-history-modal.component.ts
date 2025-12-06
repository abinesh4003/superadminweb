import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pkz-message-history-modal',
  templateUrl: 'message-history-modal.component.html',
  styleUrls: ['./message-history-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageHistoryModalComponent implements OnInit {
  data: any;

  constructor(
    private ngbActiveModal: NgbActiveModal
  ) {}

  ngOnInit() {
  }

  dismiss() {
    this.ngbActiveModal.dismiss('');
  }

  close() {
    this.ngbActiveModal.close(this.data.feedback);
  }
}
