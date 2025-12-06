import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ApiService} from "@app/core/services/api.service";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'pkz-assign-delivery-boy-modal',
  templateUrl: './assign-delivery-boy-modal.component.html',
  styleUrls: ['./assign-delivery-boy-modal.component.scss']
})
export class AssignDeliveryBoyModalComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();

  distances = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  distance = 3;
  data: any;
  deliveryBoys: any[];
  selectedDeliveryAssistant: any;

  constructor(private ngbActiveModal: NgbActiveModal, private _api: ApiService) {
  }

  ngOnInit() {
    if (this.data.order_id) {
      this.getAvailableDeliveryAssociates();
    }
  }

  public getAvailableDeliveryAssociates() {
    this._api.getAvailableDeliveryAssociates(this.data.order_id, this.distance)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => this.deliveryBoys = data, error => {
        this.deliveryBoys = [];
        this.selectedDeliveryAssistant = null;
      });
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }

  onAssign() {
    this._api.assignDeliveryBoy(this.data.order_id, this.selectedDeliveryAssistant)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => this.ngbActiveModal.close(this.selectedDeliveryAssistant));
  }

  public setDeliveryBoy(id) {
    this.selectedDeliveryAssistant = id;
  }

  public roundDistance(d) {
    return d.toFixed(2);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
