import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'pkz-confirm-modal',
  templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent extends ModalComponent {
  constructor(
    public ngbActiveModal: NgbActiveModal
  ) {
    super(ngbActiveModal);
  }
}
