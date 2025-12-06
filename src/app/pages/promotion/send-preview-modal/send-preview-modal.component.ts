import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'pkz-send-preview-modal',
  templateUrl: 'send-preview-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SendPreviewModalComponent implements OnInit, OnDestroy {
  title: string;
  field = '';

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private ngbActiveModal: NgbActiveModal
  ) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  close(): void {
    this.ngbActiveModal.close(this.field);
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }
}
