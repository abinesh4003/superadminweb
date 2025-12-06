import {Component} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'pkz-change-order-status-confirmation-modal',
  templateUrl: './change-order-status-confirmation-modal.component.html',
  styleUrls: ['./change-order-status-confirmation-modal.component.scss']
})
export class ChangeOrderStatusConfirmationModalComponent {
  data: any;

  constructor(private ngbActiveModal: NgbActiveModal) {
  }

  onConfirm(): void {
    this.ngbActiveModal.close();
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }
}
