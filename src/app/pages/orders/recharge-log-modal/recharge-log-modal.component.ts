import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '@app/core/services/api.service';
import {finalize} from 'rxjs/operators/finalize';

@Component({
  selector: 'pkz-recharge-log-modal',
  templateUrl: './recharge-log-modal.component.html',
  styleUrls: ['./recharge-log-modal.component.scss']
})
export class RechargeLogModalComponent implements OnInit {
  data;
  rechargeLogList;
  spin;
  isLoading = true;

  constructor(private ngbActiveModal: NgbActiveModal,
              private _api: ApiService) { }

  ngOnInit() {
    const body = {
      customer_id: this.data.subsInfo.user_id
    };

    this._api.getSubsRechargeLog(body)
        .pipe(
            finalize(() => {
              this.isLoading = false;
            })
        )
        .subscribe(res => {
      this.rechargeLogList = res.data;
    });
  }

  dismiss(reason = 'Cancel'): void {
    this.ngbActiveModal.dismiss(reason);
  }

}
