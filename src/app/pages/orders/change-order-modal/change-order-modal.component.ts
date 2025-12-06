import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'pkz-change-order-modal',
  templateUrl: './change-order-modal.component.html',
  styleUrls: ['./change-order-modal.component.scss']
})
export class ChangeOrderModalComponent implements OnInit {
  data: any;
  bfCash: boolean;

  constructor(private ngbActiveModal: NgbActiveModal) { }

  ngOnInit() {
  }

  onConfirm(): void {
    this.ngbActiveModal.close();
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }
}
