import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {PaginationPage} from "@app/core/models";
import {takeUntil} from "rxjs/operators/takeUntil";
import {Subject} from "rxjs/Subject";
import {RemittanceService} from "@app/pages/finance/remittance/remittance.service";
import {skip} from "rxjs/operators/skip";
import {StorageService} from "@app/core/services/storage.service";
import {ActivatedRoute, Router} from "@angular/router";
import * as moment from "moment";

@Component({
  selector: 'pkz-cod-history',
  templateUrl: './cod-history.component.html',
  styleUrls: ['./cod-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodHistoryComponent implements OnInit, OnDestroy {
  isPageLoaded = true;
  page: PaginationPage;
  rows: any[];
  codHistoryQueryObj: {
    status: number,
    delivered_orders: string[]
  };
  totalCodAmount = 0;
  order_count = 0;
  agency_offer_amt = 0;

  userIconOptions = {path: 'spad/us/img/vw', width: 500};
  shopIconOptions = {path: 'shop/ick/vw', width: 500};

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private service: RemittanceService,
              private storage: StorageService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.codHistoryQueryObj = this.service.codHistoryQueryObj;

    if(!this.codHistoryQueryObj.delivered_orders.length) {
      this.router.navigate(['../'], {relativeTo: this.activatedRoute});
    }

    this.handleRowsLimit();
    this.resetPageOffset();
  }


  private loadTableData() {
    console.log('loadTableData');
    const queryObj = {
      ...this.codHistoryQueryObj,
      skip: this.page.pageNumber * this.page.limit,
      limit: this.page.limit
    };

    this.service.getCodHistory(queryObj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: any) => {
          console.log('Data = ', data);

          data.order_info.forEach(order => {
            const startedAt = moment(order.order_info.started_at);
            const deliveredAt = moment(order.order_info.delivered_at);
            const difference = moment.utc(deliveredAt.diff(startedAt));

            let deliveredWithin = '';

            if(difference.hours() > 0) {
              deliveredWithin += `${difference.hours()} hour `;
            }
            if(difference.minutes() > 0) {
              deliveredWithin += `${difference.minutes()} min `;
            }
            deliveredWithin += `${difference.seconds()} sec `;

            order.order_info.delivered_within = deliveredWithin;
          });

          this.initPage({data: data.order_info, count: data.statusInfo.count});
          this.totalCodAmount = data.statusInfo.total_cod_amount;
          this.agency_offer_amt = data.statusInfo.online_offer_amt;
          this.order_count = data.statusInfo.count;
          this.isPageLoaded = true;

          this.cd.markForCheck();
        });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.loadTableData();
  }

  private initPage({data, count}): void {
    this.rows = data ? data : [];
    this.page.count = count;
  }

  private resetPageOffset() {
    this.setPage({offset: 0});
  }

  private handleRowsLimit() {
    this.page = new PaginationPage();
    this.page.setLimit(this.storage.getRowsPerPage());
    this.storage.observeRowsPerPage()
        .pipe(
            takeUntil(this.ngUnsubscribe),
            skip(1)
        )
        .subscribe(key => {
          this.page.setLimit(key);
          this.resetPageOffset();
        });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
