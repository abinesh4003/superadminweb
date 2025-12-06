import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FINANCE_WITHDRAWAL_STATUS_REQUESTED } from '@app/core/constants';
import { ApiService } from '@app/core/services/api.service';
import { WireTransferModalComponent } from './wire-transfer/wire-transfer-modal.component';
import { WithdrawalDetailsModalComponent } from './withdrawal-details/withdrawal-details-modal.component';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { concatMap } from 'rxjs/operators/concatMap';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Injectable()
export class WithdrawalListService {

  constructor(
    private api: ApiService,
    private modalService: ModalService,
    private currency: CurrencyPipe
  ) {}

  getWithdrawRequests(queryObj) {
    return this.api.getWithdrawRequests(queryObj);
  }

  getInitFiltersData() {
    return {
      status: FINANCE_WITHDRAWAL_STATUS_REQUESTED,
      location: '',
      name: ''
    };
  }

  getFiltersObj(filtersObj) {
    const { location, status, name } = filtersObj;

    return {
      location,
      status,
      name
    };
  }

  openDetailsModal(withdrawalData) {
    return this.modalService.open(WithdrawalDetailsModalComponent, {
      options: {
        windowClass: 'modal-size-700'
      },
      data: withdrawalData,
    })
      .pipe(
        concatMap(({action, request_id}) => {
          switch (action) {
            case 'transfer':
              return this.openWireTransferModal(request_id);
            case 'reject':
              return this.openRejectModal(request_id);
            default:
              throw new Error('Wrong action!');
          }
        })
      );
  }

  openWireTransferModal(requestId) {
    return this.modalService.open(WireTransferModalComponent, {
      data: { requestId }
    })
      .pipe(
        mergeMap((data) => this.api.makeFinanceTransferRequest(data))
      );
  }

  openRejectModal(requestId) {
    return this.modalService.openReject()
      .pipe(
        mergeMap((reason: string) => this.api.makeFinanceRejectRequest({reason, request_id: requestId}))
      );
  }

  downloadSheet(dataRows) {
    if (!dataRows || !dataRows.length) {
      return;
    }
    const filename = `BayFay_Payment_${moment().format('DD_MMM_YYYY')}.xlsx`;
    const rows = this.getFormattedRows(dataRows);
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    worksheet['!cols'] = this.getCols(rows);

    XLSX.utils.book_append_sheet(workbook, worksheet);
    XLSX.writeFile(workbook, filename);
  }

  private getFormattedRows(rows) {
    const payment_date = moment().format('DD/MM/YYYY');
    const details = `Payment from BayFay for ${moment().format('MMMM YYYY')}`;

    return rows.map((item) => {
      const amount = this.currency.transform(item.amount).slice(1);

      return {
        'PAYMENT TYPE': 'PAY',
        'PAYMENT DATE': payment_date,
        'PAYEE NAME': item.account.account_name,
        'DEBIT A/C NO': '42805098727',
        'PAYEE A/C NO': item.account.account_number.toString(),
        'PAYEE IFSC': item.account.ifsc_code.toString(),
        'PAYMENT AMT': amount.toString(),
        'PAYMENT DETAILS': details,
        'EMAIL ID': 'accounts@bayfay.com',
      };
    });
  }

  private getCols(rows) {
    const cols = [];
    const container = Object.keys(rows[0]).reduce((prev, curr) => {
      prev[curr] = curr.length;

      return prev;
    }, {});

    rows.forEach(row => {
      Object.entries(row).forEach(([key, value]) => {
        const charLength = value.toString().length;

        if (container[key] < charLength) {
          container[key] = charLength;
        }
      });
    });

    Object.values(container).forEach((width: number) => {
      cols.push({wch: width + 3});
    });

    return cols;
  }
}
