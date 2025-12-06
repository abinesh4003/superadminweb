import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pkz-transfer-amount-modal',
  templateUrl: './transfer-amount-modal.component.html',
  styleUrls: ['./transfer-amount-modal.component.scss']
})
export class TransferAmountModalComponent implements OnInit {
  data: any;
  subWalletAmount = 0;
  bayFayCashBalance = 0;
  amount = 0;
  isChecked = false;

  get isIncorrectAmount(): boolean {
    return this.amount > this.subWalletAmount;
  }

  constructor(private ngbActiveModal: NgbActiveModal) { }

  ngOnInit() {
    this.subWalletAmount = +this.data.subsInfo.subs_wallet;
    this.bayFayCashBalance = +this.data.subsInfo.bfcash;
  }

  checkValue() {
    this.amount = this.isChecked ? this.subWalletAmount : 0;
  }

  toggleCheckbox() {
    this.isChecked = this.amount === this.subWalletAmount;
  }

  confirm() {
    const queryObj = {
      customer_id: this.data.subsInfo.user_id,
      amount: this.amount,
      is_full_amt: this.isChecked
    };

    this.ngbActiveModal.close(queryObj);
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }
}
