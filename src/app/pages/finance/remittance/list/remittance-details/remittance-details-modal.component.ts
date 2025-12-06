import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FINANCE_REMITTANCE_STATUS_TRANSFERRED} from "@app/core/constants";

@Component({
  selector: 'pkz-remittance-details',
  templateUrl: 'remittance-details-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    '.row { margin-bottom: 5px; }',
    '.modal__btn { width: 120px;}'
  ]
})
export class RemittanceDetailsModalComponent implements OnInit {
  data;
  order;
  statusTypes: {id: number, name: string}[];

  get isTransferredOrder(): boolean {
    return this.data.order.payment_info.status === FINANCE_REMITTANCE_STATUS_TRANSFERRED;
  }

  constructor(
    private ngbActiveModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.order = this.data.order;
    this.statusTypes = this.data.statusTypes;
    console.log(this.order);
  }

  getPaymentModelById(id: number): string {
    switch (id) {
      case 1:
        return 'Bank transfer';
      case 2:
        return 'Payment gateway';
      case 3:
        return 'Wallet';
      default:
        break;
    }
  }

  close(action): void {
    this.ngbActiveModal.close({
      action,
      id: this.order.payment_info._id,
      reference_id: this.order.payment_info.reference_id,
    });
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }
}
