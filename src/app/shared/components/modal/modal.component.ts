import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pkz-modal',
  template: '',
})
export class ModalComponent {
  message: string;
  title: string;
  data: any;

  constructor(
    public ngbActiveModal: NgbActiveModal,
  ) {}

  close(result = 'OK'): void {
    this.ngbActiveModal.close(result);
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }
}
