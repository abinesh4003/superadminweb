import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import {FINANCE_REMITTANCE_STATUS_TRANSFERRED} from '@app/core/constants';
import { ApiService } from '@app/core/services/api.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { concatMap } from 'rxjs/operators/concatMap';
import {of} from "rxjs/observable/of";
import {RemittanceRejectModalComponent} from "@app/pages/finance/remittance/list/remittance-reject/remittance-reject-modal.component";
import {RemittanceApproveModalComponent} from "@app/pages/finance/remittance/list/remittance-approve/remittance-approve-modal.component";
import {RemittanceDetailsModalComponent} from "@app/pages/finance/remittance/list/remittance-details/remittance-details-modal.component";

@Injectable()
export class RemittanceService {
  private _codHistoryQueryObj: {
    status: number,
    delivered_orders: string[]
  } = {
    status: 0,
    delivered_orders: []
  };

  get codHistoryQueryObj() {
    return {...this._codHistoryQueryObj};
  }
  set codHistoryQueryObj(value) {
    this._codHistoryQueryObj = value;
  }

  constructor(
    private api: ApiService,
    private modalService: ModalService,
    private currency: CurrencyPipe
  ) {}

  getRemittance(queryObj) {
    return this.api.getRemittance(queryObj);
  }

  getRemittanceInfo(queryObj) {
    return this.api.getRemittanceInfo(queryObj);
  }

  updateRemittance(queryObj) {
    return this.api.updateRemittance(queryObj);
  }

  getCodHistory(queryObj) {
    return this.api.getCodHistory(queryObj);
  }

  getInitFiltersData() {
    return {
      status: FINANCE_REMITTANCE_STATUS_TRANSFERRED
    };
  }

  openDetailsModal(withdrawalData) {
    return this.modalService.open(RemittanceDetailsModalComponent, {
      options: {
        windowClass: 'modal-size-700'
      },
      data: withdrawalData,
    })
      .pipe(
        concatMap(({action, id, reference_id}) => {
          switch (action) {
            case 'approved':
              return this.openApproveModal(id, reference_id);
            case 'reject':
              return this.openRejectModal(id, reference_id);
            default:
              throw new Error('Wrong action!');
          }
        })
      );
  }

  openApproveModal(id, reference_id) {
    return this.modalService
      .open(RemittanceApproveModalComponent, {
        data: { id: id, reference_id: reference_id }
      })
      .pipe(
        mergeMap((data) => this.updateRemittance(data))
      );
  }

  openRejectModal(id, reference_id) {
    return this.modalService
      .open(RemittanceRejectModalComponent, {
        data: { id: id, reference_id: reference_id }
      })
      .pipe(
          mergeMap((data) => this.updateRemittance(data))
      );
  }
}
